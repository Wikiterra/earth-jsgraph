# FED v2 — Pending Work

---

## UI refinements (next up)

- [ ] **Velocity/speed selector** — replace cycle-mode buttons + multiplier buttons with a single dropdown: e.g. `1 h/s · 1 d/s · 1 mo/s · 1 yr/s · 10 yr/s`, no separate multiplier
- [ ] **Play/Pause redesign** — visually distinguish playing vs paused state more clearly; move Reset out of the demo tab strip into a standalone icon button in the top bar
- [ ] **Remove TFE tab** — remove from HTML visible tab list (keep hidden `<li>` in DOM only if Tabs.js requires it for its animation sequence)
- [ ] **Calendar: digit-scroll input** — replace the free-text input with individual scrollable fields (day · month · year · hour · minute), each stepable with arrow keys or mouse wheel; current text input stays as a fallback
- [ ] **Remove canvas date/time overlay** — `app.js` renders date/time text directly on the canvas via `DrawInfo()`. Locate the `ShowDateTime` flag or equivalent call and suppress it once assets are editable (Phase 7). Until then, the top-bar calendar display duplicates it.
- [ ] **Sun/Moon info strip** — display current sun altitude, azimuth and moon phase/altitude in a compact row to the right of the calendar toggle (reads from `FeDomeApp` properties each `UpdateAll`)

---

## Phase 4 — CSS

- [ ] Mobile-first base: bottom bar icons-only at ≤ 480px, top bar horizontally scrollable
- [ ] `@media (min-width: 768px)`: show text labels under bottom bar icon toggles
- [ ] `ResizeObserver` on `#FeGraph` → call jsg resize when container size changes
- [ ] Dark mode: `@media (prefers-color-scheme: dark)` — swap surface/bg vars, keep accent
- [ ] `prefers-reduced-motion`: disable CSS transitions, prevent auto-play on load
- [ ] `role="dialog"` + `aria-modal="true"` on `#calendar-dropdown` when open
- [ ] Year progress track — thin range/progress bar showing DayOfYear position within 0–364

---

## Phase 5 — JS remaining

- [ ] `wiki.js` has ~150 symbols used across assets; dependency graph too deep to untangle manually — defer to Phase 7 Vite (tree-shaking removes unused symbols automatically at build time)

---

## Phase 7 — Vite + PixiJS

**Decision:** Vite for bundling/HMR/modules + PixiJS for WebGL-accelerated rendering. No Astro, no Three.js.

### 7a — Vite scaffold
- [ ] `npm create vite@latest fed-wabis-v3 -- --template vanilla`
- [ ] Move `assets/`, `css/`, `js/`, `index.html` into the new project
- [ ] Fix `jsg.js` `document.writeln` — replace with `createElement` + `insertAdjacentElement` (4-line change; this is the only hard blocker for Vite module mode)
- [ ] Assign all globals to `window` explicitly (`window.FeDomeApp`, `window.UpdateAll`, `window.ControlPanels`, `window.Animations`, `window.Tabs`) so ControlPanel.js and Tabs.js keep working with zero changes

### 7b — PixiJS compat shim
- [ ] `npm install pixi.js`
- [ ] Audit all `jsg.*` API calls in `app.js` — list every method name and signature used
- [ ] Write `jsg-pixi.js`: implements the full `jsg` drawing API (`Line`, `Arc`, `Circle`, `FillPoly`, `Text`, color/transform state) backed by PixiJS `Graphics` and `Container`
- [ ] Keep `jsgx3d.js` math completely intact — it produces 2D screen coordinates; only the draw calls change
- [ ] Swap `<script src="assets/jsg.js">` for `jsg-pixi.js`; `app.js` requires zero changes

### 7c — PixiJS performance wins
- [ ] Stars (`ShowStars`) → `ParticleContainer` with GPU instancing — biggest fps gain
- [ ] Ray fans (`ShowManyRays`, `ShowDomeRays`, `ShowSphereRays`) → batched WebGL line rendering
- [ ] Profile fps before/after on desktop and mobile during animation

### 7d — wiki.js tree-shaking
- [ ] Vite automatically drops unused exports from `wiki.js` at build — no manual audit needed

### 7e — Globals → ES modules (after 7a–7d stable)
- [ ] Inventory all cross-file globals
- [ ] Convert `app.js` to named exports: `export { FeDomeApp, UpdateAll }`
- [ ] Convert remaining files one at a time; verify Tabs.js / ControlPanel.js still function after each

---

## Future ideas

- [ ] **Day/night terminator gradient** — radial gradient overlay on the FE disc aligned to sun position; soft penumbra effect. Pure canvas 2D, no library change needed.
- [ ] **Observer location picker** — click/tap on the FE disc surface to set ObserverLat/Long directly, instead of right-drag only
- [ ] **Screenshot export** — `canvas.toDataURL('image/png')` triggered by a button; opens in new tab or downloads
- [ ] **Star precession** — stars slowly rotate as DayOfYear advances (currently static)
- [ ] **Lunar phase disc** — show lit fraction of moon face based on sun-moon angle
