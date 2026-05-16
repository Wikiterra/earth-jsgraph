// (C) http://walter.bislins.ch/doku/jsgx3d

function JsgPolyListIter(polys){polys=xDefObjOrNull(polys,null);this.Reset(polys);}
JsgPolyListIter.prototype.Reset=function(polys){this.CurrPolyIx=-1;this.CurrPointIx=-1;if(JsgPolygonList.Ok(polys)){this.Poly=null;this.PolyList=polys;}else if(JsgPolygon.Ok(polys)){this.Poly=polys;this.PolyList=null;}
if(this.PolyList&&this.PolyList.Size>0){this.CurrPolyIx=0;this.Poly=polys.PolyList[0];}
return this;}
JsgPolyListIter.prototype.GetNextPoint=function(p){var poly=this.Poly;if(!poly)return false;this.CurrPointIx++;if(this.PolyList){if(this.CurrPointIx>=poly.Size){this.CurrPolyIx++;if(this.CurrPolyIx>=this.PolyList.Size)return false;this.Poly=this.PolyList.PolyList[this.CurrPolyIx];this.CurrPointIx=-1;return this.GetNextPoint(p);}}else{if(this.CurrPointIx>=poly.Size)return false;}
var i=this.CurrPointIx;JsgVect3.Set(p,poly.X[i],poly.Y[i],poly.Z[i]);return true;}
JsgPolyListIter.prototype.Back=function(){this.CurrPointIx--;}
var JsgVect3={New:function(x,y,z){return[x,y,z];},Null:function(){return[0,0,0];},Ok:function(vec){return xArray(vec)&&(vec.length==3);},IsZero:function(vec){return vec[0]==0&&vec[1]==0&&vec[2]==0;},Reset:function(vec){vec[0]=0;vec[1]=0;vec[2]=0;return vec;},Set:function(vec,x,y,z){if(xArray(x)){return this.Set(vec,x[0],x[1],x[2]);}
vec[0]=x;vec[1]=y;vec[2]=z;return vec;},Copy:function(src){return[src[0],src[1],src[2]];},CopyTo:function(src,dest){dest[0]=src[0];dest[1]=src[1];dest[2]=src[2];return dest;},FromAngle:function(aHAng,aVAng,aDist){aVAng*=Math.PI/180;aHAng*=Math.PI/180;var z=aDist*Math.sin(aVAng);var a=aDist*Math.cos(aVAng);var x=a*Math.cos(aHAng);var y=a*Math.sin(aHAng);return[x,y,z];},Scale:function(v,s){return[v[0]*s,v[1]*s,v[2]*s];},ScaleTo:function(v,s){v[0]*=s;v[1]*=s;v[2]*=s;return v;},Length2:function(v){return v[0]*v[0]+v[1]*v[1]+v[2]*v[2];},Length:function(v){return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);},Norm:function(v){var s=this.Length(v);if(s==0.0){return[v[0],v[1],v[2]];}else{return[v[0]/s,v[1]/s,v[2]/s];}},NormTo:function(v){var s=this.Length(v);if(s!=0.0)this.ScaleTo(v,1/s);return v;},Add:function(a,b){return[a[0]+b[0],a[1]+b[1],a[2]+b[2]];},AddTo:function(a,b){a[0]+=b[0];a[1]+=b[1];a[2]+=b[2];return a;},Sub:function(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];},SubFrom:function(a,b){a[0]-=b[0];a[1]-=b[1];a[2]-=b[2];return a;},ScalarProd:function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];},Mult:function(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];},MultTo:function(v,a,b){v[0]=a[1]*b[2]-a[2]*b[1];v[1]=a[2]*b[0]-a[0]*b[2];v[2]=a[0]*b[1]-a[1]*b[0];return v;},Angle:function(v1,v2){var sp=this.ScalarProd(this.Norm(v1),this.Norm(v2));if(sp>1)sp=1;if(sp<-1)sp=-1;return Math.acos(sp);},};var JsgVect3List={Ok:function(obj){if(!xArray(obj))return false;if(obj.length==0)return true;return JsgVect3.Ok(obj[0]);},ToPoly2D:function(vl,poly){poly=poly||new JsgPolygon();poly.Reset();var len=vl.length;for(var i=0;i<len;i++){var v=vl[i];poly.AddPoint(v[0],v[1]);}
return poly;},};var JsgVect3Grid={Ok:function(obj){if(!xArray(obj))return false;if(obj.length==0)return true;return JsgVect3List.Ok(obj[0]);},};var JsgMat3={Zero:function(){return[[0,0,0,0],[0,0,0,0],[0,0,0,0]];},Unit:function(){return[[1,0,0,0],[0,1,0,0],[0,0,1,0]];},FromVect:function(v1,v2,v3){return[[v1[0],v1[1],v1[2],0],[v2[0],v2[1],v2[2],0],[v3[0],v3[1],v3[2],0]];},Moving:function(x,y,z,m){var r=[[1,0,0,x],[0,1,0,y],[0,0,1,z]];if(m)r=this.Mult(r,m);return r;},Scaling:function(sx,sy,sz,m){var r=[[sx,0,0,0],[0,sy,0,0],[0,0,sz,0]];if(m)r=this.Mult(r,m);return r;},RotatingX:function(aAngle,m){var c=Math.cos(aAngle),s=Math.sin(aAngle);var r=[[1,0,0,0],[0,c,-s,0],[0,s,c,0]];if(m)r=this.Mult(r,m);return r;},RotatingY:function(aAngle,m){var c=Math.cos(aAngle),s=Math.sin(aAngle);var r=[[c,0,s,0],[0,1,0,0],[-s,0,c,0]];if(m)r=this.Mult(r,m);return r;},RotatingZ:function(aAngle,m){var c=Math.cos(aAngle),s=Math.sin(aAngle);var r=[[c,-s,0,0],[s,c,0,0],[0,0,1,0]];if(m)r=this.Mult(r,m);return r;},Copy:function(m){return[[m[0][0],m[0][1],m[0][2],m[0][3]],[m[1][0],m[1][1],m[1][2],m[1][3]],[m[2][0],m[2][1],m[2][2],m[2][3]]];},CopyTo:function(src,dest){for(var row=0;row<3;row++){for(var col=0;col<4;col++){dest[row][col]=src[row][col];}}
return dest;},Set:function(dest,src){return this.CopyTo(src,dest);},Mult:function(a,b){return this.MultTo(a,b,this.Zero());},MultTo:function(a,b,to){for(var i=0;i<3;i++){for(var j=0;j<3;j++){to[i][j]=a[i][0]*b[0][j]+a[i][1]*b[1][j]+a[i][2]*b[2][j];}
to[i][3]=a[i][0]*b[0][3]+a[i][1]*b[1][3]+a[i][2]*b[2][3]+a[i][3];}
return to;},Trans:function(m,v){return this.TransTo(m,v,JsgVect3.Null());},TransTo:function(m,v,to){to=to||v;return this.TransXYZTo(m,v[0],v[1],v[2],to)},TransXYZTo:function(m,x,y,z,to){to[0]=m[0][0]*x+m[0][1]*y+m[0][2]*z+m[0][3];to[1]=m[1][0]*x+m[1][1]*y+m[1][2]*z+m[1][3];to[2]=m[2][0]*x+m[2][1]*y+m[2][2]*z+m[2][3];return to;},TransList:function(m,vl){var rl=[],len=vl.length;for(var i=0;i<len;i++){rl.push(this.Trans(m,vl[i]));}
return rl;},TransGrid:function(m,vg){var rg=[],len=vg.length;for(var i=0;i<len;i++){rg.push(this.TransList(m,vg[i]));}
return rg;},};function JsgCamera(){this.WorkPoint=JsgVect3.Null();this.WorkPoint2=JsgVect3.Null();this.ResultPoly=new JsgPolygon(true,'JsgCamera.ResultPoly');this.Reset();}
JsgCamera.prototype.Reset=function(){this.Zoom=1;this.SceneSize=2;this.ScreenSize=1;this.ObjectZExtend=0;this.CamViewCenter=JsgVect3.Null();this.CamPos=JsgVect3.New(100,0,0);this.CamUp=JsgVect3.New(0,0,1);this.Update();}
JsgCamera.prototype.Update=function(){var vVect=JsgVect3.Sub(this.CamViewCenter,this.CamPos);this.ViewCenterDist=JsgVect3.Length(vVect);if(this.ViewCenterDist==0){this.CamPos=JsgVect3.Add(this.CamViewCenter,[1,0,0]);this.ViewCenterDist=1;vVect=[-1,0,0];}
this.ViewDir=JsgVect3.Norm(vVect);var xVect=JsgVect3.Scale(this.ViewDir,-1);var zVect=JsgVect3.Norm(this.CamUp);if(JsgVect3.Length2(zVect)==0){zVect=[0,0,1];this.CamUp=[0,0,1];}
var yVect=JsgVect3.Norm(JsgVect3.Mult(zVect,xVect));if(JsgVect3.Length2(yVect)==0){this.CamUp=JsgMat3.Trans(JsgMat3.FromVect([0,0,1],[0,0,0],[1,1,0]),this.CamUp);this.Update();return;}
zVect=JsgVect3.Norm(JsgVect3.Mult(xVect,yVect));this.CamTrans=JsgMat3.FromVect(xVect,yVect,zVect);this.ScreenDist=1;if(this.SceneSize!=0){this.ScreenDist=(this.ScreenSize/this.SceneSize)*(this.ViewCenterDist-this.ObjectZExtend);}}
JsgCamera.prototype.Set=function(aParams){if(!xObj(aParams))return;if(xNum(aParams.SceneSize))this.SceneSize=aParams.SceneSize;if(xNum(aParams.ScreenSize))this.ScreenSize=aParams.ScreenSize;if(xNum(aParams.ObjectZExtend))this.ObjectZExtend=aParams.ObjectZExtend;if(xNum(aParams.Zoom))this.Zoom=aParams.Zoom;if(JsgVect3.Ok(aParams.CamViewCenter))this.CamViewCenter=aParams.CamViewCenter;if(JsgVect3.Ok(aParams.CamUp))this.CamUp=aParams.CamUp;if(JsgVect3.Ok(aParams.CamPos))this.CamPos=aParams.CamPos;this.SetAngle(aParams.CamHAng,aParams.CamVAng,aParams.CamDist);this.Update();}
JsgCamera.prototype.SetAngle=function(aHAng,aVAng,aDist){if(xNum(aHAng)||xNum(aVAng)){var hAng=xDefNum(aHAng,0);var vAng=xDefNum(aVAng,0);var vVect=JsgVect3.Sub(this.CamViewCenter,this.CamPos);var dist=JsgVect3.Length(vVect);if(xNum(aDist))dist=aDist;this.CamPos=JsgVect3.Add(this.CamViewCenter,JsgVect3.FromAngle(hAng,vAng,dist));}}
JsgCamera.prototype.Save=function(aParams){var par=xDefObj(aParams,{});par.SceneSize=this.SceneSize;par.ScreenSize=this.ScreenSize;par.ObjectZExtend=this.ObjectZExtend;par.CamViewCenter=this.CamViewCenter;par.CamUp=this.CamUp;par.CamPos=this.CamPos;par.Zoom=this.Zoom;return par;}
JsgCamera.prototype.SetScale=function(aSceneSize,aScreenSize,aObjectZExtend,aZoom){if(xNum(aSceneSize))this.SceneSize=aSceneSize;if(xNum(aScreenSize))this.ScreenSize=aScreenSize;if(xNum(aObjectZExtend))this.ObjectZExtend=aObjectZExtend;if(xNum(aZoom))this.Zoom=aZoom;this.Update();}
JsgCamera.prototype.SetPos=function(aPos,aViewCenter,aUp){if(JsgVect3.Ok(aPos))this.CamPos=aPos;if(JsgVect3.Ok(aViewCenter))this.CamViewCenter=aViewCenter;if(JsgVect3.Ok(aUp))this.CamUp=aUp;this.Update();}
JsgCamera.prototype.SetView=function(aViewCenter,aHAng,aVAng,aDist,aUp){if(JsgVect3.Ok(aViewCenter))this.CamViewCenter=aViewCenter;if(JsgVect3.Ok(aUp))this.CamUp=aUp;this.SetAngle(aHAng,aVAng,aDist);this.Update();}
JsgCamera.prototype.SetZoom=function(aZoom){this.Zoom=xDefNum(aZoom,1);}
JsgCamera.prototype.TransPoly=function(poly,transPolys){transPolys=transPolys||this.ResultPoly.Reset();var p=this.WorkPoint;var xs=poly.X;var ys=poly.Y;var zs=poly.Z;var f=this.ScreenDist;var zoom=this.Zoom;var size=poly.Size;for(var i=0;i<size;i++){JsgVect3.Set(p,xs[i],ys[i],zs[i]);JsgVect3.SubFrom(p,this.CamPos);JsgMat3.TransTo(this.CamTrans,p);var x=p[1];var y=p[2];var z=-p[0];if(z!=0){x*=f/z*zoom;y*=f/z*zoom;}
transPolys.AddPoint(x,y,z);}
return transPolys;}
JsgCamera.prototype.Trans=function(v){return this.TransTo(v[0],v[1],v[2],JsgVect3.Copy(v));}
JsgCamera.prototype.TransTo=function(x,y,z,v){v=v||this.WorkPoint;JsgVect3.Set(v,x,y,z);JsgMat3.TransTo(this.CamTrans,JsgVect3.SubFrom(v,this.CamPos));var f=this.ScreenDist;var x=v[1],y=v[2],z=-v[0];if(z!=0){x*=f/z*this.Zoom;y*=f/z*this.Zoom;}
v[0]=x;v[1]=y;v[2]=z;return v;}
JsgCamera.prototype.TransList=function(vl){var rl=[],len=vl.length;for(var i=0;i<len;i++)rl.push(this.Trans(vl[i]));return rl;}
JsgCamera.prototype.TransGrid=function(vg){var rg=[],len=vg.length;for(var i=0;i<len;i++)rg.push(this.TransList(vg[i]));return rg;}
JsgCamera.prototype.TransToPoly2D=function(vl,poly){return JsgVect3List.ToPoly2D(this.TransList(vl),poly);}
function JsgPlane(pos,xdir,ydir,normalize){this.WorkPoint=JsgVect3.Null();this.WorkPoint2=JsgVect3.Null();this.WorkPoint3=JsgVect3.Null();this.ExitPoint=JsgVect3.Null();this.EnterPoint=JsgVect3.Null();this.FirstEnterPoint=JsgVect3.Null();this.Result=JsgVect3.Null();this.ResultPoly=new JsgPolygon(true,'JsgPlane.ResultPoly');this.PolyIterator=new JsgPolyListIter();this.Set(pos,xdir,ydir,normalize);}
JsgPlane.Ok=function(obj){return xDef(obj)&&xDef(obj.Pos);}
JsgPlane.prototype.Set=function(pos,xdir,ydir,normalize){this.Pos=pos;this.XDir=xdir;this.YDir=ydir;this.Normal=JsgVect3.Null();if(normalize){this.Normalize();}else{this.CompNormal();}}
JsgPlane.prototype.Normalize=function(){var XdirNorm=JsgVect3.NormTo(this.XDir);var ZDir=JsgVect3.MultTo(this.WorkPoint,XdirNorm,this.YDir);JsgVect3.NormTo(JsgVect3.MultTo(this.YDir,ZDir,XdirNorm));this.CompNormal();return this;}
JsgPlane.prototype.CompNormal=function(){JsgVect3.MultTo(this.Normal,this.XDir,this.YDir);}
JsgPlane.prototype.Copy=function(normalize){return new JsgPlane(this.Pos,this.XDir,this.YDir,normalize);}
JsgPlane.prototype.PointOnPlane=function(x,y,v){if(JsgVect2.Ok(x)){return this.PointOnPlane(x[0],x[1],y);}
v=v||this.Result;JsgVect3.CopyTo(this.Pos,v);JsgVect3.AddTo(v,JsgVect3.ScaleTo(JsgVect3.CopyTo(this.XDir,this.WorkPoint),x));JsgVect3.AddTo(v,JsgVect3.ScaleTo(JsgVect3.CopyTo(this.YDir,this.WorkPoint),y));return v;}
JsgPlane.prototype.PolygonOnPlane=function(xArray,yArray,size,planePoly){if(JsgPolygon.Ok(xArray)){return this.PolygonOnPlane(xArray.X,xArray.Y,xArray.Size,yArray);}
planePoly=planePoly||this.ResultPoly;planePoly.Reset();size=xDefNum(size,xArray.length);for(var i=0;i<size;i++){var p=this.PointOnPlane(xArray[i],yArray[i]);planePoly.AddPoint3D(p);}
return planePoly;}
JsgPlane.prototype.Polygon=function(xpoly,ypoly,size){if(JsgPolygon.Ok(xpoly)){return this.Polygon(xpoly.X,xpoly.Y,xpoly.Size);}
size=xDefNum(size,xpoly.length);var vl=[];for(var i=0;i<size;i++){vl.push(JsgVect3.Copy(this.PointOnPlane(xpoly[i],ypoly[i])));}
return vl;}
JsgPlane.prototype.IntersectLine=function(p1,p2){var r=JsgVect3.SubFrom(JsgVect3.CopyTo(p2,this.Result),p1);var r3=JsgVect3.ScalarProd(r,this.Normal);if(r3==0){var tmp=p1;p1=p2;p2=tmp;r=JsgVect3.SubFrom(JsgVect3.CopyTo(p2,this.Result),p1);r3=JsgVect3.ScalarProd(r,this.Normal);if(r3==0){return null;}}
var pos_p1=JsgVect3.SubFrom(JsgVect3.CopyTo(p1,this.WorkPoint),this.Pos);var P3=JsgVect3.ScalarProd(pos_p1,this.Normal);var a=-P3/r3;return JsgVect3.AddTo(JsgVect3.ScaleTo(r,a),p1);}
JsgPlane.prototype.IsPoint3DOnTop=function(p){var pos_p=JsgVect3.SubFrom(JsgVect3.CopyTo(p,this.WorkPoint),this.Pos);return JsgVect3.ScalarProd(pos_p,this.Normal)>=0;}
JsgPlane.prototype.IsPointOnTop=function(x,y,z){JsgVect3.Set(this.WorkPoint,x,y,z);var pos_p=JsgVect3.SubFrom(this.WorkPoint,this.Pos);return JsgVect3.ScalarProd(pos_p,this.Normal)>=0;}
JsgPlane.prototype.ClipPoly=function(polys,clippedPolyList,interpolFunc,interpolData){clippedPolyList.Reset();if(JsgPolygonList.Ok(polys)){var size=polys.Size;for(var i=0;i<size;i++){this.Clip(polys.PolyList[i],clippedPolyList,false,interpolFunc,interpolData);}}else{this.Clip(polys,clippedPolyList,false,interpolFunc,interpolData);}}
JsgPlane.prototype.ClipArea=function(polys,clippedPolyList,interpolFunc,interpolData){clippedPolyList.Reset();clippedPolyList.NewPoly();if(JsgPolygonList.Ok(polys)&&polys.Size>1){var mainPoly=polys.PolyList[0];var lastMainPoint=mainPoly.Size-1;var x=mainPoly.X[lastMainPoint];var y=mainPoly.Y[lastMainPoint];var z=mainPoly.Z[lastMainPoint];var n=polys.Size;for(var i=1;i<n;i++){polys.PolyList[i].AddPoint(x,y,z);}}
var didClose=polys.Close()
this.Clip(polys,clippedPolyList,true,interpolFunc,interpolData);if(didClose)polys.RemoveLastPoint();if(JsgPolygonList.Ok(polys)&&polys.Size>1){var n=polys.Size;for(var i=1;i<n;i++){polys.PolyList[i].RemoveLastPoint();}}}
JsgPlane.prototype.Clip=function(polys,clippedPolyList,isArea,interpolFunc,interpolData){function addSegmentToClipPoly(){if(!isLastP2Added){if(!isArea){clippedPolyList.NewPoly();}
clippedPolyList.AddPoint3D(p1);}
clippedPolyList.AddPoint3D(p2);isLastP2Added=true;}
if(polys.Size==0)return;var isP1Inside,isP2Inside;var validEnter=false;var validExit=false;var validFirstEnter=false;var p1=this.WorkPoint2;var p2=this.WorkPoint3;var polyIter=this.PolyIterator.Reset(polys);if(!polyIter.GetNextPoint(p1))return;isP1Inside=this.IsPoint3DOnTop(p1);if(!polyIter.GetNextPoint(p2)){if(isP1Inside){if(!isArea){clippedPolyList.NewPoly();}
clippedPolyList.AddPoint3D(p1);}
return;}
polyIter.Back();var isLastP2Added=false;while(polyIter.GetNextPoint(p2)){isP2Inside=this.IsPoint3DOnTop(p2);if(isP1Inside&&isP2Inside){addSegmentToClipPoly();}else if(isP1Inside!=isP2Inside){var s=this.IntersectLine(p1,p2);if(!s){isP2Inside=isP1Inside;if(isP1Inside){addSegmentToClipPoly()}}else if(isP1Inside){if(!isLastP2Added){if(!isArea){if(!interpolFunc){clippedPolyList.NewPoly();}else if(clippedPolyList.Size==0){clippedPolyList.NewPoly();}}
clippedPolyList.AddPoint3D(p1);}
clippedPolyList.AddPoint3D(s);isLastP2Added=false;if(interpolFunc){JsgVect3.CopyTo(s,this.ExitPoint);validExit=true;}}else{if(!isArea){if(!interpolFunc){clippedPolyList.NewPoly();}else if(clippedPolyList.Size==0){clippedPolyList.NewPoly();}}
if(interpolFunc){JsgVect3.CopyTo(s,this.EnterPoint);if(validExit){interpolFunc(this,clippedPolyList,interpolData);}else{JsgVect3.CopyTo(s,this.FirstEnterPoint);validFirstEnter=true;}
validEnter=false;validExit=false;}
clippedPolyList.AddPoint3D(s);clippedPolyList.AddPoint3D(p2);isLastP2Added=true;}}
isP1Inside=isP2Inside;JsgVect3.CopyTo(p2,p1);}
if(interpolFunc&&validFirstEnter&&validExit){JsgVect3.CopyTo(this.FirstEnterPoint,this.EnterPoint);interpolFunc(this,clippedPolyList,interpolData);clippedPolyList.AddPoint3D(this.FirstEnterPoint);}}
function NewGraphX3D(aParams){return new JsGraphX3D(aParams);}
function JsGraphX3D(aParams){aParams=xDefObj(aParams,{});this.parentClass.constructor.call(this,aParams);this.ClientResetFunc=function(g){g.Reset3D();}
this.WorkPoly2D=new JsgPolygon(false,'JsGraphX3D.WorkPoly2D (local)');this.WorkPoint3D=JsgVect3.Null();this.WorkPoint3D2=JsgVect3.Null();this.WorkPoly3D=new JsgPolygon(true,'JsGraphX3D.WorkPoly3D');this.WorkPoly3D2=new JsgPolygon(true,'JsGraphX3D.WorkPoly3D2');this.XfmPolys3D=new JsgPolygonList(true,'JsGraphX3D.XfmPolys3D');this.CamPolys3D=new JsgPolygonList(true,'JsGraphX3D.CamPolys3D');this.ClipPolys3D1=new JsgPolygonList(true,'JsGraphX3D.ClipPolys3D1');this.ClipPolys3D2=new JsgPolygonList(true,'JsGraphX3D.ClipPolys3D2');this.Trans3D=null;this.Trans3DStack=[];this.Plane=new JsgPlane([0,0,0],[0,1,0],[0,0,1]);this.Camera=new JsgCamera();this.PathPolys3D=new JsgPolygonList(true,'JsGraphX3D.PathPolys3D (local)');this.IsPath3DOpen=false;this.ApplyTransToPath3D=false;this.LastPos3D=JsgVect3.Null();this.LastPosOnPlane=JsgVect2.Null()
this.Poly3D=new JsgPolygon(true,'JsGraphX3D.Poly3D');this.ApplyTransToPoly3D=false;this.CameraClipPlaneDist=0;this.ClipPlaneList=[null];this.Reset3D();this.SetAll(aParams);this.SetWindowToCameraScreen();}
JsGraphX3D.inheritsFrom(JsGraph);JsGraphX3D.prototype.Reset3D=function(reset2D,clear){reset2D=xDefBool(reset2D,true);clear=xDefBool(clear,true);if(reset2D){this.Reset(false);}
this.CameraClipPlaneDist=0;this.Plane.Set([0,0,0],[0,1,0],[0,0,1]);this.ClipPlaneList=[null];this.ClipPlaneListSize=1;this.PathPolys3D.Reset();this.Trans3D=null;this.Trans3DStack=[];this.IsPath3DOpen=false;this.SetViewport();this.ResetCamera();if(clear){this.Clear();}}
JsGraphX3D.prototype.SaveAll=function(aParams){var par=xDefObj(aParams,{});this.SaveClipPlanes(par);this.SaveCamera(par);this.SavePlane(par);return par;}
JsGraphX3D.prototype.SetAll=function(aParams){if(xFuncOrNull(aParams.DrawFunc)){this.SetDrawFunc(aParams.DrawFunc);}
this.SetClipPlanes(aParams);this.SetCamera(aParams);this.SetPlane(aParams);}
JsGraphX3D.prototype.SetWindowToCameraScreen=function(){var ratio=this.VpWidth/this.VpHeight;var screenSize=this.Camera.ScreenSize;var w,h;if(ratio>0){w=screenSize*ratio;h=screenSize;}else{w=screenSize;h=screenSize/ratio;}
this.SetWindowWH(-w/2,-h/2,w,h);}
JsGraphX3D.prototype.ResetCamera=function(){this.Camera.Reset();this.UpdateCameraClipPlane();}
JsGraphX3D.prototype.SetCamera=function(aParams){this.Camera.Set(aParams);this.UpdateCameraClipPlane();}
JsGraphX3D.prototype.SaveCamera=function(aParams){return this.Camera.Save(aParams);}
JsGraphX3D.prototype.SetCameraScale=function(aSceneSize,aScreenSize,aObjectZExtend,aZoom){this.Camera.SetScale(aSceneSize,aScreenSize,aObjectZExtend,aZoom);}
JsGraphX3D.prototype.SetCameraPos=function(aPos,aViewCenter,aUp){this.Camera.SetPos(aPos,aViewCenter,aUp);this.UpdateCameraClipPlane();}
JsGraphX3D.prototype.SetCameraView=function(aViewCenter,aHAng,aVAng,aDist,aUp){this.Camera.SetView(aViewCenter,aHAng,aVAng,aDist,aUp);this.UpdateCameraClipPlane();}
JsGraphX3D.prototype.SetCameraZoom=function(aZoom){this.Camera.SetZoom(aZoom);}
JsGraphX3D.prototype.UpdateCameraClipPlane=function(){if(this.CameraClipPlaneDist<=0&&this.ClipPlaneList[0]!=null){this.ClipPlaneList[0]=null;}
if(this.CameraClipPlaneDist>0){var cam=this.Camera;var n=JsgVect3.Norm(JsgVect3.Sub(cam.CamViewCenter,cam.CamPos));var pos=JsgVect3.Add(cam.CamPos,JsgVect3.Scale(n,this.CameraClipPlaneDist));var xdir=JsgVect3.Mult(cam.CamUp,n);var ydir=JsgVect3.Mult(n,xdir);var plane=new JsgPlane(pos,xdir,ydir,true);this.ClipPlaneList[0]=plane;}}
JsGraphX3D.prototype.SetCameraClipping=function(clipPlaneDist){this.CameraClipPlaneDist=clipPlaneDist;this.UpdateCameraClipPlane();}
JsGraphX3D.prototype.DeleteClipPlanes=function(){this.ClipPlaneListSize=1;}
JsGraphX3D.prototype.AddClipPlane=function(planeOrPos,xdir,ydir){if(JsgPlane.Ok(planeOrPos)){planeOrPos.Normalize();this.ClipPlaneList[this.ClipPlaneListSize]=planeOrPos;this.ClipPlaneListSize++;}else{this.ClipPlaneList[this.ClipPlaneListSize]=new JsgPlane(planeOrPos,xdir,ydir,true);this.ClipPlaneListSize++;}}
JsGraphX3D.prototype.SaveClipPlanes=function(aParams){if(this.CameraClipPlaneDist>0){aParmas.CameraClipPlaneDist=this.CameraClipPlaneDist;}
var n=this.ClipPlaneListSize;if(n>1){var l=[];for(var i=1;i<n;i++){l.push(this.ClipPlaneList[i].Copy());}
aParams.ClipPlaneList=l;}}
JsGraphX3D.prototype.SetClipPlanes=function(aParams){this.DeleteClipPlanes();if(xDefArray(aParams.ClipPlaneList)){var lst=aParams.ClipPlaneList;var n=lst.length;for(var i=0;i<n;i++){var plane=lst[i];if(JsgPlane.Ok(plane)){this.AddClipPlane(plane);}}}
if(xDefNum(aParams.CameraClipPlaneDist)){this.SetCameraClipping(aParams.CameraClipPlaneDist);}}
JsGraphX3D.prototype.PolygonFromFunc=function(aParams,poly){aParams.Graph3D=xDefObj(aParams.Graph3D,this);var min=xDefNum(aParams.Min,-1);var max=xDefNum(aParams.Max,1);var delta=0.1;if(xNum(aParams.Steps)){delta=(max-min)/aParams.Steps;}else if(xNum(aParams.Delta)){delta=Math.abs(aParams.Delta);if(max<min){delta=-delta;}}
var limit=max+0.1*delta;poly=poly||new JsgPolygon(true);var point=this.WorkPoint3D;for(var x=min;(delta>0)?(x<=limit):(x>=limit);x+=delta){poly.AddPoint3D(aParams.Func(x,aParams,point));}
return poly;}
JsGraphX3D.prototype.VectListFromFunc=function(aParams){aParams.Graph3D=xDefObj(aParams.Graph3D,this);var min=xDefNum(aParams.Min,-1);var max=xDefNum(aParams.Max,1);var delta=0.1;if(xNum(aParams.Steps)){delta=(max-min)/aParams.Steps;}else if(xNum(aParams.Delta)){delta=Math.abs(aParams.Delta);if(max<min){delta=-delta;}}
var limit=max+0.1*delta;var vectList=[];for(var x=min;(delta>0)?(x<=limit):(x>=limit);x+=delta){vectList.push(aParams.Func(x,aParams));}
return vectList;}
JsGraphX3D.prototype.VectGridFrom3DFunc=function(aParams){aParams.Graph3D=xDefObj(aParams.Graph3D,this);var min=xDefNum(aParams.Min,-1);var max=xDefNum(aParams.Max,1);var min2=xDefNum(aParams.Min2,min);var max2=xDefNum(aParams.Max2,max);var delta=0.1;if(xNum(aParams.Steps)){delta=(max-min)/aParams.Steps;}else if(xNum(aParams.Delta)){delta=Math.abs(aParams.Delta);if(max<min){delta=-delta;}}
var delta2=delta;if(xNum(aParams.Steps2)){delta2=(max2-min2)/aParams.Steps2;}else if(xNum(aParams.Delta2)){delta2=Math.abs(aParams.Delta2);if(max2<min2){delta2=-delta2;}}
var limit=max+0.1*delta;var limit2=max2+0.1*delta2;var grid=[];for(var b=min2;(delta2>0)?(b<=limit2):(b>=limit2);b+=delta2){var line=[];for(var a=min;(delta>0)?(a<=limit):(a>=limit);a+=delta){line.push(aParams.Func(a,b,aParams));}
grid.push(line);}
return grid;}
JsGraphX3D.prototype.ResetTrans3D=function(clearStack){this.Trans3D=null;if(clearStack){this.Trans3DStack=[];}
return this;}
JsGraphX3D.prototype.SaveTrans3D=function(reset){var transCopy=null;if(this.Trans3D)transCopy=JsgMat3.Copy(this.Trans3D);this.Trans3DStack.push(transCopy);if(reset)this.Trans3D=null;return transCopy;}
JsGraphX3D.prototype.RestoreTrans3D=function(){if(this.Trans3DStack.length>0)this.Trans3D=this.Trans3DStack.pop();}
JsGraphX3D.prototype.SetTrans3D=function(mat,useMat){if(mat){if(useMat){this.Trans3D=mat;}else{this.Trans3D=JsgMat3.Copy(mat);}}else{this.Trans3D=null;}}
JsGraphX3D.prototype.TransMove3D=function(x,y,z){if(JsgVect3.Ok(x))return this.TransMove3D(x[0],x[1],x[2]);this.Trans3D=JsgMat3.Moving(x,y,z,this.Trans3D);return this;}
JsGraphX3D.prototype.TransScale3D=function(sx,sy,sz){if(JsgVect3.Ok(sx))return this.TransScale3D(sx[0],sx[1],sx[2]);this.Trans3D=JsgMat3.Scaling(sx,sy,sz,this.Trans3D);return this;}
JsGraphX3D.prototype.TransRotateX3D=function(ang){this.Trans3D=JsgMat3.RotatingX(this.AngleToRad(ang),this.Trans3D);return this;}
JsGraphX3D.prototype.TransRotateY3D=function(ang){this.Trans3D=JsgMat3.RotatingY(this.AngleToRad(ang),this.Trans3D);return this;}
JsGraphX3D.prototype.TransRotateZ3D=function(ang){this.Trans3D=JsgMat3.RotatingZ(this.AngleToRad(ang),this.Trans3D);return this;}
JsGraphX3D.prototype.TransRotateVect3D=function(v,ang){var n=JsgVect3.Norm([v[0],v[1],0]);var lambda=Math.acos(JsgVect3.ScalarProd(n,[1,0,0]));if(v[1]<0)lambda*=-1;var vl=JsgVect3.Length(v);var phi=0;if(vl!=0)phi=Math.acos(v[2]/vl);ang=this.AngleToRad(ang);var am=this.SetAngleMeasure('rad');this.TransRotateZ3D(-lambda);this.TransRotateY3D(-phi);this.TransRotateZ3D(ang);this.TransRotateY3D(phi);this.TransRotateZ3D(lambda);this.SetAngleMeasure(am);}
JsGraphX3D.prototype.AddTrans3D=function(mat){if(this.Trans3D){this.Trans3D=JsgMat3.Mult(mat,this.Trans3D);}else{this.Trans3D=JsgMat3.Copy(mat);}
return this;}
JsGraphX3D.prototype.NewPoly3D=function(applyTrans){this.ApplyTransToPoly3D=xDefBool(applyTrans,false);this.Poly3D.Reset();return this;}
JsGraphX3D.prototype.CopyPoly3D=function(to,reuseArrays){reuseArrays=xDefBool(reuseArrays,false);return this.Poly3D.Copy(to,!reuseArrays);}
JsGraphX3D.prototype.AddPointToPoly3D=function(x,y,z){if(JsgVect3.Ok(x)){if(this.ApplyTransToPoly3D){this.Poly3D.AddPoint3D(this.TransPoint3D(x[0],x[1],x[2]));}else{this.Poly3D.AddPoint3D(x);}}else{if(this.ApplyTransToPoly3D){this.Poly3D.AddPoint3D(this.TransPoint3D(x,y,z));}else{this.Poly3D.AddPoint(x,y,z);}}
return this;}
JsGraphX3D.prototype.DrawPoly3D=function(mode,roundedEdges){mode=xDefNum(mode,1);if(mode&16)this.Poly3D.Invert();this.Polygon3D(this.Poly3D,mode,roundedEdges);}
JsGraphX3D.prototype.MoveTo3D=function(x,y,z){if(JsgVect3.Ok(x))return this.MoveTo3D(x[0],x[1],x[2]);JsgVect3.Set(this.LastPos3D,x,y,z);return this;}
JsGraphX3D.prototype.LineTo3D=function(x,y,z){if(JsgVect3.Ok(x)){return this.LineTo3D(x[0],x[1],x[2]);}
this.WorkPoly3D.Reset();this.WorkPoly3D.AddPoint3D(this.LastPos3D);this.WorkPoly3D.AddPoint(x,y,z);this.TransClipPolygon3D(this.WorkPoly3D,1);this.WorkPoly3D.GetLastPoint3D(this.LastPos3D);return this;}
JsGraphX3D.prototype.Line3D=function(x1,y1,z1,x2,y2,z2,append){if(JsgVect3.Ok(x1)){return this.Line3D(x1[0],x1[1],x1[2],y1[0],y1[1],y1[2],z1);}
var mode=1;if(append)mode+=8;this.WorkPoly3D.Reset();this.WorkPoly3D.AddPoint(x1,y1,z1);this.WorkPoly3D.AddPoint(x2,y2,z2);this.TransClipPolygon3D(this.WorkPoly3D,mode);this.WorkPoly3D.GetLastPoint3D(this.LastPos3D);return this;}
JsGraphX3D.prototype.VectList3D=function(vectList,mode,roundedEdges){this.VectListToPoly3D(vectList);this.DrawPoly3D(mode,roundedEdges);}
JsGraphX3D.prototype.Polygon3D=function(poly,mode,roundedEdges){mode=xDefNum(mode,1);var didClose=false;if((mode&4)>0){didClose=poly.Close();}
roundedEdges=xDefBool(roundedEdges,false);if(roundedEdges&&!this.IsPath3DOpen){var oldJoin=this.LineJoin;var oldCap=this.LineCap;this.SetLineJoin('round');this.SetLineCap('round');this.TransClipPolygon3D(poly,mode&~4);this.SetLineJoin(oldJoin);this.SetLineCap(oldCap);}else{this.TransClipPolygon3D(poly,mode&~4);}
poly.GetLastPoint3D(this.LastPos3D);if(didClose){poly.RemoveLastPoint();}}
JsGraphX3D.prototype.PolygonList3D=function(polys,mode,roundedEdges){for(var i=0;i<polys.Size;i++){this.Polygon3D(polys.PolyList[i],mode,roundedEdges);}}
JsGraphX3D.prototype.BezierCurve3D=function(sx,sy,sz,cx1,cy1,cz1,cx2,cy2,cz2,ex,ey,ez,mode,nSegments){nSegments=xDefNum(nSegments,this.NumBezierSegments);var poly=this.MakeBezierPolygon3D(sx,sy,sz,cx1,cy1,cz1,cx2,cy2,cz2,ex,ey,ez,nSegments);this.Polygon3D(poly,mode);return this;}
JsGraphX3D.prototype.MakeBezierPolygon3D=function(sx,sy,sz,cx1,cy1,cz1,cx2,cy2,cz2,ex,ey,ez,nSegments,add,polyRet){if(JsgVect3.Ok(sx)){return this.MakeBezierPolygon3D(sx[0],sx[1],sx[2],sy[0],sy[1],sy[2],sz[0],sz[1],sz[2],cx1[0],cx1[1],cx1[2],cy1[0],cy1[1],cy1[2]);}
if(JsgPolygon.Ok(sx)){polyRet=polyRet||this.WorkPoly3D;var startIx=xDefNum(sy,0);if(sx.Size<startIx+4){add=xDefBool(add,false);if(!add)polyRet.Reset();return polyRet;}
var i=xDefNum(sy,0);return this.MakeBezierPolygon(sx.X[i+0],sx.Y[i+0],sx.Z[i+0],sx.X[i+1],sx.Y[i+1],sx.Z[i+1],sx.X[i+2],sx.Y[i+2],sx.Z[i+2],sx.X[i+3],sx.Y[i+3],sx.Z[i+3],sz,cx1,cy1);}
nSegments=xDefNum(nSegments,this.NumBezierSegments);add=xDefBool(add,false);var polyRet=polyRet||this.WorkPoly3D;if(!add)polyRet.Reset();var dt=1/nSegments;var tlast=1+dt/2;for(var t=0;t<tlast;t+=dt){var t2=t*t;var t3=t*t2;var mt=1-t;var mt2=mt*mt;var mt3=mt*mt2;var x=sx*mt3+cx1*3*mt2*t+cx2*3*mt*t2+ex*t3;var y=sy*mt3+cy1*3*mt2*t+cy2*3*mt*t2+ey*t3;var z=sz*mt3+cz1*3*mt2*t+cz2*3*mt*t2+ez*t3;polyRet.AddPoint(x,y,z);}
return polyRet;}
JsGraphX3D.prototype.VectListToPoly3D=function(vectList,newPoly){newPoly=xDefBool(newPoly,true);if(newPoly){this.NewPoly3D();}
var size=vectList.length;for(var i=0;i<size;i++){var v=vectList[i];this.AddPointToPoly3D(v[0],v[1],v[2]);}}
JsGraphX3D.prototype.Arrow3D=function(x1,y1,z1,x2,y2,z2,variant,mode,sym1,sym2){if(JsgVect3.Ok(x1)){return this.Arrow3D(x1[0],x1[1],x1[2],y1[0],y1[1],y1[2],z1,x2,y2,z2);}
var poly=this.WorkPoly3D.Reset();poly.AddPoint(x1,y1,z1);poly.AddPoint(x2,y2,z2);poly.GetLastPoint3D(this.LastPos3D);variant=xDefNum(variant,1);if(variant&1){if(!this.TransClipPoint3D(poly.X[1],poly.Y[1],poly.Z[1]))variant&=~1;}
if(variant&2){if(!this.TransClipPoint3D(poly.X[0],poly.Y[0],poly.Z[0]))variant&=~2;}
var transPoly=this.TransClipPolygon3D(poly,1,false,true);if(transPoly.IsEmpty())return this;if(JsgPolygonList.Ok(transPoly))transPoly=transPoly.GetFirstPoly();if((variant&3)>0){this.Arrow(transPoly.X[0],transPoly.Y[0],transPoly.X[1],transPoly.Y[1],variant,mode,sym1,sym2);}else{this.Line(transPoly.X[0],transPoly.Y[0],transPoly.X[1],transPoly.Y[1]);}
JsgVect3.Set(this.LastPos3D,x2,y2,z2);return this;}
JsGraphX3D.prototype.PolygonArrow3D=function(poly,variant,lineMode,arrowMode,sym1,sym2){if(poly.Size<2)return this;if((variant&4)==0){this.Polygon3D(poly,lineMode);}
var last=poly.Size-1;if(variant&1){if(!this.TransClipPoint3D(poly.X[last],poly.Y[last],poly.Z[last]))variant&=~1;}
if(variant&2){if(!this.TransClipPoint3D(poly.X[0],poly.Y[0],poly.Z[0]))variant&=~2;}
variant|=4;if((variant&2)>0){this.Arrow3D(poly.X[0],poly.Y[0],poly.Z[0],poly.X[1],poly.Y[1],poly.Z[1],variant&~1,arrowMode,sym1);}
if((variant&1)>0){var prev=last-1;this.Arrow3D(poly.X[prev],poly.Y[prev],poly.Z[prev],poly.X[last],poly.Y[last],poly.Z[last],variant&~2,arrowMode,sym2);}
poly.GetLastPoint3D(this.LastPos3D);return this;}
JsGraphX3D.prototype.Text3D=function(aText,p,widthOrMode){var p=this.TransClipPoint3D(p[0],p[1],p[2]);if(p){this.Text(aText,p,widthOrMode);}
return this;}
JsGraphX3D.prototype.GetTextBox3D=function(aText,p,width){var p=this.TransClipPoint3D(p[0],p[1],p[2]);if(!p)return null;return this.GetTextBox(aText,p,width);}
JsGraphX3D.prototype.DrawPolyMarker3D=function(mode,mat){this.Marker3D(this.Poly3D,mode,mat);}
JsGraphX3D.prototype.Marker3D=function(x,y,z,mode,mat){if(JsgPolygon.Ok(x)){var polyClipped=this.TransClipPointPoly3D(x);this.Marker(polyClipped,y,z);return this;}
if(JsgVect3.Ok(x))return this.Marker3D(x[0],x[1],x[2],y,z);var p=this.TransClipPoint3D(x,y,z);if(p){this.Marker(p,mode,mat);}
return this;}
JsGraphX3D.prototype.OpenPath3D=function(applyTrans){this.ApplyTransToPath3D=xDefBool(applyTrans,false);this.PathPolys3D.Reset();this.IsPath3DOpen=true;}
JsGraphX3D.prototype.ClearPath3D=function(){this.PathPolys3D.Reset();this.IsPath3DOpen=false;}
JsGraphX3D.prototype.Path3D=function(mode,clear){mode=xDefNum(mode,1);clear=xDefBool(clear,true);var didClose=false;if((mode&4)>0){didClose=this.PathPolys3D.Close();}
this.TransClipPolygon3D(this.PathPolys3D,mode&~4,true,true);if(clear){this.ClearPath3D();}else{if(didClose){this.PathPolys3D.RemoveLastPoint();}}}
JsGraphX3D.prototype.TransClipPolygon3D=function(polys,mode,draw,bypassPath){bypassPath=xDefBool(bypassPath,false);draw=xDefBool(draw,true);if(this.IsPath3DOpen&&!bypassPath){var appendMode=((mode&8)>0)?2:1;if(this.ApplyTransToPath3D){this.PathPolys3D.AddPoly(this.TransPolys3D(polys),appendMode);}else{this.PathPolys3D.AddPoly(polys,appendMode);}
return this.PathPolys3D;}
var transformedPolys=this.TransPolys3D(polys);var polysRet=transformedPolys;if((mode&2)>0){var clippedPolys=this.ClipPolygon3D(transformedPolys,true);var cameraPolys=this.CameraTrans3D(clippedPolys);if(draw){this.DrawPolygonList3D(cameraPolys,mode&~1);}
polysRet=cameraPolys;}
if((mode&1)>0){var clippedPolys=this.ClipPolygon3D(transformedPolys,false);var cameraPolys=this.CameraTrans3D(clippedPolys);if(draw){this.DrawPolygonList3D(cameraPolys,mode&~(2+4));}
polysRet=cameraPolys;}
return polysRet;}
JsGraphX3D.prototype.TransClipPointPoly3D=function(poly,polyRet){polyRet=polyRet||this.WorkPoly3D;polyRet.Reset();var xs=poly.X;var ys=poly.Y;var zs=poly.Z;var len=poly.Size;for(var i=0;i<len;i++){var p=this.TransClipPoint3D(xs[i],ys[i],zs[i]);if(p){polyRet.AddPoint3D(p);}}
return polyRet;}
JsGraphX3D.prototype.TransPolys3D=function(polys,reset){if(!this.Trans3D)return polys;reset=xDefBool(reset,true);var polysRet=this.XfmPolys3D;if(reset){polysRet.Reset();}
if(JsgPolygonList.Ok(polys)){for(var i=0;i<polys.Size;i++){this.TransPolys3D(polys.PolyList[i],false);}}else{polysRet.NewPoly();var polyTrans=polysRet.GetLastPoly();var mat=this.Trans3D;var xs=polys.X,ys=polys.Y,zs=polys.Z,p=this.WorkPoint3D;var n=polys.Size;for(var i=0;i<n;i++){JsgMat3.TransXYZTo(mat,xs[i],ys[i],zs[i],p);polyTrans.AddPoint3D(p);}}
return polysRet;}
JsGraphX3D.prototype.TransClipPoint3D=function(x,y,z){if(JsgVect3.Ok(x))return this.TransClipPoint3D(x[0],x[1],x[2]);var p=this.TransPoint3D(x,y,z);if(!this.IsPointInsideClipRange3D(p[0],p[1],p[2]))return null;return this.Camera.TransTo(p[0],p[1],p[2]);}
JsGraphX3D.prototype.VTransPoint3D=function(x,y,z){var p;if(xNum(x)){p=this.TransPoint3D(x,y,z);}else{p=this.TransPoint3D(x[0],x[1],x[2]);}
return this.Camera.TransTo(p[0],p[1],p[2]);}
JsGraphX3D.prototype.TransPoint3D=function(x,y,z){if(JsgVect3.Ok(x))return this.TransPoint3D(x[0],x[1],x[2]);var p=JsgVect3.Set(this.WorkPoint3D,x,y,z);if(this.Trans3D){JsgMat3.TransTo(this.Trans3D,p);}
return p;}
JsGraphX3D.prototype.DrawPolygonList3D=function(polys,mode){if(JsgPolygonList.Ok(polys)){var n=polys.Size;for(var i=0;i<n;i++){this.Polygon(polys.PolyList[i],mode);}}else{this.Polygon(polys,mode);}}
JsGraphX3D.prototype.CameraTrans3D=function(polys){var transPolys=this.CamPolys3D.Reset();if(JsgPolygonList.Ok(polys)){var n=polys.Size;for(var i=0;i<n;i++){transPolys.NewPoly();this.Camera.TransPoly(polys.PolyList[i],transPolys);}}else{transPolys.NewPoly();this.Camera.TransPoly(polys,transPolys);}
return transPolys;}
JsGraphX3D.prototype.ClipPolygon3D=function(polys,isArea){var n=this.ClipPlaneListSize;if(n==1&&this.ClipPlaneList[0]==null){if(!isArea||JsgPolygon.Ok(polys)){return polys;}else{return this.MergeAreaPolys(polys,this.ClipPolys3D1);}}
var nextClipPolys=this.ClipPolys3D2;var currClipPolys=this.ClipPolys3D1;for(var i=0;i<n;i++){var clipPlane=this.ClipPlaneList[i];if(clipPlane){var clippedPolys=currClipPolys.Reset();if(isArea){clipPlane.ClipArea(polys,clippedPolys);}else{clipPlane.ClipPoly(polys,clippedPolys);}
polys=clippedPolys;var tmp=currClipPolys;currClipPolys=nextClipPolys;nextClipPolys=tmp;}}
return polys;}
JsGraphX3D.prototype.MergeAreaPolys=function(polys,mergedPolys){if(polys.Size==0)return polys;if(polys.Size==1)return polys.PolyList[0];mergedPolys.Reset();mergedPolys.NewPoly();for(var i=0;i<polys.Size;i++){var poly=polys.PolyList[i];var hasClosed=poly.Close();mergedPolys.AddPoly(poly,2);if(i>0){mergedPolys.Close();}
if(hasClosed){poly.RemoveLastPoint();}}
return mergedPolys;}
JsGraphX3D.prototype.IsPointInsideClipRange3D=function(x,y,z){var isVect=JsgVect3.Ok(x);var n=this.ClipPlaneListSize;if(n==1&&this.ClipPlaneList[0]==null)return true;for(var i=0;i<n;i++){var clipPlane=this.ClipPlaneList[i];if(clipPlane){if(isVect){if(!clipPlane.IsPoint3DOnTop(x))return false;}else{if(!clipPlane.IsPointOnTop(x,y,z))return false;}}}
return true;}
JsGraphX3D.prototype.SavePlane=function(aParams){var par=xDefObj(aParams,{});par.Plane=this.Plane;return par;}
JsGraphX3D.prototype.SetPlane=function(PosOrObj,xDir,yDir,normalize){if(xObj(PosOrObj)){if(JsgPlane.Ok(PosOrObj)){this.Plane=PosOrObj;}else if(xDef(PosOrObj.Plane)){this.Plane=PosOrObj.Plane;}}else{this.Plane.Set(PosOrObj,xDir,yDir,normalize);}}
JsGraphX3D.prototype.PolygonToPlane=function(xpoly,ypoly,size,planePoly){return this.Plane.PolygonOnPlane(xpoly,ypoly,size,planePoly);}
JsGraphX3D.prototype.GetPointOnPlane=function(x,y,v){v=v||this.WorkPoint3D;return this.Plane.PointOnPlane(x,y,v);}
JsGraphX3D.prototype.GetTransPointOnPlane=function(x,y,v){return this.GetTransPoint3D(this.Plane.PointOnPlane(x,y),v);}
JsGraphX3D.prototype.GetTransPoint3D=function(x,y,z,v){if(JsgVect3.Ok(x)){return this.GetTransPoint3D(x[0],x[1],x[2],y);}
v=v||this.WorkPoint3D;if(this.Trans3D){JsgMat3.TransXYZTo(this.Trans3D,x,y,z,v);}else{JsgVect3.Set(v,x,y,z);}
return v;}
JsGraphX3D.prototype.AddPointToPoly3DOnPlane=function(x,y){this.Poly3D.AddPoint3D(this.Plane.PointOnPlane(x,y));}
JsGraphX3D.prototype.MoveToOnPlane=function(x,y){if(JsgVect2.Ok(x)){return this.MoveToOnPlane(x[0],x[1]);}
JsgVect2.Set(this.LastPosOnPlane,x,y);return this;}
JsGraphX3D.prototype.LineToOnPlane=function(x,y){if(JsgVect2.Ok(x)){return this.LineToOnPlane(x[0],x[1]);}
this.LineOnPlane(this.LastPosOnPlane[0],this.LastPosOnPlane[1],x,y);return this;}
JsGraphX3D.prototype.LineOnPlane=function(x1,y1,x2,y2,append){if(JsgVect2.Ok(x1)){return this.LineOnPlane(x1[0],x1[1],y1[0],y1[1],x2);}
this.Plane.PointOnPlane(x1,y1,this.WorkPoint3D);this.Plane.PointOnPlane(x2,y2,this.WorkPoint3D2);this.Line3D(this.WorkPoint3D,this.WorkPoint3D2,append);JsgVect2.Set(this.LastPosOnPlane,x2,y2);return this;}
JsGraphX3D.prototype.PolygonOnPlane=function(xpoly,ypoly,mode,size,roundedEdges){if(JsgPolygon.Ok(xpoly)){return this.PolygonOnPlane(xpoly.X,xpoly.Y,ypoly,xpoly.Size,mode);}
size=xDefNum(size,xpoly.length);var poly=this.Plane.PolygonOnPlane(xpoly,ypoly,size);this.Polygon3D(poly,mode,roundedEdges);JsgVect2.Set(this.LastPosOnPlane,xpoly[size-1],ypoly[size-1]);return this;}
JsGraphX3D.prototype.BezierCurveOnPlane=function(sx,sy,cx1,cy1,cx2,cy2,ex,ey,mode,nSegments){if(JsgPolygon.Ok(sx)){var i=xDefNum(cx1,0);return this.BezierCurveOnPlane(sx.X[i+0],sx.Y[i+0],sx.X[i+1],sx.Y[i+1],sx.X[i+2],sx.Y[i+2],sx.X[i+3],sx.Y[i+3],sy,cx1);}
if(JsgVect2.Ok(sx)){return this.BezierCurveOnPlane(sx[0],sx[1],sy[0],sy[1],cx1[0],cx1[1],cy1[0],cy1[1],cx2,cy2);}
var poly2D=this.MakeBezierPolygon(sx,sy,cx1,cy1,cx2,cy2,ex,ey,nSegments);this.PolygonOnPlane(poly2D,mode);return this;}
JsGraphX3D.prototype.BezierCurveToOnPlane=function(cx1,cy1,cx2,cy2,ex,ey,mode,nSegments){if(JsgPolygon.Ok(cx1)){var i=xDefNum(cx2,0);return this.BezierCurveToOnPlane(cx1.X[i+0],cx1.Y[i+0],cx1.X[i+1],cx1.Y[i+1],cx1.X[i+2],cx1.Y[i+2],cy1,cx2);}
if(JsgVect2.Ok(cx1)){return this.BezierCurveToOnPlane(cx1[0],cx1[1],cy1[0],cy1[1],cx2[0],cx2[1],cy2,ex);}
this.BezierCurveOnPlane(this.LastPosOnPlane[0],this.LastPosOnPlane[1],cx1,cy1,cx2,cy2,ex,ey,mode,nSegments);return this;}
JsGraphX3D.prototype.SplineCurveOnPlane=function(xpoly,ypoly,tension,mode,size,nSegments){if(JsgPolygon.Ok(xpoly)){return this.SplineCurveOnPlane(xpoly.X,xpoly.Y,ypoly,tension,xpoly.Size,mode);}
var poly2D=this.MakeSplineCurve(xpoly,ypoly,tension,mode,size,nSegments);var roundedEdges=(mode&4)>0;this.PolygonOnPlane(poly2D,mode,roundedEdges);return this;}
JsGraphX3D.prototype.ArrowOnPlane=function(x1,y1,x2,y2,variant,mode,sym1,sym2){if(JsgVect2.Ok(x1)){return this.ArrowOnPlane(x1[0],x1[1],y1[0],y1[1],x2,y2,variant,mode);}
this.Plane.PointOnPlane(x1,y1,this.WorkPoint3D);this.Plane.PointOnPlane(x2,y2,this.WorkPoint3D2);this.Arrow3D(this.WorkPoint3D,this.WorkPoint3D2,variant,mode,sym1,sym2);JsgVect2.Set(this.LastPosOnPlane,x2,y2);return this;}
JsGraphX3D.prototype.PolygonArrowOnPlane=function(xpoly,ypoly,variant,lineMode,arrowMode,size,sym1,sym2){if(JsgPolygon.Ok(xpoly)){return this.PolygonArrowOnPlane(xpoly.X,xpoly.Y,ypoly,variant,lineMode,xpoly.Size,arrowMode,size);}
var poly=this.Plane.PolygonOnPlane(xpoly,ypoly,size);this.PolygonArrow3D(poly,variant,lineMode,arrowMode,sym1,sym2);size=size||xpoly.length;JsgVect2.Set(this.LastPosOnPlane,xpoly[size-1],ypoly[size-1]);return this;}
JsGraphX3D.prototype.RectOnPlane=function(x1,y1,x2,y2,mode,roll){if(JsgVect2.Ok(x1)){return this.RectOnPlane(x1[0],x1[1],y1[0],y1[1],x2,y2);}
mode=xDefNum(mode,1);var poly;if(xObj(x1)){mode=xDefNum(y1,1);roll=xDefNum(x2,0);var clockWise=!!(mode&4);poly=this.MakeRectPolygon(x1,clockWise,roll);}else{var clockWise=!!(mode&4);poly=this.MakeRectPolygon(x1,y1,x2,y2,clockWise,roll);}
this.PolygonOnPlane(poly,mode,true);return this;}
JsGraphX3D.prototype.RectWHOnPlane=function(x,y,w,h,mode,roll){if(JsgRect.Ok(x)){this.RectOnPlane(x.x,x.y,x.x+x.w,x.y+x.h,y,w);}else{this.RectOnPlane(x,y,x+w,y+h,mode,roll);}}
JsGraphX3D.prototype.CompViewportRadius=function(x,y,rx,ry){function len(xs,ys,i,j){var vx=xs[i]-xs[j];var vy=ys[i]-ys[j];return vx*vx+vy*vy;}
var abs=Math.abs,max=Math.max;var absRx=abs(rx);var absRy=abs(ry);var maxR=max(absRx,absRy);var plane=this.Plane;var poly=this.WorkPoly3D2.Reset();poly.AddPoint3D(this.VTransPoint3D(plane.PointOnPlane(x-maxR,y-maxR)));poly.AddPoint3D(this.VTransPoint3D(plane.PointOnPlane(x+maxR,y-maxR)));poly.AddPoint3D(this.VTransPoint3D(plane.PointOnPlane(x+maxR,y+maxR)));poly.AddPoint3D(this.VTransPoint3D(plane.PointOnPlane(x-maxR,y+maxR)));var xs=poly.X,ys=poly.Y;var l1=len(xs,ys,1,0);var l2=len(xs,ys,2,3);var ll1=(l1+l2)/2;var l1=len(xs,ys,3,0);var l2=len(xs,ys,2,1);var ll2=(l1+l2)/2;var maxRVT=Math.sqrt(max(ll1,ll2))/2;var cnvsRx=abs(this.CurrTrans.ScaleX)*maxRVT;var cnvsRy=abs(this.CurrTrans.ScaleY)*maxRVT;var rPixel=max(cnvsRx,cnvsRy);return rPixel;}
JsGraphX3D.prototype.CircleOnPlane=function(x,y,r,mode,startAngle){if(JsgVect2.Ok(x)){return this.CircleOnPlane(x[0],x[1],y,r,mode);}
this.EllipseOnPlane(x,y,r,Math.abs(r),0,mode,startAngle);return this;}
JsGraphX3D.prototype.ArcOnPlane=function(x,y,r,start,end,mode){if(JsgVect2.Ok(x)){return this.ArcOnPlane(x[0],x[1],y,r,start,end);}
this.EllipseArcOnPlane(x,y,r,Math.abs(r),0,start,end,mode);return this;}
JsGraphX3D.prototype.ArcToOnPlane=function(x,y,r,big,mode){if(JsgVect2.Ok(x)){return this.ArcToOnPlane(x,x,y,r,big);}
this.ArcPtOnPlane(this.LastX,this.LastY,x,y,r,big,mode|8);return this;}
JsGraphX3D.prototype.ArcPtOnPlane=function(x1,y1,x2,y2,r,big,mode){if(JsgVect2.Ok(x1)){return this.ArcPtOnPlane(x1[0],x1[1],y1[0],y1[1],x2,y2,r);}
big=xDefBool(big,false);mode=xDefNum(mode,1);var arc=this.MakeArcFromPoints(x1,y1,x2,y2,r,big);this.ArcOnPlane(arc.x,arc.y,arc.r,arc.start,arc.end,mode);return this;}
JsGraphX3D.prototype.EllipseOnPlane=function(x,y,rx,ry,rot,mode,startAngle){if(JsgVect2.Ok(x)){return this.EllipseOnPlane(x[0],x[1],y,rx,ry,rot,mode);}
startAngle=xDefNum(startAngle,0);var start=startAngle;var end=startAngle+this.RadToAngle(2*Math.PI);if(rx<0){start=end;end=startAngle;}
this.EllipseArcOnPlane(x,y,rx,ry,rot,start,end,mode);return this;}
JsGraphX3D.prototype.EllipseArcOnPlane=function(x,y,rx,ry,rot,start,end,mode){if(JsgVect2.Ok(x)){return this.EllipseArcOnPlane(x[0],x[1],y,rx,ry,rot,start,end);}
ry=xDefNum(ry,Math.abs(rx));rot=xDefNum(rot,0);start=xDefNum(start,0);end=xDefNum(end,start+this.RadToAngle(2*Math.PI));mode=xDefNum(mode,1);var rPixel=this.CompViewportRadius(x,y,rx,ry);var ell=this.MakeEllipseArcPolygon(x,y,rx,ry,rot,start,end,rPixel);var roundedEdges=((mode&1)&&this.IsClosedPolygon(ell.X,ell.Y,ell.Size));this.PolygonOnPlane(ell,mode,roundedEdges);return this;}
JsGraphX3D.prototype.TextOnPlane=function(txt,x,y,WidthOrMode){if(JsgVect2.Ok(x)){return this.TextOnPlane(txt,x[0],x[1],y);}
return this.Text3D(txt,this.Plane.PointOnPlane(x,y),WidthOrMode);}
JsGraphX3D.prototype.GetTextBoxOnPlane=function(aText,x,y,width){if(JsgVect2.Ok(x)){return this.GetTextBoxOnPlane(aText,x[0],x[1],y);}
var pos=this.Plane.PointOnPlane(x,y);var posVT=this.Camera.Trans(pos);return this.GetTextBox(aText,posVT[0],posVT[1],width);}
JsGraphX3D.prototype.MarkerOnPlane=function(x,y,mode,mat,size){if(JsgPolygon.Ok(x)){return this.MarkerOnPlane(x.X,x.Y,y,mode,x.Size);}
if(xArray(x)&&xArray(y)){return this.Marker3D(this.Plane.PolygonOnPlane(x,y,size),mode,mat);}
if(JsgVect2.Ok(x))return this.MarkerOnPlane(x[0],x[1],y,mode);return this.Marker3D(this.Plane.PointOnPlane(x,y),mode,mat);}
JsGraphX3D.prototype.CreateLinearGradient3D=function(aGradientDef){var p1VT,p2VT;var gradDef={Stops:aGradientDef.Stops};if(aGradientDef.Plane){var plane=aGradientDef.Plane;p1VT=this.Camera.Trans(plane.PointOnPlane(aGradientDef.X1,aGradientDef.Y1));p2VT=this.Camera.Trans(plane.PointOnPlane(aGradientDef.X2,aGradientDef.Y2));}else{p1VT=this.Camera.Trans(aGradientDef.P1);p2VT=this.Camera.Trans(aGradientDef.P2);}
gradDef.X1=p1VT[0];gradDef.Y1=p1VT[1];gradDef.X2=p2VT[0];gradDef.Y2=p2VT[1];var grad=this.CreateLinearGradient(gradDef);grad.Def3D=aGradientDef;return grad}
JsGraphX3D.prototype.SetLinearGradientGeom3D=function(aLinearGradient3D,aGeom){var p1VT,p2VT;var grad=aLinearGradient3D.Def3D;if(grad.Plane){var plane=grad.Plane;grad.X1=xDefNum(aGeom.X1,grad.X1);grad.Y1=xDefNum(aGeom.Y1,grad.Y1);grad.X2=xDefNum(aGeom.X2,grad.X2);grad.Y2=xDefNum(aGeom.Y2,grad.Y2);p1VT=this.Camera.Trans(plane.PointOnPlane(grad.X1,grad.Y1));p2VT=this.Camera.Trans(plane.PointOnPlane(grad.X2,grad.Y2));}else{grad.P1=xDefArray(aGeom.P1,grad.P1);grad.P2=xDefArray(aGeom.P2,grad.P2);p1VT=this.Camera.Trans(grad.P1);p2VT=this.Camera.Trans(grad.P2);}
this.SetLinearGradientGeom(aLinearGradient3D,{X1:p1VT[0],Y1:p1VT[1],X1:p2VT[0],Y1:p2VT[1]});}