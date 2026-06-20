// Save/Restore handlers
// Extracted from inline script lines 4021-4049



ControlPanels.NewPanel( {
  Name: 'UnitsPanel',
  ModelRef: 'CurveApp',
  NCols: 1,
  OnModelChange: UpdateAll

} ).AddRadiobuttonField( {
  Name: 'UnitsType',
  Label: 'Units',
  ValueType: 'int',
  Items: [
    {
      Name: 'm (Metric)',
      Value: 0
    }, {
      Name: 'mi/ft (Imperial)',
      Value: 1
    }, {
      Name: 'ft/ft (Imperial)',
      Value: 2
    }
  ]

} ).RenderInto('panel-saverestore');
