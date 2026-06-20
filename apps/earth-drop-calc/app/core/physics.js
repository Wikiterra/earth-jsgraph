// @ts-check
// =============================================================================
// physics.js — Pure geometry / refraction / visibility functions (no `this`).
//   Extracted from CurveAppClass.Update() to isolate the math for testing and
//   potential reuse across apps.
//
//   Each function takes explicit inputs and returns computed values or objects.
//   No dependencies on global app state (CurveApp, graph, etc.) — only math
//   helpers (toRad, toDeg) and JsgVect3.
// =============================================================================

// ---------------------------------------------------------------------------
// 3D vector helpers for object geometry
// ---------------------------------------------------------------------------

/**
 * Compute object position vector relative to observer.
 * @param {number} dist  — surface distance along refracted earth
 * @param {number} side  — lateral offset along surface
 * @param {number} size  — object height above surface
 * @param {number} rad   — (refracted) earth radius
 * @param {number} h     — observer height above surface
 * @returns {number[]} 3D vector [vx, vy, vz]
 */
function compObjVect(dist, side, size, rad, h) {
  var R = rad + size;
  var a1 = side / rad;
  var a2 = dist / rad;
  var r = R * Math.cos(a1);
  var vx = R * Math.sin(a1);
  var vy = r * Math.sin(a2);
  var vz = r * Math.cos(a2) - (rad + h);
  return [vx, vy, vz];
}

/**
 * Euclidean distance of a 3D vector.
 * @param {number[]} v
 * @returns {number}
 */
function compViewDist(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

/**
 * Angle (radians) between two 3D vectors.
 * @param {number[]} v1
 * @param {number[]} v2
 * @returns {number}
 */
function compVectAng(v1, v2) {
  var sp = JsgVect3.ScalarProd(JsgVect3.Norm(v1), JsgVect3.Norm(v2));
  return Math.acos(Limit1(sp));
}

// ---------------------------------------------------------------------------
// Refraction
// ---------------------------------------------------------------------------

/**
 * Compute refraction coefficient k from pressure, temperature and lapse rate.
 * k = 503 · P/T² · (0.0343 + dT/dh)
 * @param {number} P_mbar — pressure in mbar
 * @param {number} T_K    — temperature in Kelvin
 * @param {number} dTdh   — temperature gradient dT/dh in K/m
 * @returns {number} refraction coefficient k
 */
function computeRefractionCoeff(P_mbar, T_K, dTdh) {
  return REFR_COEFF_CONST * (P_mbar / (T_K * T_K)) * (STD_TEMP_GRADIENT + dTdh);
}

/**
 * Inverse: compute temperature gradient from refraction coefficient.
 * dT/dh = (k · T²) / (503 · P) - 0.0343
 * @param {number} k       — refraction coefficient
 * @param {number} T_K     — temperature in Kelvin
 * @param {number} P_mbar  — pressure in mbar
 * @returns {number} temperature gradient dT/dh in K/m
 */
function computeTempGradientFromK(k, T_K, P_mbar) {
  return (k * T_K * T_K) / (REFR_COEFF_CONST * P_mbar) - STD_TEMP_GRADIENT;
}

/**
 * Compute refraction factor a from k: a = 1 / (1 - k)
 * @param {number} k — refraction coefficient
 * @returns {number} refraction factor
 */
function computeRefractionFactor(k) {
  return 1 / (1 - k);
}

/**
 * Compute refracted earth radius: R' = R · a
 * @param {number} R — true earth radius
 * @param {number} a — refraction factor
 * @returns {number} refracted earth radius
 */
function computeRefractedRadius(R, a) {
  return R * a;
}

// ---------------------------------------------------------------------------
// Horizon geometry
// ---------------------------------------------------------------------------

/**
 * Compute all horizon-dependent values for a given refracted earth radius and
 * observer height. Returns an object with the standard horizon fields.
 * @param {number} R_refr — refracted earth radius
 * @param {number} height — observer height above surface
 * @returns {{
 *   horizDropAnglFromEyeLvl: number,
 *   horizDistOnEyeLvl: number,
 *   horizSurfDist: number,
 *   earthCentrToHorizDisc: number,
 *   horizDropFromObsSurf: number,
 *   horizDropFromEyeLvl: number,
 *   horizDistLineOfSight: number,
 * }}
 */
function computeHorizonGeometry(R_refr, height) {
  var dropAngl = Math.acos(R_refr / (R_refr + height));
  return {
    horizDropAnglFromEyeLvl: dropAngl,
    horizDistOnEyeLvl: R_refr * Math.sin(dropAngl),
    horizSurfDist: R_refr * dropAngl,
    earthCentrToHorizDisc: R_refr * Math.cos(dropAngl),
    horizDropFromObsSurf: R_refr - R_refr * Math.cos(dropAngl),
    horizDropFromEyeLvl: (R_refr - R_refr * Math.cos(dropAngl)) + height,
    horizDistLineOfSight: (height + R_refr) * Math.sin(dropAngl),
  };
}

/**
 * Compute the horizon left-right drop angle/distance (the "horseshoe" HUD).
 * @param {number} viewAngle       — camera FOV in degrees
 * @param {number} deviceRatio     — screen width/height
 * @param {number} horizDistLineOfSight
 * @param {number} horizDistOnEyeLvl
 * @param {number} horizDropAnglFromEyeLvl
 * @param {number} horizDropFromEyeLvl
 * @returns {{
 *   horizLftRgtWidth: number,
 *   horizLftRgtDist: number,
 *   horizLftRgtDropAngl: number,
 *   horizLftRgtDrop: number,
 * }}
 */
function computeLeftRightDrop(
  viewAngle, deviceRatio,
  horizDistLineOfSight, horizDistOnEyeLvl,
  horizDropAnglFromEyeLvl, horizDropFromEyeLvl
) {
  var yFieldOfView2 = toRad(viewAngle) / Math.sqrt(1 + 1 / (deviceRatio * deviceRatio)) / 2;
  var width2HorLRDrop = horizDistLineOfSight * Math.sin(yFieldOfView2);

  if (width2HorLRDrop < horizDistOnEyeLvl) {
    var width = width2HorLRDrop * 2;
    var dist = Math.sqrt(horizDistOnEyeLvl * horizDistOnEyeLvl - width2HorLRDrop * width2HorLRDrop);
    var angVert = Math.atan(dist / horizDropFromEyeLvl);
    var angRad = Math.PI / 2 - horizDropAnglFromEyeLvl - angVert;
    return {
      horizLftRgtWidth: width,
      horizLftRgtDist: dist,
      horizLftRgtDropAngl: toDeg(angRad),
      horizLftRgtDrop: horizDistLineOfSight * Math.sin(angRad),
    };
  }

  return { horizLftRgtWidth: 0, horizLftRgtDist: 0, horizLftRgtDropAngl: 0, horizLftRgtDrop: 0 };
}

/**
 * Compute refraction angle — the angular difference between geometric and
 * refracted horizon vectors.
 * @param {number} R_geom   — true earth radius
 * @param {number} R_refr   — refracted earth radius
 * @param {number} height   — observer height
 * @param {number} horizonSurfDist — refracted horizon surface distance
 * @param {number} refractionCoeff — k
 * @returns {number} horizon refraction angle in degrees
 */
function computeHorizonRefractionAngle(R_geom, R_refr, height, horizonSurfDist, refractionCoeff) {
  if (Math.abs(R_geom - R_refr) <= 1e-5) return 0;

  var dropAngleGeom = Math.acos(R_geom / (R_geom + height));
  var horizSurfDistGeom = R_geom * dropAngleGeom;
  var vGeom = compObjVect(horizSurfDistGeom, 0, 0, R_geom, height);
  var vRefr = compObjVect(horizonSurfDist, 0, 0, R_refr, height);
  var ang = toDeg(compVectAng(vGeom, vRefr));
  return refractionCoeff < 0 ? -ang : ang;
}

// ---------------------------------------------------------------------------
// Object geometry
// ---------------------------------------------------------------------------

/**
 * Compute geometry for the nearest reference object.
 * @param {number} objSurfDist      — object surface distance
 * @param {number} objSidePos       — lateral offset
 * @param {number} objNearSize      — object height (with size var applied)
 * @param {number} R_refr           — refracted earth radius
 * @param {number} R_geom           — true earth radius
 * @param {number} height           — observer height
 * @param {number} horizDropAnglFromEyeLvl
 * @param {number} horizRefrAngl    — precomputed horizon refraction angle
 * @param {number} refractionCoeff  — k
 * @returns {{
 *   objSurfDistAngl: number,
 *   objRealSurfDist: number,
 *   bulge: number,
 *   objDropFromObsSurf: number,
 *   objDropAnglFromObsSurf: number,
 *   objNearTilt: number,
 *   objSizeAngl: number,
 *   objRefrAngl: number,
 *   objLiftAbs: number,
 *   objLiftRelToHoriz: number,
 *   horizonLift: number,
 *   objHidden: number,
 *   objVisi: number,
 *   objHiddenAngl: number,
 *   objVisibleAngl: number,
 *   objTopAnglFromEyeLvl: number,
 *   objTopAnglFromEyeLvlFE: number,
 * }}
 */
function computeObjectGeometry(
  objSurfDist, objSidePos, objNearSize,
  R_refr, R_geom, height,
  horizDropAnglFromEyeLvl, horizRefrAngl, refractionCoeff
) {
  // Surface distance angle & real surface distance
  var vectObjPos = compObjVect(objSurfDist, objSidePos, 0, R_refr, -R_refr);
  var objSurfDistAngl = compVectAng(vectObjPos, [0, 0, R_refr]);
  var objRealSurfDist = objSurfDistAngl * R_refr;

  // Bulge and drop
  var d2r = Math.sin(objRealSurfDist / (2 * R_refr));
  var bulge = R_refr * (1 - Math.sqrt(1 - d2r * d2r));
  var objDropFromObsSurf = R_refr * (1 - Math.cos(objRealSurfDist / R_refr));
  var hdist = R_refr * Math.sin(objRealSurfDist / R_refr);
  var objDropAnglFromObsSurf = toDeg(Math.atan(objDropFromObsSurf / hdist));

  // Object angular size and refraction
  var vBase_refr = compObjVect(objSurfDist, objSidePos, 0, R_refr, height);
  var vTop_refr  = compObjVect(objSurfDist, objSidePos, objNearSize, R_refr, height);
  var vBase_geom = compObjVect(objSurfDist, objSidePos, 0, R_geom, height);

  var objUpDir = JsgVect3.Sub(vTop_refr, vBase_refr);
  var objNearTilt = toDeg(compVectAng([0, 0, 1], objUpDir));
  var objSizeAngl = toDeg(compVectAng(vBase_refr, vTop_refr));
  if (Math.abs(objSizeAngl) < 1e-5) objSizeAngl = 0;

  var objRefrAngl = toDeg(compVectAng(vBase_geom, vBase_refr));
  if (Math.abs(objRefrAngl) < 1e-5) objRefrAngl = 0;
  if (refractionCoeff < 0) objRefrAngl *= -1;

  // Lift
  var objLiftAbs = 0, objLiftRelToHoriz = 0, horizonLift = 0;
  if (objSizeAngl !== 0) {
    objLiftAbs = objNearSize * objRefrAngl / objSizeAngl;
    horizonLift = objNearSize * horizRefrAngl / objSizeAngl;
    objLiftRelToHoriz = objLiftAbs - horizonLift;
  }

  // Hidden / visible
  var objHidden, objVisi, objHiddenAngl, objVisibleAngl;
  if (objSurfDistAngl > horizDropAnglFromEyeLvl) {
    // Behind horizon
    var cosaHorObj = Math.cos(objSurfDistAngl - horizDropAnglFromEyeLvl);
    objHidden = R_refr * (1 - cosaHorObj) / cosaHorObj;
    objVisi = objNearSize - objHidden;
    if (objVisi < 0) objVisi = 0;
    objHiddenAngl = objSizeAngl * objHidden / objNearSize;
    objVisibleAngl = objSizeAngl * objVisi / objNearSize;
  } else {
    objHidden = 0;
    objVisi = objNearSize;
    objHiddenAngl = 0;
    objVisibleAngl = objSizeAngl;
  }

  // Top angle from eye level (globe model)
  var a = R_refr + height;
  var b = R_refr + objNearSize;
  var c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(objRealSurfDist / R_refr));
  var a1 = (c * c - b * b + a * a) / (2 * a);
  var objTopAnglFromEyeLvl = -Math.asin(a1 / c) * 180 / Math.PI;

  // Top angle from eye level (flat earth model)
  var objTopAnglFromEyeLvlFE = Math.atan((objNearSize - height) / objRealSurfDist) * 180 / Math.PI;

  return {
    objSurfDistAngl, objRealSurfDist,
    bulge, objDropFromObsSurf, objDropAnglFromObsSurf,
    objNearTilt, objSizeAngl, objRefrAngl,
    objLiftAbs, objLiftRelToHoriz, horizonLift,
    objHidden, objVisi, objHiddenAngl, objVisibleAngl,
    objTopAnglFromEyeLvl, objTopAnglFromEyeLvlFE,
  };
}

// ---------------------------------------------------------------------------
// Camera / view geometry
// ---------------------------------------------------------------------------

/**
 * Compute azimuthal view center angle depending on aiming mode.
 * FE is an infinite flat plane → its horizon is eye level (aim 0).
 * @param {number} viewcenterHorizon — 0=globe, 1=FE, 2=between, 3=eye level
 * @param {number} height              — observer height
 * @param {number} equatorRadiusFE     — FE equator radius
* @param {number} horizDropAnglFromEyeLvl
 * @param {boolean} isShowGlobe
 * @param {string} [aimModel]          - 'globe' | 'fe' (in split-screen mode)
 * @returns {number} vertical view center angle in radians
 */
function computeViewCenterAngle(
  viewcenterHorizon, height, equatorRadiusFE,
  horizDropAnglFromEyeLvl, isShowGlobe, aimModel
) {
  // FE is modelled as an infinite flat plane: its horizon coincides with eye
  // level, so every FE aim term is 0 (height/equatorRadiusFE unused here now).
  if (viewcenterHorizon === 0) {
    var aimGlobe = (aimModel === 'globe') ? true
                 : (aimModel === 'fe')    ? false
                 : isShowGlobe;
    return aimGlobe ? horizDropAnglFromEyeLvl : 0;
  }
  if (viewcenterHorizon === 1) {
    return 0; // FE horizon = eye level
  }
  if (viewcenterHorizon === 2) {
    return horizDropAnglFromEyeLvl / 2; // between globe horizon and eye level
  }
  return 0; // eye level
}

export {
  compObjVect, compViewDist, compVectAng,
  computeRefractionCoeff, computeTempGradientFromK,
  computeRefractionFactor, computeRefractedRadius,
  computeHorizonGeometry, computeLeftRightDrop,
  computeHorizonRefractionAngle,
  computeObjectGeometry,
  computeViewCenterAngle,
};