// =============================================================================
// metadata.js - Property metadata used by DataX for JSON serialization
//               and URL state encoding/decoding.
// =============================================================================
var CurveAppMetaData = {
  Compact: false,
  DefaultPrec: 8,
  Properties: [
    { Name: 'DemoText',          Type: 'str',  Default: '' },
    { Name: 'Description',       Type: 'str',  Default: '' },

    { Name: 'Height',            Type: 'num',  Default: 2 },
    { Name: 'FocalLengthField',  Type: 'num',  Default: 3000 },

    { Name: 'ShowModel',         Type: 'int',  Default: 1 },
    { Name: 'DeviceRatio',       Type: 'num',  Default: DeviceRatio_Off },
    { Name: 'ViewcenterHorizon', Type: 'int',  Default: 0 },

    { Name: 'ObjType',           Type: 'arr', Size: 2, ArrayType: 'int', Default: [ 0, 0 ] },
    { Name: 'NObjects',          Type: 'arr', Size: 2, ArrayType: 'int', Default: [ 1, 0 ] },
    { Name: 'ObjSurfDist',           Type: 'arr', Size: 2, ArrayType: 'num', Default: [ 12000, 20000 ] },
    { Name: 'ObjDeltaDist',      Type: 'arr', Size: 2, ArrayType: 'num', Default: [ 300, 300 ] },
    { Name: 'ObjSideType',       Type: 'arr', Size: 2, ArrayType: 'int', Default: [ 0, 0 ] },
    { Name: 'ObjSidePos',        Type: 'arr', Size: 2, ArrayType: 'num', Default: [ 0, 0 ] },
    { Name: 'ObjSideVar',        Type: 'arr', Size: 2, ArrayType: 'num', Default: [ 0, 0 ] },
    { Name: 'ObjSizeType',       Type: 'arr', Size: 2, ArrayType: 'int', Default: [ 1, 1 ] },
    { Name: 'ObjSize',           Type: 'arr', Size: 2, ArrayType: 'num', Default: [ 10, 10 ] },
    { Name: 'ObjSizeVar',        Type: 'arr', Size: 2, ArrayType: 'num', Default: [ 0, 0 ] },

    { Name: 'RefractionCoeff',   Type: 'num',  Default: 0 },
    { Name: 'TemperatureGradient',Type:'num',  Default: -0.0065 },
    { Name: 'RefractionSync',    Type: 'int',  Default: 0 },
    { Name: 'Pressure_mbar',     Type: 'num',  Default: 1013.25 },
    { Name: 'Temperature_C',     Type: 'num',  Default: 15 },
    { Name: 'RefractionFactMin', Type: 'num',  Default: 0.5 },
    { Name: 'RefractionFactMax', Type: 'num',  Default: 10000 },

    { Name: 'RadiusEarth',       Type: 'num',  Default: 6371000 },
    { Name: 'EquatorRadiusFE',   Type: 'num',  Default: 10007543 },
    { Name: 'ShowTheodolite',    Type: 'bool', Default: false },
    { Name: 'OverlayImage',      Type: 'str',  Default: '' },
    { Name: 'OverlayImageAlpha', Type: 'num',  Default: 0.5 },

    { Name: 'UnitsType',         Type: 'int',  Default: 0 },
    { Name: 'Tilt',              Type: 'num',  Default: 0 },
    { Name: 'Pan',               Type: 'num',  Default: 0 },

    { Name: 'Flerspective',      Type: 'int',  Default: 0 },     // feature removed
    { Name: 'RefDistance',       Type: 'num',  Default: 10000 }, // feature removed
    { Name: 'ShowDataObject',    Type: 'bool', Default: true },
    { Name: 'ShowDataRefraction',Type: 'bool', Default: true },
    { Name: 'ShowDataHorizon',   Type: 'bool', Default: true },
    { Name: 'ShowLftRghtDrop',   Type: 'bool', Default: false },
  ],
};
