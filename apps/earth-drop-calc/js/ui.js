/**
 * ui.js — earth-drop-calc panel drawer orchestrator
 *
 * Three collapsible sections: Measures, Optics, Distance Data.
 */
export function init() {
  const drawer = document.getElementById('panel-drawer');
  if (!drawer) return;

  let activeSection = null;

  const openSection = (section) => {
    /* If clicking the same section, toggle drawer closed */
    if (activeSection === section && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      document.querySelectorAll('.layer-toggle[data-section]').forEach((btn) => {
        btn.setAttribute('aria-pressed', 'false');
      });
      document.querySelectorAll('.drawer-section').forEach((s) => s.classList.remove('open'));
      activeSection = null;
      return;
    }

    activeSection = section;
    drawer.classList.add('open');
    /* Open only the clicked section's accordion */
    document.querySelectorAll('.drawer-section').forEach((s) => {
      s.classList.toggle('open', s.dataset.section === section);
    });
    /* Update button pressed states */
    document.querySelectorAll('.layer-toggle[data-section]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.section === section ? 'true' : 'false');
    });
  };

  /* Wire bottom-bar section buttons */
  document.querySelectorAll('.layer-toggle[data-section]').forEach((btn) => {
    btn.addEventListener('click', () => openSection(btn.dataset.section));
  });

  /* Wire accordion titles to toggle their own section */
  document.querySelectorAll('.drawer-section-title').forEach((title) => {
    title.addEventListener('click', () => {
      const section = title.closest('.drawer-section');
      if (!section) return;
      section.classList.toggle('open');
    });
  });

  /* Close button */
  document.getElementById('panel-drawer-close')?.addEventListener('click', () => {
    drawer.classList.remove('open');
    document.querySelectorAll('.layer-toggle[data-section]').forEach((btn) => {
      btn.setAttribute('aria-pressed', 'false');
    });
    document.querySelectorAll('.drawer-section').forEach((s) => s.classList.remove('open'));
    activeSection = null;
  });

  /* Model toggle buttons */
  document.querySelectorAll('[data-prop="ShowModel"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.val);
      if (window.CurveApp) {
        CurveApp.ShowModel = val;
        UpdateAll();
      }
      btn.closest('.quick-section')?.querySelectorAll('[data-prop="ShowModel"]').forEach(b => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });

  /* Sync model buttons from CurveApp state */
  if (window.CurveApp) {
    document.querySelectorAll('[data-prop="ShowModel"]').forEach((btn) => {
      const val = parseInt(btn.dataset.val);
      btn.setAttribute('aria-pressed', val === CurveApp.ShowModel ? 'true' : 'false');
    });
  }

  /* Reset button */
  document.getElementById('pb-reset')?.addEventListener('click', () => {
    if (window.ResetApp) ResetApp();
  });

  /* Units panel toggle */
  document.getElementById('qs-units')?.addEventListener('click', () => {
    /* Import and show units panel — rendered on first click */
    const unitsPanel = document.querySelector('.drawer-section[data-section="units"]');
    if (unitsPanel) {
      openSection('units');
      return;
    }
    /* Otherwise navigate to save-restore tab from hidden tabs for units */
    const tabs = document.getElementById('CurveSettingsTabs');
    if (tabs) {
      Tabs.Select('CurveSettingsTabs', 5);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}