// FeDomeApp Draw* methods - extracted from app.js
// Imports after app.js, so FeDomeApp already exists on globalThis.

Object.assign(FeDomeApp, {

  Draw: function (g) {
    g = g || this.GraphObject;

    if (!this.IsInit) this.Update();
    EarthMap.Radius = this.RadiusFE;
    g.Reset3D();

    // compute scene size and init camera
    var sceneSize = 2 * this.CameraDistance * Math.tan(Math.asin(this.RadiusFE / this.CameraDistance));
    g.SetCameraScale(sceneSize);
    g.SetCameraZoom(this.Zoom);
    g.SetCameraView([0, 0, 0], this.CameraDirection, this.CameraHeight, this.CameraDistance);
    g.SetWindowToCameraScreen();
    g.SetGraphClipping(true, 'viewport', 0);

    // this plane transforms the flat earth from upright to horizontal
    g.SetPlane(this.FePlane.Copy());

    // compute camera viewing center as a position between half dome height and observer pos depending on zoom
    var halfDomeHeight = [0, 0, this.DomeHeight / 2];
    var targetFeCoord = this.ObserverFeCoord;
    if (this.RayTarget == 1 && this.RaySource == 2) {
      // if ray source is star then zoom in on star position instead of observer position
      var starDomeCoord = this.CelestLatLongToDomeCoord(this.ObserverLat, this.ObserverLong);
      targetFeCoord = this.DomeCoordToGlobalFeCoord(starDomeCoord);
    }
    var obsToHalfHeight = JsgVect3.Sub(halfDomeHeight, targetFeCoord);
    var halfWay = Limit01((this.Zoom - this.ZoomMin) / (this.ZoomMax - this.ZoomMin));
    halfWay = Math.pow(halfWay - 1, 4);
    var cameraViewCenter = JsgVect3.Add(targetFeCoord, JsgVect3.Scale(obsToHalfHeight, halfWay));
    g.SetCameraView(cameraViewCenter, this.CameraDirection, this.CameraHeight, this.CameraDistance);

    // draw flat earth map
    EarthMap.DrawFlatEarth(g);

    // draw flat earth night time shadow
    if (this.ShowShadow) {
      this.DrawFeNightShadow(g);
    }

    // draw flat earth grid
    if (this.ShowFeGrid) {
      g.SetAlpha(0.2);
      g.SetLineAttr('gray', 1);
      EarthMap.DrawFlatEarthGrid(g, 15, 15);
      g.SetLineAttr('black', 1);
      EarthMap.DrawFlatEarthEquator(g);
      EarthMap.DrawFlatEarthBorder(g);
      EarthMap.DrawFlatEarthMeridian(g);
      g.SetAlpha(1);
    }

    // draw flat earth center
    g.SetAreaAttr('white', 'red', 1);
    g.PolygonOnPlane([0, 100, 500, 100, 0, -100, -500, -100, 0], [500, 100, 0, -100, -500, -100, 0, 100, 500], 3);

    // draw observer
    if (this.RayTarget == 0) {
      this.DrawObserver(g);
    }

    // draw local celstial sphere
    if (this.RayTarget == 0 && this.ShowSphere) {
      this.DrawFeCelestSphere(g);
    }

    // draw local celestial sphere stars
    if (this.RayTarget == 0 && this.ShowStars && this.ShowSphere) {
      this.DrawFeCelestSphereStars(g, 6, 12);
    }

    // draw line to moon and celestial sphere moon

    this.DrawMoonRays(g);

    // draw line to sun

    this.DrawSunRays(g);

    // draw star rays
    this.DrawStarsRays(g);

    // draw dome
    g.TransRotateZ3D(-this.EarthRotAngle);

    // draw dome grid
    if (this.ShowDomeGrid) {
      g.SetAlpha(0.2);
      g.SetLineAttr('#44f', 1);
      this.DrawDomeGrid(g, 12, 24);
      g.SetLineAttr('gray', 1);
      this.DrawDomeOutline(g, 24);
      g.SetAlpha(1);
    }

    if (this.ShowDomeGrid || this.ShowSunTrack || this.ShowMoonTrack) {
      g.SetAlpha(0.2);
      g.SetLineAttr('#00f', 2);
      this.DrawDomeLatitudeLine(g, 0);   // equator
      g.SetLineAttr('#00f', 1);
      this.DrawDomeLongitudeLine(g, 0);  // meridian
      g.Line3D([0, 0, 0], [0, 0, this.DomeHeight]); // dome axes
      g.SetAlpha(1);
    }

    if (this.ShowSunTrack || this.ShowMoonTrack) {
      g.SetAlpha(0.2);
      g.SetLineAttr('#00f', 1.5);
      this.DrawDomeLatitudeLine(g, this.AxialTilt);   // solstices
      this.DrawDomeLatitudeLine(g, -this.AxialTilt);   // solstices
      g.SetAlpha(0.5);
      this.DrawDomeLatitudeLine(g, -90); // south pole latitude
      g.SetAlpha(1);
    }

    if (this.ShowMoonTrack) {
      // draw moon path
      g.SetLineAttr('#aaa', 1);
      this.DrawDomeLatitudeLine(g, this.MoonCelestLatLong.lat);

      // moon ecliptic
      this.DrawMoonTrack(g);
    }

    if (this.ShowSunTrack) {
      // draw sun path
      g.SetLineAttr('orange', 1);
      this.DrawDomeLatitudeLine(g, this.SunCelestLatLong.lat);

      // sun ecliptic
      this.DrawSunTrack(g);
    }

    // draw dome stars
    if (this.ShowStars && this.RayTarget == 0) {
      this.DrawDomeStars(g, 6, 12);
    }

    // draw moon
    g.SetMarkerAttr('Circle', 10, '#888', 'white', 1);
    g.Marker3D(this.MoonDomeCoord, 3);

    // draw sun
    g.SetMarkerAttr('Circle', 20, 'white', 'white', 1);
    g.SetAlpha(0.5);
    g.Marker3D(this.SunDomeCoord, 2);
    g.SetMarkerAttr('Circle', 15, 'white', 'white', 1);
    g.Marker3D(this.SunDomeCoord, 2);
    g.SetMarkerAttr('Circle', 10, 'orange', 'white', 1);
    g.SetAlpha(1);
    g.Marker3D(this.SunDomeCoord, 3);
    g.ResetTrans3D();

    if (!this.ShowStars && this.RayTarget == 0) {
      this.DrawMoonPhase(g);
    }

    this.DrawDescription(g);

    g.SetLineAttr('#ddd', 1);
    g.Frame();

  },

  DrawDescription: function (g) {
    // all coordinates are with respect to a vieport of size 907x507

    var oldTrans = g.SelectTrans('viewport');

    if (this.Description != '') {
      g.SetTextAttr('Arial', 16, 'black', 'normal', 'normal', 'center', 'bottom', 3);
      g.SetAreaAttr('white', 'white', 1);
      var tx = g.VpInnerWidth / 2;
      var ty = g.VpInnerHeight - 4;
      g.TextBox(this.Description, tx, ty, 3);
      g.Text(this.Description, tx, ty);
    }

    if (this.PointerText != '') {
      g.SetAlpha(0.5);
      g.SetMarkerAttr('Arrow1', 16, 'gray', 'gray', 3);
      var xFrom = this.PointerFrom[0] * g.VpInnerWidth / 907;
      var yFrom = this.PointerFrom[1] * g.VpInnerHeight / 507;
      var xTo = this.PointerTo[0] * g.VpInnerWidth / 907;
      var yTo = this.PointerTo[1] * g.VpInnerHeight / 507;
      g.Arrow(xFrom + 1, yFrom + 2, xTo + 1, yTo + 2);
      g.SetAlpha(1);
      g.SetAreaAttr('red', 'red', 2);
      g.Arrow(xFrom, yFrom, xTo, yTo);

      var txtpos = JsgVect2.Sub(this.PointerFrom, [0, 4]);
      var txtHalign = 'bottom';
      var yoff = -4;
      if (yTo < yFrom) {
        txtHalign = 'top';
        yoff = 4;
      }
      g.SetTextAttr('Arial', 12, 'black', 'normal', 'normal', 'center', txtHalign, 3);
      g.SetAreaAttr('gray', 'gray', 1);
      g.SetAlpha(0.5);
      g.TextBox(this.PointerText, xFrom + 1, yFrom + yoff + 2, 3);
      g.SetAlpha(1);
      g.SetAreaAttr('white', 'white', 1);
      g.TextBox(this.PointerText, xFrom, yFrom + yoff, 3);
      g.Text(this.PointerText, xFrom, yFrom + yoff);
    }

    g.SelectTrans(oldTrans);
  },

  DateTimeToString: function (dateTime) {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function num00(n) {
      var s = Math.floor(n).toString();
      if (s.length < 2) s = '0' + s;
      return s;
    }

    var ms = (this.ZeroDate + dateTime) * this.msPerDay;
    var dateObj = new Date(ms);
    var year = dateObj.getUTCFullYear();
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var hours = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();

    var s = monthNames[month] + ' ' + num00(day) + ' ' + year + ' / ' + num00(hours) + ':' + num00(minutes) + ' UTC';
    if ((month == 2 && day == 20) || (month == 8 && day == 19)) {
      s = s + '|Equinox';
    }
    return s;
  },

  DrawMoonPhase: function (g) {
    // This function draws the moon phase and orientation in the upped left corner.
    // It uses the relative positions of sun, earth and moon in the heliocentric model
    // to calculate the moon shadow in the heliocentric model.
    // Using the observer location on the globe, assuming the observer aims his camera
    // to the moon, keeping the camera vertical, the apparent orientation for the observer
    // is calculated and drawn. 
    //
    // Note: This function does not have any flat earth calculations at all. 
    // It only uses heliocentric and globe model values, transformations and calculations.

    // compute coloring of moon and background depending on its position

    if (this.MoonFeCelestSphereCoord[2] > 0) {
      // moon above horizon
      if (this.SunFeCelestSphereCoord[2] > 0) {
        // daytime
        var brightColor = '#bbf';
        var darkColor = '#22f';
      } else {
        // night
        var brightColor = '#fff';
        var darkColor = '#000';
      }
    } else {
      // moon below horizon
      if (this.SunFeCelestSphereCoord[2] > 0) {
        // daytime
        var brightColor = '#2a2';
        var darkColor = '#090';
      } else {
        // night
        var brightColor = '#151';
        var darkColor = '#030';
      }
    }

    // calculate direction of moon shadow in heliocentric (celestial) coordinates
    // from vectors between moon and sun and moon and earth in the heliocentric model

    var moonCelestPos = JsgVect3.Scale(this.MoonCelestCoord, this.DistMoon);
    var sunCelestPos = JsgVect3.Scale(this.SunCelestCoord, this.DistSun);
    var vectCelestMoonToGlobe = JsgVect3.Norm(JsgVect3.Scale(moonCelestPos, -1));
    var vectCelestMoonToSun = JsgVect3.Norm(JsgVect3.Sub(sunCelestPos, moonCelestPos));
    var vectCelestMoonShadowUp = JsgVect3.Norm(JsgVect3.Mult(vectCelestMoonToSun, vectCelestMoonToGlobe));
    var vectCelestMoonShadowEast = JsgVect3.Norm(JsgVect3.Mult(vectCelestMoonShadowUp, vectCelestMoonToGlobe));

    // moon phase is determined by the vectors between moon/sun and moon/earth

    var moonPhase = Math.acos(Limit1(JsgVect3.ScalarProd(vectCelestMoonToSun, vectCelestMoonToGlobe)));

    // transform the celestial direction to the moon into the globe coordinate system 
    // which depends on the orientation of the earth at current date/time and observer location

    var vectGlobeToMoon = this.CelestCoordToLocalGlobeCoord(JsgVect3.Scale(vectCelestMoonToGlobe, -1));

    // to calculate the moon phase orientation for the observer, 
    // we need the camera orientation on the globe model

    var camRight = JsgVect3.Mult(vectGlobeToMoon, [1, 0, 0]);
    if (JsgVect3.Length(camRight) == 0) {
      camRight = [0, 0, 1];
    } else {
      camRight = JsgVect3.Norm(camRight);
    }
    var camUp = JsgVect3.Mult(camRight, vectGlobeToMoon);

    // transform the heliocentric moon shadow direction to the 
    // local observer coordinate system on the globe

    var vectMoonShadowUp = this.CelestCoordToLocalGlobeCoord(vectCelestMoonShadowUp);
    var vectMoonShadowEast = this.CelestCoordToLocalGlobeCoord(vectCelestMoonShadowEast);

    // calculate the apparent moon phase orientation 
    // from the camera up vector and the direction of the shadow 
    // in the observers coordinate system.

    var moonRotation = Math.acos(Limit1(JsgVect3.ScalarProd(camUp, vectMoonShadowUp)));
    if (JsgVect3.ScalarProd(vectMoonShadowUp, camRight) > 0) {
      moonRotation *= -1;
    }

    // draw the moon in the upper left corner of the window
    // in the calculated moonRotation

    var d = (moonPhase / Math.PI * 8) % 16;
    g.SetViewport(5, 5, g.CanvasWidth / 14, g.CanvasWidth / 14);

    g.SetAreaAttr(darkColor, darkColor, 1);
    g.Frame(3);

    g.SetWindow(-1.09, -1.09, 1.09, 1.09);
    g.TransRotate(ToDeg(moonRotation));
    g.OpenPath();
    g.Circle(0, 0, 1);
    g.Clip();
    g.SetBgColor(brightColor);
    var rx = Math.abs(Math.cos(d / 8 * Math.PI));
    if (d >= 0 && d < 4) {
      g.SetBgColor(brightColor);
      g.Rect(-1, -1, 0, 1, 2);
      g.SetBgColor(brightColor);
      g.Ellipse(0, 0, rx, 1, 0, 2);
    } else if (d >= 4 && d < 8) {
      g.SetBgColor(brightColor);
      g.Rect(-1, -1, 0, 1, 2);
      g.SetBgColor(darkColor);
      g.Ellipse(0, 0, rx, 1, 0, 2);
    } else if (d >= 8 && d < 12) {
      g.SetBgColor(brightColor);
      g.Rect(0, -1, 1, 1, 2);
      g.SetBgColor(darkColor);
      g.Ellipse(0, 0, rx, 1, 0, 2);
    } else {
      g.SetBgColor(brightColor);
      g.Rect(0, -1, 1, 1, 2);
      g.SetBgColor(brightColor);
      g.Ellipse(0, 0, rx, 1, 0, 2);
    }
    g.SetAlpha(1);
    g.ResetTrans();
    g.SetViewport();
    g.SetClipping();

    if (true || this.MoonFeCelestSphereCoord[2] < 0) {
      // moon below horizon, label invisible
      var oldTrans = g.SelectTrans('viewport');
      g.SetTextAttr('Arial', 12, 'black', 'normal', 'normal', 'center', 'top', 2);
      g.SetAreaAttr('white', 'white', 1);
      var tx = g.CanvasWidth / 28 + 5;
      var ty = g.CanvasWidth / 14 + 8;
      var txt = 'not visible';
      var txt = (100 * (1 - moonPhase / Math.PI)).toFixed(1) + '%';
      g.TextBox(txt, tx, ty, 3);
      g.Text(txt, tx, ty);
      g.SelectTrans(oldTrans);
    }
  },

  DrawObserver: function (g) {
    // local globe coord: x -> up, y -> east, z -> north
    var me = this;
    function tfe(p) {
      return me.LocalGlobeCoordToGlobalFeCoord(p);
    }
    var origin = tfe([0, 0, 0]);
    var north = tfe([0, 0, 500]);
    var east = tfe([0, 500, 0]);
    var south = tfe([0, 0, -500]);
    var west = tfe([0, -500, 0]);
    var corner1 = tfe([0, 100, 100]);
    var corner2 = tfe([0, 100, -100]);
    var corner3 = tfe([0, -100, -100]);
    var corner4 = tfe([0, -100, 100]);
    g.SetAreaAttr('red', 'black', 1);
    g.NewPoly3D().AddPointToPoly3D(north).AddPointToPoly3D(corner1).AddPointToPoly3D(origin).AddPointToPoly3D(corner4);
    g.DrawPoly3D(7);
    g.SetAreaAttr('white', 'black', 1);
    g.NewPoly3D().AddPointToPoly3D(east).AddPointToPoly3D(corner2).AddPointToPoly3D(origin).AddPointToPoly3D(corner1);
    g.DrawPoly3D(7);
    g.SetAreaAttr('blue', 'black', 1);
    g.NewPoly3D().AddPointToPoly3D(south).AddPointToPoly3D(corner2).AddPointToPoly3D(origin).AddPointToPoly3D(corner3);
    g.DrawPoly3D(7);
    g.SetAreaAttr('white', 'black', 1);
    g.NewPoly3D().AddPointToPoly3D(west).AddPointToPoly3D(corner3).AddPointToPoly3D(origin).AddPointToPoly3D(corner4);
    g.DrawPoly3D(7);

    g.SetAlpha(0.5);
    g.SetLineAttr('red', 1);
    g.Line3D(this.ObserverFeCoord, [0, 0, 0]);
    g.SetAlpha(1);
  },

  DrawFeNightShadow: function (g) {
    var transRotateToSun = JsgMat3.RotatingZ(ToRad(this.SunCelestAngle));
    var transRotateToEarth = JsgMat3.RotatingZ(-ToRad(this.EarthRotAngle));
    var maxDeltaLongDeg = 2.5;
    var dAngle = ToRad(2.5);
    var maxAngle = 2 * Math.PI + dAngle / 2;
    var sunAng = this.SunCelestAngle;
    var sunAngularSize = 0.5334 * Math.PI / 180;
    var nearSunRadius = 0.5 * this.DistSun * sunAngularSize;
    var shadowOffset = (this.RadiusEarth - nearSunRadius) / this.DistSun;
    if (shadowOffset < 0) shadowOffset = 0;
    var shadowRadius = Math.sqrt(1 - shadowOffset * shadowOffset);
    g.NewPoly();
    for (var angle = 0; angle < maxAngle; angle += dAngle) {
      var pCircle = JsgVect3.Scale([shadowOffset, shadowRadius * Math.sin(angle), shadowRadius * Math.cos(angle)], this.RadiusEarth);
      var pCelest = JsgMat3.Trans(this.TransMatSunToCelest, JsgMat3.Trans(transRotateToSun, pCircle));
      var pEarth = JsgMat3.Trans(transRotateToEarth, pCelest);
      var latlong = this.CoordToLatLong(pEarth);
      g.AddPointToPoly(latlong.lat, latlong.lng);
    }
    // interpolate between holes in Poly(lat,long)
    var poly = g.Poly;
    var maxi = poly.Size - 2;
    g.NewPoly3D();
    for (var i = 0; i < maxi; i++) {
      var pFE = this.FeLatLongToGlobalFeCoord(poly.X[i], poly.Y[i]);
      g.AddPointToPoly3D(pFE);
      var longMin = poly.Y[i];
      var longMax = poly.Y[i + 1];
      var diffLong = longMax - longMin;
      if (Math.abs(diffLong) > 180) {
        // bridge over 180 to -180
        if (longMin < longMax) {
          longMin += 360;
        } else {
          longMax += 360;
        }
        diffLong = longMax - longMin;
      }
      if (Math.abs(diffLong) > maxDeltaLongDeg && poly.X[i] < 10) {
        // add interpolated points
        var nPoints = Math.floor(Math.abs(diffLong) / maxDeltaLongDeg);
        var dLong = diffLong / (nPoints + 1);
        var firstLong = longMin + dLong;
        var maxLong = longMax - dLong / 2;
        var lat1 = poly.X[i];
        var lat2 = poly.X[i + 1];
        for (var long = firstLong; (dLong > 0) ? long < maxLong : long > maxLong; long += dLong) {
          var paramLong = (long - longMin) / diffLong; // 0..1
          var lat = paramLong * (lat2 - lat1) + lat1;
          var longInRange = long;
          if (longInRange > 180) longInRange -= 360;
          var pFE = this.FeLatLongToGlobalFeCoord(lat, longInRange);
          g.AddPointToPoly3D(pFE);
        }
      }
    }
    var pFE = this.FeLatLongToGlobalFeCoord(poly.X[maxi + 1], poly.Y[maxi + 1]);
    g.AddPointToPoly3D(pFE);

    g.SetAreaAttr('gray', 'gray', 1);
    g.SetAlpha(0.35);
    var shadowAngle = Math.acos(shadowRadius) * 180 / Math.PI;
    var sunCelestAngleRange = this.SunCelestLatLong.lat + shadowAngle;
    if (sunCelestAngleRange >= 0) {
      g.OpenPath3D();
      g.CircleOnPlane(0, 0, this.RadiusFE);
      g.DrawPoly3D();
      g.Path3D(3);
    } else {
      g.DrawPoly3D(3);
    }
    g.SetAlpha(1);
  },

  DrawObjRays: function (g, objCelestCoord, objDomeCoord) {
    // draw sun rays to many points on FE
    var dLat = 30;
    if (this.ShowManyRays) dLat /= 2;
    var latMin = -90;
    var latMax = 90 + dLat / 2;
    var latOff = 0.1;
    var dLong = 15;
    if (this.ShowManyRays) dLong /= 2;
    var longMin = 0;
    var longMax = 360 - dLong / 2;
    for (var lat = latMin; lat < latMax; lat += dLat) {
      for (var long = longMin; long < longMax; long += dLong) {
        g.SetLineAttr(this.StarColorFromLatLong(lat, long), 1);
        if (lat > 89) latOff = 0;
        this.DrawObjRayToFeTarget(g, objCelestCoord, objDomeCoord, lat + latOff, long);
        if (lat > 89) break;
      }
    }
  },

  DrawSunRays: function (g) {
    if (this.RayTarget == 0 && !this.ShowStars) {

      // one ray between sun and observer
      this.DrawSunRayToObserver(g);

    } else if (this.RayTarget == 1 && this.RaySource == 0) {

      // draw sun rays to many points on FE
      this.DrawObjRays(g, this.SunCelestCoord, this.SunDomeCoord);

    }
  },

  DrawMoonRays: function (g) {
    if (this.RayTarget == 0 && !this.ShowStars) {

      // one ray between moon and observer
      this.DrawMoonRayToObserver(g);

    } else if (this.RayTarget == 1 && this.RaySource == 1) {

      // draw moon rays to many points on FE
      this.DrawObjRays(g, this.MoonCelestCoord, this.MoonDomeCoord);

    }
  },

  DrawStarsRays: function (g) {

    if (this.RayTarget == 0 && this.ShowStars && (this.ShowDomeRays || this.ShowSphereRays)) {

      // one rays between stars and observer
      this.DrawStarRaysToObserver(g, 6, 12);

    } else if (this.RayTarget == 1 && this.RaySource == 2) {

      // draw rays from 1 star to many points on FE
      // lat and long of observer determines the star position

      var starCelestCoord = this.LatLongToCoord(this.ObserverLat, this.ObserverLong, 1);
      var starDomeCoord = this.CelestLatLongToDomeCoord(this.ObserverLat, this.ObserverLong);
      this.DrawObjRays(g, starCelestCoord, starDomeCoord);

      // draw star dome latitude
      g.SetAlpha(0.7);
      g.SetLineAttr('#f80', 1);
      this.DrawDomeLatitudeLine(g, this.ObserverLat);

      // draw single big star
      var starGlobalFeCoord = this.DomeCoordToGlobalFeCoord(starDomeCoord);
      g.SetMarkerAttr('Star6', 16, 'black', 'yellow', 1);
      g.Marker3D(starGlobalFeCoord, 3);
      g.SetAlpha(1);

    }
  },

  DrawStarRaysToObserver: function (g, nLat, nLong) {
    // at the northpole only one single star is drawn,
    // no southpole star can be drawn, because its position is everywhere on the -90 degree,
    // so enstead a row of stars is drawn at some -90 + degrees

    var dLatDeg = 180 / nLat;
    var maxLatDeg = 90 - dLatDeg / 2;
    var dLongDeg = 360 / nLong;
    if (!this.ShowManyRays) dLongDeg *= 4;
    var maxLongDeg = 360 - dLongDeg / 2;

    for (var latDeg = -90; latDeg < maxLatDeg; latDeg += dLatDeg) {
      var latCorrectedDeg = latDeg;
      if (latDeg == -90) latCorrectedDeg += 5;
      for (var longDeg = 0; longDeg < maxLongDeg; longDeg += dLongDeg) {
        var lineWidth = this.StarSizeFromLong(longDeg);
        if (!this.ShowManyRays) lineWidth = 1;
        g.SetLineAttr(this.StarColorFromLatLong(latDeg, longDeg), lineWidth);
        this.DrawStarRay(g, latCorrectedDeg, longDeg);
      }
    }

    // draw polaris
    g.SetLineAttr(this.StarColorFromLatLong(90, 0), 2);
    this.DrawStarRay(g, 90, 0);
  },

  DrawObjRayToFeTarget: function (g, objCelestCoord, objDomeCoord, targetLat, targetLong) {

    var targetGlobalFeCoord = this.FeLatLongToGlobalFeCoord(targetLat, targetLong);
    var matCelestToGlobe = this.CompTransMatCelestToGlobe(targetLat, targetLong);
    var matLocalFeToGlobalFe = this.CompTransMatLocalFeToGlobalFe(targetGlobalFeCoord, targetLong);

    // if shadow is drawn don't draw rays of stars in day part of the FE
    if (this.RaySource == 2 && this.ShowShadow) {
      var sunLocalGlobeCoord = JsgMat3.Trans(matCelestToGlobe, this.SunCelestCoord);
      var sunLocalFeSphereCoord = this.LocalGlobeCoordToLocalFeCoord(JsgVect3.Scale(sunLocalGlobeCoord, this.RadiusSphere));
      var sunGlobalFeSphereCoord = JsgMat3.Trans(matLocalFeToGlobalFe, sunLocalFeSphereCoord);
      if (sunGlobalFeSphereCoord[2] >= 0) return;
    }

    var objLocalGlobeCoord = JsgMat3.Trans(matCelestToGlobe, objCelestCoord);
    var objLocalFeSphereCoord = this.LocalGlobeCoordToLocalFeCoord(JsgVect3.Scale(objLocalGlobeCoord, this.RadiusSphere));
    var objGlobalFeSphereCoord = JsgMat3.Trans(matLocalFeToGlobalFe, objLocalFeSphereCoord);

    if (objGlobalFeSphereCoord[2] < 0) return;

    // object is above the horizon, compute bezier curve
    var objGlobalFeCoord = this.DomeCoordToGlobalFeCoord(objDomeCoord);
    var cpLength = JsgVect3.Length(JsgVect3.Sub(objGlobalFeCoord, targetGlobalFeCoord)) * this.RayParameter / 3;
    var controlPointLocalFeCoord = this.LocalGlobeCoordToLocalFeCoord(JsgVect3.Scale(objLocalGlobeCoord, cpLength));
    var controlPointGlobalFeCoord = JsgMat3.Trans(matLocalFeToGlobalFe, controlPointLocalFeCoord);
    g.BezierCurve3D(targetGlobalFeCoord, controlPointGlobalFeCoord, objGlobalFeCoord, objGlobalFeCoord, 1);
  },

  DrawSunRayToObserver: function (g) {
    var sunFeCoord = this.DomeCoordToGlobalFeCoord(this.SunDomeCoord);
    var cpLength = JsgVect3.Length(JsgVect3.Sub(sunFeCoord, this.ObserverFeCoord)) * this.RayParameter / 3;
    var controlPointFeCoord = this.LocalGlobeCoordToGlobalFeCoord(JsgVect3.Scale(this.SunLocalGlobeCoord, cpLength));

    if (this.SunFeCelestSphereCoord[2] > 0) {
      if (this.ShowSphereRays) {
        // sphere sun ray
        g.SetLineAttr('darkorange', 1);
        g.Line3D(this.ObserverFeCoord, this.SunFeCelestSphereCoord);
      }
      if (this.ShowSphere) {
        // sphere sun
        g.SetMarkerAttr('Circle', 8, 'orange', 'white', 1);
        g.Marker3D(this.SunFeCelestSphereCoord);
      }
      if (this.ShowDomeRays) {
        // dome sun ray
        g.SetAlpha(0.5);
        g.SetLineAttr('white', 5);
        g.BezierCurve3D(this.ObserverFeCoord, controlPointFeCoord, sunFeCoord, sunFeCoord, 1);
        g.SetAlpha(1);
        g.SetLineAttr('orange', 1.5);
        g.BezierCurve3D(this.ObserverFeCoord, controlPointFeCoord, sunFeCoord, sunFeCoord, 1);
        g.SetAlpha(1);
      }
    }
  },

  DrawMoonRayToObserver: function (g) {
    var moonGlobalFeCoord = this.DomeCoordToGlobalFeCoord(this.MoonDomeCoord);
    var cpLength = JsgVect3.Length(JsgVect3.Sub(moonGlobalFeCoord, this.ObserverFeCoord)) * this.RayParameter / 3;
    var controlPointGlobalFeCoord = this.LocalGlobeCoordToGlobalFeCoord(JsgVect3.Scale(this.MoonLocalGlobeCoord, cpLength));

    if (this.MoonFeCelestSphereCoord[2] > 0) {
      if (this.ShowSphereRays) {
        // sphere moon ray
        g.SetLineAttr('#666', 1);
        g.Line3D(this.ObserverFeCoord, this.MoonFeCelestSphereCoord);
      }
      if (this.ShowSphere) {
        // sphere moon
        g.SetMarkerAttr('Circle', 8, '#888', 'white', 1);
        g.Marker3D(this.MoonFeCelestSphereCoord);
      }
      if (this.ShowDomeRays) {
        // dome moon ray
        g.SetAlpha(0.5);
        g.SetLineAttr('white', 4);
        g.BezierCurve3D(this.ObserverFeCoord, controlPointGlobalFeCoord, moonGlobalFeCoord, moonGlobalFeCoord, 1);
        g.SetAlpha(1);
        g.SetLineAttr('#aaa', 1.5);
        g.BezierCurve3D(this.ObserverFeCoord, controlPointGlobalFeCoord, moonGlobalFeCoord, moonGlobalFeCoord, 1);
        g.SetAlpha(1);
      }
    }
  },

  DrawSunTrack: function (g) {
    // draw track
    var sunLatLong;
    var dSunAngDeg = 0.5;
    var maxSunAngDeg = 360 + dSunAngDeg / 2;
    g.NewPoly3D();
    for (var sunAngDeg = 0; sunAngDeg < maxSunAngDeg; sunAngDeg += dSunAngDeg) {
      var sunDomeCoord = this.CelestCoordToDomeCoord(this.SunAngleToCelestCoord(sunAngDeg));
      g.AddPointToPoly3D(sunDomeCoord);
    }
    g.SetAlpha(0.25);
    g.SetLineAttr('red', 2);
    g.DrawPoly3D();

    // draw intersecton knots with ecliptic and solstice points
    g.SetAlpha(0.5);
    g.SetMarkerAttr('Circle', 5, 'black', 'red', 1);
    var dSunAngDeg = 90;
    var maxSunAngDeg = 360 - dSunAngDeg / 2;
    for (var sunAngDeg = 0; sunAngDeg < maxSunAngDeg; sunAngDeg += dSunAngDeg) {
      var sunDomeCoord = this.CelestCoordToDomeCoord(this.SunAngleToCelestCoord(sunAngDeg));
      g.Marker3D(sunDomeCoord, 3);
    }
    g.SetAlpha(1);
  },

  DrawMoonTrack: function (g) {
    // draw track
    var dMoonAngDeg = 0.5;
    var maxMoonAngDeg = 360 + dMoonAngDeg / 2;
    g.NewPoly3D();
    for (var moonAngDeg = 0; moonAngDeg < maxMoonAngDeg; moonAngDeg += dMoonAngDeg) {
      var moonDomeCoord = this.CelestCoordToDomeCoord(this.MoonAngleToCelestCoord(moonAngDeg));
      g.AddPointToPoly3D(moonDomeCoord);
    }
    g.SetAlpha(0.25);
    g.SetLineAttr('green', 2);
    g.DrawPoly3D();

    // draw intersection knots with sun track (ecliptic)
    g.SetAlpha(0.5);
    g.SetMarkerAttr('Circle', 5, 'black', 'green', 1);
    var dMoonAngDeg = 180;
    var maxMoonAngDeg = 360 - dMoonAngDeg / 2;
    for (var moonAngDeg = 0; moonAngDeg < maxMoonAngDeg; moonAngDeg += dMoonAngDeg) {
      var moonDomeCoord = this.CelestCoordToDomeCoord(this.MoonAngleToCelestCoord(moonAngDeg));
      g.Marker3D(moonDomeCoord, 3);
    }
    g.SetAlpha(1);
  },

  DrawDomeGrid: function (g, nLat, nLong) {
    // draw longitudes
    var dLongDeg = 360 / nLong;
    var maxLongDeg = 360 - dLongDeg / 2;
    for (var longDeg = 0; longDeg < maxLongDeg; longDeg += dLongDeg) {
      this.DrawDomeLongitudeLine(g, longDeg);
    }

    // draw latitudes
    var dLatDeg = 180 / nLat;
    var maxLatDeg = 90 - dLatDeg / 2;
    for (var latDeg = -90; latDeg < maxLatDeg; latDeg += dLatDeg) {
      this.DrawDomeLatitudeLine(g, latDeg);
    }
  },

  DrawFeCelestSphereStars: function (g, nLat, nLong) {
    // at the northpole only one single star is drawn,
    // no southpole star can be drawn, because its position is everywhere on the -90 degree,
    // so enstead a row of stars is drawn at some -90 + degrees

    var baseMarkerSize = 6;
    var addMarkerSize = 3 + 3 * ((this.Zoom - 1) / 10);
    g.SetMarkerAttr('Star4', baseMarkerSize, 'black', 'yellow', 1);

    var dLatDeg = 180 / nLat;
    var maxLatDeg = 90 - dLatDeg / 2;
    var dLongDeg = 360 / nLong;
    var maxLongDeg = 360 - dLongDeg / 2;

    for (var latDeg = -90; latDeg < maxLatDeg; latDeg += dLatDeg) {
      var latCorrectedDeg = latDeg;
      if (latDeg == -90) latCorrectedDeg += 5;
      for (var longDeg = 0; longDeg < maxLongDeg; longDeg += dLongDeg) {
        g.SetAreaAttr('black', this.StarColorFromLatLong(latDeg, longDeg), 1);
        g.SetMarkerSize((this.StarSizeFromLong(longDeg) - 1) * addMarkerSize + baseMarkerSize);
        this.DrawFeCelestSphereStar(g, latCorrectedDeg, longDeg);
      }
    }

    // draw polaris
    g.SetAreaAttr('black', this.StarColorFromLatLong(90, 0), 1);
    g.SetMarkerSize(addMarkerSize + baseMarkerSize);
    this.DrawFeCelestSphereStar(g, 90, 0);
  },

  StarColorFromLatLong: function (lat, long) {
    var hue = 1 - (ToRange(lat + 90, 180) / 180);
    return JsgColor.HSV(hue, 1, 1, 1);
  },

  StarSizeFromLong: function (long) {
    var longRange = ToRange(long, 120);
    var size = 1;
    if (longRange < 1 || longRange > 119) size = 2;
    return size;
  },

  DrawDomeStars: function (g, nLat, nLong) {
    // at the northpole only one single star is drawn,
    // no southpole star can be drawn, because its position is everywhere on the -90 degree,
    // so enstead a row of stars is drawn at some -90 + degrees

    var baseMarkerSize = 8;
    var addMarkerSize = 4 + 4 * ((this.Zoom - 1) / 10);
    g.SetMarkerAttr('Star5', baseMarkerSize, 'black', 'yellow', 1);

    var dLatDeg = 180 / nLat;
    var maxLatDeg = 90 - dLatDeg / 2;
    var dLongDeg = 360 / nLong;
    var maxLongDeg = 360 - dLongDeg / 2;

    for (var latDeg = -90; latDeg < maxLatDeg; latDeg += dLatDeg) {
      var latCorrectedDeg = latDeg;
      if (latDeg == -90) latCorrectedDeg += 5;
      for (var longDeg = 0; longDeg < maxLongDeg; longDeg += dLongDeg) {
        var starSphereCoord = this.CelestLatLongToGlobalFeSphereCoord(latCorrectedDeg, longDeg, this.RadiusSphere);
        if (starSphereCoord[2] > 0) {
          g.SetAlpha(1);
        } else {
          g.SetAlpha(0.3);
        }
        g.SetMarkerSize((this.StarSizeFromLong(longDeg) - 1) * addMarkerSize + baseMarkerSize);
        g.Marker3D(this.CelestLatLongToDomeCoord(latCorrectedDeg, longDeg), 3);
      }
    }

    // draw polaris
    var starSphereCoord = this.CelestLatLongToGlobalFeSphereCoord(90, 0, this.RadiusSphere);
    if (starSphereCoord[2] > 0) {
      g.SetAlpha(1);
    } else {
      g.SetAlpha(0.3);
    }
    g.SetMarkerSize(addMarkerSize + baseMarkerSize);
    g.Marker3D(this.CelestLatLongToDomeCoord(90, 0), 3);
    g.SetAlpha(1);
  },

  DrawFeCelestSphereStar: function (g, latDeg, longDeg) {
    var starSphereCoord = this.CelestLatLongToGlobalFeSphereCoord(latDeg, longDeg, this.RadiusSphere);
    if (starSphereCoord[2] > 0) {
      // g.Line3D( this.ObserverFeCoord, starSphereCoord );
      g.Marker3D(starSphereCoord, 3);
    }
  },

  DrawStarRay: function (g, latDeg, longDeg) {
    var starSphereCoord = this.CelestLatLongToGlobalFeSphereCoord(latDeg, longDeg, this.RadiusSphere);
    var starDomeCoord = JsgMat3.Trans(this.TransMatEarthRot, this.CelestLatLongToDomeCoord(latDeg, longDeg));
    var cpLength = JsgVect3.Length(JsgVect3.Sub(starDomeCoord, this.ObserverFeCoord)) * this.RayParameter / 3;
    var pBezierControl = this.CelestLatLongToGlobalFeSphereCoord(latDeg, longDeg, cpLength);

    if (starSphereCoord[2] > 0) {
      if (this.ShowSphereRays) {
        g.SetAlpha(0.5);
        g.Line3D(this.ObserverFeCoord, starSphereCoord);
        g.SetAlpha(1);
      }
      if (this.ShowDomeRays) {
        g.BezierCurve3D(this.ObserverFeCoord, pBezierControl, starDomeCoord, starDomeCoord, 1);
      }
    }
  },

  DrawDomeOutline: function (g, nLong) {
    if (this.DomeSize <= 1.0001) return;

    var maxLatRad = Math.acos(1 / this.DomeSize);
    var dLongDeg = 360 / nLong;
    var maxLongDeg = 360 - dLongDeg / 2;
    for (var longDeg = 0; longDeg < maxLongDeg; longDeg += dLongDeg) {
      this.DrawDomeLongitudeOutline(g, longDeg, maxLatRad);
    }

    g.CircleOnPlane(0, 0, this.DomeSize * this.RadiusFE, 1);
  },

  DrawDomeLongitudeOutline: function (g, longDeg, aMaxRad) {
    // aMaxRad as angle from ground = 0 to zenith = PI/2
    function addDomePoint(lat) {
      var r = domeRadius * Math.cos(lat);
      var x = r * cosLong;
      var y = r * sinLong;
      var z = domeHeight * Math.sin(lat);
      g.AddPointToPoly3D(x, y, z);
    }

    g.NewPoly3D();
    var domeRadius = this.DomeSize * this.RadiusFE;
    var domeHeight = this.DomeHeight;
    var longRad = ToRad(longDeg);
    var cosLong = Math.cos(longRad);
    var sinLong = Math.sin(longRad);
    var dLatRad = ToRad(5);
    var maxLatRad = aMaxRad - dLatRad / 2;
    for (var latRad = 0; latRad < maxLatRad; latRad += dLatRad) {
      addDomePoint(latRad);
    }
    addDomePoint(aMaxRad);
    g.DrawPoly3D();
  },

  DrawDomeLongitudeLine: function (g, longDeg) {
    var dLatDeg = 2.5;
    var maxLatDeg = 90 + dLatDeg / 2;
    g.NewPoly3D();
    for (var latDeg = -90; latDeg < maxLatDeg; latDeg += dLatDeg) {
      g.AddPointToPoly3D(this.CelestLatLongToDomeCoord(latDeg, longDeg));
    }
    g.DrawPoly3D();
  },

  DrawDomeLatitudeLine: function (g, latDeg) {
    if (latDeg >= 90) return;
    var dLongDeg = 5;
    var maxLongDeg = 360 + dLongDeg / 2;
    g.NewPoly3D();
    for (var longDeg = 0; longDeg < maxLongDeg; longDeg += dLongDeg) {
      g.AddPointToPoly3D(this.CelestLatLongToDomeCoord(latDeg, longDeg));
    }
    g.DrawPoly3D();
  },

  DrawFeCelestSphere: function (g) {
    // draws celestial sphere at observion position of flat earth

    // grid below surface is clipped and grid facing away is dimmer, by drawing the front part twice using clipping
    // surface clip plane
    g.AddClipPlane([0, 0, 0], [1, 0, 0], [0, 1, 0]);

    // draw grid
    g.SetLineAttr('black', 1);
    g.SetAlpha(0.15);
    this.DrawFeCelestSphereGrid(g);

    var vecObsToCam = JsgVect3.Norm(JsgVect3.Sub(g.Camera.CamPos, this.ObserverFeCoord));
    var vecInPlane = JsgVect3.Norm(JsgVect3.Mult([0, 0, 1], vecObsToCam));
    var vecUp = JsgVect3.Norm(JsgVect3.Mult(vecObsToCam, vecInPlane));
    g.AddClipPlane(this.ObserverFeCoord, vecInPlane, vecUp);

    // draw grid second time clipped to front
    g.SetAlpha(0.2);
    this.DrawFeCelestSphereGrid(g);
    // draw equator
    g.SetAlpha(0.5);
    this.DrawFeCelestSphereLatLine(g, 0);

    // reset clipping to surface clipping only
    g.DeleteClipPlanes();
    g.AddClipPlane([0, 0, 0], [1, 0, 0], [0, 1, 0]);

    // draw sun path
    if (!this.ShowStars) {
      g.SetAlpha(1);
      g.SetLineAttr('orange', 1);
      this.DrawFeCelestSphereLatLine(g, this.SunCelestLatLong.lat);

      // draw moon path
      g.SetLineAttr('green', 1);
      this.DrawFeCelestSphereLatLine(g, this.MoonCelestLatLong.lat);

      // draw axes
      g.SetLineAttr('blue', 1);
      g.Line3D(this.ObserverFeCoord, this.CelestLatLongToGlobalFeSphereCoord(-90, 0, this.RadiusSphere));
      g.SetLineAttr('red', 1);
      g.Line3D(this.ObserverFeCoord, this.CelestLatLongToGlobalFeSphereCoord(90, 0, this.RadiusSphere));
    }

    // draw base circle
    g.DeleteClipPlanes();
    g.SetLineAttr('black', 1);
    this.DrawGlobalFeCircle(g, this.ObserverFeCoord, this.RadiusSphere, 1);
    g.SetAlpha(1);
  },

  DrawGlobalFeCircle: function (g, pos, radius, mode) {
    var oldPlane = g.Plane;
    g.SetPlane(this.DefaultPlane);
    g.CircleOnPlane(pos, radius, mode);
    g.SetPlane(oldPlane);
  },

  DrawFeCelestSphereGrid: function (g) {
    // draw latitude lines
    var dLatDeg = 15;
    var maxLatDeg = 90 - dLatDeg / 2;
    for (var latDeg = -90 + dLatDeg; latDeg < maxLatDeg; latDeg += dLatDeg) {
      this.DrawFeCelestSphereLatLine(g, latDeg);
    }
    // draw longitude lines
    var dLongDeg = 15;
    var maxLongDeg = 360 - dLongDeg / 2;
    for (var longDeg = 0; longDeg < maxLongDeg; longDeg += dLongDeg) {
      this.DrawFeCelestSphereLongLine(g, longDeg);
    }
  },

  DrawFeCelestSphereLatLine: function (g, latDeg) {
    var dLongDeg = 5;
    var maxLongDeg = 180 + dLongDeg / 2;
    g.NewPoly3D();
    for (var longDeg = -180; longDeg < maxLongDeg; longDeg += dLongDeg) {
      g.AddPointToPoly3D(this.CelestLatLongToGlobalFeSphereCoord(latDeg, longDeg, this.RadiusSphere));
    }
    g.DrawPoly3D();
  },

  DrawFeCelestSphereLongLine: function (g, longDeg) {
    var dLatDeg = 5;
    var maxLatDeg = 90 + dLatDeg / 2;
    g.NewPoly3D();
    for (var latDeg = -90; latDeg < maxLatDeg; latDeg += dLatDeg) {
      g.AddPointToPoly3D(this.CelestLatLongToGlobalFeSphereCoord(latDeg, longDeg, this.RadiusSphere));
    }
    g.DrawPoly3D();
  },

});
