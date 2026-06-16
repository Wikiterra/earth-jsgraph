// FeDomeApp coord/math methods - extracted from app.js
// Loads after app.js; FeDomeApp already on globalThis.

Object.assign(FeDomeApp, {

  DateToEarthRotAngle: function (dateTime) {
    var angleDeg = 360 * (dateTime - this.SunAngleOffset) * 24 / this.SidericDay;
    return ToRange(angleDeg, 360);
  },

  CompTransMatCelestToGlobe: function (obsLatDeg, obsLongDeg) {
    // requires this.EarthRotAngle
    return JsgMat3.RotatingY(ToRad(obsLatDeg), JsgMat3.RotatingZ(ToRad(-obsLongDeg - this.EarthRotAngle)));
  },

  CompTransMatLocalFeToGlobalFe: function (observerCoord, observerLongDeg) {
    var rotationMat = JsgMat3.RotatingZ(ToRad(observerLongDeg));
    return JsgMat3.Moving(observerCoord[0], observerCoord[1], observerCoord[2], rotationMat);
  },

  CompTransMatSunToCelest: function (eclipseDeg) {
    return JsgMat3.RotatingX(ToRad(eclipseDeg));
  },

  CompTransMatMoonToCelest: function (sunEclipticDeg, moonEclipticDeg, moonPrecessAngleDeg) {
    var transMoonToMoonEcliptic = JsgMat3.RotatingX(ToRad(moonEclipticDeg));
    var transMoonToSunEcliptic = JsgMat3.RotatingZ(ToRad(moonPrecessAngleDeg), transMoonToMoonEcliptic);
    var transMoonToCelest = JsgMat3.RotatingX(ToRad(sunEclipticDeg), transMoonToSunEcliptic);
    return transMoonToCelest;
  },

  CompTransMatDomeToFe: function (earthRotAngleDeg) {
    return JsgMat3.RotatingZ(-ToRad(earthRotAngleDeg));
  },

  SunAngleToCelestCoord: function (sunAngleDeg) {
    // requires this.TransMatSunToCelest
    // returns unit vector to sun position in celestial coord
    var sunAngleRad = ToRad(sunAngleDeg);
    var sunCoord = [Math.cos(sunAngleRad), Math.sin(sunAngleRad), 0];
    return JsgMat3.Trans(this.TransMatSunToCelest, sunCoord);
  },

  MoonAngleToCelestCoord: function (moonAngleDeg) {
    // requires this.TransMatMoonToCelest
    // returns unit vector to moon position in celestial coord
    var moonAngleRad = ToRad(moonAngleDeg);
    var moonCoord = [Math.cos(moonAngleRad), Math.sin(moonAngleRad), 0];
    return JsgMat3.Trans(this.TransMatMoonToCelest, moonCoord);
  },

  CompMoonNorthCelestCoord: function () {
    // requires this.TransMatMoonToCelest
    // returns unit vector in celest coords that is the direction of the moon's northpole
    return JsgMat3.Trans(this.TransMatMoonToCelest, [0, 0, 1]);
  },

  DateToSunAngleCelest: function (dateTime) {
    return 360 * (dateTime - this.SunAngleOffset) / this.SunPeriod;
  },

  DateToMoonPrecessAngle: function (dateTime) {
    return 360 * (dateTime - this.MoonPrecessOffset) / this.MoonPrecessPeriod;
  },

  DateToMoonAngleCelest: function (dateTime) {
    return 360 * (dateTime - this.MoonAngleOffset) / this.MoonPeriod;
  },

  CelestCoordToLocalGlobeCoord: function (celestCoord) {
    // requires this.TransMatCelestToGlobe
    return JsgMat3.Trans(this.TransMatCelestToGlobe, celestCoord);
  },

  CelestLatLongToLocalGlobeCoord: function (latDeg, longDeg, length) {
    return this.CelestCoordToLocalGlobeCoord(this.LatLongToCoord(latDeg, longDeg, length));
  },

  CelestLatLongToGlobalFeSphereCoord: function (latDeg, longDeg, length) {
    var localGlobeCoord = this.CelestLatLongToLocalGlobeCoord(latDeg, longDeg, length);
    var globalFeCoord = this.LocalGlobeCoordToGlobalFeCoord(localGlobeCoord);
    return globalFeCoord;
  },

  CelestCoordToLocalGlobeAngles: function (celestCoord) {
    // requires this.TransMatCelestToGlobe
    // returns { azimuth, elevation } object, angles in degrees
    return this.LocalGlobeCoordToAngles(this.CelestCoordToLocalGlobeCoord(celestCoord));
  },

  LatLongToCoord: function (latDeg, longDeg, length) {
    return JsgVect3.FromAngle(longDeg, latDeg, length);
  },

  CoordToLatLong: function (coord) {
    // returns { lat, long } object, angles in degrees
    var ret = {};
    var vectXY = [coord[0], coord[1], 0];
    if (JsgVect3.Length(vectXY) == 0) {
      // coord is up or down, so long is undefined -> set long = 0
      ret.lng = 0;
      ret.lat = (coord[2] >= 0) ? 90 : -90;
      return ret;
    }
    // assert JsgVect3.Length(vectXY) > 0, so Norm returns no null vector
    var vectXYNorm = JsgVect3.Norm(vectXY);
    var coordNorm = JsgVect3.Norm(coord);
    ret.lat = 90 - ToDeg(Math.acos(Limit1(JsgVect3.ScalarProd([0, 0, 1], coordNorm))));
    ret.lng = ToDeg(Math.acos(Limit1(JsgVect3.ScalarProd([1, 0, 0], vectXYNorm))));
    if (vectXYNorm[1] < 0) ret.lng *= -1;
    return ret;
  },

  LocalGlobeCoordToAngles: function (coord) {
    // returns { azimuth, elevation } object, angles in degrees
    // note: observer coordinates are: x -> zenith, y -> east, z -> north
    var ret = {};
    var vectYZNorm = JsgVect3.Norm([0, coord[1], coord[2]]);
    var coordNorm = JsgVect3.Norm(coord);
    ret.azimuth = ToDeg(Math.acos(Limit1(JsgVect3.ScalarProd([0, 0, 1], vectYZNorm))));
    if (vectYZNorm[1] < 0) ret.azimuth = 360 - ret.azimuth;
    ret.elevation = 90 - ToDeg(Math.acos(Limit1(JsgVect3.ScalarProd([1, 0, 0], coordNorm))));
    return ret;
  },

  FeLatLongToGlobalFeCoord: function (latDeg, longDeg) {
    // requires EarthMap.Radius, this.FePlane
    return JsgVect3.Copy(this.FePlane.PointOnPlane(EarthMap.PointOnFE(latDeg, longDeg)));
  },

  CelestLatLongToDomeCoord: function (latDeg, longDeg) {
    // latDeg, long in degrees
    var domeRadius = this.DomeSize * this.RadiusFE;
    var radialDist = this.RadiusFE * (90 - latDeg) / 180;
    var longRad = ToRad(longDeg);
    var x = radialDist * Math.cos(longRad);
    var y = radialDist * Math.sin(longRad);
    var z = Math.sqrt(sqr(domeRadius) - sqr(radialDist)) * this.DomeHeight / domeRadius;
    return [x, y, z];
  },

  CelestCoordToDomeCoord: function (vect) {
    var latlong = this.CoordToLatLong(vect);
    return this.CelestLatLongToDomeCoord(latlong.lat, latlong.lng);
  },

  CelestCoordToGlobalFeCoord: function (vect) {
    var latlong = this.CoordToLatLong(vect);
    return this.CelestLatLongToGlobalFeSphereCoord(latlong.lat, latlong.lng, this.RadiusFE);
  },

  DomeCoordToGlobalFeCoord: function (vect) {
    return JsgMat3.Trans(this.TransMatDomeToFe, vect);
  },

  LocalGlobeCoordToLocalFeCoord: function (vect) {
    return [-vect[2], vect[1], vect[0]];
  },

  LocalGlobeCoordToGlobalFeCoord: function (vect) {
    return JsgMat3.Trans(this.TransMatLocalFeToGlobalFe, this.LocalGlobeCoordToLocalFeCoord(vect));
  },

});
