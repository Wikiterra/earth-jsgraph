// Refraction button handlers (Std/Zero)
// Extracted from inline script lines 3789-3872



function CLengthModel() {
  this.m = 0;
  this.km = 0;
  this.sm = 0;
  this.mile = 0;
  this.in = 0;
  this.cm = 0;
  this.ft = 0;
  this.fl = 0;
  this.mLast = 0;
  this.kmLast = 0;
  this.smLast = 0;
  this.mileLast = 0;
  this.inLast = 0;
  this.cmLast = 0;
  this.ftLast = 0;
  this.flLast = 0;
}

CLengthModel.prototype.calcOthersFromMeter = function() {
  this.km = this.m / 1000;
  this.sm = this.m / 1852;
  this.mile = this.m / 1609.344;
  this.in = this.m / 0.0254;
  this.cm = this.m * 100;
  this.ft = this.m / 0.3048;
  this.fl = this.ft / 100;
}

CLengthModel.prototype.Update = function() {
  if (this.m != this.mLast) {
    this.calcOthersFromMeter();
  }
  else if (this.km != this.kmLast) {
    this.m = this.km * 1000;
    this.calcOthersFromMeter();
  }
  else if (this.sm != this.smLast) {
    this.m = this.sm * 1852;
    this.calcOthersFromMeter();
  }
  else if (this.mile != this.mileLast) {
    this.m = this.mile * 1609.344;
    this.calcOthersFromMeter();
  }
  else if (this.in != this.inLast) {
    this.m = this.in * 0.0254;
    this.calcOthersFromMeter();
  }
  else if (this.cm != this.cmLast) {
    this.m  = this.cm / 100;
    this.calcOthersFromMeter();
  }
  else if (this.ft != this.ftLast) {
    this.m = this.ft * 0.3048;
    this.calcOthersFromMeter();
  }
  else if (this.fl != this.flLast) {
    this.m = this.fl * 100 * 0.3048;
    this.calcOthersFromMeter();
  }
  this.mLast = this.m;
  this.kmLast = this.km;
  this.smLast = this.sm;
  this.mileLast = this.mile;
  this.inLast = this.in;
  this.cmLast = this.cm;
  this.ftLast = this.ft;
  this.flLast = this.fl;
}

var LengthModel = new CLengthModel();

function UpdateLengthModel() {
  LengthModel.Update();
  ControlPanels.Update( 'Units-Calculator' );
}

function CAngleModel() {
  this.deg = 0;
  this.rad = 0;
  this.grad = 0;
  this.arcmin = 0;
  this.arcsec = 0;
  this.degLast = 0;
  this.radLast = 0;
  this.gradLast = 0;
  this.arcminLast = 0;
  this.arcsecLast = 0;
}

CAngleModel.prototype.calcOthersFromDeg = function() {
  this.rad = this.deg * Math.PI / 180;
  this.grad = this.deg * 200 / 180;
  this.arcmin = this.deg * 60;
  this.arcsec = this.deg * 3600;
}

CAngleModel.prototype.Update = function() {
  if (this.deg != this.degLast) {
    this.calcOthersFromDeg();
  }
  else if (this.rad != this.radLast) {
    this.deg = this.rad * 180 / Math.PI;
    this.calcOthersFromDeg();
  }
  else if (this.grad != this.gradLast) {
    this.deg = this.grad * 180 / 200;
    this.calcOthersFromDeg();
  }
  else if (this.arcmin != this.arcminLast) {
    this.deg = this.arcmin / 60;
    this.calcOthersFromDeg();
  }
  else if (this.arcsec != this.arcsecLast) {
    this.deg = this.arcsec / 3600;
    this.calcOthersFromDeg();
  }
  this.degLast = this.deg;
  this.radLast = this.rad;
  this.gradLast = this.grad;
  this.arcminLast = this.arcmin;
  this.arcsecLast = this.arcsec;
}

var AngleModel = new CAngleModel();

function UpdateAngleModel() {
  AngleModel.Update();
  ControlPanels.Update( 'Angle-Calculator' );
}

xOnLoad(function() {
  UpdateLengthModel();
  UpdateAngleModel();
});

Object.assign(globalThis, { CLengthModel, LengthModel, UpdateLengthModel, CAngleModel, AngleModel, UpdateAngleModel });
