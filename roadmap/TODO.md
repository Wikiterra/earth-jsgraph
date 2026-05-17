# FED v2 — Pending Work

Constraints: v2 only (do not touch `fed-wabis-v3/`); no external libraries or frameworks.

Completed items are recorded in [DONE.md](DONE.md). The pending list below covers the next refactor surface.

## Future cleanup candidates

- [x] **`wiki.js` (920 → 424 lines)** — deleted `WikiMenuBarHandling`, `MarkSearch`/`highlightWord`/`highlightRegExp`/`DoMarkSearch`/`ToggleMarks`, `OnOffSections`, wiki.js's own `UrlParams` (DataX has its own), `LayoutMaximize`/`Normal`/`Fullscreen*`/`IsLayout*`, `Zoom`/`CZoom` (+ all `Zoom*` shims), `CProgressbar`/`Progressbar`, `EditPage`/`ShowUploadForm`/`ShowWikiFunctions`/`OnDocKeyDown`/`UrlEncode`/`Trim`/`OnDblCklick`/`InitWikiJS`, `MarkupMathText`/`ProcessMathText`, `AddToCookie`/`AddCBReq`/`SEL`/`SplitWords`/`decodeHtml`, `xGreek*`, `xDebug`/`xDebugOutId`/`xClearLog`/`xDbg*`, `xClipboard*`, `xImage`/`xChangeImage`/`xMultiImage`, `htmlString`, and the `xOptions`+`xTransform*` cluster. Kept `xSetCookie`/`xGetCookie`/`xDeleteCookie` (DataX), `xTimeMS` (ModelAnimation), `CImgCache`+`IC` (jsg.js); `xLog` stubbed to no-op since `CImgCache.DisplayStatus` calls it. One leftover ref to `xOptions.Transform.OffsetElement` in `xEventManager.TriggerLayoutChange` cleared.
- [ ] **`Tabs.js`** — minified engine drives demo selection. Replace with a small handwritten tab state manager once the demo task-list format is reworked.
- [ ] **`jsg.js` + `jsgx3d.js`** — Walter's custom 2D canvas API (~900 lines). No replacement planned; keep as-is.
- [ ] **`app.js` (~1010 lines)** — main module further trimmed. Demo task helpers + `Demos.AddState`/`AddDemo` payloads → `assets/demos-data.js`; `FeDomeApp.Draw*` methods (incl. `DateTimeToString`) → `assets/app-draw.js` via `Object.assign(FeDomeApp, {...})`. Remaining extraction candidate: the `Demos` manager (~400 lines, lines 600–1000 of current app.js).
- [ ] **`save-restore` panel** — DataX-driven; uses `#SaveRestorePanel` textarea + buttons. Confirm it still works after recent deletions; if so, document; if not, decide whether to keep or remove.
