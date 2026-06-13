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

export function sync() {
  try {
    setIfNotFocused(document.getElementById('tc-time'),
                    document.getElementById('tc-time-val'),
                    FeDomeApp.Time, FeDomeApp.Time.toFixed(1));

    setIfNotFocused(document.getElementById('tc-day'),
                    document.getElementById('tc-day-val'),
                    FeDomeApp.DayOfYear, fmtDayOfYear(FeDomeApp.DayOfYear));

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
  document.getElementById('tc-time').addEventListener('input', function () {
    const v = parseFloat(this.value);
    FeDomeApp.DateTime = Math.floor(FeDomeApp.DateTime) + v / 24;
    document.getElementById('tc-time-val').textContent = v.toFixed(1);
    UpdateAll();
  });

  document.getElementById('tc-day').addEventListener('input', function () {
    const v = parseInt(this.value);
    FeDomeApp.DateTime = v + FeDomeApp.Time / 24;
    document.getElementById('tc-day-val').textContent = fmtDayOfYear(v);
    UpdateAll();
  });

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

  document.getElementById('ps-dist-moon').addEventListener('input', function () {
    const km = Math.pow(10, parseFloat(this.value));
    FeDomeApp.DistMoon = km;
    document.getElementById('pv-dist-moon').textContent = fmtDist(km);
    UpdateAll();
  });

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
