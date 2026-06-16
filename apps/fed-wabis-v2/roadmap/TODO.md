# FED v2 — Pending Work

Constraints: v2 only (do not touch `fed-wabis-v3/`); no external libraries or frameworks.

Completed items are recorded in [DONE.md](DONE.md). The pending list below covers the next refactor surface.

## Pending

_(none — all queued work has shipped through Phase 14.)_

## Out of scope

- Further splitting of `app.js` (~450 lines): `FeDomeApp` data + lifecycle methods (`Init`, `Update`, `OnMouseMove`, `OnScroll`) are cohesive. Scattering them would be churn for no clear gain.
- Walter's library code (`jsg.js` + `jsgx3d.js`, ~1500 reformatted lines): keep as-is unless a concrete bug or feature requires touching. No replacement planned.
- DataX / ModelAnimation: reformatted to multi-line in Phase 9c but internals untouched. They're stable; don't rewrite.
- `xEvent` wrapper: still allocates a wrapper object per DOM event (via `xAddEvent`). Could be flattened to native `addEventListener`, but jsg's mouse handling uses `event.PreventDefault()` / `event.offsetX` from the wrapper API. Not worth the surgery.
- Two-finger pinch-zoom on touch: `jsgMouseHandler` only handles single-finger drag; pinch falls through to the browser. Adding it would mean tracking two simultaneous touches and computing distance deltas. Out of scope until someone uses the app on a phone and complains.

## Shipped phases (see DONE.md for details)

| Phase | Theme                                                                                                                                                                              |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | HTML cleanup (CMS artefacts, single `<main>`, script-load order)                                                                                                                   |
| 2     | Full-screen layout + fixed top/bottom bars                                                                                                                                         |
| 3     | Calendar widget (digit-scroll spinbuttons, dropdown)                                                                                                                               |
| 4     | CSS (mobile-first, `ResizeObserver`, year-progress track)                                                                                                                          |
| 5     | JS audit (`controlPanels.js` + `optionPanel.js` removed)                                                                                                                           |
| 6     | Accessibility (aria-pressed / aria-selected sync, focus trap, keyboard nav)                                                                                                        |
| 7e    | ES module conversion (13 asset files → ESM, single `main-v2.js` entry)                                                                                                             |
| 8     | JS module decomposition (`app.js` 3232 → 453 lines; `wiki.js` 920 → 424; new `app-math` / `app-draw` / `demos-data` / `demos-manager` / `earth-map-data` / `ui/save-restore`)      |
| 9     | `Tabs.js` deleted; `wireButton()` helper + aria-selected sync                                                                                                                      |
| 9b    | `wiki.js` third pruning pass (LayoutChange / WindowResize / DisplayChange cluster gone)                                                                                            |
| 9c    | Library reformat (DataX / jsg / jsgx3d / EarthMap / ModelAnimation / jsgMouseHandler multi-line); `Demos.AddAnimation` `reurn` typo fix                                            |
| 10    | Latent-bug sweep + polyfill removal + dead-state cleanup (`Containes`, `arguments.lenth`, `inheritsFrom` inlined, dead `TabActive` / `LastDemo` dropped, gesture-hint touch-aware) |
| 11    | Year timeline scrubber + speed cycle button                                                                                                                                        |
| 12    | Play/pause one-SVG; Luminaries section; save/restore restyled to dark bar theme                                                                                                    |
| 13    | Bottom bar regrouped (Layers / Params / Rays / Luminaries); new `ShowSun` / `ShowMoon` model flags; `data-prop-list` multi-prop wiring; Orbits button                              |
| 14    | 10 yr/s preset dropped; moon phase widget neutral palette; save/restore moved to top-left; calendar pinned right; demo tabs unified (no more `TabPrimary`)                         |
