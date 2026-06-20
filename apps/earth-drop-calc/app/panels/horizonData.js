// Data panel handlers and graph drawing setup
// Extracted from inline script lines 4170-4249



ControlPanels.NewPanel( {
  Name: 'HorizonDataPanel',
  ModelRef: 'CurveApp',
  OnModelChange: UpdateAll,
  NCols: 2,
  ReadOnly: true,
  Format: 'std',
  Digits: DefaultDigits

} ).AddHeader( {
  Text: 'Horizon Data',
  ColSpan: 4,

} ).AddTextField( {
  Name: 'HorizSurfDist',
  Label: 'Dist on Surf',
  UnitsData: 'LengthUnits',

} ).AddTextField( {
  Name: 'HorizDropAnglFromEyeLvl',
  Label: 'Dip Angle',
  Mult: Math.PI / 180,
  Units: '°'

} ).AddTextField( {
  Name: 'HorizDistLineOfSight',
  Label: 'Dist from Eye',
  UnitsData: 'LengthUnits',

} ).AddTextField( {
  Name: 'HorizDistOnEyeLvl',
  Label: 'Dist on Eye-Lvl',
  UnitsData: 'LengthUnits',

} ).AddTextField( {
  Name: 'HorizDropFromObsSurf',
  Label: 'Drop from Surf',
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'HorizDropFromEyeLvl',
  Label: 'Drop from Eye-Lvl',
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'SceneWidth',
  Label: 'Frame Width',
  UnitsData: 'LengthUnits',

} ).AddTextField( {
  Name: 'GridSpacing',
  Label: 'Grid Spacing',
  UnitsData: 'LengthUnits',

} ).AddTextField( {
  Name: 'HorizLftRgtDrop',
  Label: 'Left-Right Drop',
  UnitsData: 'HeightUnits',

} ).AddTextField( {
  Name: 'HorizLftRgtDropAngl',
  Label: 'Left-Right Drop Angle',
  Units: '°'

} ).AddTextField( {
  Name: 'HorizLftRgtWidth',
  Label: 'Left-Right Width',
  UnitsData: 'LengthUnits',

} ).AddTextField( {
  Name: 'RefractedRadiusEarth',
  Label: 'Apparent Radius',
  UnitsData: 'LengthUnits',

} ).RenderInto('panel-horizondata');
