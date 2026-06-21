import { playback } from './playback.js';

const MNAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MFULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SPIN_IDS = ['cs-month', 'cs-day', 'cs-year', 'cs-hour', 'cs-min'];

const calState = { month: 0, day: 1, year: 2024, hour: 12, min: 0 };

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

function parseCalFromDateTime() {
  try {
    const d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
    calState.month = d.getUTCMonth();
    calState.day   = d.getUTCDate();
    calState.year  = d.getUTCFullYear();
    calState.hour  = d.getUTCHours();
    calState.min   = d.getUTCMinutes();
  } catch (e) {}
}

function renderCalDigits() {
  try {
    const sm = document.getElementById('cs-month');
    if (!sm) return;
    sm.textContent = MNAMES[calState.month];
    sm.setAttribute('aria-valuenow',  calState.month);
    sm.setAttribute('aria-valuetext', MFULL[calState.month]);
    const sd = document.getElementById('cs-day');
    sd.textContent = String(calState.day).padStart(2, '0');
    sd.setAttribute('aria-valuenow', calState.day);
    const sy = document.getElementById('cs-year');
    sy.textContent = calState.year;
    sy.setAttribute('aria-valuenow', calState.year);
    const sh = document.getElementById('cs-hour');
    sh.textContent = String(calState.hour).padStart(2, '0');
    sh.setAttribute('aria-valuenow', calState.hour);
    const sn = document.getElementById('cs-min');
    sn.textContent = String(calState.min).padStart(2, '0');
    sn.setAttribute('aria-valuenow', calState.min);
  } catch (e) {}
}

function applyCalDigits() {
  try {
    const d = new Date(0);
    d.setUTCFullYear(calState.year, calState.month, calState.day);
    d.setUTCHours(calState.hour, calState.min, 0, 0);
    const dt = d.getTime() / FeDomeApp.msPerDay - FeDomeApp.ZeroDate;
    if (!isNaN(dt)) { FeDomeApp.DateTime = dt; UpdateAll(); }
  } catch (e) {}
}

function stepCalField(field, delta) {
  let maxDay;
  switch (field) {
    case 'month':
      calState.month = (calState.month + delta + 12) % 12;
      maxDay = daysInMonth(calState.year, calState.month);
      if (calState.day > maxDay) calState.day = maxDay;
      break;
    case 'day':
      maxDay = daysInMonth(calState.year, calState.month);
      calState.day = ((calState.day - 1 + delta + maxDay) % maxDay) + 1;
      break;
    case 'year':
      calState.year = Math.max(1900, Math.min(2099, calState.year + delta));
      maxDay = daysInMonth(calState.year, calState.month);
      if (calState.day > maxDay) calState.day = maxDay;
      break;
    case 'hour':
      calState.hour = (calState.hour + delta + 24) % 24;
      break;
    case 'min':
      calState.min = (calState.min + delta + 60) % 60;
      break;
  }
  renderCalDigits();
  applyCalDigits();
}

function updateCalendarDisplay() {
  if (!document.getElementById('cs-month')) return;
  try {
    parseCalFromDateTime();
    renderCalDigits();
  } catch (e) {}
}

export function sync() {
  updateCalendarDisplay();
}

export function init() {
  const calDropdown = document.getElementById('calendar-dropdown');
  if (!calDropdown) return;

  /* Digit-scroll spinbuttons: ↑↓ arrows + mouse wheel */
  SPIN_IDS.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    const field = el.dataset.field;

    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp')   { e.preventDefault(); stepCalField(field, +1); }
      if (e.key === 'ArrowDown') { e.preventDefault(); stepCalField(field, -1); }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = document.getElementById(SPIN_IDS[Math.max(0, idx - 1)]);
        if (prev) prev.focus();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = document.getElementById(SPIN_IDS[Math.min(SPIN_IDS.length - 1, idx + 1)]);
        if (next) next.focus();
      }
    });

    el.addEventListener('wheel', e => {
      e.preventDefault();
      stepCalField(field, e.deltaY < 0 ? +1 : -1);
    }, { passive: false });
  });

  /* Arrow buttons (up/down) next to each spin field — auto-repeat with acceleration */
  const repeatTimers = {};
  const REPEAT_START = 400;   // ms before first repeat
  const REPEAT_FAST  = 50;    // ms at max speed
  const REPEAT_ACCEL = 0.85;  // multiplier per tick (gets faster)

  function startRepeat(field, delta) {
    stopRepeat(field);
    let delay = REPEAT_START;
    function tick() {
      stepCalField(field, delta);
      delay = Math.max(REPEAT_FAST, delay * REPEAT_ACCEL);
      repeatTimers[field] = setTimeout(tick, delay);
    }
    repeatTimers[field] = setTimeout(tick, delay);
  }

  function stopRepeat(field) {
    if (repeatTimers[field]) {
      clearTimeout(repeatTimers[field]);
      delete repeatTimers[field];
    }
  }

  for (const arrow of calDropdown.querySelectorAll('.cal-arrow')) {
    const field = arrow.dataset.field;
    if (!field) continue;
    const delta = arrow.classList.contains('cal-up') ? +1 : -1;

    arrow.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      stepCalField(field, delta);
      startRepeat(field, delta);
    });

    arrow.addEventListener('mouseup', () => stopRepeat(field));
    arrow.addEventListener('mouseleave', () => stopRepeat(field));

    // touch support
    arrow.addEventListener('touchstart', e => {
      e.preventDefault();
      e.stopPropagation();
      stepCalField(field, delta);
      startRepeat(field, delta);
    }, { passive: false });

    arrow.addEventListener('touchend', () => stopRepeat(field));
    arrow.addEventListener('touchcancel', () => stopRepeat(field));
  }
}
