// =============================================================================
// units.js - Length/height/angle unit conversion helpers used by panels.
//   L = length, H = height, B = big length, A = angle gradient.
// =============================================================================
function LVal( x ) {
  return x / CurveApp.LengthUnits.Mults[CurveApp.UnitsType];
}

function LUnit() {
  return ' ' + CurveApp.LengthUnits.Units[CurveApp.UnitsType];
}

function HVal( x ) {
  return x / CurveApp.HeightUnits.Mults[CurveApp.UnitsType];
}

function HUnit() {
  return ' ' + CurveApp.HeightUnits.Units[CurveApp.UnitsType];
}

function AVal( x ) {
  return x / CurveApp.GradientUnits.Mults[CurveApp.UnitsType];
}

function AUnit() {
  return CurveApp.GradientUnits.Units[CurveApp.UnitsType];
}

export { LVal, LUnit, HVal, HUnit, AVal, AUnit };
