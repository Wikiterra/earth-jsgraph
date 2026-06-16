// Object 1 sliders panel
// Extracted from inline script lines 3127-3218



ControlPanels.NewSliderPanel( {
  Name: 'Object-Sliders0',
  ModelRef: 'CurveApp',
  OnModelChange: UpdateAll,
  Format: 'std',
  Digits: DefaultDigits,
  ReadOnly: false,
  PanelFormat: 'InputMediumWidth'

} ).AddValueSliderField( {
  Name: 'NObjects',
  ValueRef: 'NObjects[0]',
  Label: 'NObjects',
  Color: 'black',
  Format: 'fix',
  Digits: 0,
  Min: 0,
  Max: 200,
  Steps: 200,
  Inc: 1,

} ).AddValueSliderField( {
  Name: 'ObjSurfDist',
  Label: 'Dist',
  ValueRef: 'ObjSurfDist[0]',
  SliderValueRef: 'SliderObjSurfDistLog[0]',
  UnitsData: 'LengthUnits',
  Color: 'blue',
  Min: 0,
  Max: 5,
  Inc: 100,

} ).AddValueSliderField( {
  Name: 'ObjSize',
  ValueRef: 'ObjSize[0]',
  SliderValueRef: 'SliderObjSizeLog[0]',
  UnitsData: 'HeightUnits',
  Color: 'red',
  Min: 0,
  Max: 4,
  Inc: 1,

} ).AddValueSliderField( {
  Name: 'ObjDeltaDist',
  Label: 'DeltaDist',
  ValueRef: 'ObjDeltaDist[0]',
  SliderValueRef: 'SliderObjDeltaDistLog[0]',
  UnitsData: 'LengthUnits',
  Color: 'blue',
  Min: 0,
  Max: 4,
  Inc: 10,

} ).AddValueSliderField( {
  Name: 'ObjSidePos',
  Label: 'SidePos',
  ValueRef: 'ObjSidePos[0]',
  SliderValueRef: 'SliderObjSidePosLog[0]',
  UnitsData: 'LengthUnits',
  Color: 'green',
  Min: -3,
  Max: 3,
  Inc: 10,

} ).AddValueSliderField( {
  Name: 'ObjSideVar',
  Label: 'SideVar',
  ValueRef: 'ObjSideVar[0]',
  SliderValueRef: 'SliderObjSideVarLog[0]',
  UnitsData: 'LengthUnits',
  Color: 'green',
  Min: -5,
  Max: 5,
  Inc: 10,

} ).AddValueSliderField( {
  Name: 'ObjSizeVar',
  ValueRef: 'ObjSizeVar[0]',
  Label: 'SizeVar',
  Units: '%',
  Mult: 0.01,
  Color: 'red',
  Min: -1,
  Max: 1,
  Inc: 0.01,

} ).Render();

