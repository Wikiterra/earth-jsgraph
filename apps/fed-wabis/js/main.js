// ES module entry point — v2 native modules (no bundler)
// Imports run in declaration order; each file also assigns its exports to globalThis.
//
// The shared wabis framework now lives in the workspace package `jsgraph-vendor`
// (single canonical copy). App-specific framework files (jsgMouseHandler, EarthMap)
// stay local. Load order is preserved exactly as before.

import 'jsgraph-vendor/src/wiki.js';
import 'jsgraph-vendor/src/xtc.js';

// --- shared helpers (toRad/ToRad, toDeg/ToDeg, sqr, Limit1, Limit01, ToRange) ---
import 'jsgraph-vendor/src/core/helpers.js';

// --- shared UI components (app-shell nav) ---
import 'jsgraph-vendor/src/core/shared.css';

import 'jsgraph-vendor/src/jsg.js';
import 'jsgraph-vendor/src/jsgx3d.js';
import '../app/jsgMouseHandler.js';
import '../app/EarthMap.js';
import '../app/earth-map-data.js';
import 'jsgraph-vendor/src/DataX.js';
import 'jsgraph-vendor/src/ModelAnimation.js';
import '../app/app.js';
import '../app/app-math.js';
import '../app/app-draw.js';
import '../app/demos-manager.js';
import '../app/demos-data.js';
import './ui.js';

// shared top nav / app-switcher (branding + link to the other app)
import 'jsgraph-vendor/src/core/appShell.js';
