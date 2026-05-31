# FED v2 — Pending Work

Constraints: v2 only (do not touch `fed-wabis-v3/`); no external libraries or frameworks.

Completed items are recorded in [DONE.md](DONE.md). The pending list below covers the next refactor surface.

## Pending

- [ ] **`jsg.js` + `jsgx3d.js`** — Walter's custom 2D canvas API (~900 lines). No replacement planned; keep as-is.

## Nibble candidates (low-priority, low-payoff)

- [x] **`wiki.js` (424 → 364 lines) — 29 dead `x*` helpers removed.** (See DONE.md Phase 8 follow-up.)
- [x] **`Tabs.js` deleted (Phase 9).** Replaced with an 8-line `wireButton(id, fn)` helper in `demos-manager.js`.
- [x] **`wiki.js` (364 → 336 lines) — third pruning pass (Phase 9b).** Dropped 8 more `x*` leaves + the `LayoutChange`/`WindowResize`/`DisplayChange` event-manager cluster (~20 symbols across the wrapper functions and `xEventManager` state). The cluster only died once Tabs.js (its last consumer) was gone.
- [x] **`assets/DataX.js` reformatted** — 43 minified lines → 125 multi-line. No behavior change.
- [x] **`assets/jsg.js`/`jsgx3d.js` reformatted** — 665 → 1073 and 267 → 459 multi-line. No behavior change.
- [x] **`Demos.AddAnimation` typo fix** — `if (!anim) reurn;` → `return`. Latent bug since the initial commit; custom-demo `AddAnimation()` calls would have thrown `ReferenceError: reurn is not defined` instead of returning early.

## Out of scope

- Further splitting of `app.js` (453 lines): `FeDomeApp` data + lifecycle methods (`Init`, `Update`, `OnMouseMove`, `OnScroll`) are cohesive. Scattering them would be churn for no clear gain.
- Walter's library code (jsg, DataX, ModelAnimation): keep as-is unless a concrete bug or feature requires touching.
