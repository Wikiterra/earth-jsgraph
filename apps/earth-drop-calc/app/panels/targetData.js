// Nearest target data + horizon data display panels
// Extracted from inline script lines 4057-4162



ControlPanels.NewPanel( {
  Name: 'TargetDataPanel',
  ModelRef: 'CurveApp',
  OnModelChange: UpdateAll,
  NCols: 2,
  ReadOnly: true,
  Format: 'std',
  Digits: DefaultDigits

} ).AddHeader( {
  Text: 'Nearest Target Data',
  ColSpan: 4,

} ).AddTextField( {
  Name: 'ObjVisi',
  Label: 'Visible',
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'ObjHidden',
  Label: 'Hidden',
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'ObjVisibleAngl',
  Label: 'Angular Visible',
  ReadOnly: true,
  Units: '°',

} ).AddTextField( {
  Name: 'ObjHiddenAngl',
  Label: 'Angular Hidden',
  ReadOnly: true,
  Units: '°',

} ).AddTextField( {
  Name: 'ObjDropFromObsSurf',
  Label: 'Drop<sup>*</sup>',
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'ObjDropAnglFromObsSurf',
  Label: 'Drop Angle<sup>*</sup>',
  Units: '°',

} ).AddTextField( {
  Name: 'ObjSizeAngl',
  Label: 'Angular Size',
  ReadOnly: true,
  Units: '°',

} ).AddTextField( {
  Name: 'ObjRefrAngl',
  Label: 'Refraction Angle',
  ReadOnly: true,
  Units: '°',

} ).AddTextField( {
  Name: 'ObjLiftAbs',
  Label: 'Lift Absolute',
  ReadOnly: true,
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'ObjLiftRelToHoriz',
  Label: 'Relative to Horizon',
  ReadOnly: true,
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'ObjTopAnglFromEyeLvl',
  Label: 'Target Top Angle',
  Units: '°',

} ).AddTextField( {
  Name: 'ObjTopAnglFromEyeLvlFE',
  Label: 'Target Top Angle FE',
  Units: '°',

} ).AddTextField( {
  Name: 'ObjNearTilt',
  Label: 'Tilt<sup>*</sup>',
  Units: '°'

} ).AddTextField( {
  Name: 'Bulge',
  Label: 'Sagitta (Bulge)<sup>*</sup>',
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'ObjRealSurfDist',
  Label: 'Distance',
  UnitsData: 'LengthUnits',

} ).AddTextField( {
  Name: 'RadiusEarth',
  Label: 'Radius Earth',
  UnitsData: 'BigLengthUnits',
  ReadOnly: false

} ).Render();

