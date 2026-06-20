// =============================================================================
// constants.js - Shared constants and trig helpers used across the calculator
//
// Physical constants:
//   SENSOR_DIAGONAL_35MM — diagonal of a 35 mm full-frame sensor (43.2 mm).
//                          Used to convert focal length to view angle and back.
//   REFR_COEFF_CONST     — 503 K/mb, from the Edlén formula for refractive index
//                          of air: n ≈ 1 + 503·P/T² · (0.0343 + dT/dh).
//                          See curveApp.js for the full formula.
//   STD_TEMP_GRADIENT    — 0.0343 K/m, the ICAO standard atmosphere lapse rate.
//   KELVIN_OFFSET        — 273.15, Celsius → Kelvin conversion.
//   FOCAL_LENGTH_MIN     — 21 mm, minimum focal length for the slider range.
//   FOCAL_LENGTH_MAX     — 10000 mm, maximum focal length for the slider range.
//   VIEW_ANGLE_MIN       — 0.1 °, minimum view angle clamp.
//   VIEW_ANGLE_MAX       — 160 °, maximum view angle clamp.
//   TILT_MIN             — -85 °, minimum tilt.
//   TILT_MAX             — 45 °, maximum tilt.
//   PAN_MIN              — -180 °, minimum pan.
//   PAN_MAX              — 180 °, maximum pan.
//   HEIGHT_MIN           — 0.001 m, minimum observer height.
//   HEIGHT_MAX           — 1e9 m, maximum observer height.
//   EARTH_RADIUS_MIN     — 100000 m, minimum earth radius clamp.
// =============================================================================

var DefaultDigits   = 6;
var DeviceRatio_Off = 1.5;
var PI90            = Math.PI / 2;

// —— Physical & optical constants ——
var SENSOR_DIAGONAL_35MM = 43.2;   // mm
var REFR_COEFF_CONST     = 503;    // K/mb — Edlén formula constant
var STD_TEMP_GRADIENT    = 0.0343; // K/m  — standard lapse rate
var KELVIN_OFFSET        = 273.15; // °C → K

// —— Clamp limits ——
var FOCAL_LENGTH_MIN = 21;    // mm
var FOCAL_LENGTH_MAX = 10000; // mm
var VIEW_ANGLE_MIN   = 0.1;   // °
var VIEW_ANGLE_MAX   = 160;   // °
var TILT_MIN         = -85;   // °
var TILT_MAX         = 45;    // °
var PAN_MIN          = -180;  // °
var PAN_MAX          = 180;   // °
var HEIGHT_MIN       = 0.001; // m
var HEIGHT_MAX       = 1e9;   // m
var EARTH_RADIUS_MIN = 100000; // m

// —— Object / target clamp limits ——
var OBJ_SIZE_MIN       = 0.001;  // m
var OBJ_SIZE_MAX       = 1e9;    // m
var OBJ_DELTA_DIST_MIN = 0.001;  // m

// —— Refraction / atmosphere clamp limits ——
var TEMP_K_MIN        = 3;      // K
var TEMP_K_MAX        = 10000;  // K
var PRESSURE_MIN_MBAR = 0.001;  // mbar
var PRESSURE_MAX_MBAR = 10000;  // mbar

function toRad(a) { return a * Math.PI / 180; }
function toDeg(a) { return a * 180 / Math.PI; }
Object.assign(globalThis, {
  DefaultDigits, DeviceRatio_Off, PI90, toRad, toDeg,
  SENSOR_DIAGONAL_35MM, REFR_COEFF_CONST, STD_TEMP_GRADIENT, KELVIN_OFFSET,
  FOCAL_LENGTH_MIN, FOCAL_LENGTH_MAX,
  VIEW_ANGLE_MIN, VIEW_ANGLE_MAX,
  TILT_MIN, TILT_MAX, PAN_MIN, PAN_MAX,
  HEIGHT_MIN, HEIGHT_MAX, EARTH_RADIUS_MIN,
  OBJ_SIZE_MIN, OBJ_SIZE_MAX, OBJ_DELTA_DIST_MIN,
  TEMP_K_MIN, TEMP_K_MAX, PRESSURE_MIN_MBAR, PRESSURE_MAX_MBAR,
});
