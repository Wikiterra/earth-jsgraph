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
    updateSunMoonStrip();
    updateYearProgress();
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
        parseCalFromDateTime();
        renderCalDigits();
      }
    } catch (e) { /* not yet initialised */ }
  }

  /* ── Sun / Moon info strip ──────────────────────────────────────────────── */

  function updateSunMoonStrip() {
    var sunEl  = document.getElementById('sms-sun');
    var moonEl = document.getElementById('sms-moon');
    if (!sunEl || !moonEl) return;
    try {
      var deg = function (n) { return n.toFixed(0) + '°'; };
      if (FeDomeApp.SunFeCelestSphereCoord[2] > 0) {
        sunEl.textContent = '☀ ' + deg(FeDomeApp.SunAnglesGlobe.azimuth) + ' / ' + deg(FeDomeApp.SunAnglesGlobe.elevation);
      } else {
        sunEl.textContent = '☀ below';
      }
      if (FeDomeApp.MoonFeCelestSphereCoord[2] > 0) {
        moonEl.textContent = '☾ ' + deg(FeDomeApp.MoonAnglesGlobe.azimuth) + ' / ' + deg(FeDomeApp.MoonAnglesGlobe.elevation);
      } else {
        moonEl.textContent = '☾ below';
      }
    } catch (e) {}
  }

  /* ── Year progress track ─────────────────────────────────────────────────── */

  function updateYearProgress() {
    var fill = document.getElementById('cal-year-fill');
    if (!fill) return;
    try {
      var pct = Math.min(100, Math.max(0, (FeDomeApp.DayOfYear / 364) * 100));
      fill.style.width = pct + '%';
      fill.parentElement.setAttribute('aria-valuenow', Math.round(FeDomeApp.DayOfYear));
    } catch (e) {}
  }

  var calendarOpen = false;

  function openCalendar() {
    var toggle   = document.getElementById('calendar-toggle');
    var dropdown = document.getElementById('calendar-dropdown');
    if (!toggle || !dropdown) return;
    calendarOpen = true;
    dropdown.hidden = false;
    dropdown.setAttribute('aria-modal', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    parseCalFromDateTime();
    renderCalDigits();
    updateYearProgress();
    var firstSpin = document.getElementById('cs-month');
    if (firstSpin) firstSpin.focus();
  }

  function closeCalendar() {
    var toggle   = document.getElementById('calendar-toggle');
    var dropdown = document.getElementById('calendar-dropdown');
    if (!toggle || !dropdown) return;
    calendarOpen = false;
    dropdown.hidden = true;
    dropdown.removeAttribute('aria-modal');
    toggle.setAttribute('aria-expanded', 'false');
  }

  /* ── Calendar digit-scroll helpers ─────────────────────────────────────── */

  var _MNAMES  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var _MFULL   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var calState = { month: 0, day: 1, year: 2024, hour: 12, min: 0 };

  function _daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

  function parseCalFromDateTime() {
    try {
      var d = new Date((FeDomeApp.ZeroDate + FeDomeApp.DateTime) * FeDomeApp.msPerDay);
      calState.month = d.getUTCMonth();
      calState.day   = d.getUTCDate();
      calState.year  = d.getUTCFullYear();
      calState.hour  = d.getUTCHours();
      calState.min   = d.getUTCMinutes();
    } catch (e) {}
  }

  function renderCalDigits() {
    try {
      var sm = document.getElementById('cs-month');
      sm.textContent = _MNAMES[calState.month];
      sm.setAttribute('aria-valuenow',  calState.month);
      sm.setAttribute('aria-valuetext', _MFULL[calState.month]);
      var sd = document.getElementById('cs-day');
      sd.textContent = String(calState.day).padStart(2, '0');
      sd.setAttribute('aria-valuenow', calState.day);
      var sy = document.getElementById('cs-year');
      sy.textContent = calState.year;
      sy.setAttribute('aria-valuenow', calState.year);
      var sh = document.getElementById('cs-hour');
      sh.textContent = String(calState.hour).padStart(2, '0');
      sh.setAttribute('aria-valuenow', calState.hour);
      var sn = document.getElementById('cs-min');
      sn.textContent = String(calState.min).padStart(2, '0');
      sn.setAttribute('aria-valuenow', calState.min);
    } catch (e) {}
  }

  function applyCalDigits() {
    try {
      var d = new Date(0);
      d.setUTCFullYear(calState.year, calState.month, calState.day);
      d.setUTCHours(calState.hour, calState.min, 0, 0);
      var dt = d.getTime() / FeDomeApp.msPerDay - FeDomeApp.ZeroDate;
      if (!isNaN(dt)) { FeDomeApp.DateTime = dt; UpdateAll(); }
    } catch (e) {}
  }

  function stepCalField(field, delta) {
    var maxDay;
    switch (field) {
      case 'month':
        calState.month = (calState.month + delta + 12) % 12;
        maxDay = _daysInMonth(calState.year, calState.month);
        if (calState.day > maxDay) calState.day = maxDay;
        break;
      case 'day':
        maxDay = _daysInMonth(calState.year, calState.month);
        calState.day = ((calState.day - 1 + delta + maxDay) % maxDay) + 1;
        break;
      case 'year':
        calState.year = Math.max(1900, Math.min(2099, calState.year + delta));
        maxDay = _daysInMonth(calState.year, calState.month);
        if (calState.day > maxDay) calState.day = maxDay;
        break;
      case 'hour':
        calState.hour = (calState.hour + delta + 24) % 24;
        break;
      case 'min':
        calState.min = (calState.min + delta + 60) % 60;
        break;
    }
    renderCalDigits();
    applyCalDigits();
  }

  /* ── Playback ────────────────────────────────────────────────────────────── */

  var playback = {
    active:   false,
    rafId:    null,
    lastTs:   null,
    baseRate: 365.256,  /* days/sec — set by the speed dropdown */
    stepSize: 365.256,  /* days per ⏮/⏭ step — equals one speed unit */

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
        FeDomeApp.DateTime += this.baseRate * elapsed;
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
    updateSunMoonStrip();
    updateYearProgress();

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

    calToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      calendarOpen ? closeCalendar() : openCalendar();
    });

    /* ── Digit-scroll spinbutton events: ↑↓ arrows + mouse wheel ── */
    var _spinIds = ['cs-month', 'cs-day', 'cs-year', 'cs-hour', 'cs-min'];
    _spinIds.forEach(function (id, idx) {
      var el = document.getElementById(id);
      if (!el) return;
      var field = el.dataset.field;

      el.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowUp')    { e.preventDefault(); stepCalField(field, +1); }
        if (e.key === 'ArrowDown')  { e.preventDefault(); stepCalField(field, -1); }
        if (e.key === 'ArrowLeft')  {
          e.preventDefault();
          var prev = document.getElementById(_spinIds[Math.max(0, idx - 1)]);
          if (prev) prev.focus();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          var next = document.getElementById(_spinIds[Math.min(_spinIds.length - 1, idx + 1)]);
          if (next) next.focus();
        }
        if (e.key === 'Escape') { closeCalendar(); }
      });

      el.addEventListener('wheel', function (e) {
        e.preventDefault();
        stepCalField(field, e.deltaY < 0 ? +1 : -1);
      }, { passive: false });
    });

    var calStepBtns = calDropdown.querySelectorAll('.cal-btn[data-cal-step]');
    for (var cs = 0; cs < calStepBtns.length; cs++) {
      calStepBtns[cs].addEventListener('click', (function (btn) {
        return function () {
          FeDomeApp.DateTime += parseFloat(btn.dataset.calStep);
          UpdateAll();
        };
      })(calStepBtns[cs]));
    }

    /* Focus trap: Tab key cycles within the open dropdown (spins + buttons) */
    calDropdown.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !calendarOpen) return;
      var focusable = calDropdown.querySelectorAll('[tabindex="0"], button');
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

    /* ── Speed dropdown ── */
    var speedSelect = document.getElementById('pb-speed');
    if (speedSelect) {
      var _syncSpeed = function () {
        var opt = speedSelect.options[speedSelect.selectedIndex];
        playback.baseRate = parseFloat(opt.dataset.rate);
        playback.stepSize = parseFloat(opt.dataset.step);
      };
      _syncSpeed(); /* apply the HTML-selected default (1 yr/s) */
      speedSelect.addEventListener('change', _syncSpeed);
    }

    /* ── Reset button ── */
    var pbReset = document.getElementById('pb-reset');
    if (pbReset) {
      pbReset.addEventListener('click', function () {
        playback.stop();
        if (typeof ResetApp === 'function') ResetApp();
      });
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

    /* ── ResizeObserver: accelerate jsg resize detection ── */
    if (window.ResizeObserver) {
      try {
        var _g = FeDomeApp.GraphObject;
        if (_g && _g.ContainerDiv) {
          new ResizeObserver(function () {
            if (_g.CheckResizeRegularly) _g.CheckResizeRegularly();
          }).observe(_g.ContainerDiv);
        }
      } catch (e) {}
    }

    /* ── Screenshot export ── */
    var screenshotBtn = document.getElementById('btn-screenshot');
    if (screenshotBtn) {
      screenshotBtn.addEventListener('click', function () {
        try {
          var canvas = FeDomeApp.GraphObject && FeDomeApp.GraphObject.Canvas;
          if (!canvas) return;
          var dataUrl = canvas.toDataURL('image/png');
          var a = document.createElement('a');
          var dateStr = '';
          try { dateStr = '-' + FeDomeApp.DateTimeToString(FeDomeApp.DateTime).split('|')[0].trim().replace(/[^\w]/g, '-'); } catch (e) {}
          a.download = 'fed' + dateStr + '.png';
          a.href = dataUrl;
          a.click();
        } catch (e) { alert('Screenshot failed: ' + e.message); }
      });
    }

    /* ── Gesture hint: fade out after 5 s ── */
    var gestureHint = document.getElementById('gesture-hint');
    if (gestureHint) {
      setTimeout(function () {
        gestureHint.style.opacity = '0';
        setTimeout(function () { gestureHint.hidden = true; }, 950);
      }, 5000);
    }

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
