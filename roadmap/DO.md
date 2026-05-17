# FED v2 — Pending Work

---

## UI refinements (next up)

- [x] **Remove canvas date/time overlay** — `DrawDateTime()` and `DrawSunMoonAzimuthElevation()` calls suppressed in `app.js` (both v2 and v3); overlay duplicated the top-bar sun/moon strip.

---

## Phase 4 — CSS (partial)

- [x] Mobile-first base: bottom bar icons-only at ≤ 480px, top bar horizontally scrollable
- [x] `@media (min-width: 768px)`: show text labels under bottom bar icon toggles
- [x] `role="dialog"` + `aria-modal="true"` on `#calendar-dropdown` when open
- [x] `prefers-reduced-motion`: disable CSS transitions
- [x] Year progress track — thin progress bar in calendar dropdown showing DayOfYear position
- [ ] Dark mode: `@media (prefers-color-scheme: dark)` — swap surface/bg vars, keep accent (app is dark-by-default; skip until light-mode skin is needed)

---

## Phase 5 — JS remaining

- [x] `wiki.js` has ~150 symbols — converted to ES module with `Object.assign(globalThis, {...})` + `export {}` block (Phase 7e)

---

## Phase 7 — Vite + PixiJS

**Decision:** Vite for bundling/HMR/modules + PixiJS for WebGL-accelerated rendering. No Astro, no Three.js.

### 7a — Vite scaffold ✅  (`fed-wabis-v3/`)
- [x] `npm create vite@latest fed-wabis-v3 -- --template vanilla`
- [x] `public/assets/` — all legacy scripts (wiki.js → app.js); copied as-is to `dist/` by Vite
- [x] Fixed `jsg.js` `document.writeln` — both occurrences in `CreateDomObjects` replaced with `getElementById('jsg-canvas-mount').outerHTML`; mount `<div>` in `index.html` at canvas position
- [x] `src/main.js` imports `css/styles.css` + `js/ui.js`; legacy scripts stay as regular `<script>` tags (globals remain on `window` implicitly — explicit `window.*` assignment deferred to Phase 7e)
- [x] `npm run build` passes: 6 modules transformed, all legacy scripts copied to `dist/assets/`

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
- [x] Vite automatically drops unused exports from `wiki.js` at build — no manual audit needed (now that src/lib/ files are proper ES modules, Phase 7e complete)

### 7e — Globals → ES modules ✅
- [x] Inventory all cross-file globals
- [x] All 13 asset files (`wiki.js` → `app.js`) converted: `Object.assign(globalThis, {...})` + `export {}` appended to each
- [x] `jsg.js`: fixed implicit-global `JsgMat2={}` → `var JsgMat2={}` (strict mode); fixed `document.writeln` → `jsg-canvas-mount` pattern
- [x] `wiki.js`: fixed cross-module `xOnLoadFinished` — page-load handler now also writes `globalThis.xOnLoadFinished=true`; re-encoded Latin-1 → UTF-8
- [x] **v2**: `js/main-v2.js` created as single `type=module` entry point; `index.html` updated (wiki.js removed from head, legacy script tags replaced with canvas mount div + module tag, inline URL fix removed)
- [x] **v3**: asset files moved to `src/lib/`, `src/main.js` updated to import from lib, `index.html` legacy script tags removed; `npm run build` passes (19 modules, 418 kB)

---

## Future ideas

- [ ] **Day/night terminator gradient** — radial gradient overlay on the FE disc aligned to sun position; soft penumbra effect. Pure canvas 2D, no library change needed.
- [ ] **Observer location picker** — click/tap on the FE disc surface to set ObserverLat/Long directly, instead of right-drag only
- [ ] **Star precession** — stars slowly rotate as DayOfYear advances (currently static)
- [ ] **Lunar phase disc** — show lit fraction of moon face based on sun-moon angle
