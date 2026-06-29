const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // matches Date.getUTCDay()

// Dome Size is the master geometry slider: dome height and sun distance scale
// with it, using their DomeSize=1 values as the base.
const DOME_H_AT_SIZE1 = 9000;        // km
const DIST_SUN_AT_SIZE1 = 149600000; // km

function setIfNotFocused(input, valEl, value, text) {
  if (!input || input === document.activeElement) return;
  input.value = value;
  if (valEl) valEl.textContent = text;
}

/* Timeline mode: 0 = minutes within the hour (0–59), 1 = hours within the day
   (0–23), 2 = days within the week (Sun–Sat), 3 = months within the year (Jan–Dec). */
let tlModeIx = 1;
const p2 = (n) => String(n).padStart(2, '0');

function curHour() {
  const dt = FeDomeApp.DateTime;
  return Math.floor((dt - Math.floor(dt)) * 24 + 1e-9);
}
function curMinute() {
  const dt = FeDomeApp.DateTime;
  const h = (dt - Math.floor(dt)) * 24;
  return Math.round((h - Math.floor(h + 1e-9)) * 60) % 60;
}
function curMonth() {
  try {
    const d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
    return d.getUTCMonth();
  } catch (e) { return 0; }
}
function curWeekday() {
  try {
    const d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
    return d.getUTCDay();
  } catch (e) { return 0; }
}

function modeValue() {
  if (tlModeIx === 0) return curMinute();
  if (tlModeIx === 1) return curHour();
  if (tlModeIx === 2) return curWeekday();
  return curMonth();
}

function setModeValue(v) {
  const day = Math.floor(FeDomeApp.DateTime);
  if (tlModeIx === 0) {            // minutes within the hour
    FeDomeApp.DateTime = day + (curHour() + v / 60) / 24;
  } else if (tlModeIx === 1) {     // hours within the day
    FeDomeApp.DateTime = day + (v + curMinute() / 60) / 24;
  } else if (tlModeIx === 2) {     // days within the week — shift whole days, keep time-of-day
    FeDomeApp.DateTime += Math.round(v) - curWeekday();
  } else {                         // months within the year
    const d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
    d.setUTCMonth(Math.round(v));
    FeDomeApp.DateTime = d.getTime() / FeDomeApp.msPerDay - FeDomeApp.ZeroDate;
  }
}

function fmtTimelineValue(v) {
  if (tlModeIx === 0) return p2(curHour()) + ':' + p2(Math.round(v));
  if (tlModeIx === 1) return p2(Math.round(v)) + ':00';
  if (tlModeIx === 2) return DOW[Math.max(0, Math.min(6, Math.round(v)))];
  return MONTHS[Math.max(0, Math.min(11, Math.round(v)))];
}

export function sync() {
  try {
    var tlVal = modeValue();
    setIfNotFocused(document.getElementById('tc-day'),
                    document.getElementById('tc-day-val'),
                    tlVal, fmtTimelineValue(tlVal));

    setIfNotFocused(document.getElementById('ps-dome-sz'),
                    document.getElementById('pv-dome-sz'),
                    FeDomeApp.DomeSize, FeDomeApp.DomeSize.toFixed(1));

    setIfNotFocused(document.getElementById('ps-pdome-sz'),
                    document.getElementById('pv-pdome-sz'),
                    FeDomeApp.RadiusSphere, Math.round(FeDomeApp.RadiusSphere));

    setIfNotFocused(document.getElementById('ps-ray-p'),
                    document.getElementById('pv-ray-p'),
                    FeDomeApp.RayParameter, FeDomeApp.RayParameter.toFixed(1));
  } catch (e) { /* FeDomeApp not yet initialised */ }
}

export function init() {
  /* Parameter sliders live behind one icon — toggle the popover open/closed */
  const paramToggle = document.getElementById('param-toggle');
  const paramPopover = document.getElementById('param-popover');
  if (paramToggle && paramPopover) {
    paramToggle.addEventListener('click', () => {
      const open = paramPopover.hidden;
      paramPopover.hidden = !open;
      paramToggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.getElementById('tc-day').addEventListener('input', function () {
    const v = parseFloat(this.value);
    setModeValue(v);
    document.getElementById('tc-day-val').textContent = fmtTimelineValue(v);
    UpdateAll();
  });

  /* Timeline mode cycling: 1h (hour), 1d (day), 1y (year) */
  const tlMode = document.getElementById('tl-mode');
  const tlLabel = document.getElementById('tl-mode-label');
  if (tlMode && tlLabel) {
    const MODES = [
      { label: '1h', min: 0, max: 59, step: 1, ticks: [[0,'00'],[15,'15'],[30,'30'],[45,'45'],[59,'59']], tp: v => v / 59 },
      { label: '1d', min: 0, max: 23, step: 1, ticks: [[0,'0'],[6,'6'],[12,'12'],[18,'18'],[23,'23']], tp: v => v / 23 },
      { label: '1w', min: 0, max: 6, step: 1, ticks: DOW.map((d, i) => [i, d]), tp: v => v / 6 },
      { label: '1y', min: 0, max: 11, step: 1, ticks: MONTHS.map((m, i) => [i, m]), tp: v => v / 11 },
    ];
    const ticksEl = document.querySelector('.timeline-ticks');
    const renderTicks = (mode) => {
      if (!ticksEl) return;
      ticksEl.innerHTML = mode.ticks
        .map(([val, lbl]) => `<span class="tk" style="--p: ${mode.tp(val)}">${lbl}</span>`)
        .join('');
    };
    const applyMode = () => {
      const mode = MODES[tlModeIx];
      tlLabel.textContent = mode.label;
      renderTicks(mode);
      const range = document.getElementById('tc-day');
      if (range) {
        range.min = mode.min;
        range.max = mode.max;
        range.step = mode.step;
        const v = Math.max(mode.min, Math.min(mode.max, modeValue()));
        range.value = v;
        document.getElementById('tc-day-val').textContent = fmtTimelineValue(v);
      }
    };
    applyMode();
    tlMode.addEventListener('click', () => {
      tlModeIx = (tlModeIx + 1) % MODES.length;
      applyMode();
      UpdateAll();
    });
  }

  // Master Dome Size slider — scales dome height and sun distance with it.
  document.getElementById('ps-dome-sz').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.DomeSize = v;
    FeDomeApp.DomeHeight = DOME_H_AT_SIZE1 * v;
    FeDomeApp.DistSun = DIST_SUN_AT_SIZE1 * v;
    document.getElementById('pv-dome-sz').textContent = v.toFixed(1);
    UpdateAll();
  });

  document.getElementById('ps-pdome-sz').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.RadiusSphere = v;
    document.getElementById('pv-pdome-sz').textContent = Math.round(v);
    UpdateAll();
  });

  document.getElementById('ps-ray-p').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.RayParameter = v;
    document.getElementById('pv-ray-p').textContent = v.toFixed(1);
    UpdateAll();
  });
}
