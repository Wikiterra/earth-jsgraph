// =============================================================================
// constants.js - Shared constants and trig helpers used across the calculator
// =============================================================================

var DefaultDigits   = 6;
var DeviceRatio_Off = 1.5;
var PI90            = Math.PI / 2;

function toRad(a) { return a * Math.PI / 180; }
function toDeg(a) { return a * 180 / Math.PI; }
Object.assign(globalThis, { DefaultDigits, DeviceRatio_Off, PI90, toRad, toDeg });
