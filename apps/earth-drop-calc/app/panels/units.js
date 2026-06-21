// Units panel (Metric/Imperial)

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

).RenderInto('panel-units');

ControlPanels.NewPanel( {
    Name: 'Angle-Calculator',
    ModelRef: 'AngleModel',
    OnModelChange: UpdateAngleModel,
    NCols: 2,
    Format: 'std',
    Digits: 10
  }

).AddTextField( {
    Name: 'deg',
    Label: 'Degree',
    Units: '°',
    Inc: 1,
  }

).AddTextField( {
    Name: 'rad',
    Label: 'Radian',
    Units: 'rad',
    Inc: 0.01,
  }

).AddTextField( {
    Name: 'grad',
    Label: 'Gradian',
    Units: 'grad',
    Inc: 1,
  }

).AddTextField( {
    Name: 'arcmin',
    Label: 'Arcminute',
    Units: '\'',
    Inc: 1,
  }

).AddTextField( {
    Name: 'arcsec',
    Label: 'Arcsecond',
    Units: '"',
    Inc: 1,
  }

).RenderInto('panel-units');
