// @ts-check
// =============================================================================
// curveApp.js - CurveAppClass: the calculator's data model and math engine.
//   - Stores inputs (height, distance, refraction, view params, objects)
//   - Computes horizon, refraction, target visibility, camera params, scene geometry
// =============================================================================

/**
 * @typedef {Object} CurveAppInstance
 * @property {number} UnitsType
 * @property {{Selection:string, Units:string[], Mults:number[]}} LengthUnits
 * @property {{Selection:string, Units:string[], Mults:number[]}} BigLengthUnits
 * @property {{Selection:string, Units:string[], Mults:number[]}} HeightUnits
 * @property {{Selection:string, Units:string[], Mults:number[]}} GradientUnits
 * @property {string} DemoText
 * @property {string} Description
 * @property {boolean} AllStatesChanged
 * @property {string} OverlayImage
 * @property {number} OverlayImageAlpha
 * @property {number} AlphaOpaque
 * @property {number} pause
 * @property {number} RadiusEarth
 * @property {number} EquatorRadiusFE
 * @property {number} NGridLines
 * @property {number} GridSpacing
 * @property {number} ShowModel    — 1=globe, 2=flat, 3=both mirrored, 4=both side by side
 * @property {number} showGrid     — 0=none, 1=on, 3=projection
 * @property {boolean} showData
 * @property {boolean} ShowDataObject
 * @property {boolean} ShowDataRefraction
 * @property {boolean} ShowDataHorizon
 * @property {boolean} ShowLftRghtDrop
 * @property {boolean} showTangent
 * @property {boolean} showEyeLevel
 * @property {boolean} ShowTheodolite
 * @property {number} DeviceRatio   — width/height
 * @property {number} SceneWidth
 * @property {number} SceneHeight
 * @property {number} ViewcenterHorizon  — 0=globe, 1=FE, 2=between, 3=eye level
 * @property {any} BaroModel
 * @property {number} RefractionSync  — 0=off, 1=T,P, 2=std, 3=k=0.13, 4=k=0.17, 5=a=7/6, 6=a=7/2
 * @property {number} RefractionFactMax
 * @property {number} RefractionFactMin
 * @property {number} Pressure_mbar
 * @property {number} PressureLast_mbar
 * @property {number} Temperature_K
 * @property {number} Temperature_C
 * @property {number} TemperatureLast_C
 * @property {number} TemperatureGradient  — dT/dh K/m
 * @property {number} TemperatureGradientLast
 * @property {number} RefractionCoeff
 * @property {number} RefractionCoeffLast
 * @property {number} RefractionFactor
 * @property {number} RefractionFactorLast
 * @property {number} RefractedRadiusEarth
 * @property {number} RefractedRadiusEarthLast
 * @property {number} RefractionSlider
 * @property {number} RefractionSliderLast
 * @property {number} HeightSlider
 * @property {number} HeightSliderLast
 * @property {number} Height
 * @property {number} ViewAngle       — FOV in degrees
 * @property {number} ViewAngleField
 * @property {number} ViewAngleSlider
 * @property {number} ViewAngleSliderLast
 * @property {number} Roll
 * @property {number} Tilt
 * @property {number} LastTilt
 * @property {number} TiltSlider
 * @property {number} LastTiltSlider
 * @property {number} Pan
 * @property {number} LastPan
 * @property {number} PanSlider
 * @property {number} LastPanSlider
 * @property {number} PanRad
 * @property {number} FocalLength
 * @property {number} FocalLengthField
 * @property {number} FocalLengthSlider
 * @property {number} FocalLengthSliderLast
 * @property {number} HorizDistOnEyeLvl
 * @property {number} HorizSurfDist
 * @property {number} HorizDropFromEyeLvl
 * @property {number} HorizDropAnglFromEyeLvl
 * @property {number} EarthCentrToHorizDisc
 * @property {number} HorizDropFromObsSurf
 * @property {number} ObjDropFromObsSurf
 * @property {number} ObjDropAnglFromObsSurf
 * @property {number} Bulge
 * @property {number} HorizDistLineOfSight
 * @property {number} GridDeltaAngl
 * @property {number[]} PosEarthCenter
 * @property {number} HorizLftRgtWidth
 * @property {number} HorizLftRgtDist
 * @property {number} HorizLftRgtDropAngl
 * @property {number} HorizLftRgtDrop
 * @property {number} CamViewAngl
 * @property {number[]} CamPos
 * @property {number[]} CamUp
 * @property {number[]} CamViewCenter
 * @property {number} CamSceneSize
 * @property {number} TheodoliteTilt
 * @property {number} Flerspective
 * @property {number} RefDistance
 * @property {number} NearObjIx
 * @property {number[]} ObjType
 * @property {number[]} ObjSideType
 * @property {number[]} ObjSizeType
 * @property {number[]} ObjSurfDist
 * @property {number[]} SliderObjSurfDistLog
 * @property {number[]} SliderObjSurfDistLogLast
 * @property {number[]} ObjSidePos
 * @property {number[]} SliderObjSidePosLog
 * @property {number[]} SliderObjSidePosLogLast
 * @property {number[]} ObjSize
 * @property {number[]} SliderObjSizeLog
 * @property {number[]} SliderObjSizeLogLast
 * @property {number[]} ObjDeltaDist
 * @property {number[]} SliderObjDeltaDistLog
 * @property {number[]} SliderObjDeltaDistLogLast
 * @property {number[]} ObjSideVar
 * @property {number[]} SliderObjSideVarLog
 * @property {number[]} SliderObjSideVarLogLast
 * @property {number[]} ObjSizeVar
 * @property {number[]} NObjects
 * @property {number[]} ObjDeltaAngl
 * @property {number[]} ObjFirstAngl
 * @property {number[]} ObjLastAngl
 * @property {number[]} NObjectsDrawn
 * @property {number[]} MaxNObjectsToDraw
 * @property {number[]} CurrentObjAngl
 * @property {boolean[]} IsHiddenObj
 * @property {boolean[]} LastPosValid
 * @property {number} HorizRefrAngl
 * @property {number} ObjRefrAngl
 * @property {number} ObjLiftAbs
 * @property {number} ObjLiftRelToHoriz
 * @property {number} HorizonLift
 * @property {number} ObjNearSize
 * @property {number} ObjNearTilt
 * @property {number} ObjSizeAngl
 * @property {number} ObjHiddenAngl
 * @property {number} ObjVisibleAngl
 * @property {number} ObjRealSurfDist
 * @property {number} ObjSurfDistAngl
 * @property {number} ObjHidden
 * @property {number} ObjVisi
 * @property {number} ObjTopAnglFromEyeLvl
 * @property {number} ObjTopAnglFromEyeLvlFE
 * @property {string} EyeLvlCol
 * @property {string} FEEqCol
 * @property {string} FEGridCol
 * @property {string} GlobeGridCol
 * @property {string} GlobeFGridCol
 * @property {string} TangentCol
 * @property {string} FrameCol
 */

/**
 * CurveAppClass — data model + math engine for the curvature calculator.
 * @constructor
 * @returns {CurveAppInstance}
 */
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

/**
 * Check whether globe model should be drawn.
 * @returns {boolean}
 */
CurveAppClass.prototype.IsShowGlobe = function() {
  return (this.ShowModel & 1) || this.ShowModel == 4;
}

/**
 * Check whether flat earth model should be drawn.
 * @returns {boolean}
 */
CurveAppClass.prototype.IsShowFlatEarth = function() {
  return (this.ShowModel & 2) || this.ShowModel == 4;
}

/**
 * Check whether both models should be drawn (split-screen).
 * @returns {boolean}
 */
CurveAppClass.prototype.IsShowBothModels = function() {
  return this.ShowModel >= 3;
}

/**
 * Check whether both models are in mirror mode.
 * @returns {boolean}
 */
CurveAppClass.prototype.IsShowBothModelsMirror = function() {
  return this.ShowModel == 3;
}

/**
 * Returns true if objIx is the nearest object to the observer.
 * @param {number} objIx
 * @returns {boolean}
 */
CurveAppClass.prototype.IsNearestObject = function( objIx ) {
  // returns true if the current object drawn is the nearest object to the observer
  return this.NObjectsDrawn[objIx] == this.NObjects[objIx]-1;
}

/**
 * Returns true if objIx is the furthest object from the observer.
 * @param {number} objIx
 * @returns {boolean}
 */
CurveAppClass.prototype.IsFurthestObject = function( objIx ) {
  // returns true if the current object drawn is the furthest object to the observer
  return this.NObjectsDrawn[objIx] == 0;
}

/**
 * Get effective object size including size variation.
 * For M-Rods (type 0), ObjSizeVar controls the size directly.
 * @param {number} objIx
 * @returns {number}
 */
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

/**
 * Returns true if the object at objIx has variable-sized instances.
 * M-Rods are never variable — all the same size.
 * @param {number} objIx
 * @returns {boolean}
 */
CurveAppClass.prototype.IsVariableSizeObject = function( objIx ) {
  // M-Rod is never variable, all the same size, but ObjSizeVar defines its size too, see GetObjectSizeVar()
  return this.ObjType[objIx] != 0 && Math.abs(this.ObjSizeVar[objIx]) > 0.01;
}

CurveAppClass.prototype.Update = function() {

  this.showData = this.ShowDataObject || this.ShowDataRefraction || this.ShowDataHorizon;

  // input validation
  if ( this.RadiusEarth  < EARTH_RADIUS_MIN ) this.RadiusEarth  = EARTH_RADIUS_MIN;
  if ( this.EquatorRadiusFE < EARTH_RADIUS_MIN ) this.EquatorRadiusFE = EARTH_RADIUS_MIN;
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
    this.Height = sliderToHeight(this.HeightSlider);
  }
  if ( this.Height < HEIGHT_MIN ) this.Height = HEIGHT_MIN;
  if ( this.Height > HEIGHT_MAX ) this.Height = HEIGHT_MAX;
  this.HeightSlider = heightToSlider(this.Height);
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
  this.Temperature_K = this.Temperature_C + KELVIN_OFFSET;
  if (this.RefractionSlider != this.RefractionSliderLast) {
    // slider changed
    this.RefractionCoeff = sliderToRefractionCoeff(this.RefractionSlider, k_max);
  } else if (this.RefractionCoeff != this.RefractionCoeffLast) {
    // k changed
  } else if (this.TemperatureGradient != this.TemperatureGradientLast) {
    // dT/dh changed
    if (this.Temperature_K < TEMP_K_MIN) this.Temperature_K = TEMP_K_MIN;
    this.RefractionCoeff = computeRefractionCoeff(this.Pressure_mbar, this.Temperature_K, this.TemperatureGradient);
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
  if (this.Temperature_K < TEMP_K_MIN) this.Temperature_K = TEMP_K_MIN;
  if (this.Temperature_K > TEMP_K_MAX) this.Temperature_K = TEMP_K_MAX;
  this.Temperature_C = this.Temperature_K - KELVIN_OFFSET;
  if (this.Pressure_mbar < PRESSURE_MIN_MBAR) this.Pressure_mbar = PRESSURE_MIN_MBAR;
  if (this.Pressure_mbar > PRESSURE_MAX_MBAR) this.Pressure_mbar = PRESSURE_MAX_MBAR;
  if (Math.abs(this.RefractionCoeff) < 0.000002) this.RefractionCoeff = 0;

  // compute refraction values
  this.TemperatureGradient = computeTempGradientFromK(this.RefractionCoeff, this.Temperature_K, this.Pressure_mbar);
  if (Math.abs(this.TemperatureGradient) < 0.000001) this.TemperatureGradient = 0;
  this.RefractionFactor = computeRefractionFactor(this.RefractionCoeff);
  this.RefractedRadiusEarth = computeRefractedRadius(this.RadiusEarth, this.RefractionFactor);
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
    this.ViewAngle = focalLengthToViewAngle(focalLengthSliderToFocalLength(this.FocalLengthSlider));
  } else if ( this.FocalLengthField != this.FocalLength ) {
    this.ViewAngle = focalLengthToViewAngle(this.FocalLengthField);
  } else if ( this.ViewAngleSlider != this.ViewAngleSliderLast ) {
    this.ViewAngle = this.ViewAngleSlider;
  } else if ( this.ViewAngleField != this.ViewAngle ) {
    this.ViewAngle = this.ViewAngleField;
  }
  if ( this.ViewAngle < VIEW_ANGLE_MIN ) this.ViewAngle = VIEW_ANGLE_MIN;
  if ( this.ViewAngle > VIEW_ANGLE_MAX ) this.ViewAngle = VIEW_ANGLE_MAX;
  this.CamViewAngl = toRad( this.ViewAngle );
  this.FocalLength = viewAngleToFocalLength(this.ViewAngle);
  this.FocalLengthField = this.FocalLength;
  this.FocalLengthSlider = focalLengthToSlider(this.FocalLength);
  this.FocalLengthSliderLast = this.FocalLengthSlider;
  this.ViewAngleField = this.ViewAngle;
  this.ViewAngleSlider = this.ViewAngle;
  this.ViewAngleSliderLast = this.ViewAngle;

  this.UpdateObjectInput(0);
  this.UpdateObjectInput(1);

  // compute diverse values
  var hg = computeHorizonGeometry(this.RefractedRadiusEarth, this.Height);
  this.HorizDropAnglFromEyeLvl = hg.horizDropAnglFromEyeLvl;
  this.HorizDistOnEyeLvl = hg.horizDistOnEyeLvl;
  this.HorizSurfDist = hg.horizSurfDist;
  this.EarthCentrToHorizDisc = hg.earthCentrToHorizDisc;
  this.HorizDropFromObsSurf = hg.horizDropFromObsSurf;
  this.HorizDropFromEyeLvl = hg.horizDropFromEyeLvl;
  this.HorizDistLineOfSight = hg.horizDistLineOfSight;

  var exp2 = Math.floor( Math.log( PI90 / this.HorizDropAnglFromEyeLvl ) / Math.LN2 );
  this.GridDeltaAngl = (PI90 / Math.pow( 2, exp2 ) / this.NGridLines);
  this.GridSpacing = this.IsShowGlobe() ? this.GridDeltaAngl * this.RefractedRadiusEarth : 0;
  this.PosEarthCenter = [ 0, 0, -(this.RefractedRadiusEarth + this.Height) ];

  // Tilt and Pan slider synchronization
  if (this.Tilt != this.LastTilt) {
    if (this.Tilt < TILT_MIN) this.Tilt = TILT_MIN;
    if (this.Tilt >  TILT_MAX) this.Tilt =  TILT_MAX;
    this.TiltSlider = tiltToSlider(this.Tilt, TILT_MIN, TILT_MAX);
  } else if (this.TiltSlider != this.LastTiltSlider) {
    this.Tilt = sliderToTilt(this.TiltSlider, TILT_MIN, TILT_MAX);
  }
  this.LastTilt = this.Tilt;
  this.LastTiltSlider = this.TiltSlider;

  if (this.Pan != this.LastPan) {
    if (this.Pan < PAN_MIN) this.Pan = PAN_MIN;
    if (this.Pan >  PAN_MAX) this.Pan =  PAN_MAX;
    this.PanSlider = panToSlider(this.Pan);
  } else if (this.PanSlider != this.LastPanSlider) {
    this.Pan = sliderToPan(this.PanSlider);
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
  var lrd = computeLeftRightDrop(
    this.ViewAngle, this.DeviceRatio,
    this.HorizDistLineOfSight, this.HorizDistOnEyeLvl,
    this.HorizDropAnglFromEyeLvl, this.HorizDropFromEyeLvl
  );
  this.HorizLftRgtWidth = lrd.horizLftRgtWidth;
  this.HorizLftRgtDist = lrd.horizLftRgtDist;
  this.HorizLftRgtDropAngl = lrd.horizLftRgtDropAngl;
  this.HorizLftRgtDrop = lrd.horizLftRgtDrop;

  // horizon refraction
  this.HorizRefrAngl = computeHorizonRefractionAngle(
    this.RadiusEarth, this.RefractedRadiusEarth,
    this.Height, this.HorizSurfDist, this.RefractionCoeff
  );

  // some computed object values
  var objIx = 0;
  if (this.NObjects[0] == 0) objIx = 1;
  if (this.NObjects[0] > 0 && this.NObjects[1] > 0 && this.ObjSurfDist[0] > this.ObjSurfDist[1]) objIx = 1;
  this.NearObjIx = objIx;

  if (this.NObjects[objIx] > 0) {

    this.ObjNearSize = this.GetObjectSizeVar(objIx) * this.ObjSize[objIx];

    var objGeom = computeObjectGeometry(
      this.ObjSurfDist[objIx], this.ObjSidePos[objIx], this.ObjNearSize,
      this.RefractedRadiusEarth, this.RadiusEarth, this.Height,
      this.HorizDropAnglFromEyeLvl, this.HorizRefrAngl, this.RefractionCoeff
    );

    this.ObjSurfDistAngl = objGeom.objSurfDistAngl;
    this.ObjRealSurfDist = objGeom.objRealSurfDist;
    this.Bulge = objGeom.bulge;
    this.ObjDropFromObsSurf = objGeom.objDropFromObsSurf;
    this.ObjDropAnglFromObsSurf = objGeom.objDropAnglFromObsSurf;
    this.ObjNearTilt = objGeom.objNearTilt;
    this.ObjSizeAngl = objGeom.objSizeAngl;
    this.ObjRefrAngl = objGeom.objRefrAngl;
    this.ObjLiftAbs = objGeom.objLiftAbs;
    this.ObjLiftRelToHoriz = objGeom.objLiftRelToHoriz;
    this.HorizonLift = objGeom.horizonLift;
    this.ObjHidden = objGeom.objHidden;
    this.ObjVisi = objGeom.objVisi;
    this.ObjHiddenAngl = objGeom.objHiddenAngl;
    this.ObjVisibleAngl = objGeom.objVisibleAngl;
    this.ObjTopAnglFromEyeLvl = objGeom.objTopAnglFromEyeLvl;
    this.ObjTopAnglFromEyeLvlFE = objGeom.objTopAnglFromEyeLvlFE;

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

/**
 * Compute camera position, up vector, and view center from pan/tilt/roll
 * and the current horizon geometry. Supports split-screen aiming ('globe' | 'fe').
 * @param {number} pan       — pan angle in radians
 * @param {number} tilt      — tilt angle in degrees
 * @param {number} roll      — roll angle in degrees
 * @param {string} [aimModel] — 'globe' | 'fe' (for split-screen mode)
 */
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

/**
 * Synchronize slider ↔ value for one object's settings (distance, side pos,
 * size, delta dist, side variation).
 * @param {number} objIx — object index (0 or 1)
 */
CurveAppClass.prototype.UpdateObjectInput = function( objIx ) {

  // object settings
  this.NObjects[objIx] = Math.round(this.NObjects[objIx]);
  if (this.NObjects[objIx] < 0) this.NObjects[objIx] = 0;
  if (this.NObjects[objIx] > 500) this.NObjects[objIx] = 500;

  // Surface distance
  if (this.SliderObjSurfDistLogLast[objIx] != this.SliderObjSurfDistLog[objIx]) {
    this.ObjSurfDist[objIx] = sliderToObjSurfDist(this.SliderObjSurfDistLog[objIx]);
  }
  var distLimit = this.RefractedRadiusEarth * Math.PI / 2;
  if (this.ObjSurfDist[objIx] < -distLimit) this.ObjSurfDist[objIx] = -distLimit;
  if (this.ObjSurfDist[objIx] >  distLimit) this.ObjSurfDist[objIx] =  distLimit;
  this.SliderObjSurfDistLog[objIx] = objSurfDistToSlider(this.ObjSurfDist[objIx]);
  this.SliderObjSurfDistLogLast[objIx] = this.SliderObjSurfDistLog[objIx];

  // Side position
  if (this.SliderObjSidePosLog[objIx] != this.SliderObjSidePosLogLast[objIx]) {
    this.ObjSidePos[objIx] = sliderToObjSidePos(this.SliderObjSidePosLog[objIx]);
  }
  var sidePosLimit = this.RefractedRadiusEarth * Math.PI / 4;
  if (this.ObjSidePos[objIx] < -sidePosLimit) this.ObjSidePos[objIx] = -sidePosLimit;
  if (this.ObjSidePos[objIx] > sidePosLimit) this.ObjSidePos[objIx] = sidePosLimit;
  this.SliderObjSidePosLog[objIx] = objSidePosToSlider(this.ObjSidePos[objIx]);
  this.SliderObjSidePosLogLast[objIx] = this.SliderObjSidePosLog[objIx];

  // Side variation
  if (this.SliderObjSideVarLog[objIx] != this.SliderObjSideVarLogLast[objIx]) {
    this.ObjSideVar[objIx] = sliderToObjSideVar(this.SliderObjSideVarLog[objIx]);
  }
  var sideVarLimit = this.RefractedRadiusEarth * Math.PI / 4;
  if (this.ObjSideVar[objIx] < -sideVarLimit) this.ObjSideVar[objIx] = -sideVarLimit;
  if (this.ObjSideVar[objIx] > sideVarLimit) this.ObjSideVar[objIx] = sideVarLimit;
  this.SliderObjSideVarLog[objIx] = objSideVarToSlider(this.ObjSideVar[objIx]);
  this.SliderObjSideVarLogLast[objIx] = this.SliderObjSideVarLog[objIx];

  // Size
  if (this.SliderObjSizeLog[objIx] != this.SliderObjSizeLogLast[objIx]) {
    this.ObjSize[objIx] = sliderToObjSize(this.SliderObjSizeLog[objIx]);
  }
  if (this.ObjSize[objIx] < OBJ_SIZE_MIN) this.ObjSize[objIx] = OBJ_SIZE_MIN;
  if (this.ObjSize[objIx] > OBJ_SIZE_MAX) this.ObjSize[objIx] = OBJ_SIZE_MAX;
  this.SliderObjSizeLog[objIx] = objSizeToSlider(this.ObjSize[objIx]);
  this.SliderObjSizeLogLast[objIx] = this.SliderObjSizeLog[objIx];

  // Delta distance
  if (this.SliderObjDeltaDistLog[objIx] != this.SliderObjDeltaDistLogLast[objIx]) {
    this.ObjDeltaDist[objIx] = sliderToObjDeltaDist(this.SliderObjDeltaDistLog[objIx]);
  }
  var deltaDistLimit = this.RefractedRadiusEarth * PI90;
  if (this.ObjDeltaDist[objIx] < OBJ_DELTA_DIST_MIN) this.ObjDeltaDist[objIx] = OBJ_DELTA_DIST_MIN;
  if (this.ObjDeltaDist[objIx] > deltaDistLimit) this.ObjDeltaDist[objIx] = deltaDistLimit;
  this.SliderObjDeltaDistLog[objIx] = objDeltaDistToSlider(this.ObjDeltaDist[objIx]);
  this.SliderObjDeltaDistLogLast[objIx] = this.SliderObjDeltaDistLog[objIx];

}


Object.assign(globalThis, { CurveAppClass });
