import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    // Third-party wabis framework is opaque (re-synced upstream). fed app code is
    // linted in a later phase; edc app code is linted (see block below).
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/*.d.ts", // ambient type declarations (e.g. wabis.d.ts) — not lint targets
      "packages/jsgraph-vendor/**",
      "apps/**/vendor/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Node-run dev scripts (codemods, etc.).
    files: ["tools/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  {
    // edc app code: enforce real module boundaries. `no-undef` flags any symbol
    // that is neither imported nor a declared global — catching missing imports.
    // Declared globals = browser + the wabis vendor surface (resolved at runtime)
    // + foundational shared helpers + the two vendor-string-bound models (bridge).
    files: ["apps/curvature-drop-calc/app/**/*.js", "apps/curvature-drop-calc/js/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        // wabis vendor surface (resolved at runtime; vendor is opaque).
        ControlPanels: "readonly", DataX: "readonly", JsgMat3: "readonly",
        JsgVect3: "readonly", NumFormatter: "readonly", Tabs: "readonly",
        Animations: "readonly", MEDIA_FOLDER: "readonly", DeviceRatio_Off: "readonly",
        xDefNum: "readonly", xOnLoad: "readonly",
        // Foundational shared helpers + physical constants (helpers.js / constants.js)
        // — a deliberate "platform" layer: shared primitives loaded first, used
        // everywhere. Kept global (not imported into every module) on purpose.
        toRad: "readonly", toDeg: "readonly", ToRad: "readonly", ToDeg: "readonly",
        sqr: "readonly", Limit1: "readonly", Limit01: "readonly", ToRange: "readonly",
        PI90: "readonly", DefaultDigits: "readonly", SENSOR_DIAGONAL_35MM: "readonly",
        REFR_COEFF_CONST: "readonly", STD_TEMP_GRADIENT: "readonly", KELVIN_OFFSET: "readonly",
        FOCAL_LENGTH_MIN: "readonly", FOCAL_LENGTH_MAX: "readonly",
        VIEW_ANGLE_MIN: "readonly", VIEW_ANGLE_MAX: "readonly",
        TILT_MIN: "readonly", TILT_MAX: "readonly", PAN_MIN: "readonly", PAN_MAX: "readonly",
        HEIGHT_MIN: "readonly", HEIGHT_MAX: "readonly", EARTH_RADIUS_MIN: "readonly",
        OBJ_SIZE_MIN: "readonly", OBJ_SIZE_MAX: "readonly", OBJ_DELTA_DIST_MIN: "readonly",
        TEMP_K_MIN: "readonly", TEMP_K_MAX: "readonly",
        PRESSURE_MIN_MBAR: "readonly", PRESSURE_MAX_MBAR: "readonly",
        // App runtime singletons / composition root (the global app instance, its
        // graph, the draw + update wiring, panel handlers). These ARE the app's
        // global composition; kept explicit-global rather than threaded by import.
        CurveAppClass: "readonly", CurveAppMetaData: "readonly",
        graph: "writable", DrawModel: "readonly",
        UpdateAll: "readonly", UpdateAllRunning: "writable", UpdateAllChanged: "writable",
        DrawObjectsBeforeHorizon: "readonly", DrawObjectsBehindHorizon: "readonly",
        PointOnEarth: "readonly", PointOnPlane: "readonly", SetTrans: "readonly",
        DrawShape: "readonly", DrawShapeVariants: "readonly",
        ResetApp: "readonly", SetStdRefraction: "readonly", Set0Refraction: "readonly",
        HandleUrlCommands: "readonly", UpdateLengthModel: "readonly",
        CLengthModel: "readonly", BaroConst: "readonly", ConvertUnit: "readonly",
        BaroModel: "readonly",
        // DIP seam (jsgraph-vendor/src/core/wabisGraph3D.js) — apps depend on this,
        // not on the wabis NewGraphX3D global.
        createGraph3D: "readonly",
        // Bridge: the wabis ControlPanel resolves these model names from strings
        // (ModelRef: 'CurveApp' / 'LengthModel'), so they must stay global.
        CurveApp: "writable", LengthModel: "writable",
      },
    },
    rules: {
      // The point of linting app code is `no-undef` (the module-boundary net).
      // The rest of the wabis-legacy style is out of scope here, so silence it.
      "no-undef": "error",
      // The point of linting app code is `no-undef` (the module-boundary net).
      // The wabis-legacy style/quality rules are out of scope here.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "no-redeclare": "off",
      "no-var": "off",
      "no-empty": "off",
      "no-constant-condition": "off",
      "no-constant-binary-expression": "off",
    },
  },
  {
    // fed app code: same module-boundary contract. fed's model FeDomeApp is one
    // cohesive object that app.js / app-math.js / app-draw.js extend via
    // Object.assign(FeDomeApp, {...}) — a deliberate method-partial layout, kept
    // as-is. Declared globals = browser + wabis vendor + shared helpers + the
    // fed runtime singletons.
    files: ["apps/fed-wabis/assets/**/*.js", "apps/fed-wabis/js/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        // wabis vendor surface (graph engine, jsg geometry types, x* DOM helpers).
        NewGraphX3D: "readonly", JsgMat3: "readonly", JsgVect3: "readonly",
        JsgVect2: "readonly", JsgColor: "readonly", JsgPlane: "readonly",
        JsgPolygon: "readonly", JsgPolygonList: "readonly",
        NumFormatter: "readonly", DataX: "readonly", Animations: "readonly",
        ModelAnimation: "readonly", NewModelAnimation: "readonly",
        CreateDomObjects: "readonly", addWheelListener: "readonly", ThisPageUrl: "readonly",
        xDef: "readonly", xDefBool: "readonly", xDefNum: "readonly", xDefObj: "readonly",
        xDefStr: "readonly", xStr: "readonly", xNum: "readonly", xFunc: "readonly",
        xArray: "readonly", xInnerHTML: "readonly", xAddClass: "readonly",
        xRemoveClass: "readonly", xOnLoad: "readonly", xOnDomReady: "readonly",
        // Shared helpers (jsgraph-vendor/src/core/helpers.js).
        toRad: "readonly", toDeg: "readonly", ToRad: "readonly", ToDeg: "readonly",
        sqr: "readonly", Limit1: "readonly", Limit01: "readonly", ToRange: "readonly",
        // fed runtime singletons / cohesive model + handlers + standalone helpers.
        FeDomeApp: "writable", EarthMap: "readonly", JsgMouseHandler: "readonly",
        Demos: "readonly", AnimationSpeed: "writable", EarthMapData: "readonly",
        ResetApp: "readonly", UpdateAll: "readonly", TFE: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      // The point of linting app code is `no-undef` (the module-boundary net).
      // The wabis-legacy style/quality rules are out of scope here.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "no-redeclare": "off",
      "no-var": "off",
      "no-empty": "off",
      "no-constant-condition": "off",
      "no-constant-binary-expression": "off",
    },
  },
);
