// =============================================================================
// helpers.js — Shared math / utility functions used by both apps.
//   Lives in the vendor package so both earth-drop-calc and fed-wabis-v2
//   can import it without duplication.
//
//   Dual-loadable: runs as a classic <script> AND as an ESM side-effect import.
//   No `export` statement, publishes on globalThis.
// =============================================================================

// ---------------------------------------------------------------------------
// Trigonometry
// ---------------------------------------------------------------------------

function toRad(a) { return a * Math.PI / 180; }
function toDeg(a) { return a * 180 / Math.PI; }

// Aliases for code that uses uppercase naming (fed-wabis-v2 legacy).
function ToRad(x) { return x * Math.PI / 180; }
function ToDeg(x) { return x * 180 / Math.PI; }

// ---------------------------------------------------------------------------
// Numeric helpers
// ---------------------------------------------------------------------------

function sqr(x) { return x * x; }
function Limit1(x) { return x < -1 ? -1 : x > 1 ? 1 : x; }
function Limit01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

/**
 * Maps x to a range [0, max) by wrapping around.
 * @param {number} x
 * @param {number} max
 * @returns {number}
 */
function ToRange(x, max) {
  var v = Math.abs(x) % max;
  return x < 0 ? max - v : v;
}

Object.assign(globalThis, { toRad, toDeg, ToRad, ToDeg, sqr, Limit1, Limit01, ToRange });