// Object 2 sliders panel
// Extracted from inline script lines 3304-3395



ControlPanels.NewSliderPanel( {
  Name: 'Object-Sliders1',
  ModelRef: 'CurveApp',
  OnModelChange: UpdateAll,
  Format: 'std',
  Digits: DefaultDigits,
  ReadOnly: false,
  PanelFormat: 'InputMediumWidth'

} ).AddValueSliderField( {
  Name: 'NObjects',
  ValueRef: 'NObjects[1]',
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
  ValueRef: 'ObjSurfDist[1]',
  SliderValueRef: 'SliderObjSurfDistLog[1]',
  UnitsData: 'LengthUnits',
  Color: 'blue',
  Min: 0,
  Max: 5,
  Inc: 100,

} ).AddValueSliderField( {
  Name: 'ObjSize',
  ValueRef: 'ObjSize[1]',
  SliderValueRef: 'SliderObjSizeLog[1]',
  UnitsData: 'HeightUnits',
  Color: 'red',
  Min: 0,
  Max: 4,
  Inc: 1,

} ).AddValueSliderField( {
  Name: 'ObjDeltaDist',
  Label: 'DeltaDist',
  ValueRef: 'ObjDeltaDist[1]',
  SliderValueRef: 'SliderObjDeltaDistLog[1]',
  UnitsData: 'LengthUnits',
  Color: 'blue',
  Min: 0,
  Max: 4,
  Inc: 10,

} ).AddValueSliderField( {
  Name: 'ObjSidePos',
  Label: 'SidePos',
  ValueRef: 'ObjSidePos[1]',
  SliderValueRef: 'SliderObjSidePosLog[1]',
  UnitsData: 'LengthUnits',
  Color: 'green',
  Min: -3,
  Max: 3,
  Inc: 10,

} ).AddValueSliderField( {
  Name: 'ObjSideVar',
  Label: 'SideVar',
  ValueRef: 'ObjSideVar[1]',
  SliderValueRef: 'SliderObjSideVarLog[1]',
  UnitsData: 'LengthUnits',
  Color: 'green',
  Min: -5,
  Max: 5,
  Inc: 10,

} ).AddValueSliderField( {
  Name: 'ObjSizeVar',
  ValueRef: 'ObjSizeVar[1]',
  Label: 'SizeVar',
  Units: '%',
  Mult: 0.01,
  Color: 'red',
  Min: -1,
  Max: 1,
  Inc: 0.01,

} ).RenderInto('panel-obj2');

