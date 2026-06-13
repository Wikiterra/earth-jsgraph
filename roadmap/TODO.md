# FED v2 — Pending Work

Constraints: v2 only (do not touch `fed-wabis-v3/`); no external libraries or frameworks.

Completed items are recorded in [DONE.md](DONE.md). The pending list below covers the next refactor surface.

## Pending

_(none — Phase 10/11/12 cleared the queue. See "Out of scope" for what's intentionally not on the list.)_

## Recent additions

- [x] **Year timeline scrubber.** Click anywhere on the line to seek, drag to scrub (mouse + touch + pen). Month tick marks Jan…Dec. Label below reads "Mar 23" instead of a raw day number. See Phase 11.
- [x] **Speed cycle button.** Click cycles forward through speed presets; shift-click / right-click / arrow-keys step back. Replaces the `<select>` dropdown. See Phase 11.
- [x] **Play/pause: one SVG.** Single `<svg>` whose `<path d>` swaps between the triangle and the bars instead of two SVGs with `hidden` toggles. See Phase 12.
- [x] **Luminaries section.** Dedicated bottom-right group with Sun / Moon / Stars toggles. Replaces the Obs/FE + ☀☾★ ray-section and removes Sun-Track / Moon-Track / Stars from the layer-section. See Phase 12.
- [x] **Save/restore restyled.** Panel matches the dark blurred bar theme (textarea + buttons consistent with `.pb-speed-btn`). See Phase 12.
- [x] **Bottom bar regrouped: Layers / Params / Rays / Luminaries.** New `ShowSun` / `ShowMoon` model flags so Sun/Moon buttons toggle the bodies (not the tracks). D·Rays / S·Rays / Rays+ moved into their own `.rays-section`. New Orbits button toggles both `ShowSunTrack` and `ShowMoonTrack` in lockstep via the new `data-prop-list` mechanism. See Phase 13.
- [x] **10 yr/s preset dropped.** 6 speeds now: 1 h/s → 12 h/s → 1 d/s → 1 wk/s → 1 mo/s → 1 yr/s. See Phase 14.
- [x] **Moon phase widget cleaned.** Dropped the daytime-blue + below-horizon-green colour matrix; widget is now neutral B&W (dim grey when moon is below horizon). See Phase 14.
- [x] **Save/restore repositioned.** Moved from bottom-left (over the layer toggles) to top-left under the top bar, narrower (280px), height-capped to fit between the bars. See Phase 14.
- [x] **Calendar pinned to the right** via `margin-left: auto` on `#calendar-widget` — absorbs leftover flex space regardless of how the timeline / playback cluster shape up. See Phase 14.
- [x] **Demo tabs unified.** `TabPrimary` class removed from Intro/Eclipses/Equinox so all 6 demos share the same default styling, click wiring, and active-tab affordance. See Phase 14.

## Out of scope

- Further splitting of `app.js` (~450 lines): `FeDomeApp` data + lifecycle methods (`Init`, `Update`, `OnMouseMove`, `OnScroll`) are cohesive. Scattering them would be churn for no clear gain.
- Walter's library code (`jsg.js` + `jsgx3d.js`, ~1500 reformatted lines): keep as-is unless a concrete bug or feature requires touching. No replacement planned.
- DataX / ModelAnimation: reformatted to multi-line in Phase 9c but internals untouched. They're stable; don't rewrite.
- `xEvent` wrapper: still allocates a wrapper object per DOM event (via `xAddEvent`). Could be flattened to native `addEventListener`, but jsg's mouse handling uses `event.PreventDefault()` / `event.offsetX` from the wrapper API. Not worth the surgery.
- Two-finger pinch-zoom on touch: `jsgMouseHandler` only handles single-finger drag; pinch falls through to the browser. Adding it would mean tracking two simultaneous touches and computing distance deltas. Out of scope until someone uses the app on a phone and complains.
