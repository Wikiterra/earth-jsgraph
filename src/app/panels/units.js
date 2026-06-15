// Units panel (Metric/Imperial)
// Extracted from inline script lines 3877-3947



ControlPanels.NewPanel( {
    Name: 'Units-Calculator',
    ModelRef: 'LengthModel',
    OnModelChange: UpdateLengthModel,
    NCols: 2,
    Format: 'std',
    Digits: 10
  }

).AddTextField( {
    Name: 'm',
    Label: 'Meter',
    Units: 'm',
    Inc: 1,
  }

).AddTextField( {
    Name: 'km',
    Label: 'Kilometer',
    Units: 'km',
    Inc: 1,
  }

).AddTextField( {
    Name: 'sm',
    Label: 'Nautical Mile',
    Units: 'sm',
    Inc: 1,
  }

).AddTextField( {
    Name: 'mile',
    Label: 'Statute Mile',
    Units: 'mi',
    Inc: 1,
  }

).AddTextField( {
    Name: 'in',
    Label: 'Inch',
    Units: 'in',
    Inc: 1,
  }

).AddTextField( {
    Name: 'cm',
    Label: 'Centimeter',
    Units: 'cm',
    Inc: 1,
  }

).AddTextField( {
    Name: 'ft',
    Label: 'Feet',
    Units: 'ft',
    Inc: 1,
  }

).AddTextField( {
    Name: 'fl',
    Label: 'Flight Level FL',
    Units: '',
    Inc: 10,
  }

).Render();

