# FED v2 — Refactor Roadmap

Base: `fed-wabis-helios` (all demo buttons working, ControlPanel system intact).
Goal: modern, mobile-first, accessible, optimized — without breaking what works.

---

## UI target — one-screen layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Intro] [Eclipses] [Equinox] [DayNight] [Poles] [Stars] [TFE]  │  ← fixed top bar
│  [Reset]                                       [📅 Mar 20 2024]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                     CANVAS (fills viewport)                     │
│                                                                 │
│                                              [⚙ Sliders ▲]     │  ← floating toggle
├─────────────────────────────────────────────────────────────────┤
│  ⏮  ⏪  ▶/⏸  ⏩  ⏭   1h ▾   1×   ──────●──────              │  ← fixed bottom bar
│  [Grid][Dome][Shadow][☀Track][☾Track][Sphere][Stars][Ra…]      │
└─────────────────────────────────────────────────────────────────┘
```

- **No scroll.** Everything fits in the viewport. Canvas is the content.
- **Mouse/touch replaces 3 sliders**: left-drag = camera rotate, scroll/pinch = zoom (already in app.js `OnMouseMove` + `OnScroll`).
- **Two fixed bars** overlay the canvas (top + bottom, semi-transparent).
- **Floating slider panel** — hidden by default, opened by a ⚙ button bottom-right.
- **Calendar** — top-right corner of the top bar, shows current date from `DateTime`.

---

## Phase 1 — HTML cleanup ✓

- [x] Fix charset: UTF-8, single meta tag
- [x] Remove CMS artifacts: Layout wrappers, ZoomPic, WikiPage/Wiki/BlogImage divs, injected html class, unused meta tags, commented ASP block
- [x] Flatten layout: `<main id="app">` is now the single wrapper
- [x] Fix script load order: scripts moved to after canvas so `document.writeln()` places panels in correct DOM position — tabs → canvas → [scripts → panels] → save-restore
- [x] Remove pre-rendered duplicate `#SliderPanel` / `#OptionPanel` tables (invalid duplicate IDs)
- [x] Remove `init.js` (only defined unused `ShowBlogPage` and `SEL_GRP_AutoName1`)
- [x] Replace OnOff SEL toggle with native `<details>/<summary>`
- [x] Canvas inline styles moved to CSS

---

## Phase 2 — Full-screen layout + top/bottom bars

Replace the current scroll-page layout with a full-viewport, overlay-based layout.

### 2a — Viewport layout
- [x] `body` and `#app`: `height: 100dvh; overflow: hidden`
- [x] `#FeGraph` (canvas): `position: fixed; inset: var(--top-bar-h) 0 var(--bottom-bar-h) 0` — fills the gap between bars
- [x] Top bar height: `--top-bar-h: 52px`; bottom bar height: `--bottom-bar-h: 80px`
- [x] Remove the ControlPanel-generated `#SliderPanel` and `#OptionPanel` from the page flow — replace with the floating panel (Phase 2c) and bottom bar toggles (Phase 2d)

### 2b — Top bar
Keep demo tabs on the left, add calendar on the right (Phase 3):
- [x] `#DomeDemoTabs`: keep as-is visually, but align left within the top bar
- [x] Top-right slot: reserved for `#calendar-widget` (built in Phase 3)
- [x] Playback step buttons (Back `⏮`, Forw `⏭`) move here from the tab list — they're navigation, not demos
- [x] Remove `CountButton` (shows animation frame count — internal debug info, not user-facing)
- [x] `ResetButton` stays in tab bar

### 2c — Floating slider panel
A panel that slides up from the bottom-right (or fades in), toggled by a `⚙` button.

**Sliders to KEEP** (need precise numeric input):
| Slider       | Range           | Unit | Note                                  |
|--------------|-----------------|------|---------------------------------------|
| Time         | 0 – 24          | h    | Fix: was 0–48 in helios               |
| DayOfYear    | 0 – 365         | d    | Fix: was 0–3500; model range is 0–364 |
| AxialTilt    | 0 – 90          | °    |                                       |
| MoonEcliptic | -90 – 90        | °    |                                       |
| DistSun      | 3e6 – 9e8 (log) | km   |                                       |
| DistMoon     | 3e5 – 6e6 (log) | km   |                                       |
| ObserverLat  | -90 – 90        | °    | Right-drag exists but non-obvious     |
| ObserverLong | -180 – 180      | °    | Right-drag exists but non-obvious     |
| DomeHeight   | model min–max   | km   |                                       |
| DomeSize     | 1–5             | %    |                                       |
| RayParam     | 0.5–2           | %    |                                       |

**Sliders to REMOVE** (already driven by mouse/touch in `app.js`):
| Removed      | Replaced by          |
|--------------|----------------------|
| CameraDir    | Left-drag horizontal |
| CameraHeight | Left-drag vertical   |
| Zoom         | Scroll wheel / pinch |

- [x] ~~Floating panel~~ → **Implementation diverged**: Time/Day sliders in top bar; MoonEcliptic, DistSun, DistMoon, DomeHeight, DomeSize, RayParam as native `<input type="range">` in bottom bar
- [x] AxialTilt, ObserverLat, ObserverLong removed from UI (right-drag handles observer position; float panel dropped)
- [x] `RayTarget` and `RaySource` compact radio buttons moved to bottom bar right section

### 2d — Bottom bar: layer toggles
Ten icon-toggle buttons, each controls a `Show*` boolean in `FeDomeApp`:

| Button      | Model property   | Icon idea        |
|-------------|------------------|------------------|
| FE Grid     | `ShowFeGrid`     | grid             |
| Dome Grid   | `ShowDomeGrid`   | arc              |
| Shadow      | `ShowShadow`     | shadow/crescent  |
| Sun Track   | `ShowSunTrack`   | sun + path       |
| Moon Track  | `ShowMoonTrack`  | moon + path      |
| Sphere      | `ShowSphere`     | circle           |
| Stars       | `ShowStars`      | star             |
| Dome Rays   | `ShowDomeRays`   | rays from dome   |
| Sphere Rays | `ShowSphereRays` | rays from sphere |
| Many Rays   | `ShowManyRays`   | multiple rays    |

- [x] Each button: `<button class="layer-toggle" data-prop="ShowFeGrid" aria-pressed="true">` + inline SVG icon + `<span>` label
- [x] On click: toggle `FeDomeApp[prop]`, call `UpdateAll()`, flip `aria-pressed`
- [x] Sync state on demo tab change (demo presets change these flags)
- [ ] Labels hidden on small screens (icon only, full label in tooltip) — Phase 4

### 2e — Top bar: playback (moved from bottom bar to top-right cluster)
- [x] `⏮` step back (one cycle unit), `▶/⏸` play/pause, `⏭` step forward
- [x] **Cycle mode** selector — sets `playback.baseRate` and `playback.stepSize`:
  - ☀ Solar day: 1 model-hour/s (`baseRate = 1/24`; step = 1h)
  - ☾ Lunar cycle: 29.5306 days/s (one synodic month = 29d 12h 44m 3s); step = one cycle
  - Solar year: 365.256 days/s (8766h 9m 9s); step = one year ← default
- [x] **Multiplier** selector: ½× | 1× | 1½× | 2× — scales `playback.baseRate`
- [x] Playback drives `FeDomeApp.DateTime` directly, calls `UpdateAll()`
- [ ] Thin progress track showing position within the current year (0–365d) — Phase 4
- [ ] Wire into `ModelAnimation` / `Animations.TimeStrech` — Phase 5

---

## Phase 3 — Calendar widget (top-right) ✓

The calendar shows and controls the current date derived from `FeDomeApp.DateTime` and `FeDomeApp.ZeroDate`.

- [x] Display: `"Jan 01 2024 / 12:30 UTC"` — computed from `FeDomeApp.DateTimeToString(FeDomeApp.DateTime)` (strips `|Equinox` annotation)
- [x] Click opens a compact dropdown with:
  - Current date as editable text input (parse on Enter/blur using local `parseDateTimeString`)
  - `[ ← 1yr ] [ ← 1d ]  [ 1d → ] [ 1yr → ]` step buttons
  - Month/year grid picker — deferred (nice to have, not MVP)
- [x] On date change: set `FeDomeApp.DateTime` directly (encodes both DayOfYear and Time), call `UpdateAll()`
- [x] Sync: when playback runs, calendar display updates each frame (via `UpdateAll` wrapper)
- [x] Keyboard: arrow keys step ±1d / ±1yr while input is focused; Escape closes; Enter applies
- **Note:** `app.js` renders current date/time text directly on the canvas, overlapping the top-bar calendar display. Suppressing the canvas text requires Phase 5 app.js edits — find the `DrawInfo()` call or equivalent and check for a `ShowDateTime` flag.

---

## Phase 4 — CSS refactor (mobile-first)

Now that the layout concept is settled, clean up the CSS:

- [ ] Mobile-first: base styles for viewport ≤ 480px (bottom bar icons-only, top bar scrollable)
- [ ] `@media (min-width: 768px)`: show labels under bottom bar icons
- [ ] CSS custom properties already done in Phase 1; expand with `--top-bar-h`, `--bottom-bar-h`
- [ ] Canvas resize: `ResizeObserver` on `#FeGraph` → call jsg resize function when container size changes (Phase 6 handles full responsiveness)
- [ ] Bottom bar: `display: flex; justify-content: space-between; align-items: center; gap: 4px`
- [ ] Dark mode: `@media (prefers-color-scheme: dark)` — invert surface/bg vars, keep accent
- [ ] `prefers-reduced-motion`: disable CSS transitions and canvas animation auto-play

---

## Phase 5 — JS audit and cleanup

- [ ] **wiki.js** audit: ~150 unique symbols used across all assets (confirmed via grep). Dependency graph too deep to extract safely without a bundler. Defer to Phase 8 (Vite tree-shaking will handle it automatically).
- [x] **controlPanels.js** + **optionPanel.js**: removed script tags from `index.html`. Their `document.writeln` output (`#SliderPanel`, `#OptionPanel`) is fully replaced by native bars. `ControlPanel.js` engine itself stays intact for Tabs.js demo system.
- [ ] Audit `app.js` CMS dead references: `ThisPageUrl` / `ThisPageShortUrl` (lines 1–2) point to Walter's site — used by DataX "Get App URL" button. Update to `''` or a local path in standalone mode.
- [x] `Animations.TimeStrech`: wired to speed multiplier in `ui.js` — `TimeStrech = 1/multiplier` so demo animations respect ½× / 1× / 1½× / 2× settings.
- [x] Demo-tab / playback conflict: `playback.stop()` is called on any demo tab click, preventing the RAF loop from racing with scripted Animator sequences.
- **Note:** `AnimationSpeed` global (app.js line 1665) sets **load-time** constants `AnimT1`–`AnimT10`. These are precomputed once and cannot change at runtime; `Animations.TimeStrech` is the correct runtime speed lever.
- [ ] Preserve untouched: `ControlPanel.js`, `Tabs.js`, `ModelAnimation.js`, `DataX.js`, `Slider.js`, `jsg.js`, `jsgx3d.js`

---

## Phase 6 — Accessibility

- [ ] Bottom bar toggle buttons: `aria-pressed` (done in Phase 2d spec)
- [x] Bottom bar layer toggles: `aria-pressed` — wired in ui.js `syncLayerToggles()`
- [x] Canvas: `#canvas-status` `aria-live="polite"` div — updates with current DateTime when playback is paused (throttled: silent during 60fps playback to avoid screen-reader flood)
- [x] Demo tab buttons: `aria-selected="false"` + `aria-controls="FeGraph-Canvas"` added to HTML; `MutationObserver` in ui.js flips `aria-selected` when Tabs.js adds/removes `TabSelected` class
- [x] Param sliders: `aria-label` per `<input type="range">` already in index.html
- [x] Playback buttons: `aria-label` on ⏮/▶/⏭ already in HTML; ▶ updates to "Pause" dynamically in `_setPlayUI`
- [x] Calendar: arrow keys (±1d/±1yr), Enter, Escape fully wired in ui.js
- [x] Focus trap in calendar dropdown: Tab/Shift-Tab cycle through `input` + 4 step `button`s; Escape closes
- [x] Gesture hint: `#gesture-hint` overlay on canvas — fades out after 5 s via ui.js timeout
- [ ] `role="dialog"` + `aria-modal` on `#calendar-dropdown` when open — Phase 4 CSS pass (needs positioning review first)

---

## Phase 7 — Future: library optimization

> Do not start until Phases 2–6 are stable and working.

Current rendering stack: `jsg.js` (2D canvas abstraction) + `jsgx3d.js` (3D projection) — custom, minified, Walter Bislin's library.

Evaluate:
- **Custom Canvas 2D** — rewrite `jsg.js`/`jsgx3d.js` as modern ES6 classes; smallest bundle, full control, preserves all existing math in `app.js`
- **PixiJS / Konva** — 2D canvas with scene graph, easier layer management for the overlay system
- **D3.js** — only if SVG rendering becomes a goal; overkill for a canvas draw loop

Decision criteria: mobile fps, bundle size, how much of `app.js` math survives unchanged.

- [ ] Profile current render fps (desktop + mobile) during animation
- [ ] Benchmark a minimal port of `DrawDome()` in each candidate
- [ ] Decide and document before touching `app.js`

---

## Phase 8 — Future: framework migration

> Do not start until Phase 7 is settled.

- **Astro JS**: static shell + canvas island. Zero-JS for surrounding content. Best fit.
- **Vite only**: if Astro feels like overkill — get bundling/tree-shaking/HMR without a framework opinion.

Migration blocker: `ControlPanel.js`, `Tabs.js`, `app.js` use many globals (`FeDomeApp`, `UpdateAll`, `ControlPanels`, `Animations`, etc.). Plan the globals → ES module migration before committing to a bundler.

- [ ] Inventory all globals used across files
- [ ] Design the module boundary (`FeDomeApp` as a singleton export vs. class)
- [ ] Verify ControlPanel system works inside a Vite/Astro build (no `document.writeln` in module mode)
- [ ] Prototype the Astro island wrapper before full migration

---

## Guiding principles

- **No scroll.** All controls live in fixed bars or floating panels. The canvas IS the page.
- **Mouse replaces sliders where possible.** Only expose sliders for values that have no obvious gesture equivalent.
- **Don't break what works.** ControlPanel/Tabs engine stays untouched until Phase 7.
- **One phase at a time.** Each phase leaves the app in a working, shippable state.
- **Assets are read-only** until Phase 7. New code goes in `css/` and new `js/` files only.
- **No abstraction without a second use case.**
