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

## wiki.js auto-init handlers disabled (2026-05-17)

Removed three wiki-specific lifecycle handlers from the end of `wiki.js`:
- `xOnDomReady(InitWikiJS)` — registered `OnDocKeyDown` (Enter / 1–9 wiki paging) on `<html>` and `OnDblCklick` on every h1–h4. No such headers exist in this app; the keydown handler was a latent conflict surface.
- `xOnDomReady(WikiMenuBarHandling.Init)` — only scans for `.menubar` divs (none exist).
- `xOnLoad(UrlParams.Parse + OnOffSections.HandleUrlParameters + MarkSearch)` — wiki search highlight + `?open=`/`?close=` URL params, all irrelevant.

The `xEventManager` load-handler chain is still installed by `app.js`'s own `xOnLoad(...)` registration, so `xOnLoadFinished` (read by `jsg.js`'s draw gate) is still set correctly.

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

---

## Phase 8 — JS module decomposition (2026-05-17 → 2026-05-18)

Goal: break the two monoliths (`app.js` 3232 lines, `wiki.js` 920 lines) into focused, cohesive modules; remove dead code and the last inline JS. Load order in `main-v2.js` after this phase: `wiki → xtc → jsg/jsgx3d/jsgMouseHandler → EarthMap → earth-map-data → Tabs → DataX → ModelAnimation → app → app-math → app-draw → demos-manager → demos-data → ui`.

### `app.js` decomposition: 3232 → 453 lines (−86%)

- **`assets/demos-data.js`** (new, 1230 lines) — extracted `Demos.AddState` / `Demos.AddDemo` payloads + the `Tpse`/`Ttxt`/`Tpnt`/`Tval` task helpers + `AnimT1..10`/`AnimTxt` constants. Loads after `demos-manager.js`; references `FeDomeApp`, `Demos`, `AnimationSpeed`, x-helpers via `globalThis`.
- **`assets/app-math.js`** (new, 164 lines) — extracted 24 pure-math coord/transform methods (`DateToEarthRotAngle`, `CompTransMatCelestToGlobe`, `CompTransMatLocalFeToGlobalFe`, `CompTransMatSunToCelest`, `CompTransMatMoonToCelest`, `CompTransMatDomeToFe`, `SunAngleToCelestCoord`, `MoonAngleToCelestCoord`, `CompMoonNorthCelestCoord`, `DateToSunAngleCelest`, `DateToMoonPrecessAngle`, `DateToMoonAngleCelest`, `CelestCoordToLocalGlobeCoord`, `CelestLatLongToLocalGlobeCoord`, `CelestLatLongToGlobalFeSphereCoord`, `CelestCoordToLocalGlobeAngles`, `LatLongToCoord`, `CoordToLatLong`, `LocalGlobeCoordToAngles`, `FeLatLongToGlobalFeCoord`, `CelestLatLongToDomeCoord`, `CelestCoordToDomeCoord`, `CelestCoordToGlobalFeCoord`, `DomeCoordToGlobalFeCoord`) via `Object.assign(FeDomeApp, {...})`.
- **`assets/app-draw.js`** (new, 1009 lines) — extracted 25 `FeDomeApp.Draw*` methods plus `DateTimeToString` (which sat in the middle of the Draw block) via `Object.assign(FeDomeApp, {...})`.
- **`assets/demos-manager.js`** (new, 401 lines) — extracted `AnimationSpeed`, the `Demos` registry (`Init`, `SetButtonText`, `Reset`, `UpdateDemoPanels`, `GetCurrPos`, `GetNStates`, `GetLastPos`, `SetPos`, `SetDemo`, `SetSusDemo`, `SetNewDemo`, `IsActive`/`IsPlaying`/`IsEndPos`/`Prev`/`Next`/`Play`/`Stop`), and the `xOnLoad`/`xOnDomReady` Tabs button-wiring handlers (`ResetButton`/`TFEButton`/`BackButton`/`ForwButton`/`PlayButton`/`CountButton`).
- **`assets/app.js`** (now 453 lines) — `FeDomeApp` data + lifecycle methods (`CreateFeGraph`, `Init`, `ClearDescription`, `OnMouseMove`, `OnScroll`, `Update`), `UpdateAllRunning`/`UpdateAll`/`ResetApp`/`TFE`/`HandleUrlCommands`, the three `DataX.Assign*` wiring calls, and the constant helpers (`ToRad`/`ToDeg`/`sqr`/`Limit1`/`Limit01`/`ToRange`).

### `wiki.js` cleanup: 920 → 424 lines (−54%)

Verified 0 external references for each deletion via cross-codebase grep before removing. All survivors are still in the export list:

- Deleted: `WikiMenuBarHandling`, `MarkSearch`/`highlightWord`/`highlightRegExp`/`DoMarkSearch`/`ToggleMarks` (wiki search-highlight machinery), `OnOffSections`, wiki.js's own `UrlParams` object (DataX has its own internal `UrlParams`), `LayoutMaximize`/`LayoutNormal`/`IsLayoutMaximized`/`LayoutFullscreenOn`/`LayoutFullscreenOff`/`IsLayoutFullscreen`, `Zoom` singleton + `CZoom` class + all `ZoomInit`/`ZoomPics`/`ZoomDebug`/`ZoomIn`/`ZoomOut`/`ZoomEnable`/`ZoomDisable` shims, `CProgressbar`/`Progressbar`, `EditPage`/`ShowUploadForm`/`ShowWikiFunctions`/`OnDocKeyDown`/`UrlEncode`/`Trim`/`OnDblCklick`/`InitWikiJS`, `MarkupMathText`/`ProcessMathText`, `AddToCookie`/`AddCBReq`/`SEL`/`SplitWords`/`decodeHtml`, `xGreekNamesToUnicode`/`xGreekNameUnicodeDict`/`xGetUnicodeOfGreekName`, `xDebug`/`xDebugOutId`/`xClearLog`/`xDbg*`/`xDbgOut`/`xDbgApp`, `xClipboardBuffer`/`xToClipboard`, `xImage`/`xChangeImage`/`xMultiImage`, `htmlString`, the entire `xOptions` + `xTransform*` cluster (`xSupportsTransform`/`xTransform`/`xTransformOrigin`/`xGetTransformPropertyName`/`xGetTransformDocOffset`/`xTransformNone`/`xTransformTranslate`/`xTransformTranslateScale`).
- Kept (still used externally): `xSetCookie`/`xGetCookie`/`xDeleteCookie` (DataX cookie save/restore), `xTimeMS` (ModelAnimation), `CImgCache` + `IC` singleton (jsg.js image cache).
- `xLog` reduced to a `function xLog() {}` no-op stub because `CImgCache.DisplayStatus` calls it internally.
- One leftover reference cleaned: `xEventManager.TriggerLayoutChange` had a stray `xOptions.Transform.OffsetElement = null;` that needed removing after the xTransform cluster was deleted.
- Object.assign + export lists pruned to match the surviving symbol set.

### `EarthMap.js` split

- **`assets/earth-map-data.js`** (new, 4 lines wrapping a 12.8 KB literal) — extracted the entire `ContinentList: [...]` polygon data (5 continents, ~30 lands with PolyX/PolyY arrays + lakes). Loaded immediately after `EarthMap.js` in `main-v2.js`; assigns `EarthMap.ContinentList = [...]`.
- `EarthMap.js` itself stays at 45 lines but now contains only the drawing methods + config (`SetWaterColor`, `SetLakeColor`, `SetContinentColor`, `SetLandColor`, `DrawGlobe`, `DrawFlatEarth`, `PointOnGlobe`, etc.) with `ContinentList: []` as an empty placeholder.

### `NumFormatter.js` deleted

- 88-line module had zero external references across the entire codebase. DataX's `FormatNum` is its own internal method, not from this file. Import removed from `main-v2.js`; file deleted.

### Inline `onclick` removed (last inline JS)

- **`js/ui/save-restore.js`** (new, 13 lines) — wires the four save-restore panel buttons (Get App State, Get App URL, Set App State, Clear) via `addEventListener`, following the existing `init()`/`sync()` contract of the other `js/ui/*.js` modules.
- `index.html`: the four buttons now use `id="sr-get-state"` / `sr-get-url` / `sr-set-state` / `sr-clear` instead of inline `onclick="DataX..."` attributes. No inline JS attributes remain anywhere.
- `js/ui.js`: imports the new module and adds it to `MODULES`.

### Save/restore panel: verified live

- `index.html` has `<details class="save-restore">` with `#SaveRestorePanel` textarea + screenshot button.
- `app.js` calls `DataX.AssignSaveRestoreDomObj('SaveRestorePanel')` which attaches a keydown(Enter)→`SetAppState` handler and restores from the `FeDomeAppAppState` cookie on page load.
- DataX uses `xTextControl` from `assets/xtc.js`; both kept.

### Net result

| File | Before | After | Δ |
|---|---:|---:|---:|
| `assets/app.js` | 3232 | 453 | −86% |
| `assets/wiki.js` | 920 | 424 | −54% |
| `assets/NumFormatter.js` | 88 | (deleted) | — |
| **New** `assets/demos-data.js` | — | 1230 | — |
| **New** `assets/app-draw.js` | — | 1009 | — |
| **New** `assets/demos-manager.js` | — | 401 | — |
| **New** `assets/app-math.js` | — | 164 | — |
| **New** `assets/earth-map-data.js` | — | 4 | — |
| **New** `js/ui/save-restore.js` | — | 13 | — |

All files pass `node --check`. Behavior verified by user (date/time playback, layer toggles, ray controls, calendar widget, save/restore, screenshot export).

### wiki.js — 29 more dead helpers removed (2026-05-18)

Second pass after the big Phase 8 cleanup. Cross-grepped each helper for external + internal usage; deleted only true leaves with no callers.

- Deleted: `xMoveTo`, `xLeft`, `xTop`, `xOpacity`, `xResizeTo`, `xVisibility`, `xShow`, `xHide`, `xDisplay`, `xIsDisplayed`, `xCreateTextNode`, `xAppendChild`, `xInsertBefore`, `xRemoveChild`, `xChildNodes`, `xHasChildNodes`, `xElementWidth`, `xElementHeight`, `xNaturalWidth`, `xNaturalHeight`, `xScrollWidth`, `xScrollHeight`, `xClientWidth`, `xClientHeight`, `xTagName`, `xZIndex`, `xCursor`, `xGetFirst`, `xArrayMap` — 29 leaf helpers, all `ext=0` and only their own declaration/export bookkeeping inside wiki.js.
- Kept (still kept alive by internal callers): `xPageX`/`xPageY`/`xScrollLeft`/`xScrollTop` (used by `xEvent.Init` mouse wrapper), `xFStr` (used by `CImgCache.GetStatus`), `xMaskRegExp`/`xIsRoot`/`xIsElementAndNotRoot` (used by `xHasClass`/`xAddClass`/`xRemoveClass` + `xPageX`/`xPageY`).
- File: 424 → 364 lines (−60). Object.assign and export lists pruned to match. Cross-codebase grep confirmed no residual references.

---

## Phase 9 — Tabs.js deletion (2026-05-24)

`assets/Tabs.js` (Walter's 17 KB minified tab-system library, ~570 LOC) deleted. Every `<li>` in `#DomeDemoTabs` carried the `TabButton` class, so `CollectTabDoms` always returned an empty list, `Select()` was never reachable from a click, and the whole `BoxTab` / `BoxData` / `TabSelected` state machine was dead. Only `Tabs.AddButtonClickHandler` was actually being called — 8 sites in `demos-manager.js`.

### Changes

- **`assets/Tabs.js`** — deleted.
- **`js/main-v2.js`** — `import '../assets/Tabs.js'` removed.
- **`assets/demos-manager.js`** — added an 8-line `wireButton(id, fn)` helper (gated on `TabEnabled` class, same semantics as the old `Tabs` click gate). The two deferred-init blocks (`xOnLoad` + `xOnDomReady`) collapsed into a single `xOnDomReady` block now that there's no `Tabs.Init()` to wait for. The 8 `Tabs.AddButtonClickHandler(...)` calls became direct `wireButton(...)` calls.
- **Aria-selected sync** — added `syncDemoAriaSelected(activeName)` helper, called from both branches of `UpdateDemoPanels`. The active demo's `<li>` now flips to `aria-selected="true"`; siblings flip to `"false"`. Replaces the `MutationObserver` in `js/ui.js` that watched for `TabSelected` (which was never added, so the observer was a no-op).
- **`js/ui.js`** — the dead `MutationObserver` block removed.
- **`css/styles.css`** — `.TabSelectors li.TabSelected` selector (dead, since `TabSelected` was never applied) → `.TabSelectors li[aria-selected="true"]`. Now the active demo lights up in accent color, which the original `TabSelected` rule was clearly intended to do.
- **`index.html`** + **`css/styles.css`** — comments referencing "Tabs.js" rewritten.

### Verification

- `node --check` passes on `demos-manager.js`, `ui.js`, `main-v2.js`.
- No references to `Tabs` remain in the active codebase (only historical references in `roadmap/DONE.md` and `roadmap/GUIDE.md`).
- `TabEnabled`, `TabActive`, `TabHide`, `TabButton`, `TabPrimary`, `TabSelectors` class names retained — they're CSS hooks still manipulated by `demos-manager.js` and the original Tabs styling stays.

---

## Phase 9b — wiki.js third pruning pass (2026-05-24)

After dropping Tabs.js (which was the last consumer of several wiki helpers and the whole `LayoutChange`/`WindowResize`/`DisplayChange` event-manager cluster), a cross-codebase grep surfaced another batch of orphan symbols. Cross-checked each against `assets/*.js`, `js/*.js`, and `index.html` before removing.

### Removed

**Predicates / type-guard helpers (0 ext refs):** `xArgsToArray`, `xInnerText`, `xGetAll`, `xGetByTag`, `xGetByClass`, `xToggleClass`, `xSetClassIf`, `xSetEnabled`, `xSetDisabled`.

**Lifecycle wrappers (0 ext refs):** `xOnUnload`, `xImgOnLoad`, `xEvent.prototype.StopPropagation`.

**Event-manager cluster (0 ext refs — all dead after Tabs.js deletion):**
- `xAddEventLayoutChange`, `xRemoveEventLayoutChange`, `xTriggerEventLayoutChange`
- `xAddEventDisplayChange`, `xRemoveEventDisplayChange`, `xTriggerEventDisplayChange`
- `xAddEventWindowResize`, `xRemoveEventWindowResize`
- `xEventManager`'s `LayoutChangeHandlers`/`MyLayoutChangeHandler`/`LayoutChangeTimer`/`LayoutChangeTimerDelay`/`WindowResizeHandlers`/`WindowResizeTimer`/`MyWindowResizeHandler`/`DisplayChangeHandlers`/`PageUnloadHandlers`/`OldWindowOnUnloadHandler`/`MyPageUnloadHandler`/`AddLayoutChangeHandler`/`RemoveLayoutChangeHandler`/`TriggerLayoutChange`/`AddWindowResizeHandler`/`RemoveWindowResizeHandler`/`TriggerWindowResize`/`AddDisplayChangeHandler`/`RemoveDisplayChangeHandler`/`TriggerDisplayChange`/`AddPageUnloadHandler`/`RemovePageUnloadHander`/`TriggerPageUnload`/`RemovePageLoadHander`/`TriggerPageLoad`/`RemoveDomReadyHandler`

The IE-only fallback paths (`document.addEventListener` else `this.DomReadyHandlers.Add(...)`, `xDef(e.currentStyle)` browser-quirk branches) were collapsed since the codebase already targets modern browsers (uses `ResizeObserver`, `classList`, `CSS custom properties`).

### Kept (still have callers)

- `xFuncOrNull` — used by `jsgx3d.js` (`SetAll`) + transitively by `xDefFuncOrNull` (used by `ModelAnimation.js`)
- `xObjOrNull` — used by `DataX.js` (type-match `'obj'`)
- `xDefObjOrNull` — used by `jsgx3d.js` (`JsgPolyListIter`)
- `xDefAnyOrNull` — used by `jsg.js` (`SetDrawFunc`)
- `xDefFuncOrNull` — used by `ModelAnimation.js`
- `xCreateElement` — used by `jsg.js` (`JsgSnapshot`)
- `xWidth`/`xHeight`/`xGetCS`/`xSetCW`/`xSetCH` — used by `jsg.js` resize handling
- `xStyle` — used by `jsg.js`
- `xIsNumeric` — used by `jsg.js` (`IsNumericPercent`)

### Result

`wiki.js`: 364 → 336 lines (-7%). Symbol-count drop is bigger than the line drop because the legacy minified `xEventManager` was rewritten as a clean multi-line block (more readable but more lines per remaining symbol). `node --check assets/wiki.js` passes; `grep -rE` confirms 0 references to any removed symbol in the rest of the codebase.

---

## Phase 9c — Library reformatting + `reurn` typo fix (2026-05-24)

### Library-code reformatting

The five "minified library" files listed in TODO.md as readability nibbles got reformatted in this pass (multi-line, with whitespace). No behavior changes; just readable. `node --check` passes on each.

| File | Before | After |
|---|---:|---:|
| `assets/DataX.js` | 43 | 125 |
| `assets/EarthMap.js` | 45 | 95 |
| `assets/ModelAnimation.js` | 148 | 242 |
| `assets/jsg.js` | 665 | 1073 |
| `assets/jsgx3d.js` | 267 | 459 |
| `assets/jsgMouseHandler.js` | 37 | 61 |

### `Demos.AddAnimation` typo fix

`assets/demos-manager.js:177` had `if (!anim) reurn;` — a typo present since the initial Walter port. This meant any custom-demo `AddAnimation()` call without an active `CurrModAnim` would throw `ReferenceError: reurn is not defined` instead of returning early. Fixed to `return`. The built-in demos all set `CurrModAnim` via `Demos.New()` before calling `AddAnimation`, so the bug only fires from custom/user-defined demos — which is presumably why it survived this long.

---

## Phase 10 — Latent-bug sweep + polyfill removal + dead-state cleanup (2026-05-24)

### Latent bug fixes (2 typos that silently misbehaved)

- **`xCallbackChain.prototype.Add`** ([assets/wiki.js:172](assets/wiki.js#L172)): `this.Containes(aFunc)` → `this.Contains(aFunc)`. Original would throw `TypeError: this.Containes is not a function` on the rare `once=true` path. Gated by `if (once && ...)` short-circuit, so it never fired in practice (no current caller passes `once=true`), but the dedup-once semantics are now actually wired.
- **`xArrFind` / `xArrFindIndex`** ([assets/wiki.js:27](assets/wiki.js#L27), [:32](assets/wiki.js#L32)): `arguments.lenth` (sic) → `arguments.length`. The `thisArg` parameter was silently ignored — `t` always stayed `undefined`, so callbacks ran with default `this`. No caller passes `thisArg` today, but the helper now actually respects the documented 4th arg.

### Modern-browser polyfills removed from wiki.js

Three IE-era polyfills targeting browsers older than anything the rest of the codebase assumes (it already uses `ResizeObserver`, `MutationObserver`, `classList`, CSS custom properties — all post-IE features):

- `requestAnimationFrame` / `cancelAnimationFrame` vendor-prefix loop + `setTimeout(16ms)` fallback IIFE
- `Object.create` shim
- `Math.log10` shim

Total ~15 lines of dead defensive code.

### `Function.prototype.inheritsFrom` inlined

The only caller was `assets/jsgx3d.js:145`. Replaced the global `Function.prototype` pollution with the three-line equivalent at the call site:

```js
JsGraphX3D.prototype = Object.create(JsGraph.prototype);
JsGraphX3D.prototype.constructor = JsGraphX3D;
JsGraphX3D.prototype.parentClass = JsGraph.prototype;
```

`parentClass` is still referenced by `jsgx3d.js:141` (`this.parentClass.constructor.call(this, aParams)`), so it has to stay on the prototype.

### `UpdateAll(stopAnimation)` — 2-arg callers cleaned up

The function declares one parameter (`stopAnimation`), but 5 call sites passed two — the second was always silently dropped. Removed the trailing dead arg from:

- `assets/app.js` × 4 — `UpdateAll(true, false)` / `UpdateAll(false, false)` / `UpdateAll(true, true)` → 1-arg form
- `assets/demos-manager.js` × 1 — same

### Dead state: `TabActive` class + `Demos.LastDemo` field

The `TabActive` class was set/cleared on the active demo button and the play button by `Demos.UpdateDemoPanels`, but no CSS rule targeted it — visually invisible since the initial port. Verified via grep: the class is never read by JS either. Dropped all `xAddClass(..., 'TabActive')` / `xRemoveClass(..., 'TabActive')` toggles from `demos-manager.js` (5 sites). The active demo is already indicated via `aria-selected="true"` + the matching CSS rule (Phase 9).

`Demos.LastDemo` was assigned in `Reset()` and `SetNewDemo()` and cleared in `UpdateDemoPanels()`, but never read. Pure write-only state. Dropped the field declaration + the 3 assignment sites.

`Demos.UpdateDemoPanels` body shrunk from 42 lines to 26 lines in the process (collapsed nested if/else into ternaries now that the duplicate `TabActive` branches are gone).

### Gesture hint: corrected + touch-aware

The hint pill in `index.html` said "Left-drag · Right-drag: observer position · Scroll: zoom". `FeDomeApp.OnMouseMove` actually distinguishes `event.ctrlKey`, not the mouse button — so "Right-drag" was just wrong. Fixed to "Ctrl-drag" for the observer-position gesture.

Single-finger touch already routes through `jsgMouseHandler.OnTouchStart/Move/End` → same rotate-camera path as left-drag. Multi-touch and `wheel` events have no touch equivalent. New hint structure:

```html
<span>Drag: rotate</span><span class="gh-fine"> · Ctrl-drag: observer position · Scroll: zoom</span>
```

CSS rule `@media (hover: none) and (pointer: coarse) { .gh-fine { display: none; } }` hides the modifier + scroll segment on touch devices.

While at it, moved the gesture-hint's inline `style="…"` block out of `index.html` and into `css/styles.css` (`#gesture-hint { … }`). All inline styles gone.

### Result

| File | Before | After |
|---|---:|---:|
| `assets/wiki.js` | 336 | 320 |
| `assets/demos-manager.js` | 386 | 366 |

`node --check` passes on every touched JS file. No remaining references to dropped symbols anywhere.
