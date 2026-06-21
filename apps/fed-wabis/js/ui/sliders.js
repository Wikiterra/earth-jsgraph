function fmtDist(km) {
  if (km >= 1e6) return (km / 1e6).toFixed(2) + 'M';
  if (km >= 1e3) return Math.round(km / 1e3) + 'k';
  return Math.round(km) + '';
}

/* Map day-of-year (0..364, non-leap baseline) to "Mon DD" for the timeline label.
   Walter's calendar treats day 0 = Jan 1. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_START_DAY = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; // Jan..Dec
function fmtDayOfYear(doy) {
  const d = Math.max(0, Math.min(364, Math.round(doy)));
  let m = 0;
  for (let i = 11; i >= 0; i--) { if (d >= MONTH_START_DAY[i]) { m = i; break; } }
  return MONTHS[m] + ' ' + (d - MONTH_START_DAY[m] + 1);
}

function setIfNotFocused(input, valEl, value, text) {
  if (!input || input === document.activeElement) return;
  input.value = value;
  if (valEl) valEl.textContent = text;
}

/* Timeline mode state — shared between sync() and the input handler */
let tlModeIx = 1; // 0=1h, 1=1d, 2=1y

function fmtTimelineValue(v) {
  if (tlModeIx === 0) return String(Math.round(v)).padStart(2, '0') + ':00';
  if (tlModeIx === 2) return 'Year ' + (2024 + Math.round(v));
  return fmtDayOfYear(v);
}

export function sync() {
  try {
    var tlVal;
    if (tlModeIx === 0) {
      tlVal = FeDomeApp.Time;
    } else if (tlModeIx === 2) {
      try {
        var d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
        tlVal = d.getUTCFullYear() - 2024;
        tlVal = Math.max(0, Math.min(4, tlVal));
      } catch (e) { tlVal = 0; }
    } else {
      tlVal = FeDomeApp.DayOfYear;
    }
    setIfNotFocused(document.getElementById('tc-day'),
                    document.getElementById('tc-day-val'),
                    tlVal, fmtTimelineValue(tlVal));

    setIfNotFocused(document.getElementById('ps-moon-ecl'),
                    document.getElementById('pv-moon-ecl'),
                    FeDomeApp.MoonEcliptic, FeDomeApp.MoonEcliptic.toFixed(1) + '°');

    setIfNotFocused(document.getElementById('ps-dist-sun'),
                    document.getElementById('pv-dist-sun'),
                    Math.log10(FeDomeApp.DistSun), fmtDist(FeDomeApp.DistSun));

    setIfNotFocused(document.getElementById('ps-dist-moon'),
                    document.getElementById('pv-dist-moon'),
                    Math.log10(FeDomeApp.DistMoon), fmtDist(FeDomeApp.DistMoon));

    setIfNotFocused(document.getElementById('ps-dome-h'),
                    document.getElementById('pv-dome-h'),
                    FeDomeApp.DomeHeight, Math.round(FeDomeApp.DomeHeight));

    setIfNotFocused(document.getElementById('ps-dome-sz'),
                    document.getElementById('pv-dome-sz'),
                    FeDomeApp.DomeSize, FeDomeApp.DomeSize.toFixed(1));

    setIfNotFocused(document.getElementById('ps-ray-p'),
                    document.getElementById('pv-ray-p'),
                    FeDomeApp.RayParameter, FeDomeApp.RayParameter.toFixed(1));
  } catch (e) { /* FeDomeApp not yet initialised */ }
}

export function init() {
  document.getElementById('tc-day').addEventListener('input', function () {
    const v = parseFloat(this.value);
    if (tlModeIx === 0) {
      /* 1h mode: value 0-23 sets hour of day */
      FeDomeApp.DateTime = Math.floor(FeDomeApp.DateTime) + v / 24;
    } else if (tlModeIx === 2) {
      /* 1y mode: value 0-4 sets year offset from 2024 */
      var year = 2024 + Math.round(v);
      var d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
      d.setUTCFullYear(year);
      FeDomeApp.DateTime = d.getTime() / FeDomeApp.msPerDay - FeDomeApp.ZeroDate;
    } else {
      /* 1d mode: value 0-364 = day of year */
      FeDomeApp.DateTime = v + FeDomeApp.Time / 24;
    }
    document.getElementById('tc-day-val').textContent = fmtTimelineValue(v);
    UpdateAll();
  });

  /* Timeline mode cycling: 1h (hour), 1d (day), 1y (year) */
  const tlMode = document.getElementById('tl-mode');
  const tlLabel = document.getElementById('tl-mode-label');
  if (tlMode && tlLabel) {
    const MODES = [
      { label: '1h', rangeMin: 0, rangeMax: 23, rangeStep: 1 },
      { label: '1d', rangeMin: 0, rangeMax: 364, rangeStep: 1 },
      { label: '1y', rangeMin: 0, rangeMax: 4, rangeStep: 1 },
    ];
    const applyMode = () => {
      const mode = MODES[tlModeIx];
      tlLabel.textContent = mode.label;
      const range = document.getElementById('tc-day');
      if (range) {
        range.min = mode.rangeMin;
        range.max = mode.rangeMax;
        range.step = mode.rangeStep;
        /* Set value based on current datetime */
        var v;
        if (tlModeIx === 0) {
          v = Math.round(FeDomeApp.Time);
        } else if (tlModeIx === 2) {
          /* Extract year from current DateTime */
          try {
            var d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
            v = d.getUTCFullYear() - 2024;
          } catch (e) { v = 0; }
          v = Math.max(0, Math.min(4, v));
        } else {
          v = FeDomeApp.DayOfYear;
        }
        v = Math.max(mode.rangeMin, Math.min(mode.rangeMax, v));
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

  document.getElementById('ps-moon-ecl').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.MoonEcliptic = v;
    document.getElementById('pv-moon-ecl').textContent = v.toFixed(1) + '°';
    UpdateAll();
  });

  document.getElementById('ps-dist-sun').addEventListener('input', function () {
    const km = Math.pow(10, parseFloat(this.value));
    FeDomeApp.DistSun = km;
    document.getElementById('pv-dist-sun').textContent = fmtDist(km);
    UpdateAll();
  });

  // ps-dist-moon slider was removed from index.html; its dead wiring threw on a
  // null element, aborting the rest of init() (later sliders) and appShell.js.

  document.getElementById('ps-dome-h').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.DomeHeight = v;
    document.getElementById('pv-dome-h').textContent = Math.round(v);
    UpdateAll();
  });

  document.getElementById('ps-dome-sz').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.DomeSize = v;
    document.getElementById('pv-dome-sz').textContent = v.toFixed(1);
    UpdateAll();
  });

  document.getElementById('ps-ray-p').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.RayParameter = v;
    document.getElementById('pv-ray-p').textContent = v.toFixed(1);
    UpdateAll();
  });
}
