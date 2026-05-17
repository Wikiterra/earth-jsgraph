# FED v2 — Pending Work

Constraints: v2 only (do not touch `fed-wabis-v3/`); no external libraries or frameworks.

Completed items are recorded in [DONE.md](DONE.md). The pending list below covers the next refactor surface.

## Future cleanup candidates

- [ ] **`wiki.js` (~595 lines)** — large block of clearly-irrelevant code (`WikiMenuBarHandling`, `MarkSearch`+`highlightWord`+`highlightRegExp`+`ToggleMarks`, `OnOffSections`, `UrlParams`, `LayoutMaximize`/`Normal`/`Fullscreen*`, `Zoom`/`CZoom`, `CProgressbar`, `EditPage`/`ShowUploadForm`/`ShowWikiFunctions`, `MarkupMathText`/`ProcessMathText`, `AddToCookie`/`AddCBReq`, `xGreek*`, `xDebug`/`xLog`/`xDbg*`, `xClipboard*`, `xImage`/`xChangeImage`/`xMultiImage`, `xSetCookie`/`xGetCookie`/`xDeleteCookie`, `xTimeMS`, `xOptions`). Auto-init handlers at the end (`xOnDomReady(InitWikiJS)` registers wiki keyboard shortcuts; `xOnDomReady`/`xOnLoad` for `WikiMenuBarHandling.Init`+`UrlParams.Parse`+`OnOffSections.HandleUrlParameters`+`MarkSearch`) fire on every page load with no useful effect. Risk: file is minified single-line, surgical edits are error-prone — best handled by reformatting wiki.js first, then deleting blocks.
- [ ] **`Tabs.js`** — minified engine drives demo selection. Replace with a small handwritten tab state manager once the demo task-list format is reworked.
- [ ] **`jsg.js` + `jsgx3d.js`** — Walter's custom 2D canvas API (~900 lines). No replacement planned; keep as-is.
- [ ] **`app.js` (3232 lines)** — main module is still monolithic. Candidates to extract if appetite returns: `Demos` registry, `FeDomeApp.Draw*` methods, demo task helpers (`Tpse`/`Ttxt`/`Tpnt`/`Tval`).
- [ ] **`save-restore` panel** — DataX-driven; uses `#SaveRestorePanel` textarea + buttons. Confirm it still works after recent deletions; if so, document; if not, decide whether to keep or remove.
