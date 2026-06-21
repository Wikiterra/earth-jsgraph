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

export function sync() {
  for (const btn of document.querySelectorAll('.layer-toggle')) {
    const props = propsOf(btn);
    if (!props.length) continue;
    btn.setAttribute('aria-pressed', pressedState(props) ? 'true' : 'false');
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

  /* Move observer toggle — special: toggles MoveObserverMode flag */
  const moveBtn = document.getElementById('move-observer-btn');
  if (moveBtn) {
    moveBtn.addEventListener('click', () => {
      const active = moveBtn.getAttribute('aria-pressed') !== 'true';
      moveBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      FeDomeApp.MoveObserverMode = active;
    });
  }
}
