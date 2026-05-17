# Refactor & Cleanup Plan — fed-wabis-v2

Destination: append to [roadmap/TODO.md](../../roadmap/TODO.md) (currently empty).

## Context

`fed-wabis-v2` has finished Phases 1–6 (HTML cleanup, bars, calendar, CSS, ES-module conversion, a11y). Several legacy files remain in `assets/` that DONE.md already claims removed but are still on disk, and `js/ui.js` has grown to 613 lines covering five distinct concerns. Goal: delete confirmed-dead code and split `ui.js` into focused modules so v2 is a clean, vanilla-JS baseline.

Scope confirmed with user: **cleanup + ui.js split**; deleting dead `assets/` files is allowed.

## Constraints

- v2 only. Do not touch `fed-wabis-v3/`.
- No external libraries / npm installs. Pure vanilla JS, native ES modules in the browser.

---

## Punch list (to write into roadmap/TODO.md)

### A. Delete dead files (confirmed not imported by [js/main-v2.js](../../js/main-v2.js))

- [ ] Delete [assets/init.js](../../assets/init.js) (7 lines — only contains unused `ShowBlogPage` + `SEL_GRP_AutoName1`; DONE.md Phase 1 already claims this).
- [ ] Delete [assets/controlPanels.js](../../assets/controlPanels.js) (155 lines — not in `main-v2.js`; DONE.md Phase 2 claims removed).
- [ ] Delete [assets/optionPanel.js](../../assets/optionPanel.js) (82 lines — same: not imported, DONE.md claims removed).
- [ ] Remove now-orphan CSS in [css/styles.css](../../css/styles.css) targeting `#SliderPanel`, `#SliderPanel .Row9/.Row10/.Row11`, `#OptionPanel` (~lines 540–547).
- [ ] Grep [index.html](../../index.html) for stray references to those IDs; remove if any.

### B. Investigate then likely delete: [assets/ControlPanel.js](../../assets/ControlPanel.js) (259 lines)

- [ ] Grep `app.js`, `Tabs.js`, `ModelAnimation.js` for `ControlPanel(` / `new ControlPanel` / `ControlPanel.` — Explore agent found 0 hits in `app.js`.
- [ ] If unused: remove the `import '../assets/ControlPanel.js'` line in [js/main-v2.js:14](../../js/main-v2.js#L14), delete the file.
- [ ] If used only by demo task lists: keep; document the call sites in a one-line comment at file top.

### C. Split [js/ui.js](../../js/ui.js) (613 lines → modules in `js/ui/`)

Current concerns inside ui.js (see the `UpdateAll` wrapper at [js/ui.js:13-28](../../js/ui.js#L13-L28)):

1. `syncLayerToggles` + click handlers → `js/ui/layers.js`
2. `syncRayControls` + click handlers → `js/ui/rays.js`
3. `syncParamSliders` + slider input handlers (top-bar time/day + bottom-bar params) → `js/ui/sliders.js`
4. Calendar dropdown, digit-scroll, year-progress, keyboard nav → `js/ui/calendar.js`
5. Playback RAF loop + speed dropdown + ↺ reset + ▶/⏸/⏮/⏭ buttons → `js/ui/playback.js`
6. Sun/moon info strip → `js/ui/sunmoon.js` (or fold into `playback.js` since it updates every frame)

Tasks:
- [ ] Create `js/ui/` directory; each module exports its public `init()` + sync function.
- [ ] New [js/ui.js](../../js/ui.js) becomes a ~30-line orchestrator: imports the modules, wraps `window.UpdateAll` once, calls each module's sync inside the wrapper, calls each `init()` on DOMContentLoaded.
- [ ] [js/main-v2.js:17](../../js/main-v2.js#L17) — no change needed; `./ui.js` still the entry.
- [ ] Drop the IIFE wrapper — modules already give scope isolation; switch `var` → `const`/`let` only inside the moved code (no other syntax modernization in this pass).

### D. Roadmap hygiene

- [ ] Update [roadmap/DONE.md](../../roadmap/DONE.md) entries that claim files were removed when they weren't — once A is executed, the claims will be true.

---

## Out of scope (deliberately)

- `app.js` (3291 lines) — Explore confirmed no obviously-dead helpers; demo task lists actively use `Tpse`/`Ttxt`/`Tpnt`/`Tval`.
- `wiki.js` — ships whole; many globals consumed by `app.js`. Pruning requires a deeper audit.
- `jsg.js` / `jsgx3d.js` — active draw API; leave as-is.
- `Tabs.js` — drives demo selection; leave as-is.

---

## Verification

After each step, open `index.html` in a browser (v2 is no-bundler — serve via any static file server) and confirm:

1. Canvas renders; all demo tabs (Intro, Eclipses, Equinox, DayNight, Poles, Stars) cycle without console errors.
2. Top-bar playback: ⏮ ▶ ⏭, speed dropdown, time/day sliders all behave.
3. Calendar dropdown opens, digit-scroll works, year-progress bar tracks.
4. Bottom bar: all 10 layer toggles flip `aria-pressed`; param sliders update model state; ray controls change source/target.
5. Sun/moon strip updates each frame; "below" appears when sun is under horizon.

## Critical files

- [js/main-v2.js](../../js/main-v2.js) — import list
- [js/ui.js](../../js/ui.js) — to be split
- [index.html](../../index.html) — confirm no dead IDs
- [css/styles.css](../../css/styles.css) — orphan rules to drop
- [roadmap/DONE.md](../../roadmap/DONE.md), [roadmap/TODO.md](../../roadmap/TODO.md)
