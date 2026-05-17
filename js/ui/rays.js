export function sync() {
  for (const btn of document.querySelectorAll('.ray-opt[data-group="RayTarget"]')) {
    btn.setAttribute('aria-checked', parseInt(btn.dataset.value) === FeDomeApp.RayTarget ? 'true' : 'false');
  }
  for (const btn of document.querySelectorAll('.ray-opt[data-group="RaySource"]')) {
    btn.setAttribute('aria-checked', parseInt(btn.dataset.value) === FeDomeApp.RaySource ? 'true' : 'false');
  }
}

export function init() {
  for (const btn of document.querySelectorAll('.ray-opt')) {
    btn.addEventListener('click', () => {
      FeDomeApp[btn.dataset.group] = parseInt(btn.dataset.value);
      UpdateAll();
    });
  }
}
