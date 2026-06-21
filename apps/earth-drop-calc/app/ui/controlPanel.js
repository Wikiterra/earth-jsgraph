// @ts-check
// =============================================================================
// controlPanel.js — modern, dependency-free replacement for the wabis
//   ControlPanel engine. Same `ControlPanels.New*().Add*().RenderInto()` API and
//   string-ref model binding as before (so the 11 app/panels/*.js files and
//   metadata/setup are UNCHANGED), but it emits SEMANTIC, accessible HTML
//   (<fieldset>/<label>/<input>/<output>, native <input type="range">, BEM
//   classes, CSS grid) instead of the legacy <table class="ControlPanel">.
//
//   Field types implemented (the surface edc uses): TextField, ValueSliderField,
//   SliderField, RadiobuttonField, CheckboxField. Formatting reuses the vendor
//   NumFormatter (a declared global); nothing else from the old engine is needed.
// =============================================================================
/* global NumFormatter */

/** @typedef {{ parts: string[], refStr: string }} Ref */
/** @typedef {Record<string, any>} Cfg  Loose field/panel config (as authored in app/panels). */
/** @typedef {{ el: any, init: () => void, update: () => void, name?: string, slider?: boolean, header?: boolean }} FieldObj */

// ---------------------------------------------------------------------------
// String-ref model binding (mirrors CpField.MakeRef / ValueFromModel / ValueToModel)
// ---------------------------------------------------------------------------

/**
 * Resolve a "Model.prop" / "prop" / "arr[0]" string against globalThis.
 * @param {string|undefined} refStr
 * @param {string} modelRefName  panel's ModelRef (e.g. 'CurveApp')
 * @returns {Ref|null}
 */
function makeRef(refStr, modelRefName) {
  if (refStr == null || refStr === '') return null;
  let ref = refStr;
  if (ref.indexOf('.') === -1 && modelRefName) ref = modelRefName + '.' + ref;
  const parts = ref.replace(/\[([^\]]+)\]/g, '.$1').split('.');
  return { parts, refStr };
}

/**
 * Resolve a Ref's parent object + final prop against globalThis. Done lazily on
 * every access (not cached at construction) so refs to globals published AFTER
 * the panel is built still bind — e.g. BaroModel, which refraction.js assigns to
 * globalThis after defining its panel.
 * @param {Ref|null} r @returns {{ obj: any, prop: string }|null}
 */
function resolveRef(r) {
  if (!r) return null;
  let obj = /** @type {any} */ (globalThis);
  for (let i = 0; i < r.parts.length - 1; i++) {
    obj = obj[r.parts[i]];
    if (obj == null) return null;
  }
  return { obj, prop: r.parts[r.parts.length - 1] };
}

/** Read a model value. @param {Ref|null} r @returns {any} */
function readRef(r) {
  const t = resolveRef(r);
  return t ? t.obj[t.prop] : '';
}

/**
 * Write a model value. If the target prop is a function it is a setter
 * (matches the vendor `xFunc(ModelRef[PropRef])` branch). Fires onChange only
 * when the value actually changes (unless forced).
 * @param {Ref|null} r @param {any} val @param {?Function} onChange @param {any} field @param {boolean} [force]
 */
function writeRef(r, val, onChange, field, force) {
  const t = resolveRef(r);
  if (!t) return;
  const old = t.obj[t.prop];
  if (!force && old === val) return;
  if (typeof t.obj[t.prop] === 'function') t.obj[t.prop]({ refStr: r.refStr, obj: t.obj, prop: t.prop }, val);
  else t.obj[t.prop] = val;
  if (onChange) onChange(field, val);
}

// ---------------------------------------------------------------------------
// Units + number formatting
// ---------------------------------------------------------------------------

/**
 * Resolve a UnitsData ref (e.g. 'HeightUnits') to the active {mult, unit} for
 * the current selection (UnitsType). Shape: {Selection:'.UnitsType', Units:[],
 * Mults:[], Formats?:[], Digits?:[]}.
 * @param {string} unitsRef
 * @param {string} modelRefName
 * @returns {{ mult: number, unit: string, format: ?string, digits: ?number }}
 */
function resolveUnits(unitsRef, modelRefName) {
  const fallback = { mult: 1, unit: '', format: null, digits: null };
  const data = readRef(makeRef(unitsRef, modelRefName));
  if (!data || data.Units == null) return fallback;
  let sel = data.Selection;
  if (typeof sel === 'string') {
    // A leading '.' means "relative to the model" (e.g. '.UnitsType' → CurveApp.UnitsType).
    const selRef = sel.charAt(0) === '.' ? modelRefName + sel : sel;
    sel = readRef(makeRef(selRef, modelRefName));
  }
  sel = sel | 0;
  return {
    mult: data.Mults ? data.Mults[sel] : 1,
    unit: data.Units ? data.Units[sel] : '',
    format: data.Formats ? data.Formats[sel] : null,
    digits: data.Digits ? data.Digits[sel] : null,
  };
}

/**
 * Format a number for display, reusing the vendor NumFormatter.
 * @param {number} num @param {?string} [format] @param {?number} [digits] @returns {string}
 */
function fmtNum(num, format, digits) {
  if (typeof num !== 'number' || !isFinite(num)) return String(num);
  if (!format) return String(num);
  return NumFormatter.NumToString(num, {
    Mode: format, Precision: digits != null ? digits : 4, UsePrefix: false, Units: '',
  });
}

/** Parse a user-typed string back to a number (tolerant of spaces/commas). @param {string} str @returns {number} */
function parseNum(str) {
  if (typeof NumFormatter.StringToNum === 'function') return NumFormatter.StringToNum(str);
  return parseFloat(String(str).replace(/[\s,]/g, ''));
}

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

/** @param {string} tag @param {string} [cls] @param {Record<string, any>} [attrs] @returns {any} */
function el(tag, cls, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) for (const k in attrs) { if (attrs[k] != null) e.setAttribute(k, String(attrs[k])); }
  return e;
}

// ---------------------------------------------------------------------------
// Field types — each returns a FieldObj
// ---------------------------------------------------------------------------

/**
 * Text / read-only value field.
 * @param {Panel} panel @param {Cfg} cfg
 * @param {{ sliderValue?: boolean, sliderOnly?: boolean, noLabel?: boolean }} [opts]
 * @returns {FieldObj}
 */
function TextField(panel, cfg, opts) {
  opts = opts || {};
  // Like the vendor, an absent ValueRef defaults to the field Name.
  const ref = makeRef(cfg.ValueRef || cfg.Name, panel.modelRef);
  const readOnly = cfg.ReadOnly != null ? !!cfg.ReadOnly : panel.readOnly;
  const id = panel.fieldId(cfg.Name);
  const fieldCls = 'cp-field' + (opts.sliderValue ? ' cp-field--slidervalue' : '') +
    (cfg.Color ? ' cp-field--' + cfg.Color : '');
  const field = el('div', fieldCls);

  let labelEl = null;
  // Like the vendor, an absent Label defaults to the field Name; '-' means none.
  const labelText = cfg.Label != null ? cfg.Label : cfg.Name;
  if (labelText && labelText !== '-' && !opts.noLabel) {
    labelEl = el('label', 'cp-field__label', { for: id });
    labelEl.innerHTML = labelText;
    field.appendChild(labelEl);
  }
  const inputWrap = el('span', 'cp-field__control');
  const input = readOnly
    ? el('output', 'cp-field__output', { id })
    : el('input', 'cp-field__input', { type: 'text', id, name: id, inputmode: 'decimal' });
  inputWrap.appendChild(input);
  const unitEl = el('span', 'cp-field__unit', { id: id + '-Unit' });
  inputWrap.appendChild(unitEl);
  field.appendChild(inputWrap);

  function curUnits() {
    if (cfg.UnitsData) return resolveUnits(cfg.UnitsData, panel.modelRef);
    return { mult: typeof cfg.Mult === 'number' ? cfg.Mult : 1, unit: cfg.Units || '', format: null, digits: null };
  }

  function store() {
    const u = curUnits();
    let v = parseNum(input.value);
    if (isNaN(v)) { update(); return; }
    v *= (u.mult || 1);
    writeRef(ref, v, panel.onModelChange, field, false);
  }

  function update() {
    if (!ref) return;
    const u = curUnits();
    const raw = readRef(ref);
    const disp = (u.mult && u.mult !== 0) ? raw / u.mult : raw;
    const format = u.format || cfg.Format || panel.format;
    const digits = u.digits != null ? u.digits : (cfg.Digits != null ? cfg.Digits : panel.digits);
    if (readOnly) {
      input.value = typeof disp === 'number' ? fmtNum(disp, format, digits) : String(disp);
    } else if (document.activeElement !== input) {
      input.value = typeof disp === 'number' ? fmtNum(disp, format, digits) : String(disp);
    }
    unitEl.textContent = u.unit ? ' ' + u.unit : '';
  }

  function init() {
    if (readOnly) return;
    input.addEventListener('change', store);
    input.addEventListener('keydown', (/** @type {KeyboardEvent} */ ev) => {
      if (ev.key === 'Enter') { store(); input.select(); ev.preventDefault(); }
      else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
        const u = curUnits();
        const cur = readRef(ref);
        if (typeof cur !== 'number') return;
        let step = (cfg.Inc || 1) * (u.mult || 1);
        if (ev.ctrlKey) step *= 10; if (ev.altKey) step /= 10;
        const nv = cur + (ev.key === 'ArrowUp' ? step : -step);
        writeRef(ref, nv, panel.onModelChange, field, true);
        ev.preventDefault();
      }
    });
    input.addEventListener('focus', () => input.select());
  }

  return { el: field, init, update, name: cfg.Name };
}

/**
 * Native range slider, bound to SliderValueRef (a pre-mapped [Min,Max] value).
 * @param {Panel} panel @param {Cfg} cfg @param {{ sliderOnly?: boolean }} [opts] @returns {FieldObj}
 */
function SliderField(panel, cfg, opts) {
  opts = opts || {};
  const ref = makeRef(cfg.SliderValueRef || cfg.ValueRef || cfg.Name, panel.modelRef);
  const id = panel.fieldId(cfg.Name) + '-Slider';
  const min = cfg.Min != null ? cfg.Min : 0;
  const max = cfg.Max != null ? cfg.Max : 1;
  const field = el('div', 'cp-field cp-field--slider' + (cfg.Color ? ' cp-field--' + cfg.Color : ''));
  const labelText = cfg.Label != null ? cfg.Label : cfg.Name;
  if (!opts.sliderOnly && labelText && labelText !== '-') {
    const l = el('label', 'cp-field__label', { for: id });
    l.innerHTML = labelText;
    field.appendChild(l);
  }
  const range = el('input', 'cp-field__range', {
    type: 'range', id, min, max,
    step: (max - min) / 1000 || 'any',
    'aria-label': (cfg.Label || cfg.Name || '').replace(/<[^>]+>/g, ''),
  });
  if (cfg.ReadOnly || cfg.SliderReadOnly) range.disabled = true;
  field.appendChild(range);

  function update() {
    if (!ref || document.activeElement === range) return;
    const v = readRef(ref);
    if (typeof v === 'number') range.value = String(v);
  }
  function init() {
    if (cfg.ReadOnly || cfg.SliderReadOnly) return;
    range.addEventListener('input', () => {
      writeRef(ref, parseFloat(range.value), panel.onModelChange, field, true);
    });
  }
  return { el: field, init, update, name: cfg.Name + '-Slider', slider: true };
}

/**
 * Radio group (single ValueRef, typed Items).
 * @param {Panel} panel @param {Cfg} cfg @returns {FieldObj}
 */
function RadioField(panel, cfg) {
  const ref = makeRef(cfg.ValueRef || cfg.Name, panel.modelRef);
  const type = cfg.ValueType || 'int';
  const groupName = panel.fieldId(cfg.Name);
  const fs = el('fieldset', 'cp-field cp-field--radio', { role: 'radiogroup' });
  const legendText = cfg.Label != null ? cfg.Label : cfg.Name;
  if (legendText && legendText !== '-') {
    const lg = el('legend', 'cp-field__legend');
    lg.innerHTML = legendText;
    fs.appendChild(lg);
  }
  /** @type {{ inp: any, value: any }[]} */
  const inputs = [];
  /** @type {any[]} */ (cfg.Items || []).forEach((it, i) => {
    if (!it || it.Text === '-') return;
    const iid = groupName + '-' + i;
    const lbl = el('label', 'cp-field__choice');
    const inp = el('input', 'cp-field__radio', { type: 'radio', name: groupName, id: iid, value: it.Value });
    const cap = el('span', 'cp-field__caption');
    cap.innerHTML = it.Text != null ? it.Text : it.Name;
    lbl.appendChild(inp); lbl.appendChild(cap); fs.appendChild(lbl);
    inputs.push({ inp, value: it.Value });
  });
  /** @param {any} v */
  function parse(v) {
    if (type === 'int') { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; }
    if (type === 'num') { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
    if (type === 'bool') return (v !== '' && v !== '0' && v !== 'false');
    return v;
  }
  function update() {
    const v = readRef(ref);
    for (const o of inputs) o.inp.checked = (v === parse(o.value));
  }
  function init() {
    for (const o of inputs) {
      o.inp.addEventListener('change', () => {
        if (o.inp.checked) writeRef(ref, parse(o.value), panel.onModelChange, fs, false);
      });
    }
  }
  return { el: fs, init, update, name: cfg.Name };
}

/**
 * Checkbox group (each Item binds its own boolean ValueRef).
 * @param {Panel} panel @param {Cfg} cfg @returns {FieldObj}
 */
function CheckboxField(panel, cfg) {
  const fs = el('fieldset', 'cp-field cp-field--checkbox', { role: 'group' });
  const legendText = cfg.Label != null ? cfg.Label : cfg.Name;
  if (legendText && legendText !== '-') {
    const lg = el('legend', 'cp-field__legend');
    lg.innerHTML = legendText;
    fs.appendChild(lg);
  }
  /** @type {{ inp: any, ref: Ref|null }[]} */
  const items = [];
  /** @type {any[]} */ (cfg.Items || []).forEach((it, i) => {
    if (!it || it.Text === '-') return;
    const iid = panel.fieldId(it.Name || cfg.Name + '-' + i);
    const ref = makeRef(it.ValueRef || it.Name, panel.modelRef);
    const lbl = el('label', 'cp-field__choice');
    const inp = el('input', 'cp-field__checkbox', { type: 'checkbox', id: iid, name: iid });
    const cap = el('span', 'cp-field__caption');
    cap.innerHTML = it.Text != null ? it.Text : it.Name;
    lbl.appendChild(inp); lbl.appendChild(cap); fs.appendChild(lbl);
    items.push({ inp, ref });
  });
  function update() { for (const o of items) o.inp.checked = !!readRef(o.ref); }
  function init() {
    for (const o of items) {
      o.inp.addEventListener('change', () => writeRef(o.ref, o.inp.checked, panel.onModelChange, fs, false));
    }
  }
  return { el: fs, init, update, name: cfg.Name };
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

let panelCounter = 0;

class Panel {
  /** @param {Cfg} [cfg] */
  constructor(cfg) {
    cfg = cfg || {};
    this.name = cfg.Name || ('ControlPanel' + ++panelCounter);
    this.modelRef = cfg.ModelRef || '';
    this.onModelChange = typeof cfg.OnModelChange === 'function' ? cfg.OnModelChange : null;
    this.ncols = cfg.NCols || 1;
    this.format = cfg.Format || 'fix';
    this.digits = cfg.Digits != null ? cfg.Digits : 2;
    this.readOnly = !!cfg.ReadOnly;
    this.valuePos = cfg.ValuePos || 'left';
    this.isSliderPanel = !!cfg.isSliderPanel;
    /** @type {FieldObj[]} */
    this.fields = [];
    /** @type {any} */
    this.dom = null;
    ControlPanels._register(this);
  }

  /** @param {string} name */
  fieldId(name) { return this.name + '-' + name; }

  /** @param {Cfg} cfg */
  AddHeader(cfg) {
    const h = el('div', 'cp-panel__header');
    h.innerHTML = (cfg && cfg.Text) || '';
    this.fields.push({ el: h, init() {}, update() {}, header: true });
    return this;
  }

  /** @param {Cfg} cfg */
  AddTextField(cfg) { this.fields.push(TextField(this, cfg, {})); return this; }

  /** @param {Cfg} cfg */
  AddValueSliderField(cfg) {
    // value text input + native range, both bound through the model.
    this.fields.push(TextField(this, cfg, { sliderValue: true }));
    this.fields.push(SliderField(this, cfg, { sliderOnly: true }));
    return this;
  }

  /** @param {Cfg} cfg */
  AddSliderField(cfg) { this.fields.push(SliderField(this, cfg, {})); return this; }
  /** @param {Cfg} cfg */
  AddRadiobuttonField(cfg) { this.fields.push(RadioField(this, cfg)); return this; }
  /** @param {Cfg} cfg */
  AddCheckboxField(cfg) { this.fields.push(CheckboxField(this, cfg)); return this; }

  /** @param {string} targetId */
  RenderInto(targetId) {
    const target = document.getElementById(targetId);
    // Missing target (e.g. units/save-restore targets dropped in the redesign):
    // skip rendering, like the old engine's document.write fallback (a post-parse
    // no-op). The panel still registers so ControlPanels.Update() is a safe no-op.
    if (!target) return this;
    const root = el('div', 'cp-panel cp-panel--cols' + this.ncols +
      (this.isSliderPanel ? ' cp-panel--slider' : '') +
      (this.readOnly ? ' cp-panel--readonly' : ''), { id: this.name });
    root.style.setProperty('--cp-cols', String(this.ncols));
    for (const f of this.fields) root.appendChild(f.el);
    target.appendChild(root);
    this.dom = root;
    for (const f of this.fields) f.init();
    this.Update();
    return this;
  }

  Update() { if (!this.dom) return; for (const f of this.fields) f.update(); }
}

// ---------------------------------------------------------------------------
// ControlPanels — the global API surface edc depends on
// ---------------------------------------------------------------------------

const ControlPanels = {
  /** @type {Panel[]} */
  _panels: [],
  /** @type {Record<string, Panel>} */
  _byName: {},
  /** @param {Panel} p */
  _register(p) { this._panels.push(p); this._byName[p.name] = p; },

  /** @param {Cfg} [cfg] */
  NewPanel(cfg) { return new Panel(cfg); },
  /** @param {Cfg} [cfg] */
  NewSliderPanel(cfg) {
    cfg = cfg || {};
    const p = new Panel(Object.assign({}, cfg, {
      NCols: (cfg.NCols ? cfg.NCols : 1) * 2,
      isSliderPanel: true,
    }));
    p.valuePos = cfg.ValuePos || 'left';
    return p;
  },

  /**
   * Refresh panels from the model. `refs` = name | "a,b" | array | undefined (all).
   * @param {string | any[]} [refs]
   */
  Update(refs) {
    let list = this._panels;
    if (typeof refs === 'string') {
      const names = refs.split(',').map((s) => s.trim());
      list = this._panels.filter((p) => names.indexOf(p.name) !== -1);
    } else if (Array.isArray(refs)) {
      list = this._panels.filter((p) => refs.indexOf(p.name) !== -1 || refs.indexOf(p) !== -1);
    }
    for (const p of list) p.Update();
  },

  /** @param {string} name */
  Get(name) { return this._byName[name] || null; },
};

Object.assign(globalThis, { ControlPanels });
