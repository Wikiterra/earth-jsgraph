/* Resolve a button's controlled prop names: either a single data-prop or
   a comma-separated data-prop-list (the Orbits button toggles both tracks). */
function propsOf(btn) {
  if (btn.dataset.prop) return [btn.dataset.prop];
  if (btn.dataset.propList) return btn.dataset.propList.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

/* Multi-prop buttons are "pressed" iff *every* controlled prop is on. */
function pressedState(props) {
  return props.length > 0 && props.every(p => !!FeDomeApp[p]);
}

/* Format observer position, e.g. "12.3°N, 45.6°E". */
function fmtLatLong() {
  const lat = FeDomeApp.ObserverLat, lng = FeDomeApp.ObserverLong;
  const f = (v, pos, neg) => Math.abs(v).toFixed(1) + '°' + (v >= 0 ? pos : neg);
  return '⌖ ' + f(lat, 'N', 'S') + ', ' + f(lng, 'E', 'W');
}

export function sync() {
  for (const btn of document.querySelectorAll('.layer-toggle')) {
    const props = propsOf(btn);
    if (!props.length) continue;
    btn.setAttribute('aria-pressed', pressedState(props) ? 'true' : 'false');
  }
  const ll = document.getElementById('ll-text');
  if (ll) { try { ll.textContent = fmtLatLong(); } catch (e) {} }
  const strip = document.getElementById('latlong-strip');
  if (strip) strip.classList.toggle('active', !!FeDomeApp.MoveObserverMode);

  const dim = document.getElementById('dim-text');
  if (dim) {
    try {
      const km = v => Math.round(v).toLocaleString('en') + ' km';
      dim.textContent = 'Earth ⌀ ' + km(2 * FeDomeApp.RadiusFE) +
        ' · Dome ⌀ ' + km(2 * FeDomeApp.DomeSize * FeDomeApp.RadiusFE) +
        ' · P-Dome ⌀ ' + km(2 * FeDomeApp.RadiusSphere);
    } catch (e) {}
  }
}

export function init() {
  for (const btn of document.querySelectorAll('.layer-toggle')) {
    const props = propsOf(btn);
    if (!props.length) continue;
    btn.addEventListener('click', () => {
      const turnOn = !pressedState(props);
      for (const p of props) FeDomeApp[p] = turnOn;
      UpdateAll();
    });
  }

  /* Position toggle — special: toggles MoveObserverMode. Activating also shows the
     personal dome (so the highlight is visible) and redraws. */
  const moveBtn = document.getElementById('move-observer-btn');
  if (moveBtn) {
    moveBtn.addEventListener('click', () => {
      const active = moveBtn.getAttribute('aria-pressed') !== 'true';
      moveBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      FeDomeApp.MoveObserverMode = active;
      if (active) FeDomeApp.ShowSphere = true;
      UpdateAll();
    });
  }
}
