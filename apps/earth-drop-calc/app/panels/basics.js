// Basics + Options panel (Globe/FE, slider Height/Distance/Size/Refraction/Zoom/View)

ControlPanels.NewSliderPanel( {
  Name: 'BasicsPanel',
  ModelRef: 'CurveApp',
  OnModelChange: UpdateAll,
  Format: 'std',
  Digits: DefaultDigits,
  ReadOnly: false,
  PanelFormat: 'InputMediumWidth'

} ).AddValueSliderField( {
  Name: 'Height',
  Label: 'Observer Height',
  ValueRef: 'Height',
  SliderValueRef: 'HeightSlider',
  UnitsData: 'HeightUnits',
  Color: 'blue',
  Min: 0,
  Max: 1,
  Inc: 0.1,

} ).AddValueSliderField( {
  Name: 'Refraction',
  ValueRef: 'RefractionCoeff',
  SliderValueRef: 'RefractionSlider',
  Color: 'red',
  Min: -1,
  Max: 1,
  Inc: 0.01,

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
  Units: '°',
  Color: 'black',
  Min: 0.247517,
  Max: 91.6,
  Inc: 0.1,

} ).RenderInto('panel-basics');

/* View options — Camera Aim + Show Data. Model lives in the bottom bar
   (FE / Globe / Both), so it's not duplicated here. Rendered into its own
   floating "View" panel, separate from Measures. */
ControlPanels.NewPanel( {
  Name: 'OptionsPanel',
  ModelRef: 'CurveApp',
  NCols: 2,
  OnModelChange: UpdateAll

} ).AddRadiobuttonField( {
  Name: 'ViewcenterHorizon',
  Label: 'Camera Aim',
  ValueType: 'int',
  Items: [
    {
      Name: 'Horizon',
      Value: 0
    }, {
      Name: 'Eye-Level',
      Value: 3
    }
  ]

} ).AddCheckboxField( {
  Name: 'ShowData',
  Label: 'Show Data',
  ColSpan: 3,
  Items: [
    {
      Name: 'ShowDataObject',
      Text: 'Object',
    }, {
      Name: 'ShowDataRefraction',
      Text: 'Refr.',
    }, {
      Name: 'ShowDataHorizon',
      Text: 'Horizon',
    }, {
      Name: 'ShowLftRghtDrop',
      Text: 'Left-Right Drop',
    }
  ]

} ).RenderInto('panel-options');
