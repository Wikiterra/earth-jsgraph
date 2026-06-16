# Advanced Earth Curvature Calculator — Refactored

Refactor of [walter.bislins.ch/CurveCalc](http://walter.bislins.ch/CurveCalc)
into a clean, file-based architecture. The original was a single saved wiki
page: ~5000 lines of HTML with ~2000 lines of inline `<script>` and ~3500
lines of mixed vendor libraries.

To open: load `index.html` directly in a browser (no build step).

## Architecture

```
src/
├── index.html               Calculator-only HTML, no wiki chrome.
├── README.md                This file.
├── assets/                  PNG/GIF images for the bottom reference tabs.
├── styles/
│   └── calculator.css       Layout + colour overrides specific to the calculator.
├── vendor/                  Untouched libraries by walter.bislins.ch.
│   ├── wiki.js                Generic helpers (xGet, xAddEvent, xOnLoad, ...).
│   ├── jsg.js                 2D graphics engine (JsGraph, JsgVect2, JsgColor, ...).
│   ├── jsgx3d.js              3D extension on top of jsg.js (NewGraphX3D, JsgVect3).
│   ├── NumFormatter.js        Number/DMS/HMS formatting with locale.
│   ├── Slider.js              Drag-and-drop slider widget.
│   ├── ControlPanel.js        Declarative ControlPanels form system.
│   ├── Tabs.js                Tab selector / tab box system.
│   ├── DataX.js               JSON + URL-fragment serialization for app state.
│   ├── xtc.js                 Cross-browser text-control wrapper.
│   ├── ModelAnimation.js      Animation timer for keyframe playback.
│   └── styles.css             Vendor base styles (typography, panels, sliders, tabs).
│
└── app/                     The calculator's own code, refactored into modules.
    ├── core/
    │   ├── constants.js       DefaultDigits, DeviceRatio_Off, PI90, toRad, toDeg.
    │   ├── metadata.js        CurveAppMetaData (property list for DataX).
    │   ├── curveApp.js        CurveAppClass — the data model + Update() math engine.
    │   ├── setup.js           Instantiates `var CurveApp`, registers it with DataX,
    │   │                      defines UpdateAll / UpdateAllChanged.
    │   ├── units.js           LVal/LUnit/HVal/HUnit/BVal/BUnit/AVal/AUnit
    │   │                      unit-conversion helpers used by panels.
    │   └── init.js            xOnLoad handler: wires top-bar buttons (Reset,
    │                          Std refraction, Zero refraction), restores URL
    │                          state, triggers first redraw.
    │
    ├── render/
    │   ├── sceneRenderer.js   `var graph = NewGraphX3D(...)` + DrawModel(g) —
    │   │                      draws earth/sky, horizon, eye-level, grid lines.
    │   └── objectRenderer.js  Draws the target objects (M-rods / mountains /
    │                          variants) on both globe and flat-earth models.
    │
    └── panels/                One file per UI panel. Each runs inline in the
        │                      body and uses `document.writeln` (via .Render())
        │                      to inject its DOM where the <script> tag sits.
        ├── basics.js          Basics + global Options (Model / Camera / Show Data).
        ├── view.js            View panel (Pan / Tilt / Roll / scene size).
        ├── obj1.js            Target 1 sliders.
        ├── obj1Options.js     Target 1 options (count, type, distribution).
        ├── obj2.js            Target 2 sliders.
        ├── obj2Options.js     Target 2 options.
        ├── refraction.js      Refraction panel (k / dT/dh / T / P / R').
        ├── refractionHandlers.js  Std/Zero refraction button helpers.
        ├── units.js           Units panel (Metric / Imperial).
        ├── saveRestore.js     URL state Save/Restore + ResetApp/Set*Refraction
        │                      / HandleUrlCommands (referenced by init.js).
        ├── saveRestoreHandlers.js  Wire-up handlers for Save/Restore buttons.
        ├── targetData.js      Read-only Nearest Target Data panel.
        └── horizonData.js     Read-only Horizon Data panel.
```

## Script load order

The original page worked because every script was inline and parsed in DOM
order. The refactored `index.html` keeps that semantic by using non-`async`,
non-`defer` `<script src=...>` tags loaded in this order:

1. **`<head>`**
   1. `NUMBER_FORMATING` and a handful of wiki globals (defined inline).
   2. CSS: `vendor/styles.css` → `styles/calculator.css`.
   3. Vendor libraries (wiki, jsg, jsgx3d, NumFormatter, Slider, ControlPanel,
      Tabs, DataX, xtc, ModelAnimation).
   4. App core that does **not** touch the DOM: `constants → metadata →
      curveApp → setup → units`.

2. **`<body>`**
   1. `render/sceneRenderer.js` — calls `NewGraphX3D` which `document.writeln`s
      the `<canvas id="JsGraph1">` at this position.
   2. `render/objectRenderer.js` — pure function definitions used by DrawModel.
   3. Tab selectors UL (settings tabs).
   4. TabBoxes wrapper with **one `<script src="app/panels/*.js">` per tab**.
      Each panel script uses `ControlPanels.NewPanel(...).Render()` which
      `document.writeln`s the panel table where the script tag sits.
   5. Read-only data panels (Nearest Target, Horizon).
   6. Reference image tabs (Angles / NoRefraction / Refraction).
   7. `app/core/init.js` — `xOnLoad` handler that fires once the DOM is ready.

Because each panel script is **synchronously loaded** at its DOM position, the
`document.writeln` calls inside the existing `ControlPanel.Render()` still
work without modifying the vendor library. The trade-off is that this design
relies on parser-time script execution; switching to `defer` or to ES modules
would require replacing every `Render()` with an explicit container append.

## What was dropped from the original

The original was a saved wiki page. Everything outside the calculator itself
was removed:

- Wiki layout chrome: sidebar, navigation, branding, footer, breadcrumb.
- Blog metadata, comments form, "Show Tutorial" collapsible.
- ~150 KB of MathJax-rendered SVG equations + the MathJax runtime
  (`MathJax.js`) — these were documentation, not calculator behaviour.
- The "Parameter Descriptions" prose section after the calculator.
- The duplicated rendered DOM that the saved page captured next to each
  `document.writeln`-driven panel: the scripts regenerate this DOM at load.

## What was preserved

- All calculator inputs, sliders, panels, data fields, refraction modes.
- All graph rendering (3D earth/sky + objects + horizon).
- URL state save/restore (DataX, `#App?...` fragment).
- Both globe / flat-earth / both-models display modes.
- The three reference image tabs at the bottom.

## Vendor libraries

The libraries under `vendor/` are kept **bit-for-bit identical** to the
originals shipped with the saved page. They are dense (one-line-per-method)
code that ships internally consistent algorithms (2D / 3D math, slider
hit-testing, DataX URL encoding). Re-formatting them would be cosmetic and
risky without a test suite — the refactor focused effort on the
calculator-specific code (`app/`), where the value is high and the surface
area is well understood.

If you ever need to read a vendor file: open it in an editor with a JS
beautifier (`prettier --parser babel`, VS Code's "Format Document", etc.).
The semantics will not change.
