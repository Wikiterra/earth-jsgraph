export const playback = {
  active:   false,
  rafId:    null,
  lastTs:   null,
  baseRate: 0.6,
  stepSize: 1.0,

  start() {
    this.active = true;
    this.lastTs = null;
    this._setPlayUI(true);
    this.rafId = requestAnimationFrame(this._tick.bind(this));
  },

  stop() {
    this.active = false;
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    this._setPlayUI(false);
  },

  toggle() { this.active ? this.stop() : this.start(); },

  step(direction) {
    FeDomeApp.DateTime += this.stepSize * direction;
    UpdateAll();
  },

  _tick(ts) {
    if (!this.active) return;
    if (this.lastTs !== null) {
      const elapsed = Math.min((ts - this.lastTs) / 1000, 0.1);
      FeDomeApp.DateTime += this.baseRate * elapsed;
      UpdateAll();
    }
    this.lastTs = ts;
    this.rafId = requestAnimationFrame(this._tick.bind(this));
  },

  _setPlayUI(playing) {
    const btn  = document.getElementById('pb-play');
    const path = document.getElementById('pb-play-icon');
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label',   playing ? 'Pause' : 'Play');
    /* Single SVG path: triangle for play, two bars for pause. */
    path.setAttribute('d', playing ? 'M6 5h4v14H6zm8 0h4v14h-4z' : 'M8 5v14l11-7z');
  }
};

export function sync() { /* no display state beyond the play button, handled in _setPlayUI */ }

export function init() {
  document.getElementById('pb-play').addEventListener('click', () => playback.toggle());

  document.getElementById('pb-step-back').addEventListener('click', () => {
    playback.stop();
    playback.step(-1);
  });

  document.getElementById('pb-step-fwd').addEventListener('click', () => {
    playback.stop();
    playback.step(1);
  });

  const pbReset = document.getElementById('pb-reset');
  if (pbReset) {
    pbReset.addEventListener('click', () => {
      playback.stop();
      if (typeof ResetApp === 'function') ResetApp();
    });
  }

  /* Stop playback when a demo tab is activated */
  const demoTabList = document.getElementById('DomeDemoTabs');
  if (demoTabList) {
    demoTabList.addEventListener('click', e => {
      const li = e.target.closest ? e.target.closest('li') : e.target;
      if (li && !li.classList.contains('tab-hidden')) playback.stop();
    });
  }

  /* Space toggles play/pause when not focused in an input */
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      playback.toggle();
    }
  });
}
