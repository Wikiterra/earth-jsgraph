const deg = n => n.toFixed(0) + '°';

export function sync() {
  const strip = document.getElementById('sun-moon-strip');
  if (!strip) return;
  const sunEl  = strip.querySelector('.sms-sun');
  const moonEl = strip.querySelector('.sms-moon');
  if (!sunEl || !moonEl) return;
  try {
    sunEl.textContent  = FeDomeApp.SunFeCelestSphereCoord[2]  > 0
      ? '☀ ' + deg(FeDomeApp.SunAnglesGlobe.azimuth)  + ' / ' + deg(FeDomeApp.SunAnglesGlobe.elevation)
      : '☀ below';
    moonEl.textContent = FeDomeApp.MoonFeCelestSphereCoord[2] > 0
      ? '☾ ' + deg(FeDomeApp.MoonAnglesGlobe.azimuth) + ' / ' + deg(FeDomeApp.MoonAnglesGlobe.elevation)
      : '☾ below';
  } catch (e) {}
}

export function init() { /* read-only display, no events */ }
