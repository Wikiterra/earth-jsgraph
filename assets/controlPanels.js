// Control Panel Setup Functions
function ParseTimeField(s) {
    if (s == 'now') {
        d = new Date();
        return 24 * ((d.getTime() / FeDomeApp.msPerDay - FeDomeApp.ZeroDate) % 1.0);
    } else {
        return NumFormatter.HmsStrToNum(s);
    }
}

function ParseDateField(s) {
    if (s == 'now') {
        d = new Date();
        return Math.floor(d.getTime() / FeDomeApp.msPerDay - FeDomeApp.ZeroDate);
    } else {
        return NumFormatter.DateStrToNum(s, FeDomeApp.ZeroDate);
    }
}

// ---------------- create control panels -------------------------

ControlPanels.NewSliderPanel({
    Name: 'SliderPanel',
    ModelRef: 'FeDomeApp',
    NCols: 1,
    ValuePos: 'left',
    OnModelChange: UpdateAll,
    Format: 'fix0',
    Digits: 2,
    ReadOnly: false,
    PanelFormat: 'InputMediumWidth'
}).AddValueSliderField({
    Name: 'Time',
    Label: 'Time',
    Units: 'h',
    Color: 'black',
    Min: 0,
    Max: 48,
    ConvToModelFunc: function (s) { return ParseTimeField(s); },
}).AddValueSliderField({
    Name: 'DayOfYear',
    Units: 'd',
    Color: 'black',
    Min: 0,
    Max: 3500,
    Steps: 3500,
    Digits: 0,
    ConvToModelFunc: function (s) { return ParseDateField(s); },
}).AddValueSliderField({
    Name: 'AxialTilt',
    Color: 'orange',
    Min: 0.00001,
    Max: 90,
    SnapTo: [0.00001, 23.44, 45],
    Inc: 1,
    Units: '°',
    Digits: 3,
    Format: 'fix',
}).AddValueSliderField({
    Name: 'MoonEcliptic',
    Color: 'blue',
    Min: -90,
    Max: 90,
    SnapTo: [0, 5.145],
    Inc: 1,
    Units: '°',
    Digits: 3,
    Format: 'fix',
}).AddValueSliderField({
    Name: 'DistSun',
    Color: 'orange',
    Min: 3,
    Max: 9,
    LogScale: true,
    Units: 'km',
    Digits: 4,
    Format: 'std',
}).AddValueSliderField({
    Name: 'DistMoon',
    Color: 'blue',
    Min: 3,
    Max: 6,
    LogScale: true,
    Units: 'km',
    Digits: 4,
    Format: 'std',
}).AddValueSliderField({
    Name: 'ObserverLat',
    Color: 'green',
    Min: -90,
    Max: 90,
    Units: '&deg;',
    Digits: 6,
    Format: 'std',
    ConvToModelFunc: function (s) { return NumFormatter.DmsStrToNum(s); },
}).AddValueSliderField({
    Name: 'ObserverLong',
    Color: 'green',
    Min: -180,
    Max: 180,
    Units: '&deg;',
    Digits: 6,
    Format: 'std',
    ConvToModelFunc: function (s) { return NumFormatter.DmsStrToNum(s); },
}).AddValueSliderField({
    Name: 'CameraDirection',
    Label: 'CameraDir',
    Color: 'red',
    Units: '&deg;',
    Min: -360,
    Max: 360,
    Inc: 1,
}).AddValueSliderField({
    Name: 'CameraHeight',
    Label: 'CameraHeight',
    Color: 'red',
    Units: '&deg;',
    Min: 0,
    Max: 89.9,
    Inc: 1,
}).AddValueSliderField({
    Name: 'Zoom',
    Label: 'Zoom',
    Color: 'orange',
    Mult: 0.01,
    Units: '%',
    Inc: 1,
    Min: FeDomeApp.ZoomMin,
    Max: FeDomeApp.ZoomMax,
}).AddValueSliderField({
    Name: 'DomeHeight',
    Color: 'blue',
    Units: 'km',
    Min: FeDomeApp.DomeHeightMin,
    Max: FeDomeApp.DomeHeightMax,
    Inc: 100,
}).AddValueSliderField({
    Name: 'DomeSize',
    Label: 'DomeSize',
    Color: 'blue',
    Mult: 0.01,
    Units: '%',
    Min: 1,
    Max: 5,
    Inc: 10,
}).AddValueSliderField({
    Name: 'RayParameter',
    Label: 'RayParam',
    Color: 'magenta',
    Mult: 0.01,
    Units: '%',
    Min: 0.5,
    Max: 2.0,
    Inc: 0.1,
}).Render();
