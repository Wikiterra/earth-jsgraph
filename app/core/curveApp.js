// =============================================================================
// curveApp.js - CurveAppClass: the calculator's data model and math engine.
//   - Stores inputs (height, distance, refraction, view params, objects)
//   - Computes horizon, refraction, target visibility, camera params, scene geometry
// =============================================================================

function CurveAppClass() {

  // choosen units tables
  this.UnitsType = 0;  // 0 -> m, 1 -> mi/ft, 2 -> ft
  this.LengthUnits = {
    Selection: '.UnitsType',
    Units: [ 'm', 'mi', 'ft' ],
    Mults: [ 1, 1609.344, 0.3048 ]
  };
  this.BigLengthUnits = {
    Selection: '.UnitsType',
    Units: [ 'km', 'mi', 'ft' ],
    Mults: [ 1000, 1609.344, 0.3048 ]
  };
  this.HeightUnits = {
    Selection: '.UnitsType',
    Units: [ 'm', 'ft', 'ft' ],
    Mults: [ 1, 0.3048, 0.3048 ]
  };
  this.GradientUnits = {
    Selection: '.UnitsType',
    Units: [ '°C/m', '°C/ft', '°C/ft' ],
    Mults: [ 1, 1/0.3048, 1/0.3048 ]
  };

  this.DemoText = '';
  this.Description = '';
  this.AllStatesChanged = false;
  this.OverlayImage = '';
  this.OverlayImageAlpha = 0.5;
  this.AlphaOpaque = 1;
  this.pause = 0; // dummy for animation delays

  this.RadiusEarth = 6371000;
  this.EquatorRadiusFE = 10007543; // this.RadiusEarth * PI90;
  this.NGridLines = 45;
  this.GridSpacing = 0;
  this.ShowModel = 1; // 1 -> globe, 2 -> flat, 3 -> both mirrored, 4 -> both side by side
  this.showGrid = 1; // 0 -> none, 1 -> on, 3 -> projection of globe to flat
  this.showData = true; // true if any of the 3 following values are true (see Update)
  this.ShowDataObject = true;
  this.ShowDataRefraction = true;
  this.ShowDataHorizon = true;
  this.ShowLftRghtDrop = false;
  this.showTangent = false;
  this.showEyeLevel = true;
  this.ShowTheodolite = false;
  this.DeviceRatio = 3 / 2; // width / height of device screen
  this.SceneWidth = 0;
  this.SceneHeight = 0;
  this.ViewcenterHorizon = 0;  // 0 -> globe, 1 -> flat earth, 2 -> between, 3 -> eye level

  // refraction
  this.BaroModel = null;
  // RefractionSync = 0 -> off, 1 -> T,P, 2 -> std, 3 -> k=0.13, 4 -> k=0.17, 5 -> a=7/6, 6 -> a=7/2
  this.RefractionSync = 0;
  this.RefractionFactMax = 10000;
  this.RefractionFactMin = 0.5;
  this.Pressure_mbar = 1013.25;
  this.PressureLast_mbar = 1013.25;
  this.Temperature_K = 288.15;
  this.Temperature_C = 15;
  this.TemperatureLast_C = 15;
  this.TemperatureGradient = -0.0065;  // K/m
  this.TemperatureGradientLast = -0.0065;
  this.RefractionCoeff = 0;
  this.RefractionCoeffLast = 0;
  this.RefractionFactor = 1;
  this.RefractionFactorLast = 1;
  this.RefractedRadiusEarth = this.RadiusEarth;
  this.RefractedRadiusEarthLast = this.RadiusEarth;
  this.RefractionSlider = 0;
  this.RefractionSliderLast = 0;
  this.HeightSlider = 0;
  this.HeightSliderLast = 0;
  this.Height = 2;

  this.ViewAngle = 0;  // viewAngle in deg (field of view)
  this.ViewAngleField = 0;
  this.ViewAngleSlider = 0;
  this.ViewAngleSliderLast = 0;
  this.Roll = 0;
  this.Tilt = 0;
  this.LastTilt = 0;
  this.TiltSlider = 0;
  this.LastTiltSlider = 0;
  this.Pan = 0;
  this.LastPan = 0;
  this.PanSlider = 0;
  this.LastPanSlider = 0;
  this.PanRad = 0;
  this.FocalLength = 0;
  this.FocalLengthField = 3000;
  this.FocalLengthSlider = 0;
  this.FocalLengthSliderLast = 0;

  this.HorizDistOnEyeLvl = 0;       // d
  this.HorizSurfDist = 0;           // s
  this.HorizDropFromEyeLvl = 0;     // p
  this.HorizDropAnglFromEyeLvl = 0; // alpha
  this.EarthCentrToHorizDisc = 0;   // R - b
  this.HorizDropFromObsSurf = 0;    // b
  this.ObjDropFromObsSurf = 0;
  this.ObjDropAnglFromObsSurf = 0;
  this.Bulge = 0;
  this.HorizDistLineOfSight = 0;    // v
  this.GridDeltaAngl = 0;           // about HorizDropAnglFromEyeLvl / NGridLines
  this.PosEarthCenter = [ 0, 0, -this.RefractedRadiusEarth ]; // origin is at Observer EyeLevel

  this.HorizLftRgtWidth = 0;
  this.HorizLftRgtDist = 0;
  this.HorizLftRgtDropAngl = 0;
  this.HorizLftRgtDrop = 0;

  this.CamViewAngl = 0.1; // rad
  this.CamPos = [ 0, 0, 0 ];
  this.CamUp = [ 0, 0, 1 ];
  this.CamViewCenter = [ 0, 1, 0 ];
  this.CamSceneSize = 1;
  this.TheodoliteTilt = 0;

  // special additional flat earth perspective transformations (flerspective)
  this.Flerspective = 0;    // 0 -> normal, 1 -> flerspective // feature removed
  this.RefDistance = 10000; // feature removed

  // object settings
  this.NearObjIx = 0;
  this.ObjType = [ 0, 0 ]; // 0 = M-Rod, 1 = mountain
  this.ObjSideType = [ 0, 0 ]; // 0 = lin, 1 = 2col, 2 = rand, 3 = cos, 4 = sin
  this.ObjSizeType = [ 1, 1 ]; // 1 = lin, 2 = rand, 3 = cos, 4 = sin

  this.ObjSurfDist = [ 12000, 20000 ];
  this.SliderObjSurfDistLog = [ 0, 0 ];
  this.SliderObjSurfDistLogLast = [ 0, 0 ];

  this.ObjSidePos = [ 0, 0 ];
  this.SliderObjSidePosLog = [ 0, 0 ];
  this.SliderObjSidePosLogLast = [ 0, 0 ];

  this.ObjSize = [ 10, 10 ];
  this.SliderObjSizeLog = [ 0, 0 ];
  this.SliderObjSizeLogLast = [ 0, 0 ];

  this.ObjDeltaDist = [ 300, 300 ];
  this.SliderObjDeltaDistLog = [ 0, 0 ];
  this.SliderObjDeltaDistLogLast = [ 0, 0 ];

  this.ObjSideVar = [ 0, 0 ];
  this.SliderObjSideVarLog = [ 0, 0 ];
  this.SliderObjSideVarLogLast = [ 0, 0 ];

  this.ObjSizeVar = [ 0, 0 ];
  this.NObjects = [ 1, 0 ];

  // object draw loop variables
  this.ObjDeltaAngl = [ 0, 0 ];
  this.ObjFirstAngl = [ 0, 0 ];
  this.ObjLastAngl = [ 0, 0 ];
  this.NObjectsDrawn = [ 0, 0 ];
  this.MaxNObjectsToDraw = [ 0, 0 ];
  this.CurrentObjAngl = [ 0, 0 ];
  this.IsHiddenObj = [ false, false ];
  this.LastPosValid = [ false, false ];

  // computed object values
  this.HorizRefrAngl = 0;
  this.ObjRefrAngl = 0;
  this.ObjLiftAbs = 0;
  this.ObjLiftRelToHoriz = 0;
  this.HorizonLift = 0;
  this.ObjNearSize = 0;
  this.ObjNearTilt = 0;
  this.ObjSizeAngl = 0;
  this.ObjHiddenAngl = 0;
  this.ObjVisibleAngl = 0;
  this.ObjRealSurfDist = 0;  // distance along surface taking refraction, ObjSurfDist and ObjSidePos into account
  this.ObjSurfDistAngl = 0;
  this.ObjHidden = 0;
  this.ObjVisi = 0;
  this.ObjTopAnglFromEyeLvl = 0;  // angle from observer tangent to top of object (90 - zenith angle) in deg
  this.ObjTopAnglFromEyeLvlFE = 0;

  // colors; for some elements '' -> do not draw element
  this.EyeLvlCol = 'magenta';
  this.FEEqCol = 'black';
  this.FEGridCol = 'black';
  this.GlobeGridCol = 'blue';
  this.GlobeFGridCol = 'red';
  this.TangentCol = 'black';
  this.FrameCol = 'black';

  this.Update();
}

CurveAppClass.prototype.IsShowGlobe = function() {
  return (this.ShowModel & 1) || this.ShowModel == 4;
}

CurveAppClass.prototype.IsShowFlatEarth = function() {
  return (this.ShowModel & 2) || this.ShowModel == 4;
}

CurveAppClass.prototype.IsShowBothModels = function() {
  return this.ShowModel >= 3;
}

CurveAppClass.prototype.IsShowBothModelsMirror = function() {
  return this.ShowModel == 3;
}

CurveAppClass.prototype.IsNearestObject = function( objIx ) {
  // returns true if the current object drawn is the nearest object to the observer
  return this.NObjectsDrawn[objIx] == this.NObjects[objIx]-1;
}

CurveAppClass.prototype.IsFurthestObject = function( objIx ) {
  // returns true if the current object drawn is the furthest object to the observer
  return this.NObjectsDrawn[objIx] == 0;
}

CurveAppClass.prototype.GetObjectSizeVar = function( objIx ) {
  // some object sizes like M-Rod are dependent on ObjSizeVar
  var sizeVar = 1;
  if (this.ObjType[objIx] == 0) {
    // M-Rod make size: var 0.1..11 for values of -1..+1 where 0 -> 1
    sizeVar = this.ObjSizeVar[objIx];
    if (sizeVar < 0) {
      sizeVar = 1 + sizeVar;
      if (sizeVar < 0.1) sizeVar = 0.1;
    } else {
      sizeVar = 10 * sizeVar + 1;
    }
  }
  return sizeVar;
}

CurveAppClass.prototype.IsVariableSizeObject = function( objIx ) {
  // M-Rod is never variable, all the same size, but ObjSizeVar defines its size too, see GetObjectSizeVar()
  return this.ObjType[objIx] != 0 && Math.abs(this.ObjSizeVar[objIx]) > 0.01;
}

CurveAppClass.prototype.Update = function() {

  this.showData = this.ShowDataObject || this.ShowDataRefraction || this.ShowDataHorizon;

  // input validation
  if ( this.RadiusEarth  < 100000 ) this.RadiusEarth  = 100000;
  if ( this.EquatorRadiusFE < 100000 ) this.EquatorRadiusFE = 100000;
  if (this.NGridLines > 200) this.NGridLines = 200;
  if (this.NGridLines < 0) this.NGridLines = 0;
  this.ShowModel = Math.floor(this.ShowModel);
  if (this.ShowModel < 1 || this.ShowModel > 4) this.ShowModel = 1;
  this.showGrid = Math.floor(this.showGrid);
  if (this.showGrid < 0 || this.showGrid > 3) this.showGrid = 1;
  if (this.DeviceRatio <= 0) this.DeviceRatio = DeviceRatio_Off;
  this.ViewcenterHorizon = Math.floor(this.ViewcenterHorizon);
  if (this.ViewcenterHorizon < 0 || this.ViewcenterHorizon > 3) this.ViewcenterHorizon = 0;

  // handle height changes
  if ( this.HeightSliderLast != this.HeightSlider ) {
    this.Height = Math.pow( 10, -1 + 6 * this.HeightSlider );
  }
  if ( this.Height < 0.001 ) this.Height = 0.001;
  if ( this.Height > 1000000000 ) this.Height = 1000000000;
  this.HeightSlider = ( Math.log10( this.Height ) + 1 ) / 6;
  this.HeightSliderLast = this.HeightSlider;
  if (this.BaroModel) {
    // BaroModel depends on Height
    this.BaroModel.Update();
  }

  // handle refraction changes
  // RefractionSync: 0 -> off, 1 -> T,P, 2 -> std, 3 -> k=0.13, 4 -> k=0.17, 5 -> a=7/6, 6 -> a=7/2

  this.RefractionSync = Math.floor(this.RefractionSync);
  if (this.RefractionSync < 0 || this.RefractionSync > 6) this.RefractionSync = 1;
  if (this.RefractionFactMin < 0.1) this.RefractionFactMin = 0.1;
  if (this.RefractionFactMin > 1) this.RefractionFactMin = 1;
  if (this.RefractionFactMax < 10000) this.RefractionFactMax = 10000;
  var k_min = 1 - 1 / this.RefractionFactMin;
  var k_max = 1 - 1 / this.RefractionFactMax;
  if (this.RefractionCoeff < k_min) this.RefractionCoeff = k_min;
  if (this.RefractionCoeff > k_max) this.RefractionCoeff = k_max;
  if (this.Pressure_mbar < 0) this.Pressure_mbar = 0;
  if (this.Pressure_mbar > 1200) this.Pressure_mbar = 1200;
  if (this.Temperature_C < -100) this.Temperature_C = -100;
  if (this.Temperature_C > 100) this.Temperature_C = 100;

  // revert sync mode to T,P or off if some refraction values have changed manually
  if (this.AllStatesChanged) {
    // refractionsSync has priority if multiple values have changed
    if (this.RefractionSync == 2 || this.RefractionSync == 0) {
      // ensure that TemperatureGradient has priority
      this.TemperatureGradientLast = this.TemperatureGradient + 1;
      this.RefractionCoeffLast = this.RefractionCoeff;
    } else {
      // ensure that RefractionCoeff has priority
      this.RefractionCoeffLast = this.RefractionCoeff + 1;
      this.TemperatureGradientLast = this.TemperatureGradient;
    }
  } else {
    if (this.RefractionSync >= 2 &&
        (this.RefractionSlider != this.RefractionSliderLast ||
         this.TemperatureGradient != this.TemperatureGradientLast ||
         this.RefractionCoeff != this.RefractionCoeffLast ||
         this.RefractionFactor != this.RefractionFactorLast ||
         this.RefractedRadiusEarth != this.RefractedRadiusEarthLast)
    )
    {
      this.RefractionSync = 1;
    } else if (this.RefractionSync > 0 &&
               (this.Temperature_C != this.TemperatureLast_C ||
                this.Pressure_mbar != this.PressureLast_mbar)
    )
    {
      this.RefractionSync = 0;
    }
  }

  // synchronize refraction Pressure_mbar, temp and gradient with baro settings
  if (this.RefractionSync >= 1) {
    if (this.Height > 84852) {
      this.Temperature_C = -86.204;
      this.Pressure_mbar = 0.00373383;
      if (this.RefractionSync == 2) {
        this.TemperatureGradient = -0.002;
        this.TemperatureGradientLast = this.TemperatureGradient - 1; // indicate a change
        this.RefractionCoeffLast = this.RefractionCoeff;
      }
    } else if (this.BaroModel) {
      var baroModel = this.BaroModel;
      this.Temperature_C = baroModel.T_C;
      this.Pressure_mbar = baroModel.p / 100;
      if (this.RefractionSync == 2) {
        this.TemperatureGradient = baroModel.alpha;
        this.TemperatureGradientLast = this.TemperatureGradient - 1; // indicate a change
        this.RefractionCoeffLast = this.RefractionCoeff;
      }
    }
  }

  // handle sync modes
  if (this.RefractionSync == 3) {
    this.RefractionCoeff = 0.13;
    this.RefractionCoeffLast = this.RefractionCoeff + 1; // indicate change
  } else if (this.RefractionSync == 4) {
    this.RefractionCoeff = 0.17;
    this.RefractionCoeffLast = this.RefractionCoeff + 1; // indicate change
  } else if (this.RefractionSync == 5) {
    this.RefractionFactor = 7 / 6;
    this.RefractionFactorLast = this.RefractionFactor + 1; // indicate change
  } else if (this.RefractionSync == 6) {
    this.RefractionFactor = 7 / 2;
    this.RefractionFactorLast = this.RefractionFactor + 1; // indicate change
  }

  // handle changes of refraction input fields and sliders
  this.Temperature_K = this.Temperature_C + 273.15;
  if (this.RefractionSlider != this.RefractionSliderLast) {
    // slider changed
    if (Math.abs(this.RefractionSlider) < 0.01) this.RefractionSlider = 0; // snap to 0
    this.RefractionCoeff = k_max * this.RefractionSlider;
  } else if (this.RefractionCoeff != this.RefractionCoeffLast) {
    // k changed
  } else if (this.TemperatureGradient != this.TemperatureGradientLast) {
    // dT/dh changed
    if (this.Temperature_K < 3) this.Temperature_K = 3;
    this.RefractionCoeff = 503 * (this.Pressure_mbar / (this.Temperature_K*this.Temperature_K)) * (0.0343 + this.TemperatureGradient);
  } else if (this.RefractionFactor != this.RefractionFactorLast) {
    // a changed
    if (this.RefractionFactor < this.RefractionFactMin) this.RefractionFactor = this.RefractionFactMin;
    if (this.RefractionFactor > this.RefractionFactMax) this.RefractionFactor = this.RefractionFactMax;
    this.RefractionCoeff = 1 - 1 / this.RefractionFactor;
  } else if (this.RefractedRadiusEarth != this.RefractedRadiusEarthLast) {
    // R' changed
    this.RefractionFactor = this.RefractedRadiusEarth / this.RadiusEarth;
    if (this.RefractionFactor < this.RefractionFactMin) this.RefractionFactor = this.RefractionFactMin;
    if (this.RefractionFactor > this.RefractionFactMax) this.RefractionFactor = this.RefractionFactMax;
    this.RefractionCoeff = 1 - 1 / this.RefractionFactor;
  }

  // limit some inputs
  if (this.RefractionCoeff < k_min) this.RefractionCoeff = k_min;
  if (this.RefractionCoeff > k_max) this.RefractionCoeff = k_max;
  if (this.Temperature_K < 3) this.Temperature_K = 3;
  if (this.Temperature_K > 10000) this.Temperature_K = 10000;
  this.Temperature_C = this.Temperature_K - 273.15;
  if (this.Pressure_mbar < 0.001) this.Pressure_mbar = 0.001;
  if (this.Pressure_mbar > 10000) this.Pressure_mbar = 10000;
  if (Math.abs(this.RefractionCoeff) < 0.000002) this.RefractionCoeff = 0;

  // compute refraction values
  this.TemperatureGradient = (this.RefractionCoeff * this.Temperature_K * this.Temperature_K) / (503 * this.Pressure_mbar) - 0.0343;
  if (Math.abs(this.TemperatureGradient) < 0.000001) this.TemperatureGradient = 0;
  this.RefractionFactor = 1 / (1 - this.RefractionCoeff);
  this.RefractedRadiusEarth = this.RadiusEarth * this.RefractionFactor;
  this.RefractionSlider = this.RefractionCoeff / k_max;

  // store current refration values for detecting user changes
  this.RefractionSliderLast = this.RefractionSlider;
  this.RefractionCoeffLast = this.RefractionCoeff;
  this.TemperatureGradientLast = this.TemperatureGradient;
  this.RefractionFactorLast = this.RefractionFactor;
  this.RefractedRadiusEarthLast = this.RefractedRadiusEarth;
  this.TemperatureLast_C = this.Temperature_C;
  this.PressureLast_mbar = this.Pressure_mbar;

  // handle ViewAngle and FocalLength changes
  if ( this.FocalLengthSlider != this.FocalLengthSliderLast ) {
    var f = (10000-21) * Math.pow(this.FocalLengthSlider,2) + 21;  // f = 21..10000
    this.ViewAngle = toDeg( 2 * Math.atan( 43.2 / 2 / f ) );
  } else if ( this.FocalLengthField != this.FocalLength ) {
    this.ViewAngle = toDeg( 2 * Math.atan( 43.2 / 2 / this.FocalLengthField ) );
  } else if ( this.ViewAngleSlider != this.ViewAngleSliderLast ) {
    this.ViewAngle = this.ViewAngleSlider;
  } else if ( this.ViewAngleField != this.ViewAngle ) {
    this.ViewAngle = this.ViewAngleField;
  }
  if ( this.ViewAngle < 0.1 ) this.ViewAngle = 0.1;
  if ( this.ViewAngle > 160 ) this.ViewAngle = 160;
  this.CamViewAngl = toRad( this.ViewAngle );
  this.FocalLength = 43.2 / ( 2 * Math.tan( this.CamViewAngl / 2 ) );
  this.FocalLengthField = this.FocalLength;
  var f = this.FocalLength - 21;
  if (f < 0) f = 0;
  this.FocalLengthSlider = Math.pow(f/(10000-21),1/2);
  this.FocalLengthSliderLast = this.FocalLengthSlider;
  this.ViewAngleField = this.ViewAngle;
  this.ViewAngleSlider = this.ViewAngle;
  this.ViewAngleSliderLast = this.ViewAngle;

  this.UpdateObjectInput(0);
  this.UpdateObjectInput(1);

  // compute diverse values
  this.HorizDropAnglFromEyeLvl = Math.acos( this.RefractedRadiusEarth / (this.RefractedRadiusEarth + this.Height) );
  this.HorizDistOnEyeLvl = this.RefractedRadiusEarth * Math.sin( this.HorizDropAnglFromEyeLvl );
  this.HorizSurfDist = this.RefractedRadiusEarth * this.HorizDropAnglFromEyeLvl;
  this.EarthCentrToHorizDisc = this.RefractedRadiusEarth * Math.cos( this.HorizDropAnglFromEyeLvl );
  this.HorizDropFromObsSurf = this.RefractedRadiusEarth - this.EarthCentrToHorizDisc;
  this.HorizDropFromEyeLvl = this.HorizDropFromObsSurf + this.Height;
  this.HorizDistLineOfSight = ( this.Height + this.RefractedRadiusEarth ) * Math.sin( this.HorizDropAnglFromEyeLvl );

  var exp2 = Math.floor( Math.log( PI90 / this.HorizDropAnglFromEyeLvl ) / Math.LN2 );
  this.GridDeltaAngl = (PI90 / Math.pow( 2, exp2 ) / this.NGridLines);
  this.GridSpacing = this.IsShowGlobe() ? this.GridDeltaAngl * this.RefractedRadiusEarth : 0;
  this.PosEarthCenter = [ 0, 0, -(this.RefractedRadiusEarth + this.Height) ];

  // Tilt and Pan slider synchronization
  if (this.Tilt != this.LastTilt) {
    if (this.Tilt < -85) this.Tilt = -85;
    if (this.Tilt >  45) this.Tilt =  45;
    if (this.Tilt > 0) {
      this.TiltSlider = Math.sqrt( this.Tilt / 45 );
    } else {
      this.TiltSlider = - Math.sqrt( -this.Tilt / 85 );
    }
  } else if (this.TiltSlider != this.LastTiltSlider) {
    if (this.TiltSlider > 0) {
      this.Tilt = Math.pow( this.TiltSlider, 2 ) * 45;
    } else {
      this.Tilt = - Math.pow( this.TiltSlider, 2 ) * 85;
    }
  }
  this.LastTilt = this.Tilt;
  this.LastTiltSlider = this.TiltSlider;

  if (this.Pan != this.LastPan) {
    if (this.Pan < -180) this.Pan = -180;
    if (this.Pan >  180) this.Pan =  180;
    if (this.Pan > 0) {
      this.PanSlider = Math.sqrt( this.Pan / 90 );
    } else {
      this.PanSlider = - Math.sqrt( -this.Pan / 90 );
    }
  } else if (this.PanSlider != this.LastPanSlider) {
    if (this.PanSlider > 0) {
      this.Pan = Math.pow( this.PanSlider, 2 ) * 90;
    } else {
      this.Pan = - Math.pow( this.PanSlider, 2 ) * 90;
    }
  }
  this.PanRad = toRad( this.Pan );
  this.LastPan = this.Pan;
  this.LastPanSlider = this.PanSlider;

  // compute CamViewCenter from panning
  if (this.Roll < -180) this.Roll = -180;
  if (this.Roll >  180) this.Roll = 180;
  this.CompCameraParams( this.PanRad, this.Tilt, this.Roll );

  // compute scene size taking device ratio into account
  var vpRatio = 3 / 2;
  var diag = 2 * this.HorizDistLineOfSight * Math.tan( this.CamViewAngl / 2 );
  this.SceneHeight = diag / Math.sqrt( 1 + this.DeviceRatio*this.DeviceRatio );
  this.SceneWidth = this.DeviceRatio * this.SceneHeight;
  if ( this.DeviceRatio > vpRatio ) {
    // device is wider then viewport
    this.CamSceneSize = this.SceneWidth / vpRatio;
  } else {
    this.CamSceneSize = this.SceneHeight;
  }

  // compute horizon left right drop (0 = whole earth in view, can't calculate left right drop)
  var yFieldOfView2 = toRad( this.ViewAngle ) / Math.sqrt( 1 + 1 / (this.DeviceRatio*this.DeviceRatio) ) / 2;
  var width2HorLRDrop = this.HorizDistLineOfSight * Math.sin( yFieldOfView2 );
  if (width2HorLRDrop < this.HorizDistOnEyeLvl) {
    this.HorizLftRgtWidth = width2HorLRDrop * 2;
    this.HorizLftRgtDist = Math.sqrt( this.HorizDistOnEyeLvl*this.HorizDistOnEyeLvl - width2HorLRDrop*width2HorLRDrop );
    var angVertHorizLRDrop = Math.atan( this.HorizLftRgtDist / this.HorizDropFromEyeLvl );
    var angHorizLRDrop_rad = Math.PI/2 - this.HorizDropAnglFromEyeLvl - angVertHorizLRDrop;
    this.HorizLftRgtDropAngl = toDeg( angHorizLRDrop_rad );
    this.HorizLftRgtDrop = this.HorizDistLineOfSight * Math.sin( angHorizLRDrop_rad );
  } else {
    this.HorizLftRgtDist = 0;
    this.HorizLftRgtWidth = 0;
    this.HorizLftRgtDropAngl = 0;
    this.HorizLftRgtDrop = 0;
  }

  function compObjVect( dist, side, size, rad, h ) {
    // dist and side are along surface
    var R = rad + size;
    var a1 = side / rad;
    var a2 = dist / rad;
    var r = R * Math.cos( a1 );
    var vx = R * Math.sin( a1 );
    var vy = r * Math.sin( a2 );
    var vz = r * Math.cos( a2 ) - (rad + h);
    return [ vx, vy, vz ];
  }

  function compViewDist( v ) {
    return Math.sqrt( v[0]*v[0] + v[1]*v[1] + v[2]*v[2] );
  }

  function compVectAng( v1, v2 ) {
    var sp = JsgVect3.ScalarProd( JsgVect3.Norm(v1), JsgVect3.Norm(v2) );
    if (sp >  1) sp =  1; // handle rounding errors
    if (sp < -1) sp = -1; // handle rounding errors
    return Math.acos( sp );
  }

  // horizon refraction
  if (Math.abs(this.RadiusEarth - this.RefractedRadiusEarth) > 1e-5) {
    var dropAngle_geom = Math.acos( this.RadiusEarth / (this.RadiusEarth + this.Height) );
    var horizSurfDist_geom = this.RadiusEarth * dropAngle_geom;
    var vectToHorizon_geom = compObjVect( horizSurfDist_geom, 0, 0, this.RadiusEarth, this.Height );
    var vectToHorizon_refracted = compObjVect( this.HorizSurfDist, 0, 0, this.RefractedRadiusEarth, this.Height );
    this.HorizRefrAngl = toDeg( compVectAng( vectToHorizon_geom, vectToHorizon_refracted ) );
    if (this.RefractionCoeff < 0) this.HorizRefrAngl *= -1;
  } else {
    this.HorizRefrAngl = 0;
  }

  // some computed object values
  var objIx = 0;
  if (this.NObjects[0] == 0) objIx = 1;
  if (this.NObjects[0] > 0 && this.NObjects[1] > 0 && this.ObjSurfDist[0] > this.ObjSurfDist[1]) objIx = 1;
  this.NearObjIx = objIx;

  if (this.NObjects[objIx] > 0) {

    // ObjRealSurfDist = distance from origin to object base along surface
    var vectObjPos = compObjVect( this.ObjSurfDist[objIx], this.ObjSidePos[objIx], 0, this.RefractedRadiusEarth, -this.RefractedRadiusEarth );
    this.ObjSurfDistAngl = compVectAng( vectObjPos, [ 0, 0, this.RefractedRadiusEarth ] );
    this.ObjRealSurfDist = this.ObjSurfDistAngl * this.RefractedRadiusEarth;

    // Bulge and drop
    var d2r = Math.sin( this.ObjRealSurfDist / (2 * this.RefractedRadiusEarth) );
    this.Bulge = this.RefractedRadiusEarth * (1 - Math.sqrt(1 - d2r*d2r));
    this.ObjDropFromObsSurf = this.RefractedRadiusEarth * (1 - Math.cos( this.ObjRealSurfDist / this.RefractedRadiusEarth ) );
    var hdist = this.RefractedRadiusEarth * Math.sin( this.ObjRealSurfDist / this.RefractedRadiusEarth );
    this.ObjDropAnglFromObsSurf = toDeg( Math.atan( this.ObjDropFromObsSurf / hdist ) );

    this.ObjNearSize = this.GetObjectSizeVar(objIx) * this.ObjSize[objIx];
    var vectToObjBase_refracted = compObjVect( this.ObjSurfDist[objIx], this.ObjSidePos[objIx], 0, this.RefractedRadiusEarth, this.Height );
    var vectToObjTop_refracted  = compObjVect( this.ObjSurfDist[objIx], this.ObjSidePos[objIx], this.ObjNearSize, this.RefractedRadiusEarth, this.Height );
    var vectToObjBase_geom = compObjVect( this.ObjSurfDist[objIx], this.ObjSidePos[objIx], 0, this.RadiusEarth, this.Height );

    var objUpDir = JsgVect3.Sub( vectToObjTop_refracted, vectToObjBase_refracted );
    this.ObjNearTilt = toDeg( compVectAng( [0,0,1], objUpDir ) );
    this.ObjSizeAngl = toDeg( compVectAng( vectToObjBase_refracted, vectToObjTop_refracted ) );
    if (Math.abs(this.ObjSizeAngl) < 1e-5) this.ObjSizeAngl = 0;
    this.ObjRefrAngl = toDeg( compVectAng( vectToObjBase_geom, vectToObjBase_refracted ) );
    if (Math.abs(this.ObjRefrAngl) < 1e-5) this.ObjRefrAngl = 0;
    if (this.RefractionCoeff < 0) this.ObjRefrAngl *= -1;

    this.ObjLiftAbs = 0;
    this.ObjLiftRelToHoriz = 0;
    this.HorizonLift = 0;
    if (this.ObjSizeAngl != 0) {
      this.ObjLiftAbs = this.ObjNearSize * this.ObjRefrAngl / this.ObjSizeAngl;
      this.HorizonLift = this.ObjNearSize * this.HorizRefrAngl / this.ObjSizeAngl;
      this.ObjLiftRelToHoriz = this.ObjLiftAbs - this.HorizonLift;
    }

    // compute hidden part
    if (this.ObjSurfDistAngl > this.HorizDropAnglFromEyeLvl) {

      // object lies behind horizon
      var cosaHorObj = Math.cos( this.ObjSurfDistAngl - this.HorizDropAnglFromEyeLvl );
      this.ObjHidden = this.RefractedRadiusEarth * ( 1 - cosaHorObj ) / cosaHorObj;
      this.ObjVisi = this.ObjNearSize - this.ObjHidden;
      if (this.ObjVisi < 0) this.ObjVisi = 0;
      this.ObjHiddenAngl = this.ObjSizeAngl * this.ObjHidden / this.ObjNearSize;
      this.ObjVisibleAngl = this.ObjSizeAngl * this.ObjVisi / this.ObjNearSize;

    } else {

      // object lies in front of horizon
      this.ObjHidden = 0;
      this.ObjVisi = this.ObjNearSize;
      this.ObjHiddenAngl = 0;
      this.ObjVisibleAngl = this.ObjSizeAngl;
    }

    // compute vertical angle from horizontal to target top (= 90 deg - zenith angle)
    // c = line of sight observer to target top
    var a = this.RefractedRadiusEarth + this.Height;
    var b = this.RefractedRadiusEarth + this.ObjNearSize;
    var c = Math.sqrt( a*a + b*b -2*a*b * Math.cos( this.ObjRealSurfDist / this.RefractedRadiusEarth ) );
    var a1 = (c*c - b*b + a*a) / (2 * a);
    this.ObjTopAnglFromEyeLvl = -Math.asin( a1 / c ) * 180 / Math.PI;
    this.ObjTopAnglFromEyeLvlFE = Math.atan( (this.ObjSize[objIx] - this.Height) / this.ObjRealSurfDist ) * 180 / Math.PI;


  } else {

    this.Bulge = 0;
    this.ObjDropFromObsSurf = 0;
    this.ObjDropAnglFromObsSurf = 0;
    this.ObjRefrAngl = this.HorizRefrAngl;
    this.ObjLiftAbs = 0;
    this.HorizonLift = 0;
    this.ObjLiftRelToHoriz = 0;
    this.ObjSizeAngl = 0;
    this.ObjHidden = 0;
    this.ObjVisi = 0;
    this.ObjHiddenAngl = 0;
    this.ObjVisibleAngl = 0;
    this.ObjRealSurfDist = 0;
    this.ObjSurfDistAngl = 0;

  }
  this.AllStatesChanged = false;

}

CurveAppClass.prototype.CompCameraParams = function( pan, tilt, roll, aimModel ) {
  var dvc, avc;
  dvc = Math.sqrt( this.HorizDistOnEyeLvl * this.HorizDistOnEyeLvl + this.HorizDropFromEyeLvl * this.HorizDropFromEyeLvl );
  if (this.ViewcenterHorizon == 0) {
    // view center is "the horizon" — aim at the horizon of the model being drawn
    // so it stays fixed (centred) under zoom. In Globe+FE comparison mode each
    // half passes aimModel ('globe' | 'fe') so both horizon lines land at the
    // same screen height; otherwise we auto-pick by which model is shown (the
    // globe dip angle when the globe is visible, else the shallow FE equator).
    var aimGlobe = (aimModel === 'globe') ? true
                 : (aimModel === 'fe')    ? false
                 : this.IsShowGlobe();
    if (aimGlobe) {
      avc = this.HorizDropAnglFromEyeLvl;
    } else {
      avc = Math.atan( this.Height / this.EquatorRadiusFE );
    }
  } else if (this.ViewcenterHorizon == 1) {
    // view center is flat earth equator
    avc = Math.atan( this.Height / this.EquatorRadiusFE );
  } else if (this.ViewcenterHorizon == 2) {
    // view center is between globe horizon and flat earth equator
    avc = (Math.atan( this.Height / this.EquatorRadiusFE ) + this.HorizDropAnglFromEyeLvl) / 2;
  } else {
    // view center is eye level
    avc = 0;
  }
  avc -= toRad( tilt );
  if ( avc > 0.9999*PI90 ) avc = 0.9999*PI90;
  if ( avc < -0.9999*PI90 ) avc = -0.9999*PI90;
  this.TheodoliteTilt = -avc * 180 / Math.PI;
  var zvc = - dvc * Math.sin( avc );
  var rvc = dvc * Math.cos( avc );
  var xvc = rvc * Math.sin( pan );
  var yvc = rvc * Math.cos( pan );
  this.CamViewCenter = [ xvc, yvc, zvc ];
  var nvc = JsgVect3.Norm( this.CamViewCenter );
  var v = JsgVect3.Norm( [ xvc, yvc, 0 ] );
  var n = JsgVect3.Mult( v, [ 0, 0, 1 ] );
  var up = JsgVect3.Mult( n, nvc );

  // compute camera up and pos
  var a = toRad( roll );
  this.CamUp = JsgVect3.Add( JsgVect3.Scale( n, Math.sin(a) ), JsgVect3.Scale( up, Math.cos(a) ) );
  this.CamPos = [ 0, 0, 0 ];
}

CurveAppClass.prototype.UpdateObjectInput = function( objIx ) {

  // object settings
  this.NObjects[objIx] = Math.round(this.NObjects[objIx]);
  if (this.NObjects[objIx] < 0) this.NObjects[objIx] = 0;
  if (this.NObjects[objIx] > 500) this.NObjects[objIx] = 500;

  if (this.SliderObjSurfDistLogLast[objIx] != this.SliderObjSurfDistLog[objIx]) {
    var distSign = this.SliderObjSurfDistLog[objIx] < 0 ? -1 : 1;
    var distVal = Math.abs( this.SliderObjSurfDistLog[objIx] );
    if (distVal < 1) {
      this.ObjSurfDist[objIx] = 100 * distVal;
    } else {
      this.ObjSurfDist[objIx] = 10 * Math.pow( 10, this.SliderObjSurfDistLog[objIx] );
    }
    this.ObjSurfDist[objIx] *= distSign;
  }
  var distLimit = this.RefractedRadiusEarth * Math.PI / 2;
  if (this.ObjSurfDist[objIx] < -distLimit) this.ObjSurfDist[objIx] = -distLimit;
  if (this.ObjSurfDist[objIx] >  distLimit) this.ObjSurfDist[objIx] =  distLimit;
  var distSign = this.ObjSurfDist[objIx] < 0 ? -1 : 1;
  var distVal  = Math.abs( this.ObjSurfDist[objIx] );
  if (distVal < 100) {
    this.SliderObjSurfDistLog[objIx] = distVal / 100;
  } else {
    this.SliderObjSurfDistLog[objIx] = Math.log10( distVal / 10 );
  }
  this.SliderObjSurfDistLog[objIx] *= distSign;
  this.SliderObjSurfDistLogLast[objIx] = this.SliderObjSurfDistLog[objIx];

  if (this.SliderObjSidePosLog[objIx] != this.SliderObjSidePosLogLast[objIx]) {
    var sidePosSign = this.SliderObjSidePosLog[objIx] < 0 ? -1 : 1;
    var sidePosVal = Math.abs( this.SliderObjSidePosLog[objIx] );
    if (sidePosVal < 1) {
      this.ObjSidePos[objIx] = 100 * sidePosVal;
    } else {
      this.ObjSidePos[objIx] = 10 * Math.pow( 10, sidePosVal );
    }
    this.ObjSidePos[objIx] *= sidePosSign;
  }
  var sidePosLimit = this.RefractedRadiusEarth * Math.PI / 4;
  if (this.ObjSidePos[objIx] < -sidePosLimit) this.ObjSidePos[objIx] = -sidePosLimit;
  if (this.ObjSidePos[objIx] > sidePosLimit) this.ObjSidePos[objIx] = sidePosLimit;
  var sidePosSign = this.ObjSidePos[objIx] < 0 ? -1 : 1;
  var sidePosVal = Math.abs( this.ObjSidePos[objIx] );
  if (sidePosVal < 100) {
    this.SliderObjSidePosLog[objIx] = sidePosVal / 100;
  } else {
    this.SliderObjSidePosLog[objIx] = Math.log10( sidePosVal / 10 );
  }
  this.SliderObjSidePosLog[objIx] *= sidePosSign;
  this.SliderObjSidePosLogLast[objIx] = this.SliderObjSidePosLog[objIx];

  if (this.SliderObjSideVarLog[objIx] != this.SliderObjSideVarLogLast[objIx]) {
    var sideVarSign = this.SliderObjSideVarLog[objIx] < 0 ? -1 : 1;
    var sideVarVal = Math.abs( this.SliderObjSideVarLog[objIx] );
    if (sideVarVal < 1) {
      this.ObjSideVar[objIx] = 10 * sideVarVal;
    } else {
      this.ObjSideVar[objIx] = Math.pow( 10, sideVarVal );
    }
    this.ObjSideVar[objIx] *= sideVarSign;
  }
  var sideVarLimit = this.RefractedRadiusEarth * Math.PI / 4;
  if (this.ObjSideVar[objIx] < -sideVarLimit) this.ObjSideVar[objIx] = -sideVarLimit;
  if (this.ObjSideVar[objIx] > sideVarLimit) this.ObjSideVar[objIx] = sideVarLimit;
  var sideVarSign = this.ObjSideVar[objIx] < 0 ? -1 : 1;
  var sideVarVal = Math.abs( this.ObjSideVar[objIx] );
  if (sideVarVal < 10) {
    this.SliderObjSideVarLog[objIx] = sideVarVal / 10;
  } else {
    this.SliderObjSideVarLog[objIx] = Math.log10( sideVarVal );
  }
  this.SliderObjSideVarLog[objIx] *= sideVarSign;
  this.SliderObjSideVarLogLast[objIx] = this.SliderObjSideVarLog[objIx];

  if (this.SliderObjSizeLog[objIx] != this.SliderObjSizeLogLast[objIx]) {
    this.ObjSize[objIx] = Math.pow( 10, this.SliderObjSizeLog[objIx] );
  }
  if (this.ObjSize[objIx] < 0.001) this.ObjSize[objIx] = 0.001;
  if (this.ObjSize[objIx] > 1e9) this.ObjSize[objIx] = 1e9;
  this.SliderObjSizeLog[objIx] = Math.log10( this.ObjSize[objIx] );
  this.SliderObjSizeLogLast[objIx] = this.SliderObjSizeLog[objIx];

  if (this.SliderObjDeltaDistLog[objIx] != this.SliderObjDeltaDistLogLast[objIx]) {
    this.ObjDeltaDist[objIx] = 10 * Math.pow( 10, this.SliderObjDeltaDistLog[objIx] );
  }
  var deltaDistLimit = this.RefractedRadiusEarth * PI90;
  if (this.ObjDeltaDist[objIx] < 0.001) this.ObjDeltaDist[objIx] = 0.001;
  if (this.ObjDeltaDist[objIx] > deltaDistLimit) this.ObjDeltaDist[objIx] = deltaDistLimit;
  this.SliderObjDeltaDistLog[objIx] = Math.log10( this.ObjDeltaDist[objIx] / 10 );
  this.SliderObjDeltaDistLogLast[objIx] = this.SliderObjDeltaDistLog[objIx];

}

