// Object 1 options panel (type/side/size variations)
// Extracted from inline script lines 3226-3294



ControlPanels.NewPanel( {
  Name: 'Object-Options0',
  ModelRef: 'CurveApp',
  NCols: 1,
  OnModelChange: UpdateAll

} ).AddRadiobuttonField( {
  Name: 'ObjType[0]',
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
  Name: 'ObjSideType[0]',
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
  Name: 'ObjSizeType[0]',
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

} ).Render();

