# FED v2 — Completed Work

---

## Phase 1 — HTML cleanup

- UTF-8 charset, single `<meta>` tag
- Removed all CMS artifacts: Layout wrappers, ZoomPic, WikiPage/BlogImage divs, injected `html` class, ASP blocks
- `<main id="app">` single wrapper, flattened layout
- Script load order fixed: scripts inserted after header so jsg's `document.writeln()` places the canvas at the correct DOM position (tabs → canvas → scripts → bars → ui.js)
- Removed duplicate pre-rendered `#SliderPanel` / `#OptionPanel` tables (invalid duplicate IDs)
- Removed `init.js` (only contained unused `ShowBlogPage` and `SEL_GRP_AutoName1`)
- Replaced OnOff SEL toggle with native `<details>/<summary>`
- Canvas inline styles moved to CSS

---

## Phase 2 — Full-screen layout + bars

### Viewport
- `body` / `#app`: `height: 100dvh; overflow: hidden`
- `#FeGraph` canvas: `position: fixed`, fills viewport between the two bars
- CSS custom properties: `--top-bar-h: 52px`, `--bottom-bar-h: 72px`, `--color-accent`, `--bar-bg`
- `controlPanels.js` + `optionPanel.js` script tags removed; their panels replaced entirely by native bars

### Top bar (left — demo tabs)
- `#DomeDemoTabs` with Intro, Eclipses, Equinox, DayNight, Poles, Stars, TFE, Reset
- BackButton, PlayButton, ForwButton, CountButton kept hidden in DOM (required by Tabs.js)
- `role="tablist"` on the list; `role="tab"` + `aria-selected` on each tab button

### Top bar (right — playback cluster)
- ⏮ step back, ▶/⏸ play/pause, ⏭ step forward
- Cycle mode radio group: ☀ Solar day (1 model-h/s) · ☾ Lunar (29.53 d/s) · yr Solar year (365.26 d/s)
- Speed multiplier radio group: ½× · 1× · 1½× · 2×
- Time of day slider (0–24 h) and Day of year slider (0–364) in compact top-bar groups
- RAF loop advances `FeDomeApp.DateTime` directly; stops on any demo tab click

### Top bar (far right — calendar)
- Displays `FeDomeApp.DateTimeToString()` formatted date
- Click opens dropdown: text input + ← 1yr / ← 1d / 1d → / 1yr → step buttons
- Keyboard: arrow keys ±1d/±1yr, Enter applies, Escape closes; focus trap on Tab/Shift-Tab

### Bottom bar — layer toggles
- 10 icon-toggle buttons: Grid, Dome, Shadow, ☀Track, ☾Track, Sphere, Stars, D·Rays, S·Rays, Rays+
- Each syncs `FeDomeApp.Show*` on click; `aria-pressed` updated by `syncLayerToggles()`
- Labels hidden at ≤600px (icon-only mode via `@media`)

### Bottom bar — param sliders
- MoonEcliptic, DistSun (log₁₀), DistMoon (log₁₀), DomeHeight, DomeSize, RayParam
- Each shows a live numeric value above the range input

### Bottom bar — ray controls
- Ray target: Obs / FE; Ray source: ☀ / ☾ / ★
- `aria-checked` synced via `syncRayControls()`

---

## Phase 3 — Calendar widget

- Date display updates every frame via `UpdateAll` wrapper
- `#canvas-status` aria-live region announces date/time to screen readers when playback is paused (silent at 60fps to avoid flood)
- Dropdown closes on outside click or Escape

---

## UI refinements (completed)

- **Calendar: digit-scroll input** — `.cal-spin` spinbuttons (`cs-month/day/year/hour/min`) wired with `keydown` (↑↓ step, ←→ move focus, Escape close) and `wheel` (scroll = step) handlers; old free-text `#cal-input` reference removed (was causing a null-ref crash on init); `applyCalendarInput` undefined call removed
- **Sun/Moon info strip** — `#sun-moon-strip` with `#sms-sun` / `#sms-moon` spans added to the right of the calendar toggle; reads `FeDomeApp.SunAnglesGlobe` / `MoonAnglesGlobe` (azimuth + elevation) each `UpdateAll`; shows "below" when `SunFeCelestSphereCoord[2] ≤ 0`
- **Year progress track** — thin 4px accent bar inside the calendar dropdown; width = `DayOfYear / 364 × 100%`; updated in `updateYearProgress()` each frame and on `openCalendar`

- Speed dropdown replaces cycle-mode buttons + multiplier buttons: `1 h/s · 12 h/s · 1 d/s · 1 wk/s · 1 mo/s · 1 yr/s · 10 yr/s`; single `<select>` sets both `playback.baseRate` and `playback.stepSize`
- TFE and Reset tabs removed from the visible tab list; both kept as hidden `<li>` elements in the DOM for Tabs.js
- Reset moved to a standalone ↺ icon button in the playback cluster; calls `ResetApp()` and stops playback
- Play button turns green (`#00b894`) while active — clearly distinct from the orange "press to play" resting state

---

## Future ideas (completed)

- **Screenshot export** — `#btn-screenshot` in the save/restore panel; clicks `FeDomeApp.GraphObject.Canvas.toDataURL('image/png')` and triggers a filename-stamped `<a>.click()` download

---

## Phase 5 — JS audit (completed items)

- `controlPanels.js` + `optionPanel.js` removed; ControlPanel.js engine kept intact for Tabs.js
- `ThisPageUrl` / `ThisPageShortUrl` overridden with `location.href` via inline `<script>` after `app.js` — "Get App URL" now produces a usable local URL instead of Walter's site
- `Animations.TimeStrech` wired to speed multiplier: `TimeStrech = 1 / multiplier`
- Playback RAF loop stops on any demo tab click — prevents race with Tabs.js Animator

---

## Phase 4 — CSS (completed items)

- `ResizeObserver` on `FeDomeApp.GraphObject.ContainerDiv` in `init()` — fires `CheckResizeRegularly()` immediately on resize instead of waiting for jsg's 50ms poll loop

- Mobile-first base: `.toggle-label { display: none }` by default; `@media (min-width: 768px)` shows them; `≤480px` media query tightens bars and hides `#sun-moon-strip`
- `role="dialog"` + `aria-modal="true"` toggled on `#calendar-dropdown` via `openCalendar` / `closeCalendar`
- `prefers-reduced-motion: reduce` → all transition/animation durations clamped to 0.01ms
- Year progress track (see UI refinements above)

---

## Phase 6 — Accessibility

- Layer toggles: `aria-pressed` set in HTML (matching app.js defaults), synced every `UpdateAll` via `syncLayerToggles()`
- Demo tabs: `aria-selected` flipped by MutationObserver watching Tabs.js `TabSelected` class changes — no Tabs.js modification needed
- Param sliders: `aria-label` on each `<input type="range">`
- Playback: `aria-label` on ⏮/▶/⏭; ▶ label flips to "Pause" dynamically
- Gesture hint pill overlay (left-drag / right-drag / scroll) fades out after 5 s
- Calendar dropdown: full keyboard nav, Enter/Escape, focus trap

---

## Phase 7e — ES module conversion ✅ (v2 + v3)

**Pattern:** each asset file appends `Object.assign(globalThis, {...})` + `export {...}` — backward-compatible with global-scope callers while enabling ES module imports. No explicit `import` statements needed in each file; module scope chain reads from `globalThis`.

### v2 (`fed-wabis-v2/`)
- All 13 asset files converted to ES modules with `globalThis` registration + named exports
- `jsg.js`: `var JsgMat2={}` (fixed implicit global, was strict-mode ReferenceError); `document.writeln` → `jsg-canvas-mount` div-swap
- `wiki.js`: page-load handler now also writes `globalThis.xOnLoadFinished=true` so other modules see the update; all symbols (~80) exported
- All asset files re-encoded Latin-1 → UTF-8 (degree/micro signs in `NumFormatter.js`, `app.js`, `wiki.js`)
- `js/main-v2.js` — single `type=module` entry: imports all 13 assets in dependency order, then `./ui.js`; fixes URL globals after import
- `index.html`: removed `<script src="assets/wiki.js">` from `<head>`; replaced 13 `<script src="assets/...">` + inline URL patch with `<div id="jsg-canvas-mount"></div>` + `<script type="module" src="js/main-v2.js">`; removed `<script src="js/ui.js">`

### v3 (`fed-wabis-v3/`)
- Converted asset files copied to `src/lib/` (UTF-8, with export blocks)
- `src/main.js` rewired: imports CSS + all 13 `./lib/*.js` in order + `../js/ui.js`; URL override at end
- `index.html`: removed `<script src="/assets/wiki.js">` from `<head>` and all 12 legacy body script tags
- `npm run build` passes: 19 modules transformed → 418 kB bundle

---

## Cleanup pass (2026-05-17)

- Deleted `assets/init.js`, `assets/controlPanels.js`, `assets/optionPanel.js` — none were imported by `main-v2.js`; controlPanels/optionPanel had created the obsolete `#SliderPanel`/`#OptionPanel` tables replaced by native bars in Phase 2
- Kept `assets/ControlPanel.js` — `app.js` still calls `ControlPanels.Update()`
- Removed the `.ControlPanel*` and `#SliderPanel*`/`#OptionPanel` CSS block (~60 lines) — no DOM generates those classes now
- Removed dead `DrawDateTime`, `DrawSunMoonAzimuthElevation`, `DrawMousePos` methods from `app.js` (replaced by top-bar displays; the only call sites were the suppression comment and a commented-out `OnClick`)
- Inlined `ThisPageUrl`/`ThisPageShortUrl` = `location.href` at the top of `app.js`; dropped the post-import override block in `main-v2.js`

## Dead variable removal (2026-05-17)

- `AnimRestartAction = 'stop'` in `app.js` was declared, exported, never read. Dropped both the declaration and the two export-list entries.

## ControlPanel engine removal (2026-05-17)

- Removed the no-op `ControlPanels.Update()` call from `UpdateAll` in `app.js`
- Deleted `assets/ControlPanel.js` and `assets/Slider.js` — no panels were ever created (controlPanels.js / optionPanel.js were the only consumers, both deleted earlier)
- Dropped the corresponding imports from `js/main-v2.js`
- Removed the orphan `div.Slider*`, `.FieldGrid`, `.FieldCell`, `.FieldCaption`, `.Disabled` CSS (~45 lines)

## ui.js split (2026-05-17)

- `js/ui.js` (613 lines) split into `js/ui/{layers,rays,sliders,sunmoon,calendar,playback}.js` + an 88-line orchestrator
- Each submodule exports `init()` + `sync()`; orchestrator wraps `UpdateAll` once and iterates
- Dropped IIFE wrapper; `var` → `const`/`let` and arrow functions in moved code
- Fixed lingering bug: removed dangling `applyCalendarInput()` call from the outside-click handler (function never existed)
