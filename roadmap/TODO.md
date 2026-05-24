# FED v2 — Pending Work

Constraints: v2 only (do not touch `fed-wabis-v3/`); no external libraries or frameworks.

Completed items are recorded in [DONE.md](DONE.md). The pending list below covers the next refactor surface.

## Pending

- [ ] **`jsg.js` + `jsgx3d.js`** — Walter's custom 2D canvas API (~900 lines). No replacement planned; keep as-is.

## Nibble candidates (low-priority, low-payoff)

- [x] **`wiki.js` (424 → 364 lines) — 29 dead `x*` helpers removed.** Deleted: `xMoveTo`, `xLeft`, `xTop`, `xOpacity`, `xResizeTo`, `xVisibility`, `xShow`, `xHide`, `xDisplay`, `xIsDisplayed`, `xCreateTextNode`, `xAppendChild`, `xInsertBefore`, `xRemoveChild`, `xChildNodes`, `xHasChildNodes`, `xElementWidth`, `xElementHeight`, `xNaturalWidth`, `xNaturalHeight`, `xScrollWidth`, `xScrollHeight`, `xClientWidth`, `xClientHeight`, `xTagName`, `xZIndex`, `xCursor`, `xGetFirst`, `xArrayMap`. Cross-checked: `xPageX`/`xPageY`/`xScrollLeft`/`xScrollTop` kept (used by `xEvent.Init`), `xFStr` kept (used by `CImgCache.GetStatus`), `xMaskRegExp`/`xIsRoot`/`xIsElementAndNotRoot` kept (used by class helpers + transitively).
- [x] **`Tabs.js` deleted.** All `<li>`s in `#DomeDemoTabs` were `TabButton`s, so the Select/Box tab-switching state machine never ran — only `AddButtonClickHandler` was used. Replaced with an 8-line `wireButton(id, fn)` helper in `demos-manager.js` (gated on the `TabEnabled` class). `Tabs.js` (17 KB minified, ~570 lines) removed from `assets/` and its import dropped from `main-v2.js`.
- [ ] **`assets/DataX.js` (43 minified lines)** — reformat to multi-line for readability. No behavior change; risk of breakage if anything mismatches. Library code; works as-is.
- [ ] **`assets/jsg.js`/`jsgx3d.js`** — same: minified library code; reformat-only would be readability-only.

## Out of scope

- Further splitting of `app.js` (453 lines): `FeDomeApp` data + lifecycle methods (`Init`, `Update`, `OnMouseMove`, `OnScroll`) are cohesive. Scattering them would be churn for no clear gain.
- Walter's library code (jsg, DataX, ModelAnimation): keep as-is unless a concrete bug or feature requires touching.
