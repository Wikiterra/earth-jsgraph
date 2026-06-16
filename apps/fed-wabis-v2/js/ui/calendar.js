import { playback } from './playback.js';

const MNAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MFULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SPIN_IDS = ['cs-month', 'cs-day', 'cs-year', 'cs-hour', 'cs-min'];

const calState = { month: 0, day: 1, year: 2024, hour: 12, min: 0 };
let calendarOpen = false;

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

function openCalendar() {
  const toggle   = document.getElementById('calendar-toggle');
  const dropdown = document.getElementById('calendar-dropdown');
  if (!toggle || !dropdown) return;
  calendarOpen = true;
  dropdown.hidden = false;
  dropdown.setAttribute('aria-modal', 'true');
  toggle.setAttribute('aria-expanded', 'true');
  parseCalFromDateTime();
  renderCalDigits();
  updateYearProgress();
  const firstSpin = document.getElementById('cs-month');
  if (firstSpin) firstSpin.focus();
}

function closeCalendar() {
  const toggle   = document.getElementById('calendar-toggle');
  const dropdown = document.getElementById('calendar-dropdown');
  if (!toggle || !dropdown) return;
  calendarOpen = false;
  dropdown.hidden = true;
  dropdown.removeAttribute('aria-modal');
  toggle.setAttribute('aria-expanded', 'false');
}

function updateCalendarDisplay() {
  const el = document.getElementById('calendar-display');
  if (!el) return;
  try {
    const s = FeDomeApp.DateTimeToString(FeDomeApp.DateTime).split('|')[0].trim();
    el.textContent = s;
    /* Announce to screen readers only when not playing — avoids 60fps spam */
    if (!playback.active) {
      const statusEl = document.getElementById('canvas-status');
      if (statusEl) statusEl.textContent = s;
    }
    if (calendarOpen) {
      parseCalFromDateTime();
      renderCalDigits();
    }
  } catch (e) {}
}

function updateYearProgress() {
  const fill = document.getElementById('cal-year-fill');
  if (!fill) return;
  try {
    const pct = Math.min(100, Math.max(0, (FeDomeApp.DayOfYear / 364) * 100));
    fill.style.width = pct + '%';
    fill.parentElement.setAttribute('aria-valuenow', Math.round(FeDomeApp.DayOfYear));
  } catch (e) {}
}

export function sync() {
  updateCalendarDisplay();
  updateYearProgress();
}

export function init() {
  const calToggle   = document.getElementById('calendar-toggle');
  const calDropdown = document.getElementById('calendar-dropdown');

  calToggle.addEventListener('click', e => {
    e.stopPropagation();
    calendarOpen ? closeCalendar() : openCalendar();
  });

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
      if (e.key === 'Escape') closeCalendar();
    });

    el.addEventListener('wheel', e => {
      e.preventDefault();
      stepCalField(field, e.deltaY < 0 ? +1 : -1);
    }, { passive: false });
  });

  /* Step buttons (← 1yr / ← 1d / 1d → / 1yr →) */
  for (const btn of calDropdown.querySelectorAll('.cal-btn[data-cal-step]')) {
    btn.addEventListener('click', () => {
      FeDomeApp.DateTime += parseFloat(btn.dataset.calStep);
      UpdateAll();
    });
  }

  /* Focus trap inside the open dropdown */
  calDropdown.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !calendarOpen) return;
    const focusable = calDropdown.querySelectorAll('[tabindex="0"], button');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (calendarOpen && !calDropdown.contains(e.target) && e.target !== calToggle) {
      closeCalendar();
    }
  });
}
