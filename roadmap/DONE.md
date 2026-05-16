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

## Phase 5 — JS audit (completed items)

- `controlPanels.js` + `optionPanel.js` removed; ControlPanel.js engine kept intact for Tabs.js
- `ThisPageUrl` / `ThisPageShortUrl` overridden with `location.href` via inline `<script>` after `app.js` — "Get App URL" now produces a usable local URL instead of Walter's site
- `Animations.TimeStrech` wired to speed multiplier: `TimeStrech = 1 / multiplier`
- Playback RAF loop stops on any demo tab click — prevents race with Tabs.js Animator

---

## Phase 6 — Accessibility

- Layer toggles: `aria-pressed` set in HTML (matching app.js defaults), synced every `UpdateAll` via `syncLayerToggles()`
- Demo tabs: `aria-selected` flipped by MutationObserver watching Tabs.js `TabSelected` class changes — no Tabs.js modification needed
- Param sliders: `aria-label` on each `<input type="range">`
- Playback: `aria-label` on ⏮/▶/⏭; ▶ label flips to "Pause" dynamically
- Gesture hint pill overlay (left-drag / right-drag / scroll) fades out after 5 s
- Calendar dropdown: full keyboard nav, Enter/Escape, focus trap
