// Slider.js — Modernized: replaced custom DgdSlider with <input type="range">
// (C) http://walter.bislins.ch/doku/Slider
//
// Maintains full backward compatibility for ControlPanel.js CpSliderField.
// Public API: DgdSliderHtml(id, caption, color), new DgdSlider(id, options),
//   .free(), .enable(), .disable(), .readonly(), .setValue(x, y, snap),
//   .updateLayout(), options.animationCallback(x, y)
// Internal: DgdCursor, DgdPosition — preserved as no-ops for legacy callers.

// ---- Stubs for legacy dependencies (no-op implementations) ----
var DgdCursor = { x: 0, y: 0, init: function () {}, refresh: function () {}, set: function () {} };
var DgdPosition = { get: function () { return [0, 0]; } };

// ---- HTML generator (wraps <input type="range"> in a div for layout compat) ----
function DgdSliderHtml(aID, aCaption, aHandleColor, aSliderColor) {
  aCaption = aCaption || '\u21C4';  // ⇄
  aHandleColor = aHandleColor || '';
  aSliderColor = aSliderColor || '';
  var style = aSliderColor ? ' style="background:' + aSliderColor + '"' : '';
  return '<div id="' + aID + '" class="Slider"' + style + '>'
    + '<input type="range" id="' + aID + '-Handle" class="Handle"'
    + ' min="0" max="1" step="any" value="0">'
    + '</div>';
}

// ---- DgdSlider — native <input type="range"> wrapper ----
var DgdSlider = function (wrapper, options) {
  if (!(wrapper = xElement(wrapper))) return;
  this.wrapper = wrapper;
  this.input = wrapper.querySelector('input[type="range"]');
  if (!this.input) return;

  this.options = options || {};
  this.disabled = false;
  this._callback = options.animationCallback || null;
  this._slide = options.slide || false;

  var self = this;
  this._inputHandler = function () { self._onInput(); };
  if (this._callback) {
    this.input.addEventListener('input', this._inputHandler);
  }
  this.IsLife = true;
};

DgdSlider.prototype = {
  free: function () {
    if (this.input && this._inputHandler) {
      this.input.removeEventListener('input', this._inputHandler);
    }
    this.wrapper = null;
    this.input = null;
    this.IsLife = false;
  },
  enable: function () {
    this.disabled = false;
    this.input.disabled = false;
    this.wrapper.classList.remove('Disabled');
  },
  disable: function () {
    this.disabled = true;
    this.input.disabled = true;
    this.wrapper.classList.add('Disabled');
  },
  readonly: function () {
    this.disabled = true;
    this.wrapper.classList.add('ReadOnly');
  },
  setValue: function (x, y, snap) {
    if (!this.input) return;
    var v = Math.max(0, Math.min(1, x));
    this.input.value = v.toString();
  },
  updateLayout: function () {
    // Native <input type="range"> resizes automatically — no-op.
  },
  _onInput: function () {
    if (this.disabled || !this._callback) return;
    var val = parseFloat(this.input.value);
    if (isNaN(val)) val = 0;
    this._callback(val, 0);
  },
};

Object.assign(globalThis, { DgdCursor, DgdPosition, DgdSliderHtml, DgdSlider });
