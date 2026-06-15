// Basics + Options panel (Globe/FE, slider Height/Distance/Size/Refraction/Zoom/View)
// Extracted from inline script lines 2900-3037



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
  Name: 'ObjSurfDist',
  Label: 'Target Distance',
  ValueRef: 'ObjSurfDist[0]',
  SliderValueRef: 'SliderObjSurfDistLog[0]',
  UnitsData: 'LengthUnits',
  Color: 'orange',
  Min: 0,
  Max: 5,
  Inc: 100,

} ).AddValueSliderField( {
  Name: 'TargetSize',
  Label: 'Target Size',
  ValueRef: 'ObjSize[0]',
  SliderValueRef: 'SliderObjSizeLog[0]',
  UnitsData: 'HeightUnits',
  Color: 'green',
  Min: 0,
  Max: 4,
  Inc: 1,

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
  Units: '�',
  Color: 'black',
  Min: 0.247517,
  Max: 91.6,
  Inc: 0.1,

} ).Render();

ControlPanels.NewPanel( {
  Name: 'OptionsPanel',
  ModelRef: 'CurveApp',
  NCols: 2,
  OnModelChange: UpdateAll

} ).AddRadiobuttonField( {
  Name: 'ShowModel',
  Label: 'Model',
  ValueType: 'int',
  Items: [
    {
      Name: 'Globe',
      Value: 1
    }, {
      Name: 'FE',
      Value: 2
    }, {
      Name: 'Globe+FE',
      Value: 3
    }
  ]

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

} ).Render();

