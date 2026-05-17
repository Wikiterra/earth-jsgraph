// Demo animation data — extracted from app.js
// Imports run after app.js, so FeDomeApp + Demos manager are already on globalThis.


// Animation helper functions

var AnimTxt = 500 / AnimationSpeed;
var AnimT1 = 1000 / AnimationSpeed;
var AnimT2 = 2000 / AnimationSpeed;
var AnimT3 = 3000 / AnimationSpeed;
var AnimT4 = 4000 / AnimationSpeed;
var AnimT5 = 5000 / AnimationSpeed;
var AnimT6 = 6000 / AnimationSpeed;
var AnimT7 = 7000 / AnimationSpeed;
var AnimT8 = 8000 / AnimationSpeed;
var AnimT9 = 9000 / AnimationSpeed;
var AnimT10 = 10000 / AnimationSpeed;

function Tpse(time) {
  time = xDefNum(time, AnimT2);
  return {
    Mode: 'serial',
    TaskList: [{ ValueRef: 'pause', EndValue: 0 }, { ValueRef: 'pause', EndValue: time, TimeSpan: time }],
  };
}

function Ttxt(txt, delay) {
  if (xStr(txt)) {
    var obj1 = { ValueRef: 'Description', EndValue: '' };
    if (delay) obj1.Delay = delay;
    var obj2 = { Delay: AnimTxt, ValueRef: 'Description', EndValue: txt };
    return {
      Mode: 'serial',
      TaskList: [obj1, obj2],
    };
  } else {
    delay = 0;
    if (xNum(txt)) delay = txt;
    var obj = { ValueRef: 'Description', EndValue: '' };
    if (delay) obj.Delay = delay;
    return obj;
  }
}

function Tpnt(txt, posTo, posFrom, delay) {
  if (xStr(txt)) {
    delay = xDefNum(delay, 1);
    if (!xDef(posFrom)) posFrom = JsgVect2.Add(posTo, [-150, -100]);
    return {
      Delay: delay,
      Mode: 'serial',
      TaskList: [
        { ValueRef: 'PointerText', EndValue: txt },
        { ValueRef: 'PointerFrom[0]', EndValue: posFrom[0] },
        { ValueRef: 'PointerFrom[1]', EndValue: posFrom[1] },
        { ValueRef: 'PointerTo[0]', EndValue: posTo[0] },
        { ValueRef: 'PointerTo[1]', EndValue: posTo[1] },
      ],
    };
  } else {
    delay = 1;
    if (xNum(txt)) delay = txt;
    return {
      Delay: delay,
      Mode: 'serial',
      TaskList: [
        { ValueRef: 'PointerText', EndValue: '' },
        { ValueRef: 'PointerFrom[0]', EndValue: 0 },
        { ValueRef: 'PointerFrom[1]', EndValue: 0 },
        { ValueRef: 'PointerTo[0]', EndValue: 0 },
        { ValueRef: 'PointerTo[1]', EndValue: 0 },
      ],
    };
  }
}

function Tval(name, val, time, delay, sweep) {
  var obj = { ValueRef: name, EndValue: val, Sweep: 'cosine' };
  if (time) obj.TimeSpan = time;
  if (delay) obj.Delay = delay;
  if (sweep) obj.Sweep = sweep;
  return obj;
}

// -------------- create App window ------------------------------

FeDomeApp.CreateFeGraph();

// -------------- Demos -----------------------------------------

// Intro Demo

Demos.New('Intro');

Demos.AddState(
  'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 82.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Tval('ShowSphere', false, 0),
      Tval('ShowSphereRays', false, 0),
      Tval('ShowDomeRays', false, 0),
      Ttxt('This is the Flat Earth Model with the Dome as proposed by Flat Earthers.'),
      Tval('DateTime', 76.46, AnimT10),
      Tval('ShowDomeRays', true, 0),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "This is the Flat Earth Model with the Dome as proposed by Flat Earthers.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 76.46, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Tpnt('Current Date and Time', [846, 22], [785, 75]),
      Tval('DayOfYear', 63, AnimT2, AnimT1, 'linear'),
      Tval('DayOfYear', 76, AnimT2, 0, 'linear'),
      Tpnt('Sun/Moon Azimuth and Elevation', [806, 70], [735, 135], AnimT1),
      Tpnt('The Sun', [399, 256], [348, 309], AnimT4),
      Tpnt('The Moon', [243, 149], [204, 113], AnimT4),
      Tval('ShowDomeGrid', false, 0, AnimT3),
      Tpnt('Flat Earth Equator', [301, 272], [204, 204]),
      Tpnt('Flat Earth 0-Meridian', [329, 397], [253, 353], AnimT3),
      Tval('ShowDomeGrid', true, 0, AnimT3),
      Tval('ShowFeGrid', false, 0),
      Tpnt('Dome Equator', [290, 205], [243, 251]),
      Tpnt('Dome 0-Meridian', [373, 415], [286, 378], AnimT3),
      Tpnt(AnimT3),
      Tval('ShowFeGrid', true, 0),
      Tval('Zoom', 3.4, AnimT3),
      Tpnt('Observer Location', [397, 394], [372, 433], AnimT1),
      Tval('ObserverLat', -15, AnimT2),
      Tval('ObserverLat', 15, AnimT3),
      Tval('ObserverLat', 0, AnimT2),
      Tpnt('Northpole', [557, 177], [599, 149], AnimT1),
      Tpnt('Lightray from Sun to Observer', [412, 181], [304, 229], AnimT3),
      Tpnt(AnimT3),
      Tval('Zoom', 1.4, AnimT3),
      Tval('ShowFeGrid', false),
      Tval('ShowDomeGrid', false),
      Tpnt('Shadow of the Night', [498, 238], [625, 143], AnimT1),
      Tval('Time', 13.20, AnimT3),
      Tval('Time', 11.04, AnimT3),
      Tpnt(),
      Tval('ShowDomeGrid', true, 0, AnimT1),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "This is the Flat Earth Model with the Dome as proposed by Flat Earthers.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 76.46, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('To produce Sunrise and Sunset as observed in Reality,'),
      Ttxt('Lightrays can not be straight but must bend!', AnimT4),
      Tval('DateTime', 78.2113, AnimT10 + AnimT10),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Lightrays can not be straight but must bend!", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 78.2113, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('From the Perspective of the Observer,'),
      Ttxt('the Dome appears like a Celestial Sphere above the Observer.', AnimT3),
      Tval('ShowSphere', true, 0, AnimT3),
      Tpnt('Celestial Sphere', [344, 316], [294, 273]),
      Tpnt(AnimT2),
      Tval('ShowSphereRays', true, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', 76, AnimT3),
          Tval('CameraHeight', 13, AnimT3),
          Tval('Zoom', 2.5, AnimT3),
        ],
      },
      Tpnt('Sun\'s Position on the Dome', [756, 130], [755, 193], AnimT1),
      Tpnt('Sun\'s apparent Position', [396, 373], [477, 414], AnimT3),
      Tpnt('Moon\'s Position on the Dome', [302, 149], [328, 103], AnimT3),
      Tpnt('Moon\'s apparent Position', [270, 220], [213, 136], AnimT3),
      Tpnt('Moon-Phase as seen by the Observer', [64, 74], [160, 143], AnimT3),
      Tpse(AnimT4),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "the Dome appears like a Celestial Sphere above the Observer.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 2.5, "CameraDirection": 76, "CameraHeight": 13, "CameraDistance": 200150, "DateTime": 78.2113, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('While Sun and Moon rotate with the Dome around its Northpole,'),
      Ttxt('Sun and Moon appear to travel on Latitude Lines of the Celestial Sphere.', AnimT4),
      Tpnt('Latitude Line', [365, 237], [425, 210], AnimT4),
      Tpnt(AnimT2),
      Tval('Time', 16.99, AnimT5, AnimT1),
      Tval('Time', 5.07, AnimT5, AnimT1),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Sun and Moon appear to travel on Latitude Lines of the Celestial Sphere.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 2.5, "CameraDirection": 76, "CameraHeight": 13, "CameraDistance": 200150, "DateTime": 78.2113, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('The Elevation of the Poles of the Celestial Sphere corresponds to the Latitude of the Observer.'),
      Tval('ShowFeGrid', true, 1, AnimT3),
      Tval('ObserverLat', 90, AnimT5),
      Tval('ObserverLat', 45, AnimT3),
      Tpnt('Observer Latitude = 45ï¿½', [243, 348], [386, 398]),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('PointerTo[0]', 386, AnimT2),
          Tval('PointerTo[1]', 333, AnimT2),
        ],
      },
      Tpnt('Elevation = 45ï¿½', [529, 307], [537, 146], AnimT2),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('PointerTo[0]', 485, AnimT2),
          Tval('PointerTo[1]', 206, AnimT2),
        ],
      },
      Tpnt(AnimT2),
      Tval('Time', 16.99, AnimT5),
      Tval('Time', 5.07, AnimT5, AnimT2),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "The Elevation of the Poles of the Celestial Sphere corresponds to the Latitude of the Observer.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 45, "ObserverLong": 15, "Zoom": 2.5, "CameraDirection": 76, "CameraHeight": 13, "CameraDistance": 200150, "DateTime": 78.2113, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('North of the Equator one Celestial Pole always points due North.'),
      Tpnt('North Celestial Pole', [486, 206], [517, 168], AnimT3),
      Tpnt(AnimT2),
      Tval('ObserverLat', 90, AnimT3),
      Tval('ObserverLat', 15, AnimT3),
      Ttxt('South of the Equator one Celestial Pole always points due South.'),
      Tval('ObserverLat', -45, AnimT3),
      Tpnt('South Celestial Pole', [147, 247], [96, 205]),
      Tpnt(AnimT2),
      Tval('ObserverLat', -90, AnimT3),
      Tval('ObserverLat', -15, AnimT3),
      Ttxt('At the Equator the Poles of the Celestial Sphere point to the Horizon due North-South.'),
      Tval('ObserverLat', 0, AnimT2, AnimT3),
      Ttxt('Sun, Moon and Stars appear to rotate around the Celestial Poles anywhere on Earth (see Star-Trails)!'),
      {
        Delay: AnimT3,
        Mode: 'parallel',
        TaskList: [
          Tval('DateTime', 82.5, 5 * AnimT10, 0, 'linear'),
          Tval('ObserverLat', -80, AnimT10),
          Tval('ObserverLat', 80, 2 * AnimT10, AnimT10),
          Tval('ObserverLat', 0.001, AnimT10, 3 * AnimT10),
        ],
      },
      {
        Delay: AnimT1,
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', 30, AnimT3),
          Tval('CameraHeight', 25, AnimT3),
          Tval('Zoom', 1.4, AnimT3),
        ],
      },
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Sun, Moon and Stars appear to rotate around the Celestial Poles anywhere on Earth (see Star-Trails)!", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 82.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

// Eclipses Demo

Demos.New('Eclipses');

Demos.AddState(
  'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 82.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Lets see the Tracks of Sun and Moon on the Dome...'),
      Tval('ShowFeGrid', false, 0),
      Tval('ShowShadow', false, 0),
      Tval('ShowDomeGrid', false, 0),
      Tval('ShowSphere', false, 0),
      Tval('ShowSphereRays', false, 0),
      Tval('ShowDomeRays', false, 0),
      Tval('ShowSunTrack', true, 0),
      Tval('ObserverLat', 90, 0),
      Tval('ObserverLong', 0, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', 0, AnimT4),
          Tval('CameraHeight', 89.9, AnimT4),
          Tval('Zoom', 1.25, AnimT4),
          Tval('DayOfYear', 117, AnimT4, 0, 'linear'),
          Tval('Time', 9.44, AnimT4),
        ],
      },
      Tpse(AnimT3),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Lets see the Tracks of Sun and Moon on the Dome...", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 90, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 89.9, "CameraDistance": 200150, "DateTime": 117.3933, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": false, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Earth\'s Axes is tilted 23.4ï¿½ with respect to its Orbital Plane around the Sun (Ecliptic).'),
      Ttxt('So the Sun follows a 23.4ï¿½ tilted Track on the Fixed Stars Background, causing Seasons.', AnimT5),
      Tpnt('Suns Ecliptic = annual Track on the Dome', [372, 411], [400, 351], AnimT5),
      Tpse(AnimT5),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "So the Sun follows a 23.4ï¿½ tilted Track on the Fixed Stars Background, causing Seasons.", "PointerFrom": [ 400, 351 ], "PointerTo": [ 372, 414 ], "PointerText": "Suns Ecliptic = annual Track on the Dome", "ObserverLat": 90, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 89.9, "CameraDistance": 200150, "DateTime": 117.3933, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": false, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Tpnt(),
      Ttxt('The 4 red dots mark the locations of Equinox and Solstice.'),
      Tpnt('Celestial Equator Line', [613, 287], [648, 342], AnimT5),
      Tpnt('June Solstice Line', [479, 366], [469, 312], AnimT3),
      Tpnt('December Solstice Line', [656, 279], [717, 334], AnimT3),
      Tpnt(AnimT3),
      {
        Delay: AnimT1,
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 170, AnimT2),
          Tval('Time', 5.98, AnimT2),
        ],
      },
      Tpnt('June Solstice', [585, 252], [663, 182], AnimT1),
      Tpnt(AnimT3),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 261, AnimT3),
          Tval('Time', 0.01, AnimT3),
        ],
      },
      Tpnt('September Equinox', [461, 86], [500, 54], AnimT1),
      Tpnt(AnimT3),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 353, AnimT3),
          Tval('Time', -6.01, AnimT3),
        ],
      },
      Tval('DayOfYear', 352, 0),
      Tval('Time', 17.99, 0),
      Tpnt('December Solstice', [241, 247], [179, 212], AnimT1),
      Tpnt(AnimT3),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 443, AnimT3),
          Tval('Time', 12.0, AnimT3),
        ],
      },
      Tpnt('March Equinox', [454, 399], [454, 358], AnimT1),
      Tpnt(AnimT3),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 482, AnimT2),
          Tval('Time', 9.47, AnimT2),
        ],
      },
      Tval('DayOfYear', 117, 0),
      Tval('Time', 9.44, 0),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "The 4 red dots mark the locations of Equinox and Solstice.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 90, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 89.9, "CameraDistance": 200150, "DateTime": 117.3933, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": false, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Lets have a look at the Track of the Moon:'),
      Tval('ShowSunTrack', false, AnimT1),
      Tval('ShowMoonTrack', true, AnimT1),
      Tpnt('Moons Ecliptic = monthly Track on the Dome', [549, 172], [633, 120], AnimT5),
      Ttxt('The Moon\'s Ecliptic plane is tilted 5.1ï¿½ with respect to Sun\'s Ecliptic Plane.', AnimT5),
      Ttxt('This means the Track of the Moon extends now farther north and south than the Sun.', AnimT7),
      Tpse(AnimT5),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "This means the Track of the Moon extends now farther north and south than the Sun.", "PointerFrom": [ 633, 120 ], "PointerTo": [ 549, 172 ], "PointerText": "Moons Ecliptic = monthly Track on the Dome", "ObserverLat": 90, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 89.9, "CameraDistance": 200150, "DateTime": 117.3933, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": false, "ShowSunTrack": false, "ShowMoonTrack": true, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Tpnt(),
      Tval('ShowSunTrack', true, AnimT1),
      Ttxt('The green dots are the intersection Knots of Sun and Moon Eclipse.'),
      Tpnt('Knot', [392, 415], [420, 342], AnimT1),
      Ttxt('Due to Precession of the Moon\'s Orbit of 19.3ï¿½ per year retrograde.', AnimT5),
      Ttxt('The green intersection Knots move slowly in the opposite direction of Sun and Moon.', AnimT5),
      Tpnt('Start Position', [392, 415], [420, 342]),
      {
        Delay: AnimT3,
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 482, 2 * AnimT10, 0, 'linear'),
          Tval('Time', -14.48, 2 * AnimT10, 0, 'linear'),
        ],
      },
      Tval('Time', 9.47, 0),
      Tval('DayOfYear', 117, 0, AnimT3),
      Tval('Time', 9.44, 0),
      Tpnt(AnimT3),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "The green intersection Knots move slowly in the opposite direction of Sun and Moon.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 90, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 89.9, "CameraDistance": 200150, "DateTime": 117.3933, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": false, "ShowSunTrack": true, "ShowMoonTrack": true, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('If Sun and Moon meet at opposite green Knots, a Lunar Eclipse happens.'),
      Ttxt('If Sun and Moon meet at the same green Knot, a Solar Eclipse happens.', AnimT5),
      Tval('DateTime', 117.0671, AnimT3, AnimT5),
      Tpnt('Target', [304, 250], [264, 212], AnimT1),
      Tval('Time', 25.6104, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 232, AnimT10),
          Tval('Time', 18.0, AnimT10),
        ],
      },
      Tpnt('Solar Eclipse 21. Aug. 2017 / 18:00', [304, 250], [264, 212], AnimT1),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "If Sun and Moon meet at the same green Knot, a Solar Eclipse happens.", "PointerFrom": [ 264, 212 ], "PointerTo": [ 304, 250 ], "PointerText": "Solar Eclipse 21. Aug. 2017 / 18:00", "ObserverLat": 90, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 89.9, "CameraDistance": 200150, "DateTime": 232.75, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": false, "ShowSunTrack": true, "ShowMoonTrack": true, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Solar Eclipse on 21. Aug. 2017'),
      Tpnt(),
      Tval('ShowDomeGrid', true, 0),
      Tval('ObserverLong', -87.6667, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('ObserverLat', 36.9667, AnimT5),
          Tval('CameraDirection', -66, AnimT5),
          Tval('CameraHeight', 19, AnimT5),
          Tval('Zoom', 3.1, AnimT5),
        ],
      },
      Tval('ShowSphere', true, 0),
      Tval('ShowSphereRays', true, 0),
      Tpnt('Sun and Moon in the same Direction', [385, 202], [220, 152], AnimT1),
      Tval('ShowDomeRays', true, 0, AnimT3),
      Tpnt('Sun and Moon at the same Spot', [368, 71], [220, 152], AnimT1),
      Tpnt(AnimT3),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Solar Eclipse on 21. Aug. 2017", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 36.9667, "ObserverLong": -87.6667, "Zoom": 3.1, "CameraDirection": -66, "CameraHeight": 19, "CameraDistance": 200150, "DateTime": 232.75, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": true, "ShowSunTrack": true, "ShowMoonTrack": true, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Tval('Zoom', 2.2, AnimT3),
      Tval('ShowShadow', true, 0),
      Tval('DateTime', 232.4767, AnimT5),
      Tpnt('Sunrise: not yet aligned', [565, 351], [742, 262], AnimT1),
      Tpnt('Sunrise: not yet aligned', [719, 118], [742, 262], AnimT3),
      Tpnt(AnimT3),
      Tval('DateTime', 233.0208, AnimT5),
      Tpnt('Sunset: not aligned anymore', [290, 318], [166, 225], AnimT1),
      Tpnt('Sunset: not aligned anymore', [253, 64], [166, 225], AnimT3),
      Tpnt(AnimT3),
      Tval('ShowSunTrack', false, 0),
      Tval('ShowMoonTrack', false, 0),
      Ttxt(),
      Tval('DayOfYear', 82, AnimT4),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('ObserverLat', 0, AnimT4),
          Tval('ObserverLong', 15, AnimT4),
          Tval('CameraDirection', 30, AnimT4),
          Tval('CameraHeight', 25, AnimT4),
          Tval('Zoom', 1.4, AnimT4),
          Tval('DateTime', 82.5, AnimT4),
        ],
      },
      Tval('ShowFeGrid', true, 0),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 82.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

// Equinox Demo

Demos.New('Equinox');

Demos.AddState(
  'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 82.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false, "RayParameter": 1, "RayTarget": 0, "RaySource": 0 }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Lets investigate the Light Rays on Equinox.'),
      Tval('ShowFeGrid', false, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', 45, AnimT3),
          Tval('CameraHeight', 15, AnimT3),
          Tval('Zoom', 1.9, AnimT3),
          Tval('DateTime', 78.254167, AnimT3),
          Tval('ObserverLong', 0, AnimT3),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Lets investigate the Light Rays on Equinox.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.9, "CameraDirection": 45, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 78.254167, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('At Equinox the Sun raises everywhere on Earth exactly due East.'),
      Tpnt('Sunrise due Easth', [435, 376], [506, 394], AnimT1),
      Tpnt(AnimT3),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('ObserverLong', -360, AnimT10),
          Tval('Time', 30.1, AnimT10),
          Tval('CameraDirection', -315, AnimT10),
          Tval('ObserverLat', 85, AnimT3),
          Tval('ObserverLat', -75, AnimT4, AnimT3),
          Tval('ObserverLat', 0.01, AnimT3, AnimT7),
        ],
      },
      Tval('DateTime', 79.2542, 0),
      Ttxt('And at Equinox the Sun sets everywhere on Earth exactly due West.'),
      Tval('DateTime', 79.7458, AnimT3),
      Tpnt('Sunset due West', [247, 324], [168, 299], AnimT1),
      Tpnt(AnimT3),
      Tval('DayOfYear', 78, 0),
      Tval('Time', 41.9, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('ObserverLong', 0, AnimT10),
          Tval('Time', 17.9, AnimT10),
          Tval('CameraDirection', 45, AnimT10),
          Tval('ObserverLat', 85, 0.9 * AnimT3),
          Tval('ObserverLat', -60, 0.9 * AnimT4, AnimT3),
          Tval('ObserverLat', 0.001, AnimT3, AnimT7),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "And at Equinox the Sun sets everywhere on Earth exactly due West.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.9, "CameraDirection": 45, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 78.7458, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Lets see how the Sun distributes its light:'),
      Tval('ShowSphere', false, 0),
      Tval('ShowSphereRays', false, 0),
      Tval('ShowManyRays', true, 0),
      Tval('RayTarget', 1, 0, AnimT2),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Lets see how the Sun distributes its light:", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.9, "CameraDirection": 45, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 78.7458, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": false, "ShowManyRays": true, "RayParameter": 1, "RayTarget": 1, "RaySource": 0 }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Tval('DateTime', 78.4875, AnimT3, AnimT1),

      {
        Delay: AnimT1,
        Mode: 'parallel',
        TaskList: [
          Tval('ObserverLat', -90, AnimT5),
          Tval('Zoom', 1.6, AnimT5),
          Tval('CameraDirection', 184, AnimT5),
          Tval('CameraHeight', 89.9, AnimT5),
        ],
      },
      Ttxt('Equinox = Sunrise due East, Sunset due West - everywhere.'),
      Tpnt('Sunrise due Easth', [482, 353], [646, 405], AnimT1),
      Tval('PointerTo[0]', 833, AnimT3),

      Tpnt('Sunset due West', [412, 354], [247, 409], AnimT1),
      Tval('PointerTo[0]', 64, AnimT3),
      Tpnt(AnimT1),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Equinox = Sunrise due East, Sunset due West - everywhere.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -90, "ObserverLong": 0, "Zoom": 1.6, "CameraDirection": 184, "CameraHeight": 89.9, "CameraDistance": 200150, "DateTime": 78.4875, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": false, "ShowManyRays": true, "RayParameter": 1, "RayTarget": 1, "RaySource": 0 }'
);


Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      {
        Delay: AnimT1,
        Mode: 'parallel',
        TaskList: [
          Tval('Zoom', 1.3, AnimT5),
          Tval('CameraHeight', 20, AnimT5),
        ],
      },
      Tval('DateTime', 79.489933, 2 * AnimT10),
      Tval('DateTime', 78.489933, 0),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Equinox = Sunrise due East, Sunset due West - everywhere.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -90, "ObserverLong": 0, "Zoom": 1.3, "CameraDirection": 184, "CameraHeight": 20, "CameraDistance": 200150, "DateTime": 78.489933, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": false, "ShowManyRays": true, "RayParameter": 1, "RayTarget": 1, "RaySource": 0 }'
);


// Day and Night Demo

Demos.New('DayNight');

Demos.AddState(
  'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 82.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Lets investigate the shape of the Night Shadow on the Flat Earth.'),
      Tval('ShowFeGrid', false, 0),
      Tval('ShowSphere', false, 0),
      Tval('ShowSphereRays', false, 0),
      Tval('ShowDomeRays', false, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('ObserverLong', 0, AnimT2),
          Tval('CameraDirection', 0, AnimT2),
          Tval('CameraHeight', 30, AnimT2),
          Tval('Zoom', 1.25, AnimT2),
          Tval('DayOfYear', 78, AnimT2, 0, 'linear'),
          Tval('Time', 12, AnimT2),
        ],
      },
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Lets investigate the shape of the Night Shadow on the Flat Earth.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 30, "CameraDistance": 200150, "DateTime": 78.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('The Border of the Night Shadow in this Animation is based on Reality. It depends on the Sun\'s Position.'),
      {
        Mode: 'serial',
        TaskList: [
          Tval('DayOfYear', 443, AnimT10, AnimT1, 'linear'),
          Tval('DayOfYear', 78, 0),
        ],
      },
      Ttxt('The Animation shows the Position of the Sun at each Noon of the Observer, starting at March Equinox.'),
      {
        Mode: 'serial',
        TaskList: [
          Tval('DayOfYear', 443, AnimT10, AnimT1, 'linear'),
          Tval('DayOfYear', 78, 0),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "The Animation shows the Position of the Sun at each Noon of the Observer, starting at March Equinox.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 30, "CameraDistance": 200150, "DateTime": 78.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Note the figure 8 the Sun traces due to the tilted Axes of the Earth.'),
      Tval('ShowSunTrack', true, 0),
      {
        Mode: 'serial',
        TaskList: [
          Tval('DayOfYear', 443, AnimT10, AnimT1, 'linear'),
          Tval('DayOfYear', 78, 0),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Note the figure 8 the Sun traces due to the tilted Axes of the Earth.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.25, "CameraDirection": 0, "CameraHeight": 30, "CameraDistance": 200150, "DateTime": 78.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Here is how the Sun illuminates the lit part of the Flat Earth.'),
      Tval('ShowDomeGrid', false, 0),
      Tval('ShowSunTrack', false, 0),
      Tval('ShowManyRays', true, 0),
      Tval('RayTarget', 1, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('Zoom', 1.5, AnimT2),
          Tval('CameraHeight', 25, AnimT2),
        ],
      },
      {
        Mode: 'serial',
        TaskList: [
          Tval('DayOfYear', 443, AnimT10, AnimT1, 'linear'),
          Tval('DayOfYear', 78, 0),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Here is how the Sun illuminates the lit part of the Flat Earth.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.5, "CameraDirection": 0, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 78.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": false, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": true, "RayParameter": 1, "RayTarget": 1, "RaySource": 0 }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Tval('CameraDirection', 90, AnimT3),
      {
        Mode: 'parallel',
        TaskList: [
          {
            Mode: 'serial',
            TaskList: [
              Tval('DayOfYear', 717, 3 * AnimT5, AnimT1, 'linear'),
              Tval('DayOfYear', 352, 0),
            ],
          },
          Tval('CameraHeight', 10, 3 * AnimT5),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Here is how the Sun illuminates the lit part of the Flat Earth.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 0, "Zoom": 1.5, "CameraDirection": 90, "CameraHeight": 10, "CameraDistance": 200150, "DateTime": 352.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": false, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": true, "RayParameter": 1, "RayTarget": 1, "RaySource": 0 }'
);


// Poles Demo

Demos.New('Poles');

Demos.AddState(
  'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 0, "ObserverLong": 15, "Zoom": 1.4, "CameraDirection": 30, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 82.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Lets investigate Day and Night at the Poles at the Solstices:'),
      Tval('ShowFeGrid', false, 0),
      Tval('ShowSunTrack', true, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', 45, AnimT3),
          Tval('CameraHeight', 15, AnimT3),
          Tval('Zoom', 1.9, AnimT3),
        ],
      },
      Ttxt('Setting Date to June Solstice:'),
      Tval('DayOfYear', 169, AnimT3),
      Tval('DateTime', 169.5, 0),

      Ttxt('June Solstice Northpole'),
      Tval('ObserverLat', 90, AnimT3),
      Tval('DateTime', 170.5, AnimT3),
      Ttxt('June Solstice Northpole: 24 h Sunlight'),
      Tval('DateTime', 172.5, AnimT6),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "June Solstice Northpole: 24 h Sunlight", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 90, "ObserverLong": 15, "Zoom": 1.9, "CameraDirection": 45, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 169.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('June Solstice Antarctica'),
      Tval('ObserverLat', -90, AnimT3),
      Tval('DateTime', 170.5, AnimT3),
      Ttxt('June Solstice Antarctica: 24 h Darkness'),
      Tval('DateTime', 172.5, AnimT6),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "June Solstice Antarctica: 24 h Darkness", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -90, "ObserverLong": 15, "Zoom": 1.9, "CameraDirection": 45, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 169.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Setting Date to December Solstice:'),
      Tval('ObserverLat', 0, AnimT2),
      Tval('DayOfYear', 352, AnimT3),
      Tval('DateTime', 352.5, 0),

      Ttxt('December Solstice Northpole'),
      Tval('ObserverLat', 90, AnimT3),
      Tval('DateTime', 353.5, AnimT3),
      Ttxt('December Solstice Northpole: 24 h Darkness'),
      Tval('DateTime', 355.5, AnimT6),
      Tval('DateTime', 352.5, 0, AnimT1),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "December Solstice Northpole: 24 h Darkness", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 90, "ObserverLong": 15, "Zoom": 1.9, "CameraDirection": 45, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 352.5, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);


Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('December Solstice Antarctica'),
      Tval('ObserverLat', -90, AnimT3),
      Tval('DateTime', 353.5, AnimT5),
      Ttxt('December Solstice Antarctica: 24 h Sunlight'),
      Tval('DateTime', 355.9583, 2 * AnimT10),
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "December Solstice Antarctica: 24 h Sunlight", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -90, "ObserverLong": 15, "Zoom": 1.9, "CameraDirection": 45, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 355.9583, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": true, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Sunrays have to bend over the Shadow to the opposite side of the North Pole!'),
      Tval('CameraDirection', 15, AnimT3),
      Tval('CameraDirection', -15, AnimT3, AnimT1),
      Tval('CameraDirection', 45, AnimT5, AnimT1),

      Tval('Zoom', 1.6, AnimT2, AnimT1),
      Tval('ShowManyRays', true, 0),
      Tval('RayTarget', 1, 0),
      Tval('ShowSunTrack', false, 0),

      Tval('CameraDirection', 15, AnimT3, AnimT1),
      Tval('CameraDirection', -15, AnimT3, AnimT1),
      {
        Delay: AnimT1,
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', 105, AnimT10),
          Tval('ObserverLat', 35, AnimT5),
        ],
      },
      Tval('CameraHeight', 89.9, AnimT5, AnimT1),
      Tval('CameraHeight', 15, AnimT5, AnimT1),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Sunrays have to bend over the Shadow to the opposite side of the North Pole!", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 35, "ObserverLong": 15, "Zoom": 1.6, "CameraDirection": 105, "CameraHeight": 15, "CameraDistance": 200150, "DateTime": 355.9583, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": true, "RayParameter": 1, "RayTarget": 1, "RaySource": 0 }'
);


// Stars Demo

Demos.New('Stars');

Demos.AddState(
  'FeDomeApp = { "Description": "", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 45, "ObserverLong": -100, "Zoom": 1.25, "CameraDirection": -35, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 78, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": false, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('Lets see how Starlight has to bend to produce correct Startrails.'),
      Tval('ShowStars', true, 0, AnimT2),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', -85, AnimT2),
          Tval('CameraHeight', 4, AnimT2),
          Tval('Zoom', 3, AnimT2),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Lets see how Starlight has to bend to produce correct Startrails.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 45, "ObserverLong": -100, "Zoom": 3, "CameraDirection": -85, "CameraHeight": 4, "CameraDistance": 200150, "DateTime": 78, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": true, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('The Observer sees the Stars rotate around one Celestial Pole: Elevation = Observer Latitude.'),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DateTime', 82, 4 * AnimT8, 0, 'linear'),

          Tval('Description', 'North of the Equator the Stars rotate Anti-Clockwise around Polaris', 0, AnimT8),
          Tpnt('Polaris', [473, 185], [530, 124], AnimT8),

          Tpnt(2 * AnimT8),
          Tval('Description', 'At the Equator the Stars rotate around 2 Poles at the Horizon.', 0, 2 * AnimT8),
          Tval('ObserverLat', 0, AnimT3, 2 * AnimT8),
          Tval('CameraDirection', -50, AnimT3, 2 * AnimT8),

          Tval('Description', 'South of the Equator the Stars rotate Clockwise around a Celestial Pole due South.', 0, 3 * AnimT8),
          Tval('ObserverLat', -45, AnimT3, 3 * AnimT8),
          Tval('CameraDirection', 80, AnimT3, 3 * AnimT8),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "South of the Equator the Stars rotate Clockwise around a Celestial Pole due South.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -45, "ObserverLong": -100, "Zoom": 3, "CameraDirection": 80, "CameraHeight": 4, "CameraDistance": 200150, "DateTime": 82, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": true, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('This are the Light Rays to the Stars on the Observer\'s Celestial Sphere:'),
      Tval('ShowSphereRays', true, 0),
      Tval('ShowManyRays', true, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DateTime', 90, 8 * AnimT8, 0, 'linear'),

          Tval('Description', 'This are the Lightrays to the corresponding Stars on the Dome.', 0, AnimT8),
          Tval('ShowDomeRays', true, 0, AnimT8),

          Tval('Zoom', 1, AnimT5, 2 * AnimT8),
          Tval('CameraHeight', 89.9, AnimT5, 2 * AnimT8),
          Tval('ShowSphereRays', false, 0, 2 * AnimT8),

          Tval('Zoom', 1.4, AnimT5, 3 * AnimT8),
          Tval('CameraHeight', 25, AnimT5, 3 * AnimT8),
          Tval('CameraDirection', -35, AnimT5, 3 * AnimT8),

          Tval('CameraDirection', -100, AnimT5, 4 * AnimT8),

          Tval('CameraDirection', 300, 2 * AnimT10, 5 * AnimT8),
        ],
      },
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "This are the Lightrays to the corresponding Stars on the Dome.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -45, "ObserverLong": 260, "Zoom": 1.4, "CameraDirection": 300, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 92, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": true, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DateTime', 96, 8 * AnimT8, 0, 'linear'),

          Tval('ObserverLat', -90, AnimT4, 1 * AnimT8),
          Tval('ObserverLat', 90, AnimT8, 2 * AnimT8),
          Tval('ObserverLat', 0, AnimT4, 4 * AnimT8),
          Tval('ObserverLat', -61.001, AnimT4, 5 * AnimT8),
          Tval('ObserverLat', -61, 0, 6 * AnimT8),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "This are the Lightrays to the corresponding Stars on the Dome.", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -61, "ObserverLong": 260, "Zoom": 1.4, "CameraDirection": 300, "CameraHeight": 25, "CameraDistance": 200150, "DateTime": 96, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": false, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": true, "ShowStars": true, "ShowDomeRays": true, "ShowSphereRays": true, "ShowManyRays": false }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('How can the same southern Star be visible from 3 Continents at the same time looking south?'),
      Tval('ShowShadow', true, 0),
      Tval('ShowSphere', false, 0),
      Tval('ShowDomeRays', false, 0),
      Tval('ShowSphereRays', false, 0),
      {
        Mode: 'parallel',
        TaskList: [
          Tval('DayOfYear', 172, AnimT2),
          Tval('ObserverLat', 90, AnimT2),
          Tval('Zoom', 1, AnimT2),
        ],
      },
      Tval('ObserverLong', -95, 0),
      {
        Delay: 0,
        Mode: 'parallel',
        TaskList: [
          Tval('DateTime', 172.9, AnimT3),
          Tval('CameraDirection', 30, AnimT3),
          Tval('CameraHeight', 30, AnimT3),
        ],
      },
      Tpse(),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "How can the same southern Star be visible from 3 Continents at the same time looking south?", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": 90, "ObserverLong": -95, "Zoom": 1, "CameraDirection": 30, "CameraHeight": 30, "CameraDistance": 200150, "DateTime": 172.9, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": false, "ShowShadow": true, "ShowDomeGrid": true, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": true, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false, "RayParameter": 1, "RayTarget": 0, "RaySource": 2 }'
);

Demos.AddAnimation(
  {
    Mode: 'serial',
    TaskList: [
      Ttxt('It can be Night at 3 Continents at the same time at June Solstice.'),
      Tpnt('South America', [300, 310], [300, 244], AnimT3),
      Tpnt('Africa', [439, 361], [439, 293], AnimT2),
      Tpnt('Australia', [604, 280], [604, 226], AnimT2),
      Tpnt(AnimT2),
      Ttxt('The same Star can be seen from this Continents looking South at the same time!'),
      Tval('RayTarget', 1, 0, AnimT1),
      {
        Delay: 0,
        Mode: 'parallel',
        TaskList: [
          Tval('ObserverLat', -70, AnimT3),
          Tval('Zoom', 1.4, AnimT3),
        ],
      },
      Tval('ShowFeGrid', true, 0),
      Tval('ShowDomeGrid', false, 0),
      {
        Delay: AnimT2,
        Mode: 'parallel',
        TaskList: [
          Tval('CameraDirection', -60, AnimT3),
          Tval('CameraHeight', 89.9, AnimT3),
          Tval('Zoom', 1.2, AnimT3),
        ],
      },
      Tpnt('South-East', [431, 447], [415, 409], AnimT1),
      Tpnt('South', [625, 252], [565, 252], AnimT2),
      Tpnt('South-West', [429, 59], [415, 93], AnimT2),
      Tpnt(AnimT2),
      Tval('CameraHeight', 36, AnimT4),
      Tval('CameraDirection', -150, AnimT3, AnimT2),
      Tval('CameraDirection', -60, AnimT3, AnimT2),
    ],
  }
);

Demos.AddState(
  'FeDomeApp = { "Description": "Use the green Sliders to change the Star Position", "PointerFrom": [ 0, 0 ], "PointerTo": [ 0, 0 ], "PointerText": "", "ObserverLat": -70, "ObserverLong": -95, "Zoom": 1.2, "CameraDirection": -60, "CameraHeight": 36, "CameraDistance": 200150, "DateTime": 172.9, "DomeSize": 1, "DomeHeight": 9000, "ShowFeGrid": true, "ShowShadow": true, "ShowDomeGrid": false, "ShowSunTrack": false, "ShowMoonTrack": false, "ShowSphere": false, "ShowStars": true, "ShowDomeRays": false, "ShowSphereRays": false, "ShowManyRays": false, "RayParameter": 1, "RayTarget": 1, "RaySource": 2 }'
);


Object.assign(globalThis, {
  AnimTxt,
  AnimT1, AnimT2, AnimT3, AnimT4, AnimT5, AnimT6, AnimT7, AnimT8, AnimT9, AnimT10,
  Tpse, Ttxt, Tpnt, Tval,
});
export {
  AnimTxt,
  AnimT1, AnimT2, AnimT3, AnimT4, AnimT5, AnimT6, AnimT7, AnimT8, AnimT9, AnimT10,
  Tpse, Ttxt, Tpnt, Tval,
};
