export const playback = {
  active:   false,
  rafId:    null,
  lastTs:   null,
  baseRate: 365.256,
  stepSize: 365.256,

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

  /* Speed cycle button: click → next preset, shift-click / right-click → previous.
     Each preset sets both the RAF rate (days/sec) and the ⏮/⏭ jump size (days). */
  const SPEED_PRESETS = [
    { label: '1 h/s',   rate: 0.04167,  step: 0.04167 },
    { label: '12 h/s',  rate: 0.5,      step: 0.5 },
    { label: '1 d/s',   rate: 1,        step: 1 },
    { label: '1 wk/s',  rate: 7,        step: 7 },
    { label: '1 mo/s',  rate: 30.437,   step: 30.437 },
    { label: '1 yr/s',  rate: 365.256,  step: 365.256 },
  ];
  const speedBtn   = document.getElementById('pb-speed-btn');
  const speedLabel = document.getElementById('pb-speed-label');
  if (speedBtn && speedLabel) {
    let speedIx = SPEED_PRESETS.findIndex(p => p.label === speedLabel.textContent.trim());
    if (speedIx < 0) speedIx = SPEED_PRESETS.length - 1; // default to last (1 yr/s)
    const applySpeed = () => {
      const p = SPEED_PRESETS[speedIx];
      playback.baseRate = p.rate;
      playback.stepSize = p.step;
      speedLabel.textContent = p.label;
    };
    const cycle = (dir) => {
      speedIx = (speedIx + dir + SPEED_PRESETS.length) % SPEED_PRESETS.length;
      applySpeed();
    };
    applySpeed();
    speedBtn.addEventListener('click', e => cycle(e.shiftKey ? -1 : 1));
    speedBtn.addEventListener('contextmenu', e => { e.preventDefault(); cycle(-1); });
    speedBtn.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); cycle(1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') { e.preventDefault(); cycle(-1); }
    });
  }

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
