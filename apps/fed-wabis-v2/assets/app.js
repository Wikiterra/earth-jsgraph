var ThisPageUrl = location.href;
var ThisPageShortUrl = location.href;

// set EarthMap colors and polygone mode (3D)
EarthMap.SetWaterColor('#d3e2f5');
EarthMap.SetLakeColor('#d3e2f5', '#8cbe5d');
EarthMap.SetContinentColor(null, '#c6dfaf', '#8cbe5d');
EarthMap.SetLandColor('Antarctica', '#eee', '#ccc');
EarthMap.FEMode = 2; // use PolygonOnPlane to draw map

// (ToRad, ToDeg, sqr, Limit1, Limit01, ToRange are now in jsgraph-vendor/src/core/helpers.js)

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
    { Name: 'ShowSun', Type: 'bool', Default: true },
    { Name: 'ShowMoon', Type: 'bool', Default: true },
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
  ShowSun: true,
  ShowMoon: true,
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
    'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 360.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSun": true, "ShowMoon": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }');
  UpdateAll(true);
  Demos.UpdateDemoPanels();
}

function TFE() {
  Demos.Reset(false);
  DataX.JsonToAppState(
    'FeDomeApp = { "Description": "TFE", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -79.78324896, "ObserverLong": -83.33692904, "Zoom": 1.4, "CameraDirection": -50, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 2904.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSun": true, "ShowMoon": true, "ShowSunTrack": true, "ShowMoonTrack": true, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }');
  UpdateAll(true);
  Demos.UpdateDemoPanels();
}


xOnLoad(
  function () {
    HandleUrlCommands();
    UpdateAll(false);
  }
);

DataX.AssignSaveRestoreDomObj('SaveRestorePanel');
DataX.AssignApp('FeDomeApp', FeDomeApp, FeDomeAppMetaData, ResetApp, function () { UpdateAll(true); });
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

Object.assign(globalThis, {
  ThisPageUrl, ThisPageShortUrl, FeDomeAppMetaData, FeDomeApp,
  UpdateAllRunning, UpdateAll, ResetApp, TFE, HandleUrlCommands,
});
