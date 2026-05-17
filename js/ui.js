/**
 * ui.js — orchestrator
 *
 * Wraps the legacy UpdateAll so every model change re-syncs the UI, then
 * delegates to focused modules in js/ui/.
 */
import * as layers   from './ui/layers.js';
import * as rays     from './ui/rays.js';
import * as sliders  from './ui/sliders.js';
import * as sunmoon  from './ui/sunmoon.js';
import * as calendar from './ui/calendar.js';
import * as playback from './ui/playback.js';

const MODULES = [layers, rays, sliders, sunmoon, calendar, playback];

const origUpdateAll = window.UpdateAll;
window.UpdateAll = function () {
  origUpdateAll.apply(this, arguments);
  for (const m of MODULES) m.sync();
};

function init() {
  for (const m of MODULES) {
    m.sync();
    m.init();
  }

  /* ── One-shot wirings that don't belong to a single concern ────────────── */

  /* aria-selected sync: watch for TabSelected class added by Tabs.js */
  const demoTabList = document.getElementById('DomeDemoTabs');
  if (demoTabList && window.MutationObserver) {
    const obs = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.attributeName === 'class') {
          m.target.setAttribute('aria-selected',
            m.target.classList.contains('TabSelected') ? 'true' : 'false');
        }
      }
    });
    for (const tab of demoTabList.querySelectorAll('li[role="tab"]')) {
      obs.observe(tab, { attributes: true, attributeFilter: ['class'] });
    }
  }

  /* ResizeObserver: accelerate jsg's 50 ms resize poll */
  if (window.ResizeObserver) {
    try {
      const g = FeDomeApp.GraphObject;
      if (g && g.ContainerDiv) {
        new ResizeObserver(() => g.CheckResizeRegularly && g.CheckResizeRegularly())
          .observe(g.ContainerDiv);
      }
    } catch (e) {}
  }

  /* Screenshot export */
  const screenshotBtn = document.getElementById('btn-screenshot');
  if (screenshotBtn) {
    screenshotBtn.addEventListener('click', () => {
      try {
        const canvas = FeDomeApp.GraphObject && FeDomeApp.GraphObject.Canvas;
        if (!canvas) return;
        const a = document.createElement('a');
        let dateStr = '';
        try { dateStr = '-' + FeDomeApp.DateTimeToString(FeDomeApp.DateTime).split('|')[0].trim().replace(/[^\w]/g, '-'); } catch (e) {}
        a.download = 'fed' + dateStr + '.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      } catch (e) { alert('Screenshot failed: ' + e.message); }
    });
  }

  /* Gesture hint fade-out */
  const gestureHint = document.getElementById('gesture-hint');
  if (gestureHint) {
    setTimeout(() => {
      gestureHint.style.opacity = '0';
      setTimeout(() => { gestureHint.hidden = true; }, 950);
    }, 5000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
