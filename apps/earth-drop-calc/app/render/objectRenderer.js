// =============================================================================
// objectRenderer.js - Draws target objects (M-rods/mountains/etc) and their
//                     variants for both globe and flat earth models.
// =============================================================================
function DrawObjectsBehindHorizon( objIx, g ) {
  var m = CurveApp;

  // init some loop variables used in DrawObjectsBeforeHorizon too
  if (m.NObjects[objIx] == 0) return;
  m.ObjDeltaAngl[objIx] = m.ObjDeltaDist[objIx] / m.RefractedRadiusEarth;
  m.ObjFirstAngl[objIx] = m.ObjSurfDist[objIx] / m.RefractedRadiusEarth;
  m.ObjLastAngl[objIx] = (m.NObjects[objIx]-1) * m.ObjDeltaAngl[objIx] + m.ObjFirstAngl[objIx];
  m.MaxNObjectsToDraw[objIx] = m.NObjects[objIx];
  m.NObjectsDrawn[objIx] = 0;
  if (m.ObjLastAngl[objIx] > Math.PI) {
    m.MaxNObjectsToDraw[objIx] = Math.floor( Math.PI / m.ObjDeltaAngl[objIx] );
    m.ObjLastAngl[objIx] = (m.MaxNObjectsToDraw[objIx]-1) * m.ObjDeltaAngl[objIx] + m.ObjFirstAngl[objIx];
    m.NObjectsDrawn[objIx] = m.NObjects[objIx] - m.MaxNObjectsToDraw[objIx];
  }
  m.CurrentObjAngl[objIx] = m.ObjLastAngl[objIx];

  // if only objects before horizon exist skip this function
  var aSide = m.ObjSidePos[objIx] / m.RefractedRadiusEarth;
  var sideOnDisk = (m.RefractedRadiusEarth - m.HorizDropFromObsSurf) * Math.tan( aSide );
  var aClip = 0;
  if (m.HorizDistOnEyeLvl > Math.abs(sideOnDisk)) {
    // not all objects are behind the horizon, so find the first object that is behind
    var distOnDisk = Math.sqrt( m.HorizDistOnEyeLvl * m.HorizDistOnEyeLvl - sideOnDisk * sideOnDisk );
    aClip = Math.asin( distOnDisk / m.RefractedRadiusEarth );
  }
  if (m.CurrentObjAngl[objIx] <= aClip) return;
  m.IsHiddenObj[objIx] = true;

  // draw all objects behind horizon only and clip then at horizon
  g.SetAlpha( m.AlphaOpaque );
  g.SetAreaAttr( '#ffa', '#666', 1 );
  g.SaveTrans3D();
  var aLimit = m.ObjFirstAngl[objIx] - m.ObjDeltaAngl[objIx]/2;
  while (m.CurrentObjAngl[objIx] > aClip && m.CurrentObjAngl[objIx] > aLimit ) {
    DrawShapeVariants( objIx, g, m, true );
    m.NObjectsDrawn[objIx]++;
    m.CurrentObjAngl[objIx] -= m.ObjDeltaAngl[objIx];
  }
  g.RestoreTrans3D();

  // clip at horizon
  if (m.NObjectsDrawn[objIx] > 0) {
    g.SetPlane( [0,0,-m.HorizDropFromEyeLvl], [1,0,0], [0,1,0] );
    g.SetBgColor( 'white' );
    g.CircleOnPlane( 0, 0, m.HorizDistOnEyeLvl, 2 );
  }
}

function DrawObjectsBeforeHorizon( objIx, g, bOnGlobe ) {
  var m = CurveApp;
  if (m.NObjects[objIx] == 0) return;

  // Init parameters for flat earth here, because DrawObjectsBehindHorizon is not caller in that case
  if (!bOnGlobe) {
    m.ObjDeltaAngl[objIx] = m.ObjDeltaDist[objIx] / m.RefractedRadiusEarth;
    m.ObjFirstAngl[objIx] = m.ObjSurfDist[objIx] / m.RefractedRadiusEarth;
    m.ObjLastAngl[objIx] = (m.NObjects[objIx]-1) * m.ObjDeltaAngl[objIx] + m.ObjFirstAngl[objIx];
    m.MaxNObjectsToDraw[objIx] = m.NObjects[objIx];
    m.CurrentObjAngl[objIx] = m.ObjLastAngl[objIx];
    m.NObjectsDrawn[objIx] = 0;
  }

  var aLimit = m.ObjFirstAngl[objIx] - m.ObjDeltaAngl[objIx]/2;
  if (m.CurrentObjAngl[objIx] < aLimit) return;
  m.IsHiddenObj[objIx] = false;

  g.SetAlpha( m.AlphaOpaque );
  g.SetAreaAttr( 'yellow', 'black', 1 );
  g.SaveTrans3D();
  while (m.CurrentObjAngl[objIx] >= aLimit) {
    DrawShapeVariants( objIx, g, m, bOnGlobe );
    m.CurrentObjAngl[objIx] -= m.ObjDeltaAngl[objIx];
    m.NObjectsDrawn[objIx]++;
  }
  g.RestoreTrans3D();
}

function SetTrans( objIx, g, m, lng, lat, size, alt, bOnGlobe ) {
  var d = 0;
  var s = 0;
  var xs = m.IsShowBothModelsMirror() && !bOnGlobe ? -m.ObjSize[objIx] : m.ObjSize[objIx];
  g.ResetTrans3D();
  g.TransScale3D( xs, m.ObjSize[objIx], m.ObjSize[objIx] );
  g.TransMove3D( 0, 0, m.RefractedRadiusEarth+alt );
  if (bOnGlobe) {
    g.TransRotateY3D( lat );
    g.TransRotateX3D( -lng );
  } else {
    d = lng * m.RefractedRadiusEarth;
    s = lat * m.RefractedRadiusEarth;
    if (m.IsShowBothModelsMirror()) s *= -1;
  }
  g.TransMove3D( s, d, -(m.RefractedRadiusEarth+m.Height) );
}

function DrawShapeVariants( objIx, g, m, bOnGlobe ) {

  // size: 0 -> lin, 1 -> alt, 2 -> rand, 3 -> cos, 4 -> sin

  var size = 1;
  var sizeType = m.ObjSizeType[objIx];
  var objType = m.ObjType[objIx];

  if (objType == 0) {
    // M-Rod only scales linearly with size, size type is ignored and ObjSizeVar defines the scale size (num of divisions)

  } else if (sizeType == 1) {
    // lin
    if (m.MaxNObjectsToDraw[objIx] > 1) {
      size = 1 + m.ObjSizeVar[objIx] * (2 / (m.MaxNObjectsToDraw[objIx] - 1) * (m.MaxNObjectsToDraw[objIx]-1 - m.NObjectsDrawn[objIx]) - 1);
    }

  } else if (sizeType == 1) {
    // alt
    size = 1 + m.ObjSizeVar[objIx] * Math.cos( Math.PI * m.NObjectsDrawn[objIx] );

  } else if (sizeType == 2) {
    // rand
    size = 1 + m.ObjSizeVar[objIx] * ( (64894678.9798467 * Math.sqrt(m.NObjectsDrawn[objIx])) % 2 - 1 );

  } else if (sizeType == 3) {
    // cos
    if (m.MaxNObjectsToDraw[objIx] > 1) {
      size = 1 - m.ObjSizeVar[objIx] * Math.cos( 2 * Math.PI * m.NObjectsDrawn[objIx]/(m.MaxNObjectsToDraw[objIx]-1) );
    } else {
      size = 1 + m.ObjSizeVar[objIx];
    }

  } else if (sizeType == 4) {
    // sin
    if (m.MaxNObjectsToDraw[objIx] > 1) {
      size = 1 - m.ObjSizeVar[objIx] * Math.sin( 2 * Math.PI * m.NObjectsDrawn[objIx]/(m.MaxNObjectsToDraw[objIx]-1) );
    } else {
      size = 1;
    }
  }

  // make size varying from 0..1
  size = (size + 1 - Math.abs(m.ObjSizeVar[objIx])) / 2;
  if (size < 0) size *= -1;

  if (objType == 0) {
    // dont scale M-Rod by sizeVar
    size = 1;
  }

  var sizeHor = 1;
  if (objType == 0) {
    // M-Rod: scale width proportionaly
    sizeHor = size;
  }

  var sideVar = m.ObjSideVar[objIx] / m.RefractedRadiusEarth / 2;
  var side = m.ObjSidePos[objIx] / m.RefractedRadiusEarth;
  var sideType = m.ObjSideType[objIx];
  if (sideType == 0) {
    // lin
    if (m.MaxNObjectsToDraw[objIx] > 1) {
      sideVar *= (2 / (m.MaxNObjectsToDraw[objIx] - 1) * (m.MaxNObjectsToDraw[objIx]-1 - m.NObjectsDrawn[objIx]) - 1);
    }

    SetTrans( objIx, g, m, m.CurrentObjAngl[objIx], side+sideVar, m.ObjSize[objIx], 0, bOnGlobe );
    g.SetPlane( [0,0,0], [sizeHor,0,0], [0,0,size] );
    DrawShape( objIx, g, m, bOnGlobe );

  } else if (sideType == 1) {
    // 2col
    var pos1 = side - sideVar;
    var pos2 = side + sideVar;
    if (Math.abs(pos1) < Math.abs(pos2)) {
      // invert drawing sequence
      var tmp = pos1;
      pos1 = pos2;
      pos2 = tmp;
    }
    // assert: pos1 is farther to the side than pos2 -> |pos1| >= |pos2|
    m.Col = 1;
    g.SetPlane( [0,0,0], [sizeHor,0,0], [0,0,size] );
    SetTrans( objIx, g, m, m.CurrentObjAngl[objIx], pos1, m.ObjSize[objIx], 0, bOnGlobe );
    DrawShape( objIx, g, m, bOnGlobe );
    m.Col = 2;
    SetTrans( objIx, g, m, m.CurrentObjAngl[objIx], pos2, m.ObjSize[objIx], 0, bOnGlobe );
    g.SetPlane( [0,0,0], [sizeHor,0,0], [0,0,size] );
    DrawShape( objIx, g, m, bOnGlobe );

  } else if (sideType == 2) {
    // rand
    sideVar *= (186573.6498496 * Math.sqrt(m.NObjectsDrawn[objIx]) % 2) - 1;
    g.SetPlane( [0,0,0], [sizeHor,0,0], [0,0,size] );
    SetTrans( objIx, g, m, m.CurrentObjAngl[objIx], side+sideVar, m.ObjSize[objIx], 0, bOnGlobe );
    DrawShape( objIx, g, m, bOnGlobe );

  } else if (sideType == 3) {
    // cos
    if (m.MaxNObjectsToDraw[objIx] > 1) {
      sideVar *= Math.cos( 2 * Math.PI * m.NObjectsDrawn[objIx]/(m.MaxNObjectsToDraw[objIx]-1) );
    }
    g.SetPlane( [side,0,0], [sizeHor,0,0], [0,0,size] );
    SetTrans( objIx, g, m, m.CurrentObjAngl[objIx], side+sideVar, m.ObjSize[objIx], 0, bOnGlobe );
    DrawShape( objIx, g, m, bOnGlobe );

  } else if (sideType == 4) {
    // sin
    if (m.MaxNObjectsToDraw[objIx] > 1) {
      sideVar *= Math.sin( 2 * Math.PI * m.NObjectsDrawn[objIx]/(m.MaxNObjectsToDraw[objIx]-1) );
    } else {
      sideVar = 0;
    }
    g.SetPlane( [side,0,0], [sizeHor,0,0], [0,0,size] );
    SetTrans( objIx, g, m, m.CurrentObjAngl[objIx], side+sideVar, m.ObjSize[objIx], 0, bOnGlobe );
    DrawShape( objIx, g, m, bOnGlobe );

  }
}

function DrawShape( objIx, g, m, bOnGlobe ) {
  // plane and transformations are set

  function setBgColor( normalColor, hiddenColor ) {
    if (m.IsHiddenObj[objIx]) {
      g.SetBgColor( hiddenColor );
    } else {
      g.SetBgColor( normalColor );
    }
  }

  // ObjType: 0 = M-Rod, 1 = Mountain
  var objType = m.ObjType[objIx];

  if (objType == 0) {
    // M-Rod
    var sizeVar = m.GetObjectSizeVar( objIx );
    setBgColor( 'yellow', '#ff4' );
    g.RectOnPlane( -0.1, 0, 0.1, sizeVar, 2 );
    setBgColor( 'red', '#f66' );
    for (var z = 0.5; z < sizeVar; z += 1) {
      var t = z + 0.5;
      if (t > sizeVar) t = sizeVar;
      g.RectOnPlane( -0.1, z, 0, t, 2 );
    }
    for (var z = 0.1; z < sizeVar; z += 0.2 ) {
      var t = z + 0.1;
      if (t > sizeVar) t = sizeVar;
      g.RectOnPlane( 0, z, 0.1, t, 2 );
    }
    g.RectOnPlane( -0.1, 0, 0.1, sizeVar, 1 );

    if (m.showData && m.IsNearestObject(objIx)) {
      // label object size
      var x1 = 0.12;
      var x2 = 0.22;
      if (m.IsShowBothModelsMirror() && !bOnGlobe) {
        x1 = -0.12;
        x2 = -0.22;
      }
      g.LineOnPlane( x1, sizeVar, x2, sizeVar );
      g.SetTextAttr( 'Arial', 12, 'black', 'normal', 'normal', 'left', 'bottom', 0 );
      var numFormat = { Mode: 'fix', Precision: 2, UsePrefix: false, Units: '' };
      var txt = NumFormatter.NumToString( HVal(m.ObjSize[objIx]*sizeVar), numFormat ) + HUnit();
      g.TextOnPlane( txt, x2, sizeVar );
    }

  } else if (objType == 1) {
    // mountain
    var mi = m.NObjectsDrawn[objIx] % 3;
    var mr = m.NObjectsDrawn[objIx] % 6;
    mi = (mi + objIx) % 3;
    if (mr > 2) {
      // mirror x axes
      g.Plane.XDir[0] *= -1;
    }
    if (mi == 0) {
      setBgColor( '#dbe2ed', '#e9f0fc' );
      g.PolygonOnPlane( [ -1.3, -0.8, -0.6, -0.3, -0.1, 0.1, 0.2, 0.4, 0.5, 0.6, 1.3, -1.3 ], [ 0, 0.6, 0.6, 1, 0.9, 0.7, 0.7, 0.9, 0.8, 0.85, 0, 0 ], 3 );
      g.PolygonOnPlane( [ -0.3, 0, 0.3, 0.5, 0.8 ], [ 0.1, 0.2, 0.5, 0.5, 0.4 ], 1 );
      g.PolygonOnPlane( [ -0.6, -0.3, 0.1 ], [ 0.6, 0.4, 0.3 ], 1 );
      g.PolygonOnPlane( [ -0.2, -0.1, 0.1 ], [ 0.5, 0.6, 0.7 ], 1 );
      g.PolygonOnPlane( [ 0.1, 0.2, 0.4, 0.5 ], [ 0.5, 0.6, 0.7, 0.8 ], 1 );

    } else if (mi == 1) {
      setBgColor( '#92aace', '#c4d2e8' );
      g.PolygonOnPlane( [ -1.3, -0.8, -0.7, -0.2, 0.1, 0.2, 0.5, 0.6, 0.7, 1.3, -1.3 ], [ 0, 0.5, 0.5, 1, 0.8, 0.7, 0.7, 0.6, 0.6, 0, 0 ], 3 );
      g.PolygonOnPlane( [ -0.7, -0.6, -0.3 ], [ 0.5, 0.5, 0.2 ], 1 );
      g.LineOnPlane( 0.2, 0.7, 0.7, 0.2 );
      g.LineOnPlane( 0.6, 0.6, 1.1, 0.1 );

    } else {
      setBgColor( '#abacb1', '#c8c9cf' );
      g.PolygonOnPlane( [ -1.3, -0.7, -0.6, -0.3, -0.3, -0.2, -0.1, 0.1, 0.3, 0.5, 0.6, 0.8, 1, 1.1, 1.3, -1.3 ],  [ 0, 0.6, 0.6, 0.8, 0.9, 1, 1, 0.8, 0.5, 0.4, 0.5, 0.5, 0.4, 0.2, 0, 0 ], 3 );
      g.PolygonOnPlane( [ -1, -0.6, -0.4, -0.2, 0 ], [ 0.1, 0.4, 0.5, 0.5, 0.3 ], 1 );
      g.PolygonOnPlane( [ -0.6, -0.5, -0.4 ], [ 0.6, 0.6, 0.5 ], 1 );
      g.PolygonOnPlane( [ -0.2, -0.1, 0 ], [ 1, 0.8, 0.4 ], 1 );
      g.PolygonOnPlane( [ 0, 0.3, 0.6, 0.8, 0.9 ], [ 0.1, 0.2, 0.5, 0.4, 0.3 ], 1 );
    }
  }
}

function PointOnEarth( lat, long ) {
  var x = CurveApp.RefractedRadiusEarth * Math.sin( long );
  var rr = CurveApp.RefractedRadiusEarth * Math.cos( long );
  var y = rr * Math.sin( lat );
  var z = rr * Math.cos( lat );
  return [ x, y, z - (CurveApp.RefractedRadiusEarth + CurveApp.Height) ];
}

function PointOnPlane( lat, long ) {
  var x = CurveApp.RefractedRadiusEarth * Math.sin( long );
  var rr = CurveApp.RefractedRadiusEarth * Math.cos( long );
  var y = rr * Math.sin( lat );
  return [ x, y, -CurveApp.Height ];
}


Object.assign(globalThis, { DrawObjectsBehindHorizon, DrawObjectsBeforeHorizon, SetTrans, DrawShapeVariants, DrawShape, PointOnEarth, PointOnPlane });
