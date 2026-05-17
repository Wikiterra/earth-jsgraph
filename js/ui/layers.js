export function sync() {
  const btns = document.querySelectorAll('.layer-toggle[data-prop]');
  for (const btn of btns) {
    btn.setAttribute('aria-pressed', FeDomeApp[btn.dataset.prop] ? 'true' : 'false');
  }
}

export function init() {
  const btns = document.querySelectorAll('.layer-toggle[data-prop]');
  for (const btn of btns) {
    btn.addEventListener('click', () => {
      const prop = btn.dataset.prop;
      FeDomeApp[prop] = !FeDomeApp[prop];
      UpdateAll();
    });
  }
}
