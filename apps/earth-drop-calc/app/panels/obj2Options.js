// Object 2 options panel
// Extracted from inline script lines 3403-3471



ControlPanels.NewPanel( {
  Name: 'Object-Options1',
  ModelRef: 'CurveApp',
  NCols: 1,
  OnModelChange: UpdateAll

} ).AddRadiobuttonField( {
  Name: 'ObjType[1]',
  Label: 'ObjType',
  ValueType: 'int',
  Items: [
    {
      Name: 'M-Rod',
      Value: 0
    }, {
      Name: 'Mountain',
      Value: 1
    }
  ]

} ).AddRadiobuttonField( {
  Name: 'ObjSideType[1]',
  Label: 'SideVar',
  ValueType: 'int',
  Items: [
    {
      Name: 'Lin',
      Value: 0
    }, {
      Name: '2-Col',
      Value: 1
    }, {
      Name: 'Rand',
      Value: 2
    }, {
      Name: 'Cos',
      Value: 3
    }, {
      Name: 'Sin',
      Value: 4
    }
  ]

} ).AddRadiobuttonField( {
  Name: 'ObjSizeType[1]',
  Label: 'SizeVar',
  ValueType: 'int',
  Items: [
    {
      Name: 'Lin',
      Value: 1
    }, {
      Name: 'Rand',
      Value: 2
    }, {
      Name: 'Cos',
      Value: 3
    }, {
      Name: 'Sin',
      Value: 4
    }
  ]

} ).RenderInto('panel-obj2');

