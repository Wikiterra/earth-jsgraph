// =============================================================================
// sceneRenderer.js - Creates the main 3D graph and draws the model scene
//                    (earth/sky, horizon, refraction overlays, grid lines).
// =============================================================================
// createGraph3D: core seam over the wabis NewGraphX3D global (see index.html).
var graph = createGraph3D( {
  Id: 'JsGraph1',
  Width: '100%',
  Height: '66.67%',
  DrawFunc: DrawModel,
  AutoReset: true,
  AutoClear: true,
  AutoScalePix: true
} );

function DrawModel( g ) {

  var m = CurveApp;
  g.MaxCurveSegments = 256;
  g.SetAngleMeasure( 'rad' );
  g.SetViewport( 0, 1, -0.5, -2 );
  g.SetGraphClipping( true, '', 0 );
  g.SetCameraClipping( 0.001 );
  g.SetWindowToCameraScreen();

  g.SetCamera( {
    SceneSize: m.CamSceneSize,
    CamPos: m.CamPos,
    CamUp: m.CamUp,
    CamViewCenter: m.CamViewCenter,
  } );
  g.SetCameraZoom( 1 );

  var specialLineWidth = 1.5;

  // Draws the magenta eye-level line + label using the camera/pan currently in
  // effect. In Globe+FE mode it is drawn once inside each half (so it lines up
  // with that half's own horizon); in single-model mode it is drawn once below.
  function drawEyeLevel( panRad ) {
    if ( !( m.showEyeLevel || m.ShowTheodolite ) ) return;
    var ez = JsgMat3.RotatingZ( -panRad );
    g.SetLineAttr( m.EyeLvlCol, 1 );
    g.SetAlpha( m.AlphaOpaque );
    g.Line3D( JsgMat3.Trans( ez, [ -2*m.SceneWidth, m.HorizDistOnEyeLvl, 0 ] ), JsgMat3.Trans( ez, [ 2*m.SceneWidth, m.HorizDistOnEyeLvl, 0 ] ) );
    g.SetTextAttr( 'Arial', 12, m.EyeLvlCol, 'normal', 'normal', 'right', 'bottom', 30, 4 );
    g.SetTextRotation( toRad(-m.Roll) );
    g.Text3D( 'Eye-Level', JsgMat3.Trans( ez, [ 0, m.HorizDistOnEyeLvl, 0 ] ) );
    g.SetTextRotation( 0 );
  }

  // rotz is reused below for the globe-half tangent / left-right-drop lines.
  var rotz = JsgMat3.RotatingZ( -m.PanRad );
  if ( !m.IsShowBothModels() ) {
    drawEyeLevel( m.PanRad );
  }

  // Flat Earth

  var objIx = 0;
  if (m.NObjects[0] == 0) objIx = 1;

  if ( m.IsShowFlatEarth() ) {

    // set clipping if both models are shown to restrict graphic to one half of the screen
    if (m.IsShowBothModels()) {
      g.SetClipRect( 0, 0, g.CanvasWidth/2, g.CanvasHeight, 'canvas' );
      // Aim this half at the FE horizon so its horizon line lands at the same
      // screen height as the globe horizon in the other half. Mirror mode also
      // flips the pan so the two views face each other.
      var fePan = m.IsShowBothModelsMirror() ? -m.PanRad : m.PanRad;
      m.CompCameraParams( fePan, m.Tilt, m.Roll, 'fe' );
      g.SetCamera( {
        CamPos: m.CamPos,
        CamUp: m.CamUp,
        CamViewCenter: m.CamViewCenter,
      } );
      drawEyeLevel( fePan );
    }

    // draw flat earth horizon and equator
    g.SetAlpha( m.AlphaOpaque );
    g.SetPlane( [ 0, 0, -m.Height ], [ 1, 0, 0 ], [ 0, 1, 0 ] );
    g.SetLineAttr( m.FEEqCol, 1 );
    g.CircleOnPlane( 0, 0, m.EquatorRadiusFE, 1 );
    g.SetLineWidth( 2 );
    g.CircleOnPlane( 0, 0, 2*m.EquatorRadiusFE, 1 );

    var aMax = 2 * Math.PI;
    var alpha = m.AlphaOpaque * (0.6 - 0.5 * (Math.log10( m.Height ) / 9));
    g.SetAlpha( alpha );
    g.SetLineAttr( m.FEGridCol, 1 );

    if (m.showGrid > 0) {

      // circle lines
      var crDelta = m.EquatorRadiusFE / 12;
      var crMax = 2 * m.EquatorRadiusFE - crDelta / 2;
      g.SetPlane( [ 0, 0, -m.Height ], [ 1, 0, 0 ], [ 0, 1, 0 ] );
      for ( var cr = crDelta; cr < crMax; cr += crDelta ) {
        g.ArcOnPlane( 0, 0, cr, 0, aMax, 1 );
      }
      if (m.Height < 700000) {
        crMax = crDelta;
        crDelta /= 10;
        crMax -= crDelta / 2;
        for ( var cr = crDelta; cr < crMax; cr += crDelta ) {
          g.ArcOnPlane( 0, 0, cr, 0, aMax, 1 );
        }
      }
      if (m.Height < 30000) {
        crMax = crDelta;
        crDelta /= 10;
        crMax -= crDelta / 2;
        for ( var cr = crDelta; cr < crMax; cr += crDelta ) {
          g.ArcOnPlane( 0, 0, cr, 0, aMax, 1 );
        }
      }
      if (m.Height < 3000) {
        crMax = crDelta;
        crDelta /= 10;
        crMax -= crDelta / 2;
        for ( var cr = crDelta; cr < crMax; cr += crDelta ) {
          g.ArcOnPlane( 0, 0, cr, 0, aMax, 1 );
        }
      }
      if (m.Height < 300) {
        crMax = crDelta;
        crDelta /= 10;
        crMax -= crDelta / 2;
        for ( var cr = crDelta; cr < crMax; cr += crDelta ) {
          g.ArcOnPlane( 0, 0, cr, 0, aMax, 1 );
        }
      }

      // ray lines
      g.SetAlpha( alpha );
      g.SetLineAttr( m.FEGridCol, 1 );
      var caDelta = Math.PI / 12;
      var caMax = 2 * Math.PI;
      caMax -= caDelta / 2;
      var r = 2 * m.EquatorRadiusFE;
      for ( var ca = 0; ca < caMax; ca += caDelta ) {
        var c = Math.cos( ca );
        var s = Math.sin( ca );
        g.LineOnPlane( r * c, r * s, 0, 0 );
      }
    }

    var drawObjIx = 1;
    if (m.ObjSurfDist[0] > m.ObjSurfDist[1]) drawObjIx = 0;
    m.LastPosValid[0] = false;
    m.LastPosValid[1] = false;
    DrawObjectsBeforeHorizon( drawObjIx, g, false );
    drawObjIx = (drawObjIx + 1) % 2;
    DrawObjectsBeforeHorizon( drawObjIx, g, false );

    // reset clipping (the globe half sets its own camera below)
    if (m.IsShowBothModels()) {
      g.SetClipping( 'canvas' );
    }

  } // end NGridLines > 0

  // Globe Earth

  if (m.IsShowGlobe()) {

    // set clipping if both models are shown to restrict graphic to one half of the screen
    if (m.IsShowBothModels()) {
      g.SetClipRect( g.CanvasWidth/2, 0, g.CanvasWidth/2, g.CanvasHeight, 'canvas' );
      // Aim this half at the globe horizon (normal pan) so its horizon line
      // lands at the same screen height as the FE horizon in the other half.
      m.CompCameraParams( m.PanRad, m.Tilt, m.Roll, 'globe' );
      g.SetCamera( {
        CamPos: m.CamPos,
        CamUp: m.CamUp,
        CamViewCenter: m.CamViewCenter,
      } );
      drawEyeLevel( m.PanRad );
    }

    var drawObjIx = 1;
    if (m.ObjSurfDist[0] > m.ObjSurfDist[1]) drawObjIx = 0;
    m.LastPosValid[0] = false;
    m.LastPosValid[1] = false;
    DrawObjectsBehindHorizon( drawObjIx, g );
    drawObjIx = (drawObjIx + 1) % 2;
    DrawObjectsBehindHorizon( drawObjIx, g );

    var alpha = m.AlphaOpaque * (0.6 - 0.5 * (Math.log10( m.Height ) / 9) );
    g.SetAlpha( alpha );
    g.SetLineAttr( m.GlobeGridCol, 1 );

    // show globe grid
    if ( m.showGrid & 1 ) {

      // latitude lines
      var latMax = m.HorizDropAnglFromEyeLvl;
      var latStart = -( Math.floor( latMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
      for ( var lat = latStart; lat < latMax; lat += m.GridDeltaAngl ) {
        var dLatPlaneDisk = m.EarthCentrToHorizDisc / Math.cos( lat );
        var longMax = Math.acos( dLatPlaneDisk / m.RefractedRadiusEarth );
        var longStart = -( Math.floor( longMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
        g.NewPoly3D();
        for ( var long = longStart; long < longMax; long += m.GridDeltaAngl ) {
          g.AddPointToPoly3D( PointOnEarth( lat, long ) );
        }
        g.AddPointToPoly3D( PointOnEarth( lat, longMax ) );
        g.DrawPoly3D( 1 );
      }

      // longitude lines
      var longMax = m.HorizDropAnglFromEyeLvl;
      var longStart = -( Math.floor( longMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
      for ( var long = longStart; long < longMax; long += m.GridDeltaAngl ) {
        var rLong = m.RefractedRadiusEarth * Math.cos( long );
        var latMax = Math.acos( m.EarthCentrToHorizDisc / rLong );
        var latStart = -( Math.floor( latMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
        g.NewPoly3D();
        g.AddPointToPoly3D( PointOnEarth( -latMax, long ) );
        for ( var lat = latStart; lat < latMax; lat += m.GridDeltaAngl ) {
          g.AddPointToPoly3D( PointOnEarth( lat, long ) );
        }
        g.AddPointToPoly3D( PointOnEarth( latMax, long ) );
        g.DrawPoly3D( 1 );
      }

    } // end show globe grid

    g.SetLineAttr( m.GlobeFGridCol, 1 );

    // show flat grid
    if ( m.showGrid & 2 ) {

      // latitude lines on flat model
      var latMax = m.HorizDropAnglFromEyeLvl;
      var latStart = -( Math.floor( latMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
      for ( var lat = latStart; lat < latMax; lat += m.GridDeltaAngl ) {
        var dLatPlaneDisk = m.EarthCentrToHorizDisc / Math.cos( lat );
        var longMax = Math.acos( dLatPlaneDisk / m.RefractedRadiusEarth );
        var longStart = -( Math.floor( longMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
        g.NewPoly3D();
        for ( var long = longStart; long < longMax; long += m.GridDeltaAngl ) {
          g.AddPointToPoly3D( PointOnPlane( lat, long ) );
        }
        g.AddPointToPoly3D( PointOnPlane( lat, longMax ) );
        g.DrawPoly3D( 1 );
      }

      // longitude lines on flat model
      var longMax = m.HorizDropAnglFromEyeLvl;
      var longStart = -( Math.floor( longMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
      for ( var long = longStart; long < longMax; long += m.GridDeltaAngl ) {
        var rLong = m.RefractedRadiusEarth * Math.cos( long );
        var latMax = Math.acos( m.EarthCentrToHorizDisc / rLong );
        var latStart = -( Math.floor( latMax / m.GridDeltaAngl ) * m.GridDeltaAngl );
        g.NewPoly3D();
        g.AddPointToPoly3D( PointOnPlane( -latMax, long ) );
        for ( var lat = latStart; lat < latMax; lat += m.GridDeltaAngl ) {
          g.AddPointToPoly3D( PointOnPlane( lat, long ) );
        }
        g.AddPointToPoly3D( PointOnPlane( latMax, long ) );
        g.DrawPoly3D( 1 );
      }

    } // end flat grid

    if ( m.showGrid & 2 ) {

      // horizon on flat model
      g.SetPlane( [ 0, 0, -m.Height ], [ 1, 0, 0 ], [ 0, 1, 0 ] );
      g.SetAlpha( m.AlphaOpaque );
      g.SetLineAttr( m.GlobeFGridCol, specialLineWidth );
      g.CircleOnPlane( 0, 0, m.HorizDistOnEyeLvl, 1 );

    }

    // Globe Horizon
    g.SetAlpha( m.AlphaOpaque );
    g.SetLineAttr( m.GlobeGridCol, specialLineWidth );
    g.SetPlane( [ 0, 0, -m.HorizDropFromEyeLvl ], [ 1, 0, 0 ], [ 0, 1, 0 ] );
    g.CircleOnPlane( 0, 0, m.HorizDistOnEyeLvl, 1 );

    // show tangent line to globe horizon
    if ( m.showTangent || m.ShowDataHorizon || m.ShowLftRghtDrop ) {
      g.SetLineAttr( m.TangentCol, 1 );
      g.Line3D( JsgMat3.Trans( rotz, [ -2*m.SceneWidth, m.HorizDistOnEyeLvl, -m.HorizDropFromEyeLvl ] ), JsgMat3.Trans( rotz, [ 2*m.SceneWidth, m.HorizDistOnEyeLvl, -m.HorizDropFromEyeLvl ] ) );
    }

    // show left-right drop line
    if ( m.ShowLftRghtDrop && m.HorizLftRgtWidth > 0) {
      g.SetLineAttr( 'red', 1 );
      g.Line3D( JsgMat3.Trans( rotz, [ -m.HorizLftRgtWidth/2, m.HorizLftRgtDist, -m.HorizDropFromEyeLvl ] ), JsgMat3.Trans( rotz, [ m.HorizLftRgtWidth/2, m.HorizLftRgtDist, -m.HorizDropFromEyeLvl ] ) );
      g.SetMarkerAttr( 'ArrowUp', g.ScalePix(10), 'black', 'white', 1 );
      g.Marker3D( JsgMat3.Trans( rotz, [ -m.HorizLftRgtWidth/2, m.HorizLftRgtDist, -m.HorizDropFromEyeLvl ] ) );
      g.Marker3D( JsgMat3.Trans( rotz, [ m.HorizLftRgtWidth/2, m.HorizLftRgtDist, -m.HorizDropFromEyeLvl ] ) );
    }

    // draw all objects in the foreground
    var drawObjIx = 1;
    if (m.ObjSurfDist[0] > m.ObjSurfDist[1]) drawObjIx = 0;
    DrawObjectsBeforeHorizon( drawObjIx, g, true );
    drawObjIx = (drawObjIx + 1) % 2;
    DrawObjectsBeforeHorizon( drawObjIx, g, true );

    // reset clipping
    if (m.IsShowBothModels()) {
      g.SetClipping( 'canvas' );
    }

  } // end model globe

  if ( m.ShowTheodolite ) {
    var xDir = JsgVect3.Mult( g.Camera.ViewDir, g.Camera.CamUp );
    var yDir = JsgVect3.Mult( g.Camera.ViewDir, xDir );
    var diag = Math.sqrt( m.SceneWidth*m.SceneWidth + m.SceneHeight*m.SceneHeight );
    g.SetPlane( g.Camera.CamViewCenter, xDir, yDir, true );

    // measurements
    var numFormat = { Mode: 'fix0', Precision: 4, UsePrefix: false, Units: '' };

    var txt = NumFormatter.NumToString( m.TheodoliteTilt, numFormat ) + '°';
    g.SetBgColor( 'white' );
    g.SetTextAttr( 'Arial', 12, 'black', 'normal', 'normal', 'left', 'bottom', 5, 2 );
    g.SetAlpha( 0.8 * m.AlphaOpaque );
    g.Rect( g.GetTextBoxOnPlane( txt, 0.1*m.SceneWidth, 0 ), 2 );
    g.SetAlpha( m.AlphaOpaque );
    g.TextOnPlane( txt, 0.1*m.SceneWidth, 0 );

    var txt = NumFormatter.NumToString( m.Pan, numFormat ) + '°';
    g.SetTextAttr( 'Arial', 12, 'black', 'normal', 'normal', 'left', 'top', 5, 2 );
    g.SetAlpha( 0.8 * m.AlphaOpaque );
    g.Rect( g.GetTextBoxOnPlane( txt, 0, -0.35*m.SceneHeight ), 2 );
    g.SetAlpha( m.AlphaOpaque );
    g.TextOnPlane( txt, 0, -0.35*m.SceneHeight );

    // crosshair
    g.SetAlpha( 0.8 * m.AlphaOpaque );
    g.SetLineAttr( 'white', 3 );
    g.LineOnPlane( -0.7*m.SceneWidth/2, 0, -0.05*m.SceneWidth/2, 0 );
    g.LineOnPlane( 0.05*m.SceneWidth/2, 0, 0.7*m.SceneWidth/2, 0 );
    g.LineOnPlane( 0, -0.7*m.SceneHeight/2, 0, -0.05*m.SceneHeight/2 );
    g.LineOnPlane( 0, 0.7*m.SceneHeight/2, 0, 0.05*m.SceneHeight/2 );
    g.SetAlpha( m.AlphaOpaque );
    g.SetLineAttr( 'black', 1 );
    g.LineOnPlane( -0.7*m.SceneWidth/2, 0, -0.02*m.SceneWidth/2, 0 );
    g.LineOnPlane(  0.7*m.SceneWidth/2, 0,  0.02*m.SceneWidth/2, 0 );
    g.LineOnPlane( 0, -0.7*m.SceneHeight/2, 0, -0.02*m.SceneHeight/2 );
    g.LineOnPlane( 0,  0.7*m.SceneHeight/2, 0,  0.02*m.SceneHeight/2 );

    // theodolite scope border
    g.SetAreaAttr( 'gray', 'gray', 2 );
    g.SetAlpha( 0.8 * m.AlphaOpaque );
    g.OpenPath3D();
    g.RectOnPlane( -diag, -diag, diag, diag );
    g.CircleOnPlane( 0, 0, -0.35*diag );
    g.Path3D( 3 );
    g.SetAlpha( m.AlphaOpaque );
  }

  // label split screen
  if (m.IsShowBothModels()) {
    var oldTrans = g.SelectTrans( 'viewport' );
    // label left
    var txt = 'Flat Earth';
    g.SetTextAttr( 'Arial', 16, 'black', 'bold', 'normal', 'left', 'top', 10 );
    g.SetAreaAttr( 'yellow', 'white', 1 );
    g.TextBox( txt, 0, 0, 3 );
    g.Text( txt, 0, 0 );
    // label right
    var txt = 'Globe';
    g.SetTextAttr( 'Arial', 16, 'black', 'bold', 'normal', 'right', 'top', 10 );
    g.SetAreaAttr( 'yellow', 'white', 1 );
    g.TextBox( txt, g.VpInnerWidth, 0, 3 );
    g.Text( txt, g.VpInnerWidth, 0 );
    // split line
    g.SetLineAttr( '#ddd', 1 );
    g.Line( g.VpInnerWidth/2, 0, g.VpInnerWidth/2, g.VpInnerHeight );
    g.SelectTrans( oldTrans );
  }

  // draw frame
  if (m.DeviceRatio != DeviceRatio_Off && m.FrameCol != '') {
    g.SetAlpha( m.AlphaOpaque );
    g.SetLineAttr( m.FrameCol, 2 );
    var xDir = JsgVect3.Mult( g.Camera.ViewDir, g.Camera.CamUp );
    var yDir = JsgVect3.Mult( g.Camera.ViewDir, xDir );
    g.SetPlane( g.Camera.CamViewCenter, xDir, yDir, true );
    g.RectOnPlane( -m.SceneWidth/2, -m.SceneHeight/2, m.SceneWidth/2, m.SceneHeight/2, 1 );
  }

  var numFormat = {
    Mode: 'std',
    Precision: 4,
    UsePrefix: false,
    Units: '',
  };

  var numFormat4 = {
    Mode: 'std',
    Precision: 4,
    UsePrefix: false,
    Units: '',
  };

  // draw left-right drop data
  var textSize = g.ScalePix(14);
  var lineHeight = g.ScalePix(21);
  var tm = g.ScalePix(5); // text margin

  if ( m.ShowLftRghtDrop && m.IsShowGlobe() && m.HorizLftRgtWidth > 0) {
    var posDropLine, align, offset;
    posDropLine = JsgMat3.Trans( rotz, [ 0.46 * m.HorizLftRgtWidth, m.HorizLftRgtDist, -m.HorizDropFromEyeLvl ] );
    align = 'right';
    offset = g.ScalePix(40);

    var posDropLineWin = g.VTransPoint3D( posDropLine );
    var posDropLineVp = g.TransXY( posDropLineWin[0], posDropLineWin[1] );
    var posDropLineX = posDropLineVp.x;
    var posDropLineY = posDropLineVp.y - g.ScalePix(1);
    var posTextX = posDropLineX + offset;
    var posTextY = posDropLineY + g.ScalePix(30);
    if (posTextX < tm) posTextX = tm;
    if (posTextX > g.VpInnerWidth-tm) posTextX = g.VpInnerWidth-tm;

    // show left-right drop data
    g.SetTextAttr( 'Arial', textSize, 'black', 'normal', 'normal', align, 'bottom', 4 );
    g.SetMarkerAttr( 'Arrow1', 6, 'black', 'black', 1 );
    var oldTrans = g.SelectTrans( 'viewport' );

    g.Arrow( posDropLineX, posTextY, posDropLineX, posDropLineY, 9 );
    g.SetBgColor( 'white' );

    var txt = 'Left-Right Drop Angle = ' + NumFormatter.NumToString( m.HorizLftRgtDropAngl, numFormat ) + '°';
    var ty = posTextY + lineHeight;
    g.TextBox( txt, posTextX, ty, 2 );
    g.Text( txt, posTextX, ty );

    var txt = 'Left-Right Drop = ' + NumFormatter.NumToString( HVal(m.HorizLftRgtDrop), numFormat ) + HUnit();
    ty += lineHeight;
    g.TextBox( txt, posTextX, ty, 2 );
    g.Text( txt, posTextX, ty );

    var txt = 'Left-Right Width = ' + NumFormatter.NumToString( LVal(m.HorizLftRgtWidth), numFormat ) + LUnit();
    ty += lineHeight;
    g.TextBox( txt, posTextX, ty, 2 );
    g.Text( txt, posTextX, ty );

    var txt = 'Apparent Radius = ' + NumFormatter.NumToString( LVal(m.RefractedRadiusEarth), numFormat ) + LUnit();
    ty += lineHeight;
    g.TextBox( txt, posTextX, ty, 2 );
    g.Text( txt, posTextX, ty );

    g.SelectTrans( oldTrans );
  }

  // draw data
  if (m.showData && m.IsShowGlobe()) {

    var posHorizon, align, offset;
    align = 'right';

    if (m.ShowDataHorizon) {
      posHorizon = JsgMat3.Trans( rotz, [ 0.44 * m.SceneWidth, m.HorizDistOnEyeLvl, -m.HorizDropFromEyeLvl ] );
      offset = g.ScalePix(40);
      var posHorizonWin = g.VTransPoint3D( posHorizon );
      var posHorizonVp = g.TransXY( posHorizonWin[0], posHorizonWin[1] );
      var posHorizonX = posHorizonVp.x;
      var posHorizonY = posHorizonVp.y - g.ScalePix(2);
      var posTextX = posHorizonX + offset;
      var posTextY = posHorizonY - g.ScalePix(30);
      if (posTextX < tm) posTextX = tm;
      if (posTextX > g.VpInnerWidth-tm) posTextX = g.VpInnerWidth-tm;

      // show horizon data
      g.SetTextAttr( 'Arial', textSize, 'black', 'normal', 'normal', align, 'bottom', 4 );
      g.SetMarkerAttr( 'Arrow1', 6, 'black', 'black', 1 );
      var oldTrans = g.SelectTrans( 'viewport' );

      g.Arrow( posHorizonX, posTextY, posHorizonX, posHorizonY, 9 );
      g.SetBgColor( 'white' );

      var txt = 'Grid Spacing = ' + NumFormatter.NumToString( LVal(m.GridSpacing), numFormat ) + LUnit();
      var ty = posTextY;
      g.TextBox( txt, posTextX, ty, 2 );
      g.Text( txt, posTextX, ty );

      var txt = 'Sagitta (Bulge) = ' + NumFormatter.NumToString( HVal(m.Bulge), numFormat ) + HUnit();
      ty -= lineHeight;
      g.TextBox( txt, posTextX, ty, 2 );
      g.Text( txt, posTextX, ty );

      var txt = 'Drop from Surface = ' + NumFormatter.NumToString( HVal(m.HorizDropFromObsSurf), numFormat ) + HUnit();
      ty -= lineHeight;
      g.TextBox( txt, posTextX, ty, 2 );
      g.Text( txt, posTextX, ty );

      var txt = 'Drop from Eye-Level = ' + NumFormatter.NumToString( HVal(m.HorizDropFromEyeLvl), numFormat ) + HUnit();
      ty -= lineHeight;
      g.TextBox( txt, posTextX, ty, 2 );
      g.Text( txt, posTextX, ty );

      var txt = 'Horizon Dip Angle = ' + NumFormatter.NumToString( toDeg( m.HorizDropAnglFromEyeLvl ), numFormat ) + '°';
      ty -= lineHeight;
      g.TextBox( txt, posTextX, ty, 2 );
      g.Text( txt, posTextX, ty );

      var txt = 'Distance on Surface = ' + NumFormatter.NumToString( LVal(m.HorizSurfDist), numFormat ) + LUnit();
      ty -= lineHeight;
      g.TextBox( txt, posTextX, ty, 2 );
      g.Text( txt, posTextX, ty );

      g.SelectTrans( oldTrans );
    }

    if (m.ShowDataObject && m.NObjects[objIx] > 0) {

      // show object data
      var oldTrans = g.SelectTrans( 'viewport' );

      var ty = 1.25 * lineHeight;
      var tx = tm;
      var hAl = 'left';
      if (m.IsShowBothModels()) {
        tx += g.VpInnerWidth / 2;
      }
      g.SetTextAttr( 'Arial', textSize, 'black', 'normal', 'normal', hAl, 'bottom', 4 );
      g.SetBgColor( 'white' );

      var txt = 'Target ' + (m.NearObjIx+1) + ' Visible = ' + NumFormatter.NumToString( HVal(m.ObjVisi), numFormat4 ) + HUnit() + '; Hidden = ' + NumFormatter.NumToString( HVal(m.ObjHidden), numFormat4 ) + HUnit();
      g.SetBgColor( '#ffddff' );
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      var eq = ' = ';
      var a = m.ObjSizeAngl;
      if (a < 1e-5) a = 0;
      if (m.IsVariableSizeObject(objIx)) eq = ' <= ';
      var txt = 'Size ' + eq + NumFormatter.NumToString( HVal(m.ObjNearSize), numFormat4 ) + HUnit() + '; Angular Size = ' + NumFormatter.NumToString( a, numFormat ) + '°';
      g.SetBgColor( 'white' );
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      var txt = 'Drop = ' + NumFormatter.NumToString( HVal(m.ObjDropFromObsSurf), numFormat ) + HUnit() + '; Drop Angle = ' + NumFormatter.NumToString( m.ObjDropAnglFromObsSurf, numFormat4 ) + '°';
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      var va = m.ObjTopAnglFromEyeLvl;
      if (Math.abs(va) < 1e-5) va = 0;
      var txt = 'Top Angle = ' + NumFormatter.NumToString( va, numFormat ) + '°; Tilt = ' + NumFormatter.NumToString( m.ObjNearTilt, numFormat4 ) + '°';
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      g.SelectTrans( oldTrans );

    }

    if (m.ShowDataRefraction && m.NObjects[objIx] > 0) {

      var oldTrans = g.SelectTrans( 'viewport' );

      // show refraction data
      var ty = g.VpInnerHeight - 5.25 * lineHeight;
      var tx = tm;
      var hAl = 'left';
      if (m.IsShowBothModels()) {
        tx += g.VpInnerWidth / 2;
      }
      g.SetTextAttr( 'Arial', textSize, 'black', 'normal', 'normal', hAl, 'bottom', 4 );
      g.SetBgColor( 'white' );

      var txt = 'Lift Relativ to Horizon = ' + NumFormatter.NumToString( HVal(m.ObjLiftRelToHoriz), numFormat4 ) + HUnit();
      g.SetBgColor( '#ffddff' );
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      var txt = 'Lift Absolute = ' + NumFormatter.NumToString( HVal(m.ObjLiftAbs), numFormat4 ) + HUnit();
      g.SetBgColor( 'white' );
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      var txt = 'Horizon Lift = ' + NumFormatter.NumToString( HVal(m.HorizonLift), numFormat4 ) + HUnit();
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      g.SetTextColor( 'darkred' );
      var txt = 'Refraction Angle = ' + NumFormatter.NumToString( m.ObjRefrAngl, numFormat ) + '°';
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      g.SelectTrans( oldTrans );
    }

  }

  if (m.showData && m.IsShowFlatEarth()) {

    var oldTrans = g.SelectTrans( 'viewport' );

    if (m.ShowDataObject && m.NObjects[objIx] > 0) {

      // show object data
      var ty = 1.25 * lineHeight;
      var tx = tm;
      var hAl = 'left';
      if (m.IsShowBothModels()) {
        tx = g.VpInnerWidth / 2 - tm;
        hAl = 'right';
      }
      g.SetTextAttr( 'Arial', textSize, 'black', 'normal', 'normal', hAl, 'bottom', 4 );
      g.SetBgColor( 'white' );

      var txt = 'Target ' + (m.NearObjIx+1) + ' Visible = ' + NumFormatter.NumToString( HVal(m.ObjSize[objIx]), numFormat4 ) + HUnit() + '; Hidden = ' + NumFormatter.NumToString( HVal(0), numFormat4 ) + HUnit();
      g.SetBgColor( '#ffddff' );
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      var eq = ' = ';
      var a = m.ObjSizeAngl;
      if (a < 1e-5) a = 0;
      if (m.IsVariableSizeObject(objIx)) eq = ' <= ';
      var txt = 'Size ' + eq + NumFormatter.NumToString( HVal(m.ObjNearSize), numFormat4 ) + HUnit() + '; Angular Size = ' + NumFormatter.NumToString( a, numFormat ) + '°';
      g.SetBgColor( 'white' );
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

      var va = m.ObjTopAnglFromEyeLvlFE;
      if (Math.abs(va) < 1e-5) va = 0;
      var txt = 'Top Angle = ' + NumFormatter.NumToString( va, numFormat ) + '°';
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
      ty += lineHeight;

    }

    g.SelectTrans( oldTrans );

  }

  // show refraction data

  if (m.ShowDataRefraction && m.IsShowGlobe() && (Math.abs(m.RefractionCoeff) > 0.001 || (m.showData && m.NObjects[objIx] > 0))) {

    function refractionClass( k ) {
      var r_class = '';
      if (k >= 0.78) {
        r_class = 'extreme';
      } else if (k >= 0.58) {
        r_class = 'severe';
      } else if (k >= 0.38) {
        r_class = 'strong';
      } else if (k >= 0.18) {
        r_class = 'medium';
      } else if (k >= 0.12) {
        r_class = 'standard';
      } else if (k > 0.0001) {
        r_class = 'weak';
      } else if (k < 0) {
        r_class = 'negative';
      }
      if (r_class != '') r_class = '(' + r_class + ')';
      return r_class;
    }

    function tempGradClass( dt ) {
      var t_class = '';
      if (dt < -0.01) {
        t_class = 'instable Layer';
      } else {
        t_class = 'stable Layer';
      }
      if (dt > 0) {
        t_class += '; Inversion';
      }
      if (t_class != '') t_class = '(' + t_class + ')';
      return t_class;
    }

    var oldTrans = g.SelectTrans( 'viewport' );

    var tx = tm;
    var hAl = 'left';
    if (m.IsShowBothModels()) {
      tx += g.VpInnerWidth / 2;
    }

    g.SetTextAttr( 'Arial', textSize, 'darkred', 'normal', 'normal', hAl, 'bottom', 4 );
    if (m.RefractionCoeff < -1e-5) {
      g.SetBgColor( '#ffeeaa' );
    } else if (m.RefractionCoeff > 1e-5) {
      g.SetBgColor( '#ffff80' );
    } else {
      g.SetBgColor( 'white' );
    }

    var oldFormatMode = numFormat.Mode;
    var oldPrecision = numFormat.Precision;
    numFormat.Mode = 'fix0';

    var ty = g.VpInnerHeight - lineHeight - g.ScalePix(5);
    var txt = 'Refraction k = ' + NumFormatter.NumToString( m.RefractionCoeff, numFormat );
    if (m.RefractionSync == 2) {
      txt += ' (Standard Atmosphere)';
    } else {
      txt += ' ' + refractionClass( m.RefractionCoeff );
    }
    g.TextBox( txt, tx, ty, 2 );
    g.Text( txt, tx, ty );

    if (m.Height < 84852) {
      numFormat.Precision = 5;
      var txt = '';
      if (m.TemperatureGradient < 1) {
        txt = 'Temp. Gradient dT/dh = ' + NumFormatter.NumToString( AVal(m.TemperatureGradient), numFormat ) + AUnit()+ ' ';
      }
      ty += lineHeight;
      txt += tempGradClass( m.TemperatureGradient );
      g.TextBox( txt, tx, ty, 2 );
      g.Text( txt, tx, ty );
    }

    numFormat.Mode = oldFormatMode;
    numFormat.Precision = oldPrecision;

    g.SelectTrans( oldTrans );
  }

  // draw overlay image
  if (m.OverlayImage != '' && m.OverlayImageAlpha > 0) {
    g.SetAlpha( m.OverlayImageAlpha );
    var imgUrl = m.OverlayImage;
    if (imgUrl.indexOf('http') != 0) imgUrl = MEDIA_FOLDER + imgUrl;
    g.DrawImage( imgUrl, 'canvas-in' );
    g.SetAlpha( m.AlphaOpaque )
  }

  // draw demo text and description
  if (m.DemoText != '') {
    var oldTrans = g.SelectTrans( 'viewport' );

    g.SetTextAttr( 'Arial', 20, 'black', 'normal', 'normal', 'center', 'top', 10 );
    g.SetBgColor( 'white' );

    if (m.OverlayImage != '') {
      g.TextBox( m.DemoText, g.VpInnerWidth/2, 0, 2 );
    }
    g.Text( m.DemoText, g.VpInnerWidth/2, 0 );

    if (m.Description != '') {
      g.SetTextAttr( 'Arial', 16, 'black', 'normal', 'normal', 'center', 'top', 10 );
      if (m.OverlayImage != '') {
        g.TextBox( m.Description, g.VpInnerWidth/2, g.ScalePix(30), 2 );
      }
      g.Text( m.Description, g.VpInnerWidth/2, g.ScalePix(30) );
    }

    g.SelectTrans( oldTrans );
  }

}


Object.assign(globalThis, { graph, DrawModel });
