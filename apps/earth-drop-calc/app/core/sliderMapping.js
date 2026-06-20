// =============================================================================
// sliderMapping.js — Bidirectional slider ↔ value mappings extracted from
//   CurveAppClass.Update() and UpdateObjectInput().
//
//   Each function encapsulates the log/linear mapping between a slider position
//   (0..1 or -1..+1) and its physical value. Extracting these simplifies Update()
//   and makes the mappings testable in isolation.
// =============================================================================

// ---------------------------------------------------------------------------
// Height
// ---------------------------------------------------------------------------

function sliderToHeight(slider) {
  return Math.pow(10, -1 + 6 * slider);
}

function heightToSlider(h) {
  return (Math.log10(h) + 1) / 6;
}

// ---------------------------------------------------------------------------
// Refraction slider (k = refractionCoeff)
// ---------------------------------------------------------------------------

function sliderToRefractionCoeff(slider, k_max) {
  var s = Math.abs(slider) < 0.01 ? 0 : slider;
  return k_max * s;
}

// ---------------------------------------------------------------------------
// Focal length ↔ view angle (sensor diagonal: SENSOR_DIAGONAL_35MM)
// ---------------------------------------------------------------------------

function focalLengthSliderToFocalLength(slider) {
  return (FOCAL_LENGTH_MAX - FOCAL_LENGTH_MIN) * Math.pow(slider, 2) + FOCAL_LENGTH_MIN;
}

function focalLengthToViewAngle(f) {
  return toDeg(2 * Math.atan(SENSOR_DIAGONAL_35MM / 2 / f));
}

function viewAngleToFocalLength(viewAngleDeg) {
  return SENSOR_DIAGONAL_35MM / (2 * Math.tan(toRad(viewAngleDeg) / 2));
}

function focalLengthToSlider(f) {
  var ff = f - FOCAL_LENGTH_MIN;
  if (ff < 0) ff = 0;
  return Math.pow(ff / (FOCAL_LENGTH_MAX - FOCAL_LENGTH_MIN), 1 / 2);
}

// ---------------------------------------------------------------------------
// Tilt slider (asymmetric: ±45° / -85°)
// ---------------------------------------------------------------------------

function tiltToSlider(tilt, tiltMin, tiltMax) {
  if (tilt > 0) {
    return Math.sqrt(tilt / tiltMax);
  }
  return -Math.sqrt(-tilt / -tiltMin);
}

function sliderToTilt(slider, tiltMin, tiltMax) {
  if (slider > 0) {
    return Math.pow(slider, 2) * tiltMax;
  }
  return -Math.pow(slider, 2) * -tiltMin;
}

// ---------------------------------------------------------------------------
// Pan slider (symmetric ±180°, but slider sqrt uses 90° as divisor)
// Note: the original code uses sqrt(pan/90), not sqrt(pan/PAN_MAX).
// These are intentionally NOT parametrized by PAN_MIN/PAN_MAX.
// ---------------------------------------------------------------------------

function panToSlider(pan) {
  if (pan > 0) return Math.sqrt(pan / 90);
  return -Math.sqrt(-pan / 90);
}

function sliderToPan(slider) {
  if (slider > 0) return Math.pow(slider, 2) * 90;
  return -Math.pow(slider, 2) * 90;
}

// ---------------------------------------------------------------------------
// Object distance (logarithmic, with linear sub-range)
// ---------------------------------------------------------------------------

function sliderToObjSurfDist(slider) {
  var sign = slider < 0 ? -1 : 1;
  var val = Math.abs(slider);
  if (val < 1) return sign * 100 * val;
  return sign * 10 * Math.pow(10, slider);
}

function objSurfDistToSlider(dist) {
  var sign = dist < 0 ? -1 : 1;
  var val = Math.abs(dist);
  if (val < 100) return sign * (val / 100);
  return sign * Math.log10(val / 10);
}

// ---------------------------------------------------------------------------
// Object side position (logarithmic, with linear sub-range)
// ---------------------------------------------------------------------------

function sliderToObjSidePos(slider) {
  var sign = slider < 0 ? -1 : 1;
  var val = Math.abs(slider);
  if (val < 1) return sign * 100 * val;
  return sign * 10 * Math.pow(10, val);
}

function objSidePosToSlider(pos) {
  var sign = pos < 0 ? -1 : 1;
  var val = Math.abs(pos);
  if (val < 100) return sign * (val / 100);
  return sign * Math.log10(val / 10);
}

// ---------------------------------------------------------------------------
// Object side variation (hybrid log)
// ---------------------------------------------------------------------------

function sliderToObjSideVar(slider) {
  var sign = slider < 0 ? -1 : 1;
  var val = Math.abs(slider);
  if (val < 1) return sign * 10 * val;
  return sign * Math.pow(10, val);
}

function objSideVarToSlider(v) {
  var sign = v < 0 ? -1 : 1;
  var val = Math.abs(v);
  if (val < 10) return sign * (val / 10);
  return sign * Math.log10(val);
}

// ---------------------------------------------------------------------------
// Object size (simple log)
// ---------------------------------------------------------------------------

function sliderToObjSize(slider) {
  return Math.pow(10, slider);
}

function objSizeToSlider(size) {
  return Math.log10(size);
}

// ---------------------------------------------------------------------------
// Object delta distance (log, shifted)
// ---------------------------------------------------------------------------

function sliderToObjDeltaDist(slider) {
  return 10 * Math.pow(10, slider);
}

function objDeltaDistToSlider(d) {
  return Math.log10(d / 10);
}

export {
  sliderToHeight, heightToSlider,
  sliderToRefractionCoeff,
  focalLengthSliderToFocalLength, focalLengthToViewAngle,
  viewAngleToFocalLength, focalLengthToSlider,
  tiltToSlider, sliderToTilt,
  panToSlider, sliderToPan,
  sliderToObjSurfDist, objSurfDistToSlider,
  sliderToObjSidePos, objSidePosToSlider,
  sliderToObjSideVar, objSideVarToSlider,
  sliderToObjSize, objSizeToSlider,
  sliderToObjDeltaDist, objDeltaDistToSlider,
};