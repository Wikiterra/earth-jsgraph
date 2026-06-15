// View panel (Pan/Tilt/Roll)
// Extracted from inline script lines 3048-3117



ControlPanels.NewSliderPanel( {
  ModelRef: 'CurveApp',
  OnModelChange: UpdateAll,
  Format: 'std',
  Digits: DefaultDigits,
  ReadOnly: false,
  PanelFormat: 'InputMediumWidth'

} ).AddValueSliderField( {
  Name: 'Height',
  ValueRef: 'Height',
  SliderValueRef: 'HeightSlider',
  UnitsData: 'HeightUnits',
  Color: 'blue',
  Min: 0,
  Max: 1,
  Inc: 0.1,

} ).AddValueSliderField( {
  Name: 'FocalLength',
  ValueRef: 'FocalLengthField',
  SliderValueRef: 'FocalLengthSlider',
  Label: 'Zoom f',
  Units: 'mm',
  Color: 'black',
  Min: 0,
  Max: 1,
  Inc: 1,

} ).AddValueSliderField( {
  Name: 'ViewAngle',
  Label: 'View&ang;',
  ValueRef: 'ViewAngleField',
  SliderValueRef: 'ViewAngleSlider',
  Units: '�',
  Color: 'black',
  Min: 0.82,
  Max: 91.6,
  Inc: 0.1,

} ).AddValueSliderField( {
  Name: 'Pan',
  ValueRef: 'Pan',
  SliderValueRef: 'PanSlider',
  Format: 'std',
  Digits: 5,
  Units: '�',
  Color: 'green',
  Min: -1,
  Max: 1,
  Inc: 0.1,

} ).AddValueSliderField( {
  Name: 'Tilt',
  ValueRef: 'Tilt',
  SliderValueRef: 'TiltSlider',
  Format: 'std',
  Digits: 5,
  Units: '�',
  Color: 'green',
  Min: -1,
  Max: 1,
  Inc: 0.1,

} ).Render();

