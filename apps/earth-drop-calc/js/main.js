// ES module entry for earth-drop-calc (mirrors fed-wabis-v2/js/main-v2.js).
// Replaces ~21 classic <script> tags. Each file runs for its side effects and
// publishes its globals via Object.assign(globalThis, …) (vendor + app alike),
// so the legacy global-based code keeps working under module scope.
//
// Load order is the original page order. Bare specifiers resolve to the workspace
// package (Vite/pnpm), so there is no ../../packages path and Vite bundles it all.

// --- wabis framework (vendor) ---
import 'jsgraph-vendor/src/wiki.js';
import 'jsgraph-vendor/src/jsg.js';
import 'jsgraph-vendor/src/jsgx3d.js';
import 'jsgraph-vendor/src/NumFormatter.js';
import 'jsgraph-vendor/src/Slider.js';
import 'jsgraph-vendor/src/ControlPanel.js';
import 'jsgraph-vendor/src/Tabs.js';
import 'jsgraph-vendor/src/DataX.js';
import 'jsgraph-vendor/src/xtc.js';
import 'jsgraph-vendor/src/ModelAnimation.js';
import 'jsgraph-vendor/src/core/tokens.css'; // shared design tokens (load first)
import 'jsgraph-vendor/src/styles.css';

// --- shared helpers (toRad, toDeg, sqr, Limit1, …) ---
import 'jsgraph-vendor/src/core/helpers.js';

// --- shared UI components (tabs, control panels, sliders, scrollers) ---
import 'jsgraph-vendor/src/core/shared.css';

// --- app styles: LAST CSS layer so calc overrides win (see calculator.css) ---
import '../styles/calculator.css';

// --- core seam (createGraph3D over NewGraphX3D) ---
import 'jsgraph-vendor/src/core/wabisGraph3D.js';

// --- app core ---
// physics.js, sliderMapping.js and units.js are not listed here: they `export`
// their functions and are imported directly by their consumers (curveApp imports
// physics + sliderMapping; the renderers import units), so the import graph loads
// them. Only modules that nothing imports are rooted here.
import '../app/core/constants.js';
import '../app/core/metadata.js';
import '../app/core/curveApp.js';
import '../app/core/setup.js';

// --- render ---
import '../app/render/sceneRenderer.js';
import '../app/render/objectRenderer.js';

// --- panels (render into their #panel-* containers via ControlPanel.RenderInto) ---
import '../app/panels/basics.js';
import '../app/panels/view.js';
import '../app/panels/objectPanels.js';
import '../app/panels/refraction.js';
import '../app/panels/refractionHandlers.js';
import '../app/panels/units.js';
import '../app/panels/saveRestore.js';
import '../app/panels/saveRestoreHandlers.js';
import '../app/panels/targetData.js';
import '../app/panels/horizonData.js';

// --- DOM-ready bootstrap (wires tabs, restores URL state, first UpdateAll) ---
import '../app/core/init.js';

// --- Panel drawer UI ---
import './ui.js';

// shared top nav / app-switcher (branding + link to the other app)
import 'jsgraph-vendor/src/core/appShell.js';
