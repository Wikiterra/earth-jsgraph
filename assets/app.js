var ThisPageUrl = location.href;
var ThisPageShortUrl = location.href;

// set EarthMap colors and polygone mode (3D)
EarthMap.SetWaterColor('#d3e2f5');
EarthMap.SetLakeColor('#d3e2f5', '#8cbe5d');
EarthMap.SetContinentColor(null, '#c6dfaf', '#8cbe5d');
EarthMap.SetLandColor('Antarctica', '#eee', '#ccc');
EarthMap.FEMode = 2; // use PolygonOnPlane to draw map

// some useful functions
function ToRad(x) { return x * Math.PI / 180; }
function ToDeg(x) { return x * 180 / Math.PI; }
function sqr(x) { return x * x; }
function Limit1(x) { return x < -1 ? -1 : x > 1 ? 1 : x; }
function Limit01(x) { return x < 0 ? 0 : x > 1 ? 1 : x }

function ToRange(x, max) {
  // maps x to a range of 0 inclusive to max exclusive
  var v = Math.abs(x) % max;
  if (x < 0) v = max - v;
  return v;
}

// The metadata are used to serialize and parse the state of the App.
// The metadata properties represent all properties of the App, that can be changed by Demos.

var FeDomeAppMetaData = {
  Compact: false,
  DefaultPrec: 8,
  Properties: [
    { Name: 'Description', Type: 'str', Default: '' },
    { Name: 'PointerFrom', Type: 'arr', Size: 2, ArrayType: 'int', Default: [0, 0] },
    { Name: 'PointerTo', Type: 'arr', Size: 2, ArrayType: 'int', Default: [0, 0] },
    { Name: 'PointerText', Type: 'str', Default: '' },

    { Name: 'ObserverLat', Type: 'num', Default: 0.0 },
    { Name: 'ObserverLong', Type: 'num', Default: 15.0 },
    { Name: 'Zoom', Type: 'num', Default: 1.4 },
    { Name: 'CameraDirection', Type: 'num', Default: 30.0 },
    { Name: 'CameraHeight', Type: 'num', Default: 25.0 },
    { Name: 'CameraDistance', Type: 'num', Default: 200150.0 },
    { Name: 'DateTime', Type: 'num', Default: 82.5 },
    { Name: 'DomeSize', Type: 'num', Default: 1.0 },
    { Name: 'DomeHeight', Type: 'num', Default: 9000.0 },

    { Name: 'ShowFeGrid', Type: 'bool', Default: true },
    { Name: 'ShowShadow', Type: 'bool', Default: true },
    { Name: 'ShowDomeGrid', Type: 'bool', Default: true },
    { Name: 'ShowSunTrack', Type: 'bool', Default: false },
    { Name: 'ShowMoonTrack', Type: 'bool', Default: false },
    { Name: 'ShowSphere', Type: 'bool', Default: true },
    { Name: 'ShowStars', Type: 'bool', Default: false },
    { Name: 'ShowDomeRays', Type: 'bool', Default: true },
    { Name: 'ShowSphereRays', Type: 'bool', Default: true },
    { Name: 'ShowManyRays', Type: 'bool', Default: false },

    { Name: 'RayParameter', Type: 'num', Default: 1 },
    { Name: 'RayTarget', Type: 'int', Default: 0 },
    { Name: 'RaySource', Type: 'int', Default: 0 },

    { Name: 'ShowGP', Type: 'bool', Default: true },
    { Name: 'ShowAzElev', Type: 'bool', Default: true },

  ],
};

// the App
// ==============================

// Coordinate Systems
// * EarthRotAngle
// * Sun      : Angle, Coord, LatLong
// * Celestial: LatLong, Coord (unit Vectors)
// * Globe    : Angles(azimuth,elevation), LatLong, LocalCoord
// * FE       : Coord, LatLong, CelestialAngles
// * Dome     : Coord
//
// Converter functions
// * LatLongToCoord( latDeg, longDeg, length )
// * CoordToLatLong( coord ) returns { lat, long }
// * LocalGlobeCoordToAngles( coord ) returns { azimtuth, elevation }
// * AnglesToCoord( angles, length )
// * AnglesToGlobalFeCoord( angles, length )
// * DateToEarthRotAngle( dateTime )
// * DateToSunAngleCelest( dateTime )

// * SunAngleToCelestCoord( sunAngleDeg )
// * CelestLatLongToLocalGlobeCoord( latDeg, longDeg, length ) {
// * CelestLatLongToDomeCoord( latDeg, longDeg )
// * CelestLatLongToGlobalFeSphereCoord( latDef, longDeg, length )
// * CelestCoordToLocalGlobeCoord( celestCoord )
// * CelestCoordToLocalGlobeAngles( celestCoord )
// * CelestCoordToDomeCoord( vect )
// * CelestCoordToGlobalFeCoord( vect )

// * FeLatLongToGlobalFeCoord( latDeg, longDeg )
// * DomeCoordToGlobalFeCoord( vect )
// * LocalGlobeCoordToLocalFeCoord( vect )
// * LocalGlobeCoordToGlobalFeCoord( vect )

var FeDomeApp = {
  // parameters
  ObserverLat: 0.0, // degrees -90..90; x < 0 is South, x > 0 is North
  ObserverLong: 15.0, // degrees -180..180; x < 0 is West, x > 0 is East
  Zoom: 1.4,
  CameraDirection: 30.0, // degrees -180..180
  CameraHeight: 25.0, // degrees 0..89.9
  CameraDistance: 200150.0, // km
  DateTime: 360.5, // date and time until 1.1.2017
  DateTimeLast: 360.5,
  DayOfYear: 360.0, // 0..364 (78 = spring equinox)
  DayOfYearLast: 360.0,
  Time: 12.0, // 0..24 UT
  TimeLast: 12.0,
  DomeSize: 1.0, // times RadiusFE gives DomeRadius
  DomeHeight: 9000.0, // km
  RayParameter: 1, // controls the distance of the bezier control point from the ray point at observer
  ShowFeGrid: true,
  ShowShadow: true,
  ShowDomeGrid: true,
  ShowSunTrack: false,
  ShowMoonTrack: false,
  ShowSphere: true,
  ShowStars: false,
  ShowDomeRays: true,
  ShowSphereRays: true,
  ShowManyRays: false,
  ShowGP: true,
  ShowAzElev: true,

  RayTarget: 0, // 0 -> observer, 1 -> Flat Earth
  RaySource: 0, // 0 -> sun, 1 -> moon, 2 -> star

  ManyRaysEnabled: false, // = ((this.ShowStars && this.ShowDomeRays) || this.RayTarget == 1)
  IsRayTargetObserver: true,

  // Description parameters
  Description: '',
  PointerFrom: [0, 0], // Note: do not replace the arrays, change their values!!!
  PointerTo: [0, 0],
  PointerText: '',

  // constants
  msPerDay: 86400000,
  ZeroDate: 0, // days of 1.1.2017 since 1.1.1970
  SidericDay: 23.93447, // hours
  AxialTilt: 23.44, // degrees from earth equator plane
  SunAngleOffset: 78.5, // days since DateTime = 0 (spring equinox = 20.3. at 12:00)
  SunPeriod: 365.256363004, // days
  MoonEcliptic: 5.145, // degrees from sun ecliptic plane
  // MoonAngleOffset and MoonPeriod are empirically adjusted to match solar eclipse and TFE
  MoonAngleOffset: 1.38, // 0.48, // days from ecliptic knot 
  MoonPeriod: 27.217, // (27.321661?) // sidereal days
  MoonPrecessPeriod: -6798.383, // days, moon ecliptic precessed counter moon orbit direction
  MoonPrecessOffset: -301.996, // days from solar eclipse 21.8.2017 (empiric)

  RadiusEarth: 6371.0, // km
  RadiusSun: 696342.0, // km
  DistSun: 149600000.0, // km
  RadiusMoon: 1738.0, // km (not needed)
  DistMoon: 384000.0, // km

  RadiusFE: 20015.0, // km
  RadiusSunFE: 26.2, // km (not needed)
  RadiusMoonFE: 26.2, // km (not needed)

  ZoomMin: 1.0,
  ZoomMax: 10.0,
  DomeHeightMin: 2000.0, // km
  DomeHeightMax: 20015.0, // km

  // computed values

  RadiusSphere: 5000.0, // km
  // planes for graphic functions PolygonOnPlane() etc.
  DefaultPlane: new JsgPlane([0, 0, 0], [1, 0, 0], [0, 1, 0]),
  FePlane: new JsgPlane([0, 0, 0], [0, 1, 0], [-1, 0, 0]),  // for flat earth 2D graphic

  EarthRotAngle: 0, // rotation angle of day and time since 20.3. 12:00 in degrees
  MoonPrecessAngle: 0, // current moon precession angle
  TransMatEarthRot: JsgMat3.Unit(),
  TransMatCelestToGlobe: JsgMat3.Unit(),
  TransMatSunToCelest: JsgMat3.Unit(),
  TransMatMoonToCelest: JsgMat3.Unit(),
  TransMatLocalFeToGlobalFe: JsgMat3.Unit(),

  SunCelestAngle: 0,
  SunCelestCoord: JsgVect3.Null(),
  SunCelestLatLong: { lat: 0, lng: 0 },
  SunAnglesGlobe: { azimuth: 0, elevation: 0 },
  SunDomeCoord: JsgVect3.Null(),
  SunLocalGlobeCoord: JsgVect3.Null(),
  SunFeCelestSphereCoord: JsgVect3.Null(),

  MoonCelestAngle: 0,
  MoonCelestCoord: JsgVect3.Null(),
  MoonNorthCelestCoord: JsgVect3.Null(),
  MoonCelestLatLong: { lat: 0, lng: 0 },
  MoonAnglesGlobe: { azimuth: 0, elevation: 0 },
  MoonDomeCoord: JsgVect3.Null(),
  MoonLocalGlobeCoord: JsgVect3.Null(),
  MoonFeCelestSphereCoord: JsgVect3.Null(),

  ObserverFeCoord: JsgVect3.Null(),

  // private
  GraphObject: null,
  MouseHandler: null,
  IsInit: false,
  pause: 0, // used for animations
  MouseViewRotationIncrement: 200,
  MousePositionIncrement: 300,

  // functions

  CreateFeGraph: function () {
    this.GraphObject = NewGraphX3D({
      Id: 'FeGraph',
      Width: '100%',
      Height: '56%',
      DrawFunc: function (g) { FeDomeApp.Draw(g); },
      AutoReset: false,
      AutoClear: false,
      AutoScalePix: true,
      BorderWidth: 0,
    });
    this.MouseHandler = new JsgMouseHandler(this, this.GraphObject);
  },

  Init: function () {
    if (this.IsInit) return;
    var date = new Date();
    date.setUTCFullYear(2017);
    date.setUTCMonth(0);
    date.setUTCDate(1);
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    this.ZeroDate = date.getTime() / this.msPerDay;
    this.IsInit = true;
  },

  ClearDescription: function () {
    this.Description = '';
    this.PointerFrom[0] = 0;
    this.PointerFrom[1] = 0;
    this.PointerTo[0] = 0;
    this.PointerTo[1] = 0;
    this.PointerText = '';
  },

  OnMouseMove: function (x, y, dx, dy, boost, event) {
    var g = this.GraphObject;
    if (event.ctrlKey) {
      var increment = this.MousePositionIncrement;
      this.ObserverLat -= dy / g.VpInnerWidth * increment;
      this.ObserverLong += dx / g.VpInnerHeight * increment;
      if (this.ObserverLat < -90) this.ObserverLat = -90;
      if (this.ObserverLat > 90) this.ObserverLat = 90;
      if (this.ObserverLong < -180) this.ObserverLong += 360;
      if (this.ObserverLong > 180) this.ObserverLong -= 360;
    } else {
      var increment = this.MouseViewRotationIncrement * boost;
      this.CameraDirection += -dx / g.VpInnerWidth * increment;
      this.CameraHeight += dy / g.VpInnerHeight * increment;
      if (this.CameraDirection < -360) this.CameraDirection += 360;
      if (this.CameraDirection > 360) this.CameraDirection -= 360;
      if (this.CameraHeight < 0) this.CameraHeight = 0;
      if (this.CameraHeight > 89.9) this.CameraHeight = 89.9;
    }
    this.ClearDescription();
    UpdateAll();
  },

  OnScroll: function (up, factor, shiftKey, crtlKey, altKey) {
    this.Zoom *= factor;
    if (this.Zoom < 1) this.Zoom = 1;
    if (this.Zoom > 10) this.Zoom = 10;
    this.ClearDescription();
    UpdateAll();
  },

  Update: function () {
    this.Init();

    this.ManyRaysEnabled = ((this.ShowStars && this.ShowDomeRays) || this.RayTarget == 1);
    this.IsRayTargetObserver = this.RayTarget == 0;

    // limit input values
    if (this.ObserverLat < -90) this.ObserverLat = -90;
    if (this.ObserverLat > 90) this.ObserverLat = 90;
    if (this.CameraHeight < -30) this.CameraHeight = -30;
    if (this.CameraHeight > 89.9) this.CameraHeight = 89.9;
    var camDistMin = 2 * this.DomeSize * this.RadiusFE;
    if (this.CameraDistance < camDistMin) this.CameraDistance = camDistMin;
    if (this.Zoom < 0.1) this.Zoom = 0.1;
    if (this.Zoom > 100) this.Zoom = 100;
    if (this.DomeSize < 1) this.DomeSize = 1;
    if (this.DomeSize > 5) this.DomeSize = 5;
    if (this.DomeHeight < this.DomeHeightMin) this.DomeHeight = this.DomeHeightMin;
    if (this.DomeHeight > this.DomeHeightMax) this.DomeHeight = this.DomeHeightMax;
    if (this.RayParameter < 0.5) this.RayParameter = 0.5;
    if (this.RayParameter > 2.0) this.RayParameter = 2.0;

    // to prevent flickering of the day/night shadow
    if (this.AxialTilt == 0) this.AxialTilt = 0.00001;

    EarthMap.Radius = this.RadiusFE;

    // update date and time from DateTime or date-time sliders
    this.DayOfYear = Math.round(this.DayOfYear);
    if (this.DayOfYear != this.DayOfYearLast || this.Time != this.TimeLast) {
      this.DateTime = this.DayOfYear + this.Time / 24;
    } else {
      this.DayOfYear = Math.floor(this.DateTime);
      this.Time = (this.DateTime - this.DayOfYear) * 24;
    }
    this.DateTimeLast = this.DateTime;
    this.DayOfYearLast = this.DayOfYear;
    this.TimeLast = this.Time;

    this.TransMatSunToCelest = this.CompTransMatSunToCelest(this.AxialTilt);
    this.ObserverFeCoord = this.FeLatLongToGlobalFeCoord(this.ObserverLat, this.ObserverLong);
    this.EarthRotAngle = this.DateToEarthRotAngle(this.DateTime);
    this.MoonPrecessAngle = this.DateToMoonPrecessAngle(this.DateTime);

    this.TransMatEarthRot = JsgMat3.RotatingZ(ToRad(-this.EarthRotAngle));
    this.TransMatMoonToCelest = this.CompTransMatMoonToCelest(this.AxialTilt, this.MoonEcliptic, this.MoonPrecessAngle);
    this.TransMatCelestToGlobe = this.CompTransMatCelestToGlobe(this.ObserverLat, this.ObserverLong);
    this.TransMatDomeToFe = this.CompTransMatDomeToFe(this.EarthRotAngle);
    this.TransMatLocalFeToGlobalFe = this.CompTransMatLocalFeToGlobalFe(this.ObserverFeCoord, this.ObserverLong);

    this.SunCelestAngle = this.DateToSunAngleCelest(this.DateTime);
    this.SunCelestCoord = this.SunAngleToCelestCoord(this.SunCelestAngle);
    this.SunCelestLatLong = this.CoordToLatLong(this.SunCelestCoord);
    this.SunDomeCoord = this.CelestLatLongToDomeCoord(this.SunCelestLatLong.lat, this.SunCelestLatLong.lng);
    this.SunLocalGlobeCoord = this.CelestCoordToLocalGlobeCoord(this.SunCelestCoord);
    this.SunFeCelestSphereCoord = this.LocalGlobeCoordToGlobalFeCoord(JsgVect3.Scale(this.SunLocalGlobeCoord, this.RadiusSphere));

    this.MoonCelestAngle = this.DateToMoonAngleCelest(this.DateTime);
    this.MoonCelestCoord = this.MoonAngleToCelestCoord(this.MoonCelestAngle);
    this.MoonNorthCelestCoord = this.CompMoonNorthCelestCoord();
    this.MoonCelestLatLong = this.CoordToLatLong(this.MoonCelestCoord);
    this.MoonDomeCoord = this.CelestLatLongToDomeCoord(this.MoonCelestLatLong.lat, this.MoonCelestLatLong.lng);
    this.MoonAnglesGlobe = this.CelestCoordToLocalGlobeAngles(this.MoonCelestCoord);
    this.MoonLocalGlobeCoord = this.CelestCoordToLocalGlobeCoord(this.MoonCelestCoord);
    this.MoonFeCelestSphereCoord = this.LocalGlobeCoordToGlobalFeCoord(JsgVect3.Scale(this.MoonLocalGlobeCoord, this.RadiusSphere));

    this.SunAnglesGlobe = this.CelestCoordToLocalGlobeAngles(this.SunCelestCoord);
    var zoomParam = Limit01((this.Zoom - 2) / (this.ZoomMax - 2));
    this.RadiusSphere = (1 - zoomParam) * 3000 + 2000;
    if (this.DomeHeight < this.RadiusSphere) this.RadiusSphere = this.DomeHeight;
  },

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


};

var UpdateAllRunning = false;

function UpdateAll(stopAnimation) {
  if (UpdateAllRunning) return;
  UpdateAllRunning = true;
  try {
    stopAnimation = xDefBool(stopAnimation, true);
    if (stopAnimation) {
      Demos.Reset();
      FeDomeApp.ClearDescription();
    }
    FeDomeApp.Update();
    FeDomeApp.Draw();
  }
  finally {
    UpdateAllRunning = false;
  }
}

function ResetApp() {
  Demos.Reset(false);
  DataX.JsonToAppState(
    'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 360.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }');
  UpdateAll(true, false);
  Demos.UpdateDemoPanels();
}

function TFE() {
  Demos.Reset(false);
  DataX.JsonToAppState(
    'FeDomeApp = { "Description": "TFE", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -79.78324896, "ObserverLong": -83.33692904, "Zoom": 1.4, "CameraDirection": -50, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 2904.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": true, "ShowMoonTrack": true, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }');
  UpdateAll(true, false);
  Demos.UpdateDemoPanels();
}


xOnLoad(
  function () {
    HandleUrlCommands();
    UpdateAll(false, false);
  }
);

DataX.AssignSaveRestoreDomObj('SaveRestorePanel');
DataX.AssignApp('FeDomeApp', FeDomeApp, FeDomeAppMetaData, ResetApp, function () { UpdateAll(true, true); });
DataX.SetupUrlStateHandler('App');

function HandleUrlCommands() {

  Animations.TimeStrech = 1 / DataX.GetUrlNum('speed', 1);
  if (Animations.TimeStrech < 0.01) Animations.TimeStrech = 0.01;
  if (Animations.TimeStrech > 100) Animations.TimeStrech = 100;

  var dataStr = DataX.GetUrlStr('demo');
  if (dataStr != '') {
    location.hash = "#App";
    var play = false;
    var pos = DataX.GetUrlInt('pos', 0);
    if (pos == 0) {
      pos = DataX.GetUrlInt('play', 0);
      play = pos > 0;
    }
    if (pos > 0) {
      pos--;
      setTimeout(
        function () {
          Demos.SetDemo(dataStr, play, pos);
        }, 1000
      );
    } else {
      setTimeout(
        function () {
          Demos.Play(dataStr, true);
        }, 1000
      );
    }
    return;
  }

}


/* Demos Manager */

var AnimationSpeed = 1;  // > 0

var Demos = {
  DemoList: [],
  CurrDemo: null,
  LastDemo: null,
  SusDemo: null,
  SusState: 0,
  CurrModAnim: null,
  CurrAnimStep: 0,
  NewCustomDemoName: '',  // custom demos may have a different name then the demo button
  OnStopFunc: null,

  Init: function () {
    // installed demo button click handlers
    var nDemos = this.DemoList.length;
    for (var i = 0; i < nDemos; i++) {
      this.AddButtonClickHandler(i);
    }
  },

  AddButtonClickHandler: function (id) {
    // id as DemoList index or demo name
    if (xStr(id)) id = this.Find(id);
    var demoName = this.DemoList[id].Name;
    Tabs.AddButtonClickHandler('DomeDemoTabs', demoName + 'Button',
      function (buttonData, event) {
        if (Demos.IsCurrDemoName(demoName) && Demos.IsPlaying()) {
          Demos.Next(false, !Demos.IsTargetIsEndPos());
        } else {
          Demos.Play(demoName, true);
        }
      }
    );
  },

  SetButtonText: function (text, button) {
    button = xDefStr(button, 'Custom');
    var buttonName = button + 'Button';
    xRemoveClass(buttonName, 'TabHide');
    xInnerHTML(buttonName, text);
    this.NewCustomDemoName = text;
  },

  Reset: function (callOnStop) {
    callOnStop = xDefBool(callOnStop, true);
    this.Stop(false);
    this.LastDemo = this.CurrDemo;
    if (this.CurrDemo) {
      this.SusDemo = this.CurrDemo;
      this.SusState = this.CurrDemo.Anim.CurrState;
    }
    this.CurrDemo = null;
    this.UpdateDemoPanels();
    if (this.callOnStop && this.OnStopFunc) this.OnStopFunc();
  },

  Find: function (name) {
    var nDemos = this.DemoList.length;
    for (var i = 0; i < nDemos; i++) {
      if (this.DemoList[i].Name == name || this.DemoList[i].Name2 == name) return i;
    }
    return -1;
  },

  UpdateDemoPanels: function () {
    if (this.LastDemo) {
      xRemoveClass(this.LastDemo.Name + 'Button', 'TabActive');
      this.LastDemo = null;
    }
    if (this.CurrDemo) {
      xAddClass('BackButton', 'TabEnabled');
      xAddClass('PlayButton', 'TabEnabled');
      xAddClass('ForwButton', 'TabEnabled');
      xAddClass('CountButton', 'TabEnabled');
      if (this.IsPlaying()) {
        xInnerHTML('PlayButton', 'Stop');
        xAddClass('PlayButton', 'TabActive');
      } else {
        xInnerHTML('PlayButton', 'Play');
        xRemoveClass('PlayButton', 'TabActive');
      }
      var pos = this.GetCurrPos() + 1;
      if (this.IsEndPos()) {
        pos = 'end';
      } else {
        pos = pos.toFixed(0);
      }
      xInnerHTML('CountButton', pos);
      xAddClass(this.CurrDemo.Name + 'Button', 'TabActive');
    } else {
      if (this.SusDemo) {
        xInnerHTML('PlayButton', 'Resume');
        xAddClass('PlayButton', 'TabEnabled');
        xAddClass('PlayButton', 'TabActive');
        xInnerHTML('CountButton', (this.SusState + 1).toFixed(0));
      } else {
        xInnerHTML('PlayButton', 'Play');
        xInnerHTML('CountButton', 'x');
        xRemoveClass('PlayButton', 'TabEnabled');
      }
      xRemoveClass('CountButton', 'TabEnabled');
      xRemoveClass('BackButton', 'TabEnabled');
      xRemoveClass('ForwButton', 'TabEnabled');
    }
  },

  New: function (name) {
    // returns ModelAnimation
    var anim = NewModelAnimation({
      ModelRef: FeDomeApp,
      OnModelChange: function () { UpdateAll(false, false); },
      PauseTime: 0,
      OnAfterStateChange: function (anim, state) { Demos.UpdateDemoPanels(); },
      OnStopPlaying: function (anim, state) {
        Demos.UpdateDemoPanels();
        if (Demos.OnStopFunc) Demos.OnStopFunc();
      }
    });
    var demo = {
      Name: name,
      Name2: this.NewCustomDemoName,
      Anim: anim,
    };
    this.NewCustomDemoName = '';
    var i = this.Find(name);
    if (i >= 0) {
      this.DemoList[i] = demo;
    } else {
      this.DemoList.push(demo);
    }
    this.CurrModAnim = anim;
    this.CurrAnimStep = 0;
    return anim;
  },

  AddState: function (jsonState) {
    var anim = this.CurrModAnim;
    if (!anim) return;
    anim.OnSetState(this.CurrAnimStep,
      function () {
        // prevent setting state for inactive demos
        if (Demos.CurrDemo && Demos.CurrDemo.Anim == anim) {
          DataX.JsonToAppState(jsonState);
        }
      }
    );
    this.CurrAnimStep++;
  },

  AddAnimation: function (animDef) {
    var anim = this.CurrModAnim;
    if (!anim) reurn;
    anim.AnimationToState(this.CurrAnimStep, animDef);
  },

  IsActive: function () {
    return this.CurrDemo != null;
  },

  IsCurrDemoName: function (name) {
    if (!this.CurrDemo) return false;
    return this.CurrDemo.Name == name;
  },

  IsPlaying: function () {
    if (!this.CurrDemo) return false;
    return this.CurrDemo.Anim.IsPlaying;
  },

  IsTransient: function () {
    if (!this.CurrDemo) return false;
    var anim = this.CurrDemo.Anim;
    return anim.CurrState != anim.TargetState;
  },

  GetCurrPos: function () {
    if (!this.CurrDemo) return 0;
    return this.CurrDemo.Anim.CurrState;
  },

  GetNStates: function () {
    if (!this.CurrDemo) return 0;
    return this.CurrDemo.Anim.NStates;
  },

  GetLastPos: function () {
    if (!this.CurrDemo) return 0;
    return this.CurrDemo.Anim.NStates - 1;
  },

  IsStartPos: function () {
    return this.GetCurrPos() == 0;
  },

  IsEndPos: function () {
    if (!this.CurrDemo) return false;
    var anim = this.CurrDemo.Anim;
    return anim.CurrState == anim.NStates - 1;
  },

  IsTargetIsEndPos: function () {
    if (!this.CurrDemo) return false;
    var anim = this.CurrDemo.Anim;
    return anim.TargetState == anim.NStates - 1;
  },

  Stop: function (callOnStop) {
    callOnStop = xDefBool(callOnStop, true);
    if (!this.CurrDemo) return;
    this.CurrDemo.Anim.Stop();
    this.UpdateDemoPanels();
    if (callOnStop && this.OnStopFunc) this.OnStopFunc();
  },

  SetPos: function (pos, play) {
    if (!this.CurrDemo) return;
    this.Stop(false);
    var anim = this.CurrDemo.Anim;
    if (pos > anim.NStates - 1) pos = anim.NStates - 1;
    if (pos < 0) pos = 0;
    anim.SetState(pos);
    if (play) {
      this.Play();
    } else {
      if (this.OnStopFunc) this.OnStopFunc();
    }
  },

  Next: function (wrap, play) {
    if (this.IsEndPos()) {
      if (wrap) {
        this.SetPos(0, play);
      } else {
        this.SetPos(this.GetCurrPos());
      }
    } else {
      this.SetPos(this.GetCurrPos() + 1, play);
    }
  },

  Prev: function (wrap, play) {
    if (this.IsTransient()) {
      this.SetPos(this.GetCurrPos(), play);
    } else {
      if (this.IsStartPos()) {
        if (wrap) {
          this.SetPos(this.GetNStates() - 1, play);
        } else {
          this.SetPos(0, play);
        }
      } else {
        this.SetPos(this.GetCurrPos() - 1, play);
      }
    }
  },

  Step: function (wrap, back, play) {
    if (back) {
      this.Prev(wrap, play);
    } else {
      this.Next(wrap, play);
    }
  },

  IsNewName: function (name) {
    return this.CurrDemo && this.CurrDemo.Name != name;
  },

  RequestName: function (name) {
    if (!xStr(name)) {
      if (!this.CurrDemo) return '';
      name = this.CurrDemo.Name;
    }
    return name;
  },

  Play: function (name, reset) {
    // name: string; name of a new demo or null for current demo
    name = this.RequestName(name);
    if (name == '') return;
    if (this.IsCurrDemoName(name)) {
      if (this.IsPlaying()) return;
    } else {
      this.Stop(false);
    }

    // assert: !this.IsPlaying() -> start new demo or restart curr demo
    if (!this.IsCurrDemoName(name)) {
      if (!this.SetNewDemo(name)) return;
    }
    var demo = this.CurrDemo;
    if (reset) demo.Anim.Reset();
    demo.Anim.Play();
    this.UpdateDemoPanels();
  },

  SetDemo: function (name, play, pos) {
    // name: string; name of a new demo or null for current demo
    pos = xDefNum(pos, 0);
    this.Stop(false);
    if (this.IsCurrDemoName(name)) {
      this.SetPos(pos, play);
      return;
    }

    // assert: !this.IsPlaying() -> start new demo
    if (this.SetNewDemo(name)) {
      this.SetPos(pos, play);
    }
  },

  SetSusDemo: function (play) {
    if (!this.SusDemo) return;
    this.SetDemo(this.SusDemo.Name, play, this.SusState);
  },

  SetNewDemo: function (name) {
    // private function
    var i = this.Find(name);
    if (i < 0) return false;
    this.LastDemo = this.CurrDemo;
    this.CurrDemo = this.DemoList[i];
    return true;
  },

  PlayStop: function (cont) {
    if (!this.CurrDemo) return;
    if (this.IsPlaying()) {
      this.Stop(true);
      return;
    }
    // not playing
    if (this.IsTransient() && !cont) {
      this.Prev();
    }
    this.Play();
  },
};

xOnLoad(
  function () {
    Demos.Init();
    Tabs.AddButtonClickHandler('DomeDemoTabs', 'ResetButton',
      function (buttonData) {
        ResetApp();
      }
    );
    Tabs.AddButtonClickHandler('DomeDemoTabs', 'TFEButton',
      function (buttonData) {
        TFE();
      }
    );
  }
);

xOnDomReady(
  function () {
    var boxTabName = 'DomeDemoTabs';
    Tabs.AddButtonClickHandler(boxTabName, 'BackButton',
      function (buttonData) {
        Demos.Prev();
      }
    );
    Tabs.AddButtonClickHandler(boxTabName, 'ForwButton',
      function (buttonData) {
        Demos.Next(true);
      }
    );
    Tabs.AddButtonClickHandler(boxTabName, 'PlayButton',
      function (buttonData) {
        if (Demos.IsActive()) {
          if (Demos.IsPlaying()) {
            Demos.Stop();
          } else {
            Demos.Play();
          }
        } else {
          Demos.SetSusDemo();
        }
      }
    );
    Tabs.AddButtonClickHandler(boxTabName, 'CountButton',
      function (buttonData) {
        if (Demos.IsEndPos()) {
          Demos.SetPos(0);
        } else {
          Demos.SetPos(Demos.GetLastPos());
        }
      }
    );
  }
);

Object.assign(globalThis, {
  ThisPageUrl, ThisPageShortUrl, FeDomeAppMetaData, FeDomeApp,
  UpdateAllRunning, UpdateAll, ResetApp, TFE, HandleUrlCommands,
  AnimationSpeed, Demos,
  ToRad, ToDeg, sqr, Limit1, Limit01, ToRange,
});
export {
  ThisPageUrl, ThisPageShortUrl, FeDomeAppMetaData, FeDomeApp,
  UpdateAllRunning, UpdateAll, ResetApp, TFE, HandleUrlCommands,
  AnimationSpeed, Demos,
  ToRad, ToDeg, sqr, Limit1, Limit01, ToRange,
};
