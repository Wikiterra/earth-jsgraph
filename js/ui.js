/**
 * ui.js — Phase 2–3 UI wiring
 *
 * Responsibilities:
 *   - Layer toggle buttons: click → toggle FeDomeApp[prop] → UpdateAll
 *   - Ray controls: click → set FeDomeApp.RayTarget / RaySource → UpdateAll
 *   - Time/Day sliders (top bar): input → set FeDomeApp.DateTime → UpdateAll
 *   - Param sliders (bottom bar): input → set FeDomeApp[prop] → UpdateAll
 *   - Wrap UpdateAll to keep all UI in sync after every model change
 *   - Calendar: toggle, date input, step buttons, keyboard nav
 *   - Playback: requestAnimationFrame loop advancing FeDomeApp.DateTime
 */
(function () {
  'use strict';

  /* ── Wrap UpdateAll to sync UI after every model change ─────────────────── */

  var _origUpdateAll = window.UpdateAll;

  window.UpdateAll = function () {
    _origUpdateAll.apply(this, arguments);
    syncLayerToggles();
    syncRayControls();
    syncParamSliders();
    updateCalendarDisplay();
  };

  /* ── Layer toggle state sync ─────────────────────────────────────────────── */

  function syncLayerToggles() {
    var btns = document.querySelectorAll('.layer-toggle[data-prop]');
    for (var i = 0; i < btns.length; i++) {
      var btn  = btns[i];
      var prop = btn.dataset.prop;
      btn.setAttribute('aria-pressed', FeDomeApp[prop] ? 'true' : 'false');
    }
  }

  /* ── Ray control state sync ──────────────────────────────────────────────── */

  function syncRayControls() {
    var targetBtns = document.querySelectorAll('.ray-opt[data-group="RayTarget"]');
    for (var i = 0; i < targetBtns.length; i++) {
      var match = parseInt(targetBtns[i].dataset.value) === FeDomeApp.RayTarget;
      targetBtns[i].setAttribute('aria-checked', match ? 'true' : 'false');
    }

    var sourceBtns = document.querySelectorAll('.ray-opt[data-group="RaySource"]');
    for (var j = 0; j < sourceBtns.length; j++) {
      var match2 = parseInt(sourceBtns[j].dataset.value) === FeDomeApp.RaySource;
      sourceBtns[j].setAttribute('aria-checked', match2 ? 'true' : 'false');
    }
  }

  /* ── Param slider state sync ─────────────────────────────────────────────── */

  function fmtDist(km) {
    if (km >= 1e6) return (km / 1e6).toFixed(2) + 'M';
    if (km >= 1e3) return Math.round(km / 1e3) + 'k';
    return Math.round(km) + '';
  }

  function syncParamSliders() {
    try {
      var tcTime = document.getElementById('tc-time');
      var tcTimeVal = document.getElementById('tc-time-val');
      if (tcTime && tcTime !== document.activeElement) {
        tcTime.value = FeDomeApp.Time;
        if (tcTimeVal) tcTimeVal.textContent = FeDomeApp.Time.toFixed(1);
      }

      var tcDay = document.getElementById('tc-day');
      var tcDayVal = document.getElementById('tc-day-val');
      if (tcDay && tcDay !== document.activeElement) {
        tcDay.value = FeDomeApp.DayOfYear;
        if (tcDayVal) tcDayVal.textContent = Math.round(FeDomeApp.DayOfYear);
      }

      var psMoonEcl = document.getElementById('ps-moon-ecl');
      var pvMoonEcl = document.getElementById('pv-moon-ecl');
      if (psMoonEcl && psMoonEcl !== document.activeElement) {
        psMoonEcl.value = FeDomeApp.MoonEcliptic;
        if (pvMoonEcl) pvMoonEcl.textContent = FeDomeApp.MoonEcliptic.toFixed(1) + '°';
      }

      var psDistSun = document.getElementById('ps-dist-sun');
      var pvDistSun = document.getElementById('pv-dist-sun');
      if (psDistSun && psDistSun !== document.activeElement) {
        psDistSun.value = Math.log10(FeDomeApp.DistSun);
        if (pvDistSun) pvDistSun.textContent = fmtDist(FeDomeApp.DistSun);
      }

      var psDistMoon = document.getElementById('ps-dist-moon');
      var pvDistMoon = document.getElementById('pv-dist-moon');
      if (psDistMoon && psDistMoon !== document.activeElement) {
        psDistMoon.value = Math.log10(FeDomeApp.DistMoon);
        if (pvDistMoon) pvDistMoon.textContent = fmtDist(FeDomeApp.DistMoon);
      }

      var psDomeH = document.getElementById('ps-dome-h');
      var pvDomeH = document.getElementById('pv-dome-h');
      if (psDomeH && psDomeH !== document.activeElement) {
        psDomeH.value = FeDomeApp.DomeHeight;
        if (pvDomeH) pvDomeH.textContent = Math.round(FeDomeApp.DomeHeight);
      }

      var psDomeSz = document.getElementById('ps-dome-sz');
      var pvDomeSz = document.getElementById('pv-dome-sz');
      if (psDomeSz && psDomeSz !== document.activeElement) {
        psDomeSz.value = FeDomeApp.DomeSize;
        if (pvDomeSz) pvDomeSz.textContent = FeDomeApp.DomeSize.toFixed(1);
      }

      var psRayP = document.getElementById('ps-ray-p');
      var pvRayP = document.getElementById('pv-ray-p');
      if (psRayP && psRayP !== document.activeElement) {
        psRayP.value = FeDomeApp.RayParameter;
        if (pvRayP) pvRayP.textContent = FeDomeApp.RayParameter.toFixed(1);
      }
    } catch (e) { /* FeDomeApp not yet initialised */ }
  }

  /* ── Calendar display + dropdown ────────────────────────────────────────── */

  function updateCalendarDisplay() {
    var el = document.getElementById('calendar-display');
    if (!el) return;
    try {
      var s = FeDomeApp.DateTimeToString(FeDomeApp.DateTime).split('|')[0].trim();
      el.textContent = s;
      /* Announce to screen readers only when not playing — avoids 60fps spam */
      if (!playback.active) {
        var statusEl = document.getElementById('canvas-status');
        if (statusEl) statusEl.textContent = s;
      }
      if (calendarOpen) {
        var inp = document.getElementById('cal-input');
        if (inp && inp !== document.activeElement) inp.value = s;
      }
    } catch (e) { /* not yet initialised */ }
  }

  var calendarOpen = false;

  function openCalendar() {
    var toggle   = document.getElementById('calendar-toggle');
    var dropdown = document.getElementById('calendar-dropdown');
    var input    = document.getElementById('cal-input');
    if (!toggle || !dropdown) return;
    calendarOpen = true;
    dropdown.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    try { input.value = FeDomeApp.DateTimeToString(FeDomeApp.DateTime).split('|')[0].trim(); } catch (e) {}
    input.focus();
    input.select();
  }

  function closeCalendar() {
    var toggle   = document.getElementById('calendar-toggle');
    var dropdown = document.getElementById('calendar-dropdown');
    if (!toggle || !dropdown) return;
    calendarOpen = false;
    dropdown.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  /* Parse "Jan 01 2024 / 12:30 UTC" → FeDomeApp.DateTime value.
     Formula mirrors DateTimeToString: ms = (ZeroDate + dateTime) * msPerDay */
  function parseDateTimeString(s) {
    var months = { Jan:0, Feb:1, Mar:2, Apr:3, Mai:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
    s = s.split('|')[0].trim();
    var m = s.match(/^(\w{3})\s+(\d{1,2})\s+(\d{4})\s*\/\s*(\d{1,2}):(\d{2})/);
    if (!m) return null;
    var month = months[m[1]];
    if (month === undefined) return null;
    var d = new Date(0);
    d.setUTCFullYear(parseInt(m[3]), month, parseInt(m[2]));
    d.setUTCHours(parseInt(m[4]), parseInt(m[5]), 0, 0);
    return d.getTime() / FeDomeApp.msPerDay - FeDomeApp.ZeroDate;
  }

  function applyCalendarInput() {
    var input = document.getElementById('cal-input');
    if (!input) return;
    var raw = input.value.trim();
    if (!raw) return;
    try {
      var dt = parseDateTimeString(raw);
      if (dt !== null && !isNaN(dt)) {
        FeDomeApp.DateTime = dt;
        UpdateAll();
      }
    } catch (e) { /* parse failed — leave DateTime unchanged */ }
  }

  /* ── Playback ────────────────────────────────────────────────────────────── */

  var playback = {
    active:     false,
    rafId:      null,
    lastTs:     null,
    baseRate:   365.256,  /* days/sec at 1× for the selected cycle mode */
    multiplier: 1,
    stepSize:   365.256,  /* days per ⏮/⏭ step — equals one cycle unit */

    start: function () {
      this.active = true;
      this.lastTs = null;
      this._setPlayUI(true);
      this.rafId = requestAnimationFrame(this._tick.bind(this));
    },

    stop: function () {
      this.active = false;
      if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
      this._setPlayUI(false);
    },

    toggle: function () { this.active ? this.stop() : this.start(); },

    step: function (direction) {
      FeDomeApp.DateTime += this.stepSize * direction;
      UpdateAll();
    },

    _tick: function (ts) {
      if (!this.active) return;
      if (this.lastTs !== null) {
        var elapsed = Math.min((ts - this.lastTs) / 1000, 0.1); /* cap at 100 ms */
        FeDomeApp.DateTime += this.baseRate * this.multiplier * elapsed;
        UpdateAll();
      }
      this.lastTs = ts;
      this.rafId = requestAnimationFrame(this._tick.bind(this));
    },

    _setPlayUI: function (playing) {
      var btn   = document.getElementById('pb-play');
      var play  = btn.querySelector('.icon-play');
      var pause = btn.querySelector('.icon-pause');
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      btn.setAttribute('aria-label',   playing ? 'Pause' : 'Play');
      play.hidden  =  playing;
      pause.hidden = !playing;
    }
  };

  /* ── DOM-ready init ──────────────────────────────────────────────────────── */

  function init() {
    /* Initial state sync */
    syncLayerToggles();
    syncRayControls();
    syncParamSliders();
    updateCalendarDisplay();

    /* ── Layer toggle click handlers ── */
    var layerBtns = document.querySelectorAll('.layer-toggle[data-prop]');
    for (var i = 0; i < layerBtns.length; i++) {
      layerBtns[i].addEventListener('click', (function (btn) {
        return function () {
          var prop = btn.dataset.prop;
          FeDomeApp[prop] = !FeDomeApp[prop];
          UpdateAll();
        };
      })(layerBtns[i]));
    }

    /* ── Ray control click handlers ── */
    var rayBtns = document.querySelectorAll('.ray-opt');
    for (var j = 0; j < rayBtns.length; j++) {
      rayBtns[j].addEventListener('click', (function (btn) {
        return function () {
          FeDomeApp[btn.dataset.group] = parseInt(btn.dataset.value);
          UpdateAll();
        };
      })(rayBtns[j]));
    }

    /* ── Time of day slider (top bar) ── */
    document.getElementById('tc-time').addEventListener('input', function () {
      var v = parseFloat(this.value);
      FeDomeApp.DateTime = Math.floor(FeDomeApp.DateTime) + v / 24;
      document.getElementById('tc-time-val').textContent = v.toFixed(1);
      UpdateAll();
    });

    /* ── Day of year slider (top bar) ── */
    document.getElementById('tc-day').addEventListener('input', function () {
      var v = parseInt(this.value);
      FeDomeApp.DateTime = v + FeDomeApp.Time / 24;
      document.getElementById('tc-day-val').textContent = v;
      UpdateAll();
    });

    /* ── Param sliders (bottom bar) ── */
    document.getElementById('ps-moon-ecl').addEventListener('input', function () {
      var v = parseFloat(this.value);
      FeDomeApp.MoonEcliptic = v;
      document.getElementById('pv-moon-ecl').textContent = v.toFixed(1) + '°';
      UpdateAll();
    });

    document.getElementById('ps-dist-sun').addEventListener('input', function () {
      var km = Math.pow(10, parseFloat(this.value));
      FeDomeApp.DistSun = km;
      document.getElementById('pv-dist-sun').textContent = fmtDist(km);
      UpdateAll();
    });

    document.getElementById('ps-dist-moon').addEventListener('input', function () {
      var km = Math.pow(10, parseFloat(this.value));
      FeDomeApp.DistMoon = km;
      document.getElementById('pv-dist-moon').textContent = fmtDist(km);
      UpdateAll();
    });

    document.getElementById('ps-dome-h').addEventListener('input', function () {
      var v = parseFloat(this.value);
      FeDomeApp.DomeHeight = v;
      document.getElementById('pv-dome-h').textContent = Math.round(v);
      UpdateAll();
    });

    document.getElementById('ps-dome-sz').addEventListener('input', function () {
      var v = parseFloat(this.value);
      FeDomeApp.DomeSize = v;
      document.getElementById('pv-dome-sz').textContent = v.toFixed(1);
      UpdateAll();
    });

    document.getElementById('ps-ray-p').addEventListener('input', function () {
      var v = parseFloat(this.value);
      FeDomeApp.RayParameter = v;
      document.getElementById('pv-ray-p').textContent = v.toFixed(1);
      UpdateAll();
    });

    /* ── Calendar dropdown ── */
    var calToggle   = document.getElementById('calendar-toggle');
    var calDropdown = document.getElementById('calendar-dropdown');
    var calInput    = document.getElementById('cal-input');

    calToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      calendarOpen ? closeCalendar() : openCalendar();
    });

    calInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter')  { applyCalendarInput(); closeCalendar(); }
      if (e.key === 'Escape') { closeCalendar(); }
      if (e.key === 'ArrowRight') { FeDomeApp.DateTime += 1;      UpdateAll(); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { FeDomeApp.DateTime -= 1;      UpdateAll(); e.preventDefault(); }
      if (e.key === 'ArrowUp')    { FeDomeApp.DateTime += 365.25; UpdateAll(); e.preventDefault(); }
      if (e.key === 'ArrowDown')  { FeDomeApp.DateTime -= 365.25; UpdateAll(); e.preventDefault(); }
    });

    calInput.addEventListener('blur', function () {
      /* small delay so cal-btn clicks register before blur closes the dropdown */
      setTimeout(function () {
        if (calendarOpen) { applyCalendarInput(); closeCalendar(); }
      }, 150);
    });

    var calStepBtns = calDropdown.querySelectorAll('.cal-btn[data-cal-step]');
    for (var cs = 0; cs < calStepBtns.length; cs++) {
      calStepBtns[cs].addEventListener('click', (function (btn) {
        return function () {
          FeDomeApp.DateTime += parseFloat(btn.dataset.calStep);
          UpdateAll();
          try { calInput.value = FeDomeApp.DateTimeToString(FeDomeApp.DateTime).split('|')[0].trim(); } catch (e) {}
        };
      })(calStepBtns[cs]));
    }

    /* Focus trap: Tab key cycles within the open dropdown */
    calDropdown.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !calendarOpen) return;
      var focusable = calDropdown.querySelectorAll('input, button');
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    /* Close calendar on outside click */
    document.addEventListener('click', function (e) {
      if (calendarOpen && !calDropdown.contains(e.target) && e.target !== calToggle) {
        applyCalendarInput();
        closeCalendar();
      }
    });

    /* ── Playback controls ── */
    document.getElementById('pb-play').addEventListener('click', function () {
      playback.toggle();
    });

    document.getElementById('pb-step-back').addEventListener('click', function () {
      playback.stop();
      playback.step(-1);
    });

    document.getElementById('pb-step-fwd').addEventListener('click', function () {
      playback.stop();
      playback.step(1);
    });

    /* ── Cycle mode buttons ── */
    var cycleBtns = document.querySelectorAll('.pb-cycle');
    for (var cb = 0; cb < cycleBtns.length; cb++) {
      cycleBtns[cb].addEventListener('click', (function (btn, all) {
        return function () {
          playback.baseRate = parseFloat(btn.dataset.rate);
          playback.stepSize = parseFloat(btn.dataset.step);
          for (var ci = 0; ci < all.length; ci++) {
            all[ci].setAttribute('aria-pressed', all[ci] === btn ? 'true' : 'false');
          }
        };
      })(cycleBtns[cb], cycleBtns));
    }

    /* ── Speed multiplier buttons ── */
    var multBtns = document.querySelectorAll('.pb-mult');
    for (var mb = 0; mb < multBtns.length; mb++) {
      multBtns[mb].addEventListener('click', (function (btn, all) {
        return function () {
          playback.multiplier = parseFloat(btn.dataset.mult);
          /* Scale demo animation durations to match our speed setting.
             TimeStrech > 1 = slower; TimeStrech < 1 = faster. */
          if (window.Animations) Animations.TimeStrech = 1 / playback.multiplier;
          for (var mi = 0; mi < all.length; mi++) {
            all[mi].setAttribute('aria-pressed', all[mi] === btn ? 'true' : 'false');
          }
        };
      })(multBtns[mb], multBtns));
    }

    /* ── Stop our playback when a demo tab is activated ── */
    var demoTabList = document.getElementById('DomeDemoTabs');
    if (demoTabList) {
      demoTabList.addEventListener('click', function (e) {
        var li = e.target.closest ? e.target.closest('li') : e.target;
        if (li && !li.classList.contains('tab-hidden')) playback.stop();
      });
    }

    /* ── aria-selected sync: watch for TabSelected class added by Tabs.js ── */
    if (demoTabList && window.MutationObserver) {
      var roleTabItems = demoTabList.querySelectorAll('li[role="tab"]');
      var tabObs = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName === 'class') {
            m.target.setAttribute('aria-selected',
              m.target.classList.contains('TabSelected') ? 'true' : 'false');
          }
        });
      });
      for (var ti = 0; ti < roleTabItems.length; ti++) {
        tabObs.observe(roleTabItems[ti], { attributes: true, attributeFilter: ['class'] });
      }
    }

    /* ── Gesture hint: fade out after 5 s ── */
    var gestureHint = document.getElementById('gesture-hint');
    if (gestureHint) {
      setTimeout(function () {
        gestureHint.style.opacity = '0';
        setTimeout(function () { gestureHint.hidden = true; }, 950);
      }, 5000);
    }

    /* Sync initial Animations.TimeStrech with default multiplier (1×) */
    if (window.Animations) Animations.TimeStrech = 1 / playback.multiplier;

    /* Keyboard: Space = play/pause when not in an input */
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        playback.toggle();
      }
    });
  }

  /* Run after DOMContentLoaded (ControlPanel.Init also uses DOMContentLoaded;
     order doesn't matter — both use getElementById which is position-independent) */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
