// Save/Restore panel (URL state)
// Extracted from inline script lines 3970-4014



function ResetApp() {
  DataX.SetAppState(
    'AdvCurveApp = { "DemoText": "", "Description": "", "Height": 2, "FocalLengthField": 3000, "ShowModel": 1, "DeviceRatio": 1.5, "ViewcenterHorizon": 0, "ObjType": [ 0, 0 ], "NObjects": [ 1, 0 ], "ObjSurfDist": [ 12000, 20000 ], "ObjDeltaDist": [ 300, 300 ], "ObjSideType": [ 0, 0 ], "ObjSidePos": [ 0, 0 ], "ObjSideVar": [ 0, 0 ], "ObjSizeType": [ 1, 1 ], "ObjSize": [ 10, 10 ], "ObjSizeVar": [ 0, 0 ], "RefractionCoeff": 0, "TemperatureGradient": -0.0343, "RefractionSync": 0, "Pressure_mbar": 1013.25, "Temperature_C": 15, "RefractionFactMin": 0.5, "RefractionFactMax": 10000, "RadiusEarth": 6371000, "EquatorRadiusFE": 10007543, "ShowTheodolite": false, "OverlayImage": "", "OverlayImageAlpha": 0.5 }' );
}

function SetStdRefraction() {
  CurveApp.RefractionSync = 2;
  UpdateAll();
}

function Set0Refraction() {
  CurveApp.RefractionSync = 1;
  CurveApp.RefractionCoeff = 0;
  UpdateAll();
}

function HandleUrlCommands() {

  var dataStr = DataX.GetUrlStr( 'tab' );
  if (dataStr != '') {
    if (dataStr == 'View') {
      Tabs.Select( 'CurveSettingsTabs', 0 );
    } else if (dataStr == 'Obj1') {
      Tabs.Select( 'CurveSettingsTabs', 1 );
    } else if (dataStr == 'Obj2') {
      Tabs.Select( 'CurveSettingsTabs', 2 );
    } else if (dataStr == 'Refr') {
      Tabs.Select( 'CurveSettingsTabs', 3 );
    } else if (dataStr == 'Unit') {
      Tabs.Select( 'CurveSettingsTabs', 4 );
    } else if (dataStr == 'SaveRest') {
      Tabs.Select( 'CurveSettingsTabs', 5 );
    }
  }

  Animations.TimeStrech = 1 / DataX.GetUrlNum( 'speed', 1 );
  if (Animations.TimeStrech < 0.01) Animations.TimeStrech = 0.01;
  if (Animations.TimeStrech > 100) Animations.TimeStrech = 100;

}

Object.assign(globalThis, { ResetApp, SetStdRefraction, Set0Refraction, HandleUrlCommands });
