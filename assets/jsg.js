// (C) http://walter.bislins.ch/doku/jsg

var JsgColor={RGB:function(r,g,b){return[r,g,b,1];},RGBA:function(r,g,b,a){return[r,g,b,a];},FromBitmap:function(c){return[c[0]/255,c[1]/255,c[2]/255,c[3]/255];},BW:function(v){return[v,v,v,1];},Black:function(){return[0,0,0,1];},White:function(){return[1,1,1,1];},Ok:function(col){return xArray(col);},Alpha:function(col){return xDefNum(col[3],1);},SetAlpha:function(col,a){col[3]=xDefNum(a,1);return col;},SetRGBA:function(col,r,g,b,a){col[0]=r;col[1]=g;col[2]=b;col[3]=a;return col;},SetRGB:function(col,r,g,b){col[0]=r;col[1]=g;col[2]=b;col[3]=1;return col;},SetBW:function(col,v){col[0]=v;col[1]=v;col[2]=v;col[3]=1;return col;},SetBlack:function(col){col[0]=0;col[1]=0;col[2]=0;col[3]=1;return col;},SetWhite:function(col){col[0]=1;col[1]=1;col[2]=1;col[3]=1;return col;},Copy:function(src){return[src[0],src[1],src[2],this.DefNum(src[3],1)];},CopyTo:function(src,dest){dest[0]=src[0];dest[1]=src[1];dest[2]=src[2];dest[3]=this.DefNum(src[3],1);return dest;},Set:function(dest,src){return this.CopyTo(src,dest);},IsEqual:function(col1,col2){return col1[0]==col2[0]&&col1[1]==col2[1]&&col1[2]==col2[2]&&col1[3]==col2[3];},IsSameColor:function(col1,col2){return col1[0]==col2[0]&&col1[1]==col2[1]&&col1[2]==col2[2];},Scale:function(col,s){col[0]*=s;col[1]*=s;col[2]*=s;return col;},Limit:function(col){limit=this.Limit01;col[0]=limit(col[0]);col[1]=limit(col[1]);col[2]=limit(col[2]);col[3]=limit(col[3]);},Add:function(col,add){col[0]+=add[0];col[1]+=add[1];col[2]+=add[2];return col;},Mult:function(col,mul){col[0]*=mul[0];col[1]*=mul[1];col[2]*=mul[2];return col;},Blend:function(colRet,col1,col2,val){var vali=1-val;for(var i=0;i<4;i++){colRet[i]=vali*col1[i]+val*col2[i];}
return colRet;},Combine:function(col1,col2){var a2=col2[3];var r2=a2*col2[0];var g2=a2*col2[1];var b2=a2*col2[2];var a1prime=1-col1[3];col1[0]+=r2*a1prime;col1[1]+=g2*a1prime;col1[2]+=b2*a1prime;col1[3]+=a2*a1prime;return col1;},ToString:function(col){function normCol(cx){cx=Math.round(cx*255);return(cx>255)?255:((cx<0)?0:cx);}
function toHex(cx){cx=normCol(cx);var hex=cx.toString(16);return cx<16?"0"+hex:hex;}
var a=normCol(this.DefNum(col[3],1));if(a==255){return'#'+toHex(col[0])+toHex(col[1])+toHex(col[2]);}else{return'rgba('
+normCol(col[0]).toFixed(0)+','
+normCol(col[1]).toFixed(0)+','
+normCol(col[2]).toFixed(0)+','
+(a/255).toFixed(3)+')';}},HSV:function(h,s,v,a){var Num=this.DefNum,Limit=this.Limit01;h=Limit(Num(h,1));s=Limit(Num(s,1));v=Limit(Num(v,1));a=Limit(Num(a,1));var r,g,b,hi;h*=6;hi=Math.floor(h)%6;h=h%1;switch(hi){case 0:r=1;g=h;b=0;break;case 1:r=1-h;g=1;b=0;break;case 2:r=0;g=1;b=h;break;case 3:r=0;g=1-h;b=1;break;case 4:r=h;g=0;b=1;break;default:r=1;g=0;b=1-h;}
r=v*(1-(1-r)*s);g=v*(1-(1-g)*s);b=v*(1-(1-b)*s);return[r,g,b,a];},HL:function(h,l,a){l=this.Limit01(this.DefNum(l,0.5));var s,v;if(l<0.5){s=1;v=2*l;}else{v=1;s=1-2*(l-0.5);}
return this.HSV(h,s,v,a);},DefNum:function(x,def){return(typeof(x)==='number')?x:def;},Limit01:function(x){return(x<0)?0:((x>1)?1:x);}};var JsgVect2={New:function(x,y){return[x,y];},Copy:function(v){return[v[0],v[1]];},CopyTo:function(v,to){to[0]=v[0];to[1]=v[1];},Set:function(v,x,y){if(xArray(x)){return this.Set(v,x[0],x[1]);}
v[0]=x;v[1]=y;return v;},Null:function(){return[0,0];},IsNull:function(v){return v[0]==0&&v[1]==0;},Ok:function(v){return xArray(v);},Scale:function(v,s){return[s*v[0],s*v[1]];},Add:function(v1,v2){return[v1[0]+v2[0],v1[1]+v2[1]];},Sub:function(v1,v2){return[v1[0]-v2[0],v1[1]-v2[1]];},Length:function(v){var x=v[0],y=v[1];return Math.sqrt(x*x+y*y);},Length2:function(x,y){return x*x+y*y;},Norm:function(v){var s=this.Length(v);if(s==0)s=1;return[v[0]/s,v[1]/s];},ScalarProd:function(v1,v2){return v1[0]*v2[0]+v1[1]*v2[1];},VectProd:function(u,v){return u[0]*v[1]-u[1]*v[0];},Rotate:function(v,ang){var c=Math.cos(ang);var s=Math.sin(ang);return[c*v[0]-s*v[1],s*v[0]+c*v[1]];},AngleAbs:function(u,v,norm){norm=xDefBool(norm,false);if(norm){u=this.Norm(u);v=this.Norm(v);}
var sp=this.ScalarProd(u,v);sp=(sp<-1)?-1:(sp>1)?1:sp;return Math.acos(sp);},Angle:function(u,v,norm){norm=xDefBool(norm,false);if(norm){u=this.Norm(u);v=this.Norm(v);}
var vp=this.VectProd(u,v);vp=(vp<-1)?-1:(vp>1)?1:vp;var sign=Math.asin(vp)<0?-1:1;var sp=this.ScalarProd(u,v);sp=(sp<-1)?-1:(sp>1)?1:sp;return sign*Math.acos(sp);},};var JsgMat2={Zero:function(){return[[0,0,0],[0,0,0]];},Unit:function(){return[[1,0,0],[0,1,0]];},Ok:function(mat){return xArray(mat);},Copy:function(m){return[[m[0][0],m[0][1],m[0][2]],[m[1][0],m[1][1],m[1][2]]];},CopyTo:function(src,dest){for(var row=0;row<2;row++){for(var col=0;col<3;col++){dest[row][col]=src[row][col];}}
return dest;},Set:function(dest,src){return this.CopyTo(src,dest);},RotatingToXY:function(x,y){var vl=Math.sqrt(x*x+y*y);if(vl==0){x=1;y=0;}else{x/=vl;y/=vl;}
return[[x,-y,0],[y,x,0]];},Transformation:function(sx,sy,rot,x,y){var cosRot=Math.cos(rot);var sinRot=Math.sin(rot);return[[cosRot*sx,-sinRot*sy,x],[sinRot*sx,cosRot*sy,y]];},Moving:function(x,y){return[[1,0,x],[0,1,y]];},Scaling:function(sx,sy){return[[sx,0,0],[0,sy,0]];},Rotating:function(ang){var c=Math.cos(ang);var s=Math.sin(ang);return[[c,-s,0],[s,c,0]];},Mult:function(matA,matB){r=this.Null();for(var i=0;i<2;i++){for(var j=0;j<2;j++){r[i][j]=matA[i][0]*matB[0][j]+matA[i][1]*matB[1][j];}
r[i][2]=matA[i][0]*matB[0][2]+matA[i][1]*matB[1][2]+matA[i][2];}
return r;},Move:function(mat,x,y){return this.Mult(mat,this.Moving(x,y));},Rotate:function(mat,ang){return this.Mult(mat,this.Rotating(ang));},Scale:function(mat,sx,sy){return this.Mult(mat,this.Scaling(sx,sy));},Trans:function(mat,v){var x=v[0]*mat[0][0]+v[1]*mat[0][1]+mat[0][2];v[1]=v[0]*mat[1][0]+v[1]*mat[1][1]+mat[1][2];v[0]=x;},TransPolyXY:function(mat,polyX,polyY,size){var l=xDefNum(size,polyX.length);for(var i=0;i<l;i++){var x=polyX[i]*mat[0][0]+polyY[i]*mat[0][1]+mat[0][2];polyY[i]=polyX[i]*mat[1][0]+polyY[i]*mat[1][1]+mat[1][2];polyX[i]=x;}},};function JsgRect(x,y,w,h){this.Set(x,y,w,h);}
JsgRect.prototype.SetPos=function(x,y){this.x=x;this.y=y;}
JsgRect.prototype.SetSize=function(w,h){this.w=w;this.h=h;}
JsgRect.prototype.Set=function(x,y,w,h){this.x=x;this.y=y;this.w=w;this.h=h;}
JsgRect.Ok=function(obj){return xDef(obj)&&xDef(obj.x)&&xDef(obj.w);};function JsgGradient(gradType,canvasGrad,gradDef){this.Type=gradType;this.CanvasGradient=canvasGrad;this.GradientDef=gradDef;}
JsgGradient.Ok=function(obj){return xObj(obj)&&xDef(obj.CanvasGradient);};function JsgPolygon(Type3D,owner){this._Owner=xDefStr(owner,'');this.Init(Type3D);}
JsgPolygon.prototype.Is3D=function(){return this.Z!=null;}
JsgPolygon.prototype.Init=function(Type3D){this.X=[];this.Y=[];this.Z=Type3D?[]:null;this.Size=0;return this;}
JsgPolygon.Ok=function(obj){return xObj(obj)&&xArray(obj.X);}
JsgPolygon.prototype.Reset=function(){this.Size=0;return this;}
JsgPolygon.prototype.IsEmpty=function(){return this.Size==0;}
JsgPolygon.prototype.GetFirstPoint3D=function(p){if(this.Size<0)return false;p[0]=this.X[0];p[1]=this.Y[0];p[2]=this.Z[0];return true;}
JsgPolygon.prototype.GetLastPoint3D=function(p){var last=this.Size-1;if(last<0)return false;p[0]=this.X[last];p[1]=this.Y[last];p[2]=this.Z[last];return true;}
JsgPolygon.prototype.AddPoint=function(x,y,z){this.X[this.Size]=x;this.Y[this.Size]=y;if(this.Z)this.Z[this.Size]=z;this.Size++
return this;}
JsgPolygon.prototype.AddPoint3D=function(p){this.X[this.Size]=p[0];this.Y[this.Size]=p[1];this.Z[this.Size]=p[2];this.Size++
return this;}
JsgPolygon.prototype.AddPoly=function(poly,offset){offset=xDefNum(offset,0);var xs=poly.X;var ys=poly.Y;var zs=poly.Z;var xd=this.X;var yd=this.Y;var zd=this.Z;var dSize=this.Size;var size=poly.Size;for(var i=offset;i<size;i++){xd[dSize]=xs[i];yd[dSize]=ys[i];if(zd)zd[dSize]=zs[i];dSize++;}
this.Size=dSize;return this;}
JsgPolygon.prototype.RemoveLastPoint=function(){this.Size--;if(this.Size<0)this.Size=0;return this;}
JsgPolygon.prototype.Close=function(){if(this.Size<2)return false;if(this.IsSamePoint(0,this,this.Size-1))return false;if(this.Z){this.AddPoint(this.X[0],this.Y[0],this.Z[0]);}else{this.AddPoint(this.X[0],this.Y[0]);}
return true;}
JsgPolygon.prototype.IsSamePoint=function(i,poly,j){if(this.Z){return this.X[i]==poly.X[j]&&this.Y[i]==poly.Y[j]&&this.Z[i]==poly.Z[j];}else{return this.X[i]==poly.X[j]&&this.Y[i]==poly.Y[j];}}
JsgPolygon.prototype.Copy=function(to,useNewArrays){to=to||new JsgPolygon(this.Is3D());if(useNewArrays)to.Init(this.Is3D);var toX=to.X
var toY=to.Y;var toZ=to.Z;var fromX=this.X;var fromY=this.Y;var fromZ=this.Z;var len=this.Size;for(var i=0;i<len;i++){toX[i]=fromX[i];toY[i]=fromY[i];if(fromZ)toZ[i]=fromZ[i];}
to.Size=len;return to;}
JsgPolygon.WorkArray=[];JsgPolygon.InvertArrays=function(xArr,yArr,zArr,size){function InvertArray(a){var last=Math.floor(size/2)-1;for(var i=0,j=size-1;i<=last;i++,j--){var tmp=a[i];a[i]=a[j];a[j]=tmp;}}
size=xDefNum(size,xArr.length);if(size<2)return;InvertArray(xArr);InvertArray(yArr);if(zArr)InvertArray(zArr);}
JsgPolygon.prototype.Invert=function(){JsgPolygon.InvertArrays(this.X,this.Y,this.Z,this.Size);}
JsgPolygon.RollArrays=function(xArr,yArr,zArr,n,size){function RollArray(a){var src=Math.abs(n)%size;if(n<0)src=size-src;var newArr=JsgPolygon.WorkArray;for(var dest=0;dest<size;dest++){newArr[dest]=a[src++];if(src>=size)src=0;}
for(var i=0;i<size;i++)a[i]=newArr[i];}
size=xDefNum(size,xArr.length);if(size<2)return;RollArray(xArr);RollArray(yArr);if(zArr)RollArray(zArr);}
JsgPolygon.prototype.Roll=function(n){JsgPolygon.RollArrays(this.X,this.Y,this.Z,n,this.Size);}
function JsgPolygonList(Type3D,owner){this._Owner=xDefStr(owner,'');this.PolyList=[];this.Size=0;this.CurrPoly=null;this.Type3D=xDefBool(Type3D,false);}
JsgPolygonList.Ok=function(obj){return xObj(obj)&&xArray(obj.PolyList);}
JsgPolygonList.prototype.Is3D=function(){return this.Type3D;}
JsgPolygonList.prototype.IsEmpty=function(){return this.Size==0||this.PolyList[0].IsEmpty();}
JsgPolygonList.prototype.Reset=function(){this.Size=0;this.CurrPoly=null;return this;}
JsgPolygonList.prototype.NewPoly=function(){if(this.PolyList.length>this.Size){this.PolyList[this.Size].Reset();}else{this.PolyList[this.Size]=new JsgPolygon(this.Type3D);}
this.CurrPoly=this.PolyList[this.Size];this.Size++;return this;}
JsgPolygonList.prototype.GetLastPoly=function(){return this.PolyList[this.Size-1];}
JsgPolygonList.prototype.GetFirstPoly=function(){return this.PolyList[0];}
JsgPolygonList.prototype.GetFirstPoint3D=function(p){if(this.Size==0)return false;return this.PolyList[this.Size-1].GetFirstPoint3D(p);}
JsgPolygonList.prototype.GetLastPoint3D=function(p){if(this.Size==0)return false;return this.PolyList[this.Size-1].GetLastPoint3D(p);}
JsgPolygonList.prototype.AddPoint=function(x,y,z){this.CurrPoly.AddPoint(x,y,z);return this;}
JsgPolygonList.prototype.AddPoint3D=function(p){this.CurrPoly.AddPoint3D(p);return this;}
JsgPolygonList.prototype.AddPoly=function(polys,appendMode){appendMode=xDefNum(appendMode,0);if(!JsgPolygonList.Ok(polys))return this.AddSinglePoly(polys,appendMode);var n=polys.Size;for(var i=0;i<n;i++){this.AddSinglePoly(polys.PolyList[i],appendMode);}
return this;}
JsgPolygonList.prototype.AddSinglePoly=function(poly,appendMode){if(appendMode==0){this.NewPoly();this.CurrPoly.AddPoly(poly,0);}else{var offset=0;if(this.Size==0){this.NewPoly();}else{var currPoly=this.CurrPoly;if(poly.Size>0&&currPoly.Size>0&&poly.IsSamePoint(0,currPoly,currPoly.Size-1)){offset=1;}else if(appendMode==1){this.NewPoly();}}
this.CurrPoly.AddPoly(poly,offset);}
return this;}
JsgPolygonList.prototype.RemoveLastPoint=function(){this.PolyList[this.Size-1].RemoveLastPoint();}
JsgPolygonList.prototype.Close=function(){if(this.Size==0)return false;var firstPoly=this.PolyList[0];var lastPoly=this.PolyList[this.Size-1];if(firstPoly.Size<1||lastPoly.Size<1)return false;if(firstPoly.IsSamePoint(0,lastPoly,lastPoly.Size-1))return false;if(this.Type3D){lastPoly.AddPoint(firstPoly.X[0],firstPoly.Y[0],firstPoly.Z[0]);}else{lastPoly.AddPoint(firstPoly.X[0],firstPoly.Y[0]);}
return true;}
function JsgSnapshot(sx,sy,sw,sh,srcCanvas){this.x=sx;this.y=sy;this.w=sw;this.h=sh;this.ImageData=null;var buffer=xCreateElement('canvas');if(buffer){buffer.width=sw;buffer.height=sh;buffer.getContext('2d').drawImage(srcCanvas,sx,sy,sw,sh,0,0,sw,sh);this.ImageData=buffer;}}
function JsgTrans(aTransName){this.Name=aTransName;this.x=0;this.y=0;this.x1=0;this.y1=0;this.x2=0;this.y2=0;this.Reset();}
JsgTrans.prototype.Reset=function(){this.Xmin=0;this.Ymin=0;this.Width=1;this.Height=1;this.ScaleX=1;this.ScaleY=1;this.OffsetX=0;this.OffsetY=0;}
JsgTrans.prototype.TransX=function(x){return x*this.ScaleX+this.OffsetX;}
JsgTrans.prototype.TransY=function(y){return y*this.ScaleY+this.OffsetY;}
JsgTrans.prototype.TransXY=function(x,y){this.x=x*this.ScaleX+this.OffsetX;this.y=y*this.ScaleY+this.OffsetY;}
JsgTrans.prototype.ObjTransXY=function(otr,x,y){if(otr){otr.TransXY(x,y);this.x=otr.x*this.ScaleX+this.OffsetX;this.y=otr.y*this.ScaleY+this.OffsetY;}else{this.x=x*this.ScaleX+this.OffsetX;this.y=y*this.ScaleY+this.OffsetY;}}
JsgTrans.prototype.ObjTransXY2=function(otr,x1,y1,x2,y2){if(otr){otr.TransXY2(x1,y1,x2,y2);this.x1=otr.x1*this.ScaleX+this.OffsetX;this.y1=otr.y1*this.ScaleY+this.OffsetY;this.x2=otr.x2*this.ScaleX+this.OffsetX;this.y2=otr.y2*this.ScaleY+this.OffsetY;}else{this.x1=x1*this.ScaleX+this.OffsetX;this.y1=y1*this.ScaleY+this.OffsetY;this.x2=x2*this.ScaleX+this.OffsetX;this.y2=y2*this.ScaleY+this.OffsetY;}}
JsgTrans.prototype.InvTransX=function(x){return(x-this.OffsetX)/this.ScaleX;}
JsgTrans.prototype.InvTransY=function(y){return(y-this.OffsetY)/this.ScaleY;}
function JsgTrans2D(aTrans2D){this.x=0;this.y=0;this.x1=0;this.y1=0;this.x2=0;this.y2=0;if(xDef(aTrans2D)){this.CopyFrom(aTrans2D);}else{this.Reset();}}
JsgTrans2D.prototype.Reset=function(){this.a00=1;this.a01=0;this.a02=0;this.a10=0;this.a11=1;this.a12=0;this.IsMoveOnly=true;this.IsUnitTrans=true;this.Enabled=true;}
JsgTrans2D.prototype.Enable=function(aFlag){var old=this.Enabled;this.Enabled=aFlag;return old;}
JsgTrans2D.prototype.CheckTransType=function(){this.IsMoveOnly=(this.a00==1&&this.a01==0&&this.a10==0&&this.a11==1);this.IsUnitTrans=(this.IsMoveOnly&&this.a02==0&&this.a12==0);}
JsgTrans2D.prototype.SetTrans=function(mat){this.a00=mat[0][0];this.a01=mat[0][1];this.a02=mat[0][2];this.a10=mat[1][0];this.a11=mat[1][1];this.a12=mat[1][2];this.CheckTransType();}
JsgTrans2D.prototype.GetTrans=function(){return[[this.a00,this.a01,this.a02],[this.a10,this.a11,this.a12]];}
JsgTrans2D.prototype.Copy=function(){return new JsgTrans2D(this);}
JsgTrans2D.prototype.CopyFrom=function(aTrans2D){this.a00=aTrans2D.a00;this.a01=aTrans2D.a01;this.a02=aTrans2D.a02;this.a10=aTrans2D.a10;this.a11=aTrans2D.a11;this.a12=aTrans2D.a12;this.IsMoveOnly=aTrans2D.IsMoveOnly;this.IsUnitTrans=aTrans2D.IsUnitTrans;this.Enabled=aTrans2D.Enabled;}
JsgTrans2D.prototype.AddTrans=function(mat){var c00,c01,c02,c10,c11,c12
if(xArray(mat)){c00=mat[0][0]*this.a00+mat[0][1]*this.a10;c01=mat[0][0]*this.a01+mat[0][1]*this.a11;c02=mat[0][0]*this.a02+mat[0][1]*this.a12+mat[0][2];c10=mat[1][0]*this.a00+mat[1][1]*this.a10;c11=mat[1][0]*this.a01+mat[1][1]*this.a11;c12=mat[1][0]*this.a02+mat[1][1]*this.a12+mat[1][2];}else{c00=mat.a00*this.a00+mat.a01*this.a10;c01=mat.a00*this.a01+mat.a01*this.a11;c02=mat.a00*this.a02+mat.a01*this.a12+mat.a02;c10=mat.a10*this.a00+mat.a11*this.a10;c11=mat.a10*this.a01+mat.a11*this.a11;c12=mat.a10*this.a02+mat.a11*this.a12+mat.a12;}
this.a00=c00;this.a01=c01;this.a02=c02;this.a10=c10;this.a11=c11;this.a12=c12;this.CheckTransType();}
JsgTrans2D.prototype.Move=function(x,y){this.a02+=x;this.a12+=y;this.CheckTransType();}
JsgTrans2D.prototype.Scale=function(sx,sy){this.a00*=sx;this.a01*=sx;this.a02*=sx;this.a10*=sy;this.a11*=sy;this.a12*=sy;this.CheckTransType();}
JsgTrans2D.prototype.Rotate=function(ang){var cosa=Math.cos(ang);var sina=Math.sin(ang);var c=[[cosa,-sina,0],[sina,cosa,0]];this.AddTrans(c);}
JsgTrans2D.prototype.TransX=function(x,y){if(this.IsUnitTrans||!this.Enabled)return x;if(this.IsMoveOnly)return x+this.a02;return this.a00*x+this.a01*y+this.a02;}
JsgTrans2D.prototype.TransY=function(x,y){if(this.IsUnitTrans||!this.Enabled)return y;if(this.IsMoveOnly)return y+this.a12;return this.a10*x+this.a11*y+this.a12;}
JsgTrans2D.prototype.TransXY=function(x,y){this.x=x;this.y=y;if(this.IsUnitTrans||!this.Enabled)return;if(this.IsMoveOnly){this.x+=this.a02;this.y+=this.a12;return;}
this.x=this.a00*x+this.a01*y+this.a02;this.y=this.a10*x+this.a11*y+this.a12;}
JsgTrans2D.prototype.TransXY2=function(x1,y1,x2,y2){this.x1=x1;this.y1=y1;this.x2=x2;this.y2=y2;if(this.IsUnitTrans||!this.Enabled)return;if(this.IsMoveOnly){this.x1+=this.a02;this.y1+=this.a12;this.x2+=this.a02;this.y2+=this.a12;return;}
this.x1=this.a00*x1+this.a01*y1+this.a02;this.y1=this.a10*x1+this.a11*y1+this.a12;this.x2=this.a00*x2+this.a01*y2+this.a02;this.y2=this.a10*x2+this.a11*y2+this.a12;}
JsgTrans2D.prototype.MaxScaling=function(){var abs=Math.abs;var t1=abs(this.a00)+abs(this.a01);var t2=abs(this.a10)+abs(this.a11);return Math.sqrt((t1*t1+t2*t2)/2);}
function JsgAttrs(aGraph){this.ScaleRef=aGraph.ScaleRef;this.LimitScalePix=aGraph.LimitScalePix;this.AutoScalePix=aGraph.AutoScalePix;this.ScalePixInt=aGraph.ScalePixInt;this.ObjTrans=aGraph.ObjTrans.Copy();this.Trans=aGraph.Trans;this.AngleMeasure=aGraph.AngleMeasure;this.Alpha=aGraph.Alpha;this.LineJoin=aGraph.LineJoin;this.LineCap=aGraph.LineCap;this.Color=aGraph.Color;this.BgColor=aGraph.BgColor;this.BgGradient=aGraph.BgGradient;this.LineWidth=aGraph.LineWidth;this.MarkerSymbol=aGraph.MarkerSymbol;this.MarkerSize=aGraph.MarkerSize;this.TextRendering=aGraph.TextRendering;this.TextClass=aGraph.TextClass;this.TextFont=aGraph.TextFont;this.TextSize=aGraph.TextSize;this.TextRitation=aGraph.TextRotation;this.TextColor=aGraph.TextColor;this.FontStyle=aGraph.FontStyle;this.FontWeight=aGraph.FontWeight;this.TextHAlign=aGraph.TextHAlign;this.TextVAlign=aGraph.TextVAlign;this.TextHPad=aGraph.TextHPad;this.TextVPad=aGraph.TextVPad;this.LineHeight=aGraph.LineHeight;this.CurvePrecision=aGraph.CurvePrecision;}
function NewGraph2D(aParams){return new JsGraph(aParams);}
function JsGraph(aParams){aParams=xDefObj(aParams,{});this.HighResolution=xDefBool(aParams.HighResolution,true);this.HighResSet=false;this.DevicePixelRatio=1;this.CanvasPixelRatio=1;this.PixelRatio=1;this.LastPixelRatio=0;this.InitInternals();this.MakeMarkers();this.CreateCanvas(aParams);if(xNum(aParams.ScaleRef))this.ScaleRef=aParams.ScaleRef;if(xBool(aParams.AutoScalePix))this.AutoScalePix=aParams.AutoScalePix;if(xBool(aParams.LimitScalePix))this.LimitScalePix=aParams.LimitScalePix;if(xBool(aParams.ScalePixInt))this.ScalePixInt=aParams.ScalePixInt;if(xNum(aParams.MinLineWidth))this.MinLineWidth=this.MinSize(aParams.MinLineWidth,0);if(xNum(aParams.MinTextSize))this.MinTextSize=this.MinSize(aParams.MinTextSize,0);if(xNum(aParams.MinMarkerSize))this.MinMarkerSize=this.MinSize(aParams.MinMarkerSize,0);if(xAny(aParams.DefaultAttrs))this.SetAttrs(aParams.DefaultAttrs);if(xStr(aParams.TextRendering))this.SetTextRendering(aParams.TextRendering);this.DeferedDrawTime=xDefNum(aParams.DeferedDrawTime,50);this.AutoReset=xDefBool(aParams.AutoReset,true);this.AutoClear=xDefBool(aParams.AutoClear,true);this.AutoRedrawOnImgLoad=xDefBool(aParams.AutoRedrawOnImgLoad,true);this.ClientResetFunc=null;var me=this;this.OnResizeFunc=function CB_OnTimeout_CheckWindowResize(){me.CheckResizeRegularly();};this.OnDrawFunc=function CB_OnTimeout_Draw(){me.Draw();};this.OnDeferedDrawFunc=function CB_OnTimeout_DeferedDraw(){me.DeferedDraw();};if(xFunc(aParams.OnClick)){this.EventHandlers.push({Event:'click',Func:aParams.OnClick,Capture:false});}
if(xArray(aParams.EventHandlers)){var handlers=aParams.EventHandlers
for(var i=0;i<handlers.length;i++){var handler=handlers[i];if(xStr(handler.Event)&&xFunc(handler.Func))this.EventHandlers.push(handler);}}
if(this.EventHandlers.length>0){xOnDomReady(function CB_InstallEventHandlers(){var nHandlers=me.EventHandlers.length;for(var i=0;i<nHandlers;i++){var handler=me.EventHandlers[i];me.AddEventHandler(handler.Event,handler.Func,handler.Capture);}
me.EventHandlers=[];});}
this.SaveAttrs();this.SaveDefaultAttrs();this.SetDriverAttrs();this.InitResizeCheck();this.CheckResizeRegularly();this.DrawPending++;if(xFunc(aParams.DrawFunc))this.SetDrawFunc(aParams.DrawFunc);if(xFunc(aParams.DeferedDrawFunc))this.SetDeferedDrawFunc(aParams.DeferedDrawFunc);if(xFunc(aParams.BeforeResetFunc))this.SetBeforeResetFunc(aParams.BeforeResetFunc);}
JsGraph.prototype.InitInternals=function(){this.LastX=0.0;this.LastY=0.0;this.BorderWidth=0;this.CanvasWidth=0;this.CanvasHeight=0;this.CanvasRatioHW=0.0;this.VpXmin=0;this.VpYmin=0;this.VpWidth=0;this.VpHeight=0;this.VpInnerWidth=0;this.VpInnerHeight=0;this.WinXmin=0.0;this.WinXmax=-1;this.WinYmin=0.0;this.WinYmax=-1;this.WinWidth=-1;this.WinHeight=-1;this.ObjTrans=new JsgTrans2D();this.ObjTransStack=[];this.ContextScale=1;this.Trans='window';this.AngleMeasure='deg';this.CanvasTrans=new JsgTrans('canvas');this.VpTrans=new JsgTrans('viewport');this.WinTrans=new JsgTrans('window');this.CurrTrans=this.WinTrans;this.TransByName={canvas:this.CanvasTrans,viewport:this.VpTrans,window:this.WinTrans};this.GraphClipEnabled=false;this.GraphClipExtend=1;this.GraphClipMargin=1;this.GraphClipInnerXmin=0;this.GraphClipInnerXmax=0;this.GraphClipInnerYmin=0;this.GraphClipInnerYmax=0;this.GraphClipOuterXmin=0;this.GraphClipOuterXmax=0;this.GraphClipOuterYmin=0;this.GraphClipOuterYmax=0;this.DrawFunc=null;this.DeferedDrawFunc=null;this.BeforeResetFunc=null;this.Snapshots=[];this.Poly=new JsgPolygon(false,'JsGraph.Poly');this.WorkPoly=new JsgPolygon(false,'JsGraph.WorkPoly');this.WorkPoly2=new JsgPolygon(false,'JsGraph.WorkPoly2');this.WorkPolyMarker=new JsgPolygon(false,'JsGraph.Marker');this.WorkRect=new JsgRect(0,0,0,0);this.EventHandlers=[];this.Alpha=1;this.Color='black';this.BgColor='white';this.BgGradient=null;this.LineWidth=1;this.MarkerSymbol='Circle';this.MarkerSize=8;this.DriverMarkerSize=8;this.TextRendering='canvas';this.TextCanvasRendering=true;this.TextClass='';this.TextFont='Arial';this.TextSize=15;this.TextRotation=0;this.CanvasFontSize=15;this.CTextCurrFontVers=0;this.CTextLastFontVers=-1;this.TextColor='black';this.FontStyle='normal';this.FontWeight='normal';this.TextHAlign='center';this.TextVAlign='middle';this.TextHPad=0;this.TextVPad=0;this.CanvasTextHPad=0;this.CanvasTextVPad=0;this.LineHeight=0;this.CanvasLineHeight=0;this.LineJoin='round';this.LineCap='butt';this.ScaleRef=800;this.AutoScalePix=false;this.LimitScalePix=true;this.ScalePixInt=false;this.MinLineWidth=0.01;this.MinTextSize=1;this.MinMarkerSize=1;this.CurvePrecision=0.25;this.MaxCurveSegments=1024;this.NumBezierSegments=64;this.DisableNativeArc=false;this.DisableNativeBezier=false;this.SavedAttrs=null;this.SavedDefaultAttrs=null;this.PenDown=false;this.IsPathOpen=false;this.CurrPath=[];this.CurrPathSize=0;this.CommonPathElePool=[];this.CommonPathElePoolSize=0;this.ArcPathElePool=[];this.ArcPathElePoolSize=0;this.BezierPathElePool=[];this.BezierPathElePoolSize=0;this.ContainerDiv=null;this.ClippingDiv=null;this.Canvas=null;this.Context2D=null;this.HtmlTextHandler=null;this.IsResettingAll=false;this.DrawTime=50;this.ResizeTimer=null;this.DrawTimer=null;this.DeferedDrawTimer=null;this.LastContWidthDrawn=0;this.LastContWidth=0;this.LastPixelRatioDrawn=0;this.LastPixelRatioOnResize=0;this.LastCanvasWidth=0;this.DrawingCount=0;this.DrawPending=0;}
JsGraph.prototype.SetDriverAttrs=function(){this.SetLineAttr(this.Color,this.LineWidth);this.SetBgColor(this.BgColor);this.SetTextRendering(this.TextRendering);this.SetTextClass('');this.SetTextAttr(this.TextFont,this.TextSize,this.TextColor,this.FontWeight,this.FontStyle,this.TextHAlign,this.TextVAlign,this.TextHPad,this.TextVPad,this.TextRotation);this.SetLineHeight(this.LineHeight);this.SetLineJoin(this.LineJoin);this.SetLineCap(this.LineCap);}
JsGraph.prototype.IdCounter=0;JsGraph.prototype.CreateCanvas=function(aParams){JsGraph.prototype.IdCounter++;if(xStr(aParams.Id)){this.Id=aParams.Id;}else{this.Id='JsGraph'+JsGraph.prototype.IdCounter;}
this.BorderWidth=xDefNum(aParams.BorderWidth,1);this.CreateDomObjects(aParams);this.Context2D=this.Canvas.getContext('2d');this.HtmlTextHandler=new JsgHtmlTextHandler(this.ClippingDiv,this.Canvas,this.Context2D);this.Context2D.save();this.UpdateCanvasSize();this.SetViewport();}
JsGraph.prototype.CreateDomObjects=function(aParams){var width,height;var borderColor=xDefStr(aParams.BorderColor,'');if(borderColor!='')borderColor='border-color:'+borderColor+';';var cssContainer='bdBoxSizing';var cssClippingBox='';var cssCanvas='';var cssDefault=xDefStr(aParams.GraphClass,'JsGraph');cssContainer=this.AddCssClass(cssContainer,cssDefault);cssClippingBox=this.AddCssClass(cssClippingBox,cssDefault+'-ClippingBox');cssCanvas=this.AddCssClass(cssCanvas,cssDefault+'-Canvas');if(xStr(aParams.GraphFormat))cssContainer=this.AddCssClass(cssContainer,aParams.GraphFormat);if(cssContainer!=='')cssContainer=' class="'+cssContainer+'"';if(cssClippingBox!=='')cssClippingBox=' class="'+cssClippingBox+'"';if(cssCanvas!=='')cssCanvas=' class="'+cssCanvas+'"';var reqWidth='100%';var reqHeight='75%';if(xIsNumeric(aParams.Width)||this.IsNumericPercent(aParams.Width))reqWidth=aParams.Width;if(xIsNumeric(aParams.Height)||this.IsNumericPercent(aParams.Height))reqHeight=aParams.Height;var commonStyle='margin:0;padding:0;';var noborderStyle='border:none;';if(this.IsNumericPercent(reqWidth)){var containerStyle='width:'+reqWidth+';height:100%;'+'border-width:'+this.BorderWidth+'px;padding:0;'+borderColor;var clippingBoxStyle='width:100%;height:100%;font-size:0;line-height:0;overflow:hidden;'+commonStyle+noborderStyle;var canvasStyle=commonStyle+noborderStyle;if(containerStyle!='')containerStyle=' style="'+containerStyle+'"';if(clippingBoxStyle!='')clippingBoxStyle=' style="'+clippingBoxStyle+'"';if(canvasStyle!='')canvasStyle=' style="'+canvasStyle+'"';var s='<div id="'+this.Id+'"'+cssContainer+containerStyle+'>';s+='<div id="'+this.Id+'-ClippingBox"'+cssClippingBox+clippingBoxStyle+'>';s+='<canvas id="'+this.Id+'-Canvas"'+cssCanvas+canvasStyle+'></canvas>';s+='</div></div>';var _jm=document.getElementById('jsg-canvas-mount');if(_jm){_jm.outerHTML=s;}else{document.body.insertAdjacentHTML('afterbegin',s);}this.ContainerDiv=xGet(this.Id);this.ClippingDiv=xGet(this.Id+'-ClippingBox');this.Canvas=xGet(this.Id+'-Canvas');this.LastContWidth=xWidth(this.ContainerDiv);width=this.LastContWidth-2*this.BorderWidth;height=this.ParseHWInt(reqHeight,width);this.CanvasRatioHW=height/width;this.Canvas.width=width;this.Canvas.height=height;}else{width=this.ParseHWInt(reqWidth);height=this.ParseHWInt(reqHeight,width);var containerStyle='width:'+width+'px;'+'border-width:'+this.BorderWidth+'px;padding:0;'+borderColor;width-=2*this.BorderWidth;height-=2*this.BorderWidth;var clippingBoxStyle='width:'+width+'px;height:'+height+'px;font-size:0;line-height:0;overflow:hidden;'+commonStyle+noborderStyle;var canvasStyle=commonStyle+noborderStyle;if(containerStyle!='')containerStyle=' style="'+containerStyle+'"';if(clippingBoxStyle!='')clippingBoxStyle=' style="'+clippingBoxStyle+'"';if(canvasStyle!='')canvasStyle=' style="'+canvasStyle+'"';var s='<div id="'+this.Id+'"'+cssContainer+containerStyle+'>';s+='<div id="'+this.Id+'-ClippingBox"'+cssClippingBox+clippingBoxStyle+'>';s+='<canvas id="'+this.Id+'-Canvas" width="'+width+'px" height="'+height+'px"'+cssCanvas+canvasStyle+'></canvas>';s+='</div></div>';var _jm2=document.getElementById('jsg-canvas-mount');if(_jm2){_jm2.outerHTML=s;}else{document.body.insertAdjacentHTML('afterbegin',s);}this.ContainerDiv=xGet(this.Id);this.ClippingDiv=xGet(this.Id+'-ClippingBox');this.Canvas=xGet(this.Id+'-Canvas');}
var clippingDiv=this.ClippingDiv;var canvas=this.Canvas;if(!clippingDiv.style.position)clippingDiv.style.position='relative';canvas.style.position='absolute';canvas.style.top=0;canvas.style.left=0;canvas.style.margin=0;canvas.style.padding=0;}
JsGraph.prototype.AddEventHandler=function(aEventType,aEventHandler,aCapture){if(!xFunc(aEventHandler))return;var me=this;xAddEvent(this.Canvas,aEventType,function CB_Call_EventHandler(evnt){aEventHandler(evnt,me);},xDefBool(aCapture,false));}
JsGraph.prototype.Redraw=function(){this.Draw();}
JsGraph.prototype.SetDrawFunc=function(aDrawFunc,bDrawNow){this.DrawFunc=xDefAnyOrNull(aDrawFunc,null);if(aDrawFunc&&(this.DrawPending||bDrawNow)){this.QueueDraw();}}
JsGraph.prototype.SetDeferedDrawFunc=function(aDrawFunc){if(this.DeferedDrawTimer){clearTimeout(this.DeferedDrawTimer);this.DeferedDrawTimer=null;}
this.DeferedDrawFunc=xDefAnyOrNull(aDrawFunc,null);}
JsGraph.prototype.SetBeforeResetFunc=function(aBeforeClearFunc){this.BeforeResetFunc=xDefFunc(aBeforeClearFunc,null);}
JsGraph.prototype.BeginDrawing=function(){if(this.DrawingCount==0){this.DrawPending=0;}
this.DrawingCount++;}
JsGraph.prototype.EndDrawing=function(bEndAll){if(bEndAll){this.DrawingCount=1;}
this.DrawingCount--;if(this.DrawingCount<0){this.DrawingCount=0;}
if(this.DrawingCount==0&&this.DrawPending){this.QueueDraw();}}
JsGraph.prototype.CancelPendingDraws=function(){if(this.DrawTimer){clearTimeout(this.DrawTimer);this.DrawTimer=null;}
if(this.DeferedDrawTimer){clearTimeout(this.DeferedDrawTimer);this.DeferedDrawTimer=null;}
this.DrawPending=0;}
JsGraph.prototype.QueueDraw=function(){if(this.DrawTimer){clearTimeout(this.DrawTimer);this.DrawTimer=null;}
if(this.DeferedDrawTimer){clearTimeout(this.DeferedDrawTimer);this.DeferedDrawTimer=null;}
if(this.DrawFunc){this.DrawTimer=setTimeout(this.OnDrawFunc,50);}}
JsGraph.prototype.Draw=function(){if(this.DrawTimer){clearTimeout(this.DrawTimer);this.DrawTimer=null;}
if(this.DeferedDrawTimer){clearTimeout(this.DeferedDrawTimer);this.DeferedDrawTimer=null;}
if(!this.DrawFunc)return;if(!xOnLoadFinished){this.QueueDraw();return;}
if(this.IsDrawing()){if(this.DrawPending==0)this.DrawPending++;this.QueueDraw();return;}
if(this.BeforeResetFunc){try{this.BeforeResetFunc(this);}
catch(err){}}
if(this.AutoReset){this.Reset(this.AutoClear);if(this.ClientResetFunc){try{this.ClientResetFunc(this);}
catch(err){}}}
this.BeginDrawing();try{this.DrawFunc(this);}catch(err){}
this.EndDrawing();if(this.DeferedDrawFunc){this.DeferedDrawTimer=setTimeout(this.OnDeferedDrawFunc,this.DeferedDrawTime);}}
JsGraph.prototype.DeferedDraw=function(){if(this.DeferedDrawTimer){clearTimeout(this.DeferedDrawTimer);this.DeferedDrawTimer=null;}
if(!this.DeferedDrawFunc||this.IsDrawing())return;this.BeginDrawing();try{this.DeferedDrawFunc(this);}catch(err){}
this.EndDrawing();}
JsGraph.prototype.IsDrawing=function(){return this.DrawingCount;}
JsGraph.prototype.IsDrawPending=function(){return this.DrawPending;}
JsGraph.prototype.IsInvalidDrawing=function(){return(this.DrawPending>0)&&(this.DrawFunc);}
JsGraph.prototype.InitResizeCheck=function(){if(!this.ContainerDiv)return;this.LastContWidthDrawn=xWidth(this.ContainerDiv);this.LastPixelRatioDrawn=this.PixelRatio;this.LastPixelRatioOnResize=this.PixelRatio;}
JsGraph.prototype.CheckResizeRegularly=function(){if(this.ResizeTimer){clearTimeout(this.ResizeTimer);this.ResizeTimer=null;}
if(!this.ContainerDiv)return;this.UpdatePixelRatios();var width=xWidth(this.ContainerDiv);if(width!=this.LastContWidth||this.LastPixelRatioOnResize!=this.PixelRatio){this.LastContWidth=width;this.LastPixelRatioOnResize=this.PixelRatio;}else{if(this.LastContWidthDrawn!=width||this.LastPixelRatioDrawn!=this.PixelRatio){this.UpdateCanvasSize(width);this.DeleteSnapshots();this.DrawPending++;this.QueueDraw();this.LastContWidthDrawn=width;this.LastPixelRatioDrawn=this.PixelRatio;}}
this.ResizeTimer=setTimeout(this.OnResizeFunc,this.DrawTime);}
JsGraph.prototype.Reset=function(clear){clear=xDefBool(clear,true);this.IsResettingAll=true;this.LastX=0.0;this.LastY=0.0;this.PenDown=false;this.IsPathOpen=false;this.CurrPathSize=0;this.ObjTrans.Reset();this.ObjTransStack=[];this.Trans='window';this.CanvasTrans.Reset();this.VpTrans.Reset();this.WinTrans.Reset();this.CurrTrans=this.WinTrans;this.UpdateCanvasTrans();this.SetViewport();this.SetGraphClipping(false,'canvas');this.ResetAttrs();if(clear)this.Clear();this.IsResettingAll=false;}
JsGraph.prototype.UpdateCanvasTrans=function(){this.CanvasTrans.Width=this.CanvasWidth;this.CanvasTrans.Height=this.CanvasHeight;}
JsGraph.prototype.GetObjTrans=function(){var otr=this.ObjTrans;return(!otr.IsUnitTrans&&otr.Enabled)?otr:null;}
JsGraph.prototype.IsNumericPercent=function(x){if(!xStr(x)||x==='')return false;var p=x.lastIndexOf('%');if(p!==x.length-1)return false;x=x.substr(0,p);if(!xIsNumeric(x))return false;return true;}
JsGraph.prototype.ParseHWInt=function(h,w){var result;if(xDef(w)&&this.IsNumericPercent(h)){result=w*(parseFloat(h)/100.0);}else if(xStr(h)){result=parseFloat(h);}else{result=h;}
result=Math.round(result);if(result<=0)retult=1;return result;}
JsGraph.prototype.AddCssClass=function(css,addCss){if(addCss==='')return css;if(css!=='')css+=' ';return css+addCss;}
JsGraph.prototype.SetHighResolution=function(aOnOff){var old=this.HighResolution;aOnOff=xDefBool(aOnOff,true);if(aOnOff==old)return old;this.HighResolution=aOnOff;this.HighResSet=false;this.UpdateCanvasSize();return old;}
JsGraph.prototype.AdjustForHighResolutionDisplays=function(){var context=this.Context2D;var canvas=this.Canvas;if(this.HighResolution&&this.DevicePixelRatio!==this.CanvasPixelRatio){var ratio=this.PixelRatio;var oldWidth=this.CanvasWidth;var oldHeight=this.CanvasHeight;if(canvas.width!=oldWidth*ratio){canvas.width=oldWidth*ratio;canvas.height=oldHeight*ratio;}
xStyle(canvas,'width',oldWidth+'px');xStyle(canvas,'height',oldHeight+'px');}else{var ratio=1;var width=this.CanvasWidth;var height=this.CanvasHeight;if(canvas.width!=width){canvas.width=width;canvas.height=height;}
xStyle(canvas,'width',width+'px');xStyle(canvas,'height',height+'px');}
context.setTransform(1,0,0,1,0,0);context.scale(ratio,ratio);this.ContextScale=ratio;this.HighResSet=true;this.LastPixelRatio=this.PixelRatio;}
JsGraph.prototype.UpdatePixelRatios=function(){var context=this.Context2D;this.DevicePixelRatio=window.devicePixelRatio||1;this.CanvasPixelRatio=context.webkitBackingStorePixelRatio||context.mozBackingStorePixelRatio||context.msBackingStorePixelRatio||context.oBackingStorePixelRatio||context.backingStorePixelRatio||1;this.PixelRatio=this.DevicePixelRatio/this.CanvasPixelRatio;}
JsGraph.prototype.UpdateCanvasSize=function(aContainerWidth){if(!this.ContainerDiv)return;if(!xDef(aContainerWidth))aContainerWidth=xWidth(this.ContainerDiv);this.UpdatePixelRatios();if(this.CanvasRatioHW==0){this.CanvasWidth=aContainerWidth-2*this.BorderWidth;this.CanvasHeight=xHeight(this.ContainerDiv)-2*this.BorderWidth;if(!this.HighResSet||this.PixelRatio!=this.LastPixelRatio){this.AdjustForHighResolutionDisplays();}}else{var width=aContainerWidth-2*this.BorderWidth;if(this.LastCanvasWidth==width&&this.PixelRatio==this.LastPixelRatio){if(!this.HighResSet){this.AdjustForHighResolutionDisplays();}
return;}
var height=width*this.CanvasRatioHW;xHeight(this.ContainerDiv,height+2*this.BorderWidth,true);this.CanvasWidth=width;this.CanvasHeight=height;this.LastCanvasWidth=width;this.AdjustForHighResolutionDisplays();}
this.UpdateCanvasTrans();this.UpdateGraphClipOuterRange();}
JsGraph.prototype.UpdateGraphClipOuterRange=function(){if(this.GraphClipExtend>=0){var xExtend=this.CanvasWidth*this.GraphClipExtend;if(xExtend<this.GraphClipMargin)xExtend=this.GraphClipMargin;var yExtend=this.CanvasHeight*this.GraphClipExtend;if(yExtend<this.GraphClipMargin)yExtend=this.GraphClipMargin;this.GraphClipOuterXmin=-xExtend;this.GraphClipOuterXmax=this.CanvasWidth+xExtend;this.GraphClipOuterYmin=-yExtend;this.GraphClipOuterYmax=this.CanvasHeight+yExtend;}else{var xExtend=-this.CanvasWidth*this.GraphClipExtend/2;if(xExtend<this.GraphClipMargin)xExtend=this.GraphClipMargin;var yExtend=-this.CanvasHeight*this.GraphClipExtend/2;if(yExtend<this.GraphClipMargin)yExtend=this.GraphClipMargin;this.GraphClipInnerXmin=xExtend;this.GraphClipInnerXmax=this.CanvasWidth-xExtend;this.GraphClipInnerYmin=yExtend;this.GraphClipInnerYmax=this.CanvasHeight-yExtend;xExtend*=0.8;yExtend*=0.8;this.GraphClipOuterXmin=xExtend;this.GraphClipOuterXmax=this.CanvasWidth-xExtend;this.GraphClipOuterYmin=yExtend;this.GraphClipOuterYmax=this.CanvasHeight-yExtend;}}
JsGraph.prototype.Clear=function(){this.Context2D.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);this.HtmlTextHandler.Clear();}
JsGraph.prototype.DeleteSnapshots=function(){this.Snapshots=[];}
JsGraph.prototype.GetSnapshot=function(id){if(this.Snapshots[id])return this.Snapshots[id];return null;}
JsGraph.prototype.MakeSnapshot=function(id,x,y,w,h){var pixelRatio=this.DevicePixelRatio;if(!xDef(x)){x=0;y=0;w=Math.floor(this.CanvasWidth*pixelRatio);h=Math.floor(this.CanvasHeight*pixelRatio);}else if(xStr(x)){var box=this.GetViewportDeviceRect();x=box.x;y=box.y;w=box.w;h=box.h;}else{x=Math.floor(x*pixelRatio);y=Math.floor(y*pixelRatio);w=Math.floor(w*pixelRatio);h=Math.floor(h*pixelRatio);}
var snapshot=new JsgSnapshot(x,y,w,h,this.Canvas);if(!snapshot.ImageData)return;this.Snapshots[id]=snapshot;}
JsGraph.prototype.DrawSnapshot=function(id,clear){clear=xDefBool(clear,true);var snapshot=this.GetSnapshot(id);if(!snapshot)return false;var ctx=this.Context2D;var pixelRatio=this.DevicePixelRatio;var x=snapshot.x/pixelRatio;var y=snapshot.y/pixelRatio;var w=snapshot.w/pixelRatio;var h=snapshot.h/pixelRatio;var oldAlpha=ctx.globalAlpha;ctx.globalAlpha=1;ctx.beginPath();if(clear)ctx.clearRect(x,y,w,h);ctx.drawImage(snapshot.ImageData,x,y,w,h);ctx.globalAlpha=oldAlpha;return true;}
JsGraph.prototype.SetAngleMeasure=function(am){var old=this.AngleMeasure;if(am=='rad'){this.AngleMeasure='rad';}else{this.AngleMeasure='deg';}
return old;}
JsGraph.prototype.ResetTrans=function(){this.ObjTrans.Reset();return this;}
JsGraph.prototype.SaveTrans=function(reset){var copyTrans=this.ObjTrans.Copy();this.ObjTransStack.push(copyTrans);if(reset)this.ObjTrans.Reset();return copyTrans;}
JsGraph.prototype.RestoreTrans=function(){if(this.ObjTransStack.length>0)this.ObjTrans=this.ObjTransStack.pop();}
JsGraph.prototype.TransMove=function(x,y){if(JsgVect2.Ok(x))return this.TransMove(x[0],x[1]);this.ObjTrans.Move(x,y);return this;}
JsGraph.prototype.TransScale=function(sx,sy){if(JsgVect2.Ok(sx))return this.TransScale(sx[0],sx[1]);this.ObjTrans.Scale(sx,sy);return this;}
JsGraph.prototype.TransRotate=function(ang){this.ObjTrans.Rotate(this.AngleToRad(ang));return this;}
JsGraph.prototype.TransRotateAtPoint=function(x,y,ang){if(JsgVect2.Ok(x))return this.TransRotateAtPoint(x[0],x[1],y);this.ObjTrans.Move(-x,-y);this.ObjTrans.Rotate(this.AngleToRad(ang));this.ObjTrans.Move(x,y);return this;}
JsGraph.prototype.AddTrans=function(mat){this.ObjTrans.AddTrans(mat);return this;}
JsGraph.prototype.ObjTransPoly=function(poly){var otr=this.GetObjTrans();if(!otr)return;var xArr=poly.X;var yArr=poly.Y;var size=poly.Size;for(var i=0;i<size;i++){otr.TransXY(xArr[i],yArr[i]);xArr[i]=otr.x;yArr[i]=otr.y;}}
JsGraph.prototype.TransPoly=function(poly){var ctr=this.CurrTrans;var otr=this.GetObjTrans();var xArr=poly.X;var yArr=poly.Y;var size=poly.Size;for(var i=1;i<size;i++){ctr.ObjTransXY(otr,xArr[i],yArr[i]);xArr[i]=ctr.x;yArr[i]=ctr.y;}}
JsGraph.prototype.ObjTransXY=function(x,y){var otr=this.ObjTrans;otr.TransXY(x,y);return otr;}
JsGraph.prototype.TransXY=function(x,y){var ctr=this.CurrTrans;ctr.ObjTransXY(this.GetObjTrans(),x,y);return ctr;}
JsGraph.prototype.SelectTrans=function(aTrans){if(this.Trans==aTrans||!this.TransByName[aTrans])return this.Trans;var oldTrans=this.Trans;this.CurrTrans=this.TransByName[aTrans];this.Trans=aTrans;return oldTrans;}
JsGraph.prototype.SetViewport=function(aX,aY,aWidth,aHeight,bScalePix,bClip){var doClip=xDef(aX);aWidth=xDefNum(aWidth,0);aHeight=xDefNum(aHeight,0);aX=xDefNum(aX,0);aY=xDefNum(aY,0);bScalePix=xDefBool(bScalePix,false);bClip=xDefBool(bClip,false);if(bScalePix){aX=this.ScalePix(aX,this.ScalePixInt);aY=this.ScalePix(aY,this.ScalePixInt);if(aWidth<0)aWidth=this.ScalePix(aWidth,this.ScalePixInt);if(aHeight<0)aHeight=this.ScalePix(aHeight,this.ScalePixInt);}
this.VpXmin=aX;this.VpYmin=aY;if(aWidth<=0){this.VpWidth=this.CanvasWidth+aWidth-aX;}else{this.VpWidth=aWidth;}
if(aHeight<=0){this.VpHeight=this.CanvasHeight+aHeight-aY;}else{this.VpHeight=aHeight;}
this.VpInnerWidth=this.VpWidth-1;this.VpInnerHeight=this.VpHeight-1;this.SetViewportTrans();this.SetWindow();this.ResetInnerClipRange();if(doClip){if(bClip){this.SetClipping('viewport');}else{this.SetClipping('canvas');}}
if(this.GraphClipExtend<0)this.UpdateGraphClipOuterRange();}
JsGraph.prototype.ResetInnerClipRange=function(){this.GraphClipInnerXmin=-this.GraphClipMargin;this.GraphClipInnerXmax=this.CanvasWidth+this.GraphClipMargin;this.GraphClipInnerYmin=-this.GraphClipMargin;this.GraphClipInnerYmax=this.CanvasHeight+this.GraphClipMargin;}
JsGraph.prototype.SetViewportRel=function(aLeft,aTop,aRight,aBottom,bScalePix,bClip){aLeft=xDefNum(aLeft,0);aTop=xDefNum(aTop,aLeft);aRight=xDefNum(aRight,aLeft);aBottom=xDefNum(aBottom,aTop);bScalePix=xDefBool(bScalePix,true);bClip=xDefBool(bClip,true);if(bScalePix){aLeft=this.ScalePix(aLeft,this.ScalePixInt);aTop=this.ScalePix(aTop,this.ScalePixInt);aRight=this.ScalePix(aRight,this.ScalePixInt);aBottom=this.ScalePix(aBottom,this.ScalePixInt);}
this.VpWidth=this.VpWidth-aLeft-aRight;this.VpHeight=this.VpHeight-aTop-aBottom;this.VpXmin=this.VpXmin+aLeft;this.VpYmin=this.VpYmin+aTop;this.VpInnerWidth=this.VpWidth-1;this.VpInnerHeight=this.VpHeight-1;this.SetViewportTrans();this.SetWindow();if(bClip){this.SetClipping('viewport');}else{this.SetClipping('canvas');}}
JsGraph.prototype.SetViewportTrans=function(){var trans=this.VpTrans;trans.Xmin=this.VpXmin;trans.Ymin=this.VpYmin;trans.Width=this.VpWidth;trans.Height=this.VpHeight;trans.OffsetX=this.VpXmin+0.5;trans.OffsetY=this.VpYmin+0.5;trans.ScaleX=1;trans.ScaleY=1;}
JsGraph.prototype.SetWindow=function(aXmin,aYmin,aXmax,aYmax){aXmin=xDefNum(aXmin,0);aYmin=xDefNum(aYmin,0);aXmax=xDefNum(aXmax,0);aYmax=xDefNum(aYmax,0);if(aXmin==aXmax)aXmax=this.VpInnerWidth;if(aYmin==aYmax)aYmax=this.VpInnerHeight;this.WinXmin=aXmin;this.WinXmax=aXmax;this.WinYmin=aYmin;this.WinYmax=aYmax;this.WinWidth=aXmax-aXmin;this.WinHeight=aYmax-aYmin;var trans=this.WinTrans;trans.Xmin=this.WinXmin;trans.Ymin=this.WinYmin;trans.Width=this.WinWidth;trans.Height=this.WinHeight;var sx=this.VpInnerWidth/this.WinWidth;trans.ScaleX=sx;trans.OffsetX=(-this.WinXmin*sx)+this.VpXmin+0.5;var sy=-(this.VpInnerHeight/this.WinHeight);trans.ScaleY=sy;trans.OffsetY=this.VpInnerHeight-this.WinYmin*sy+this.VpYmin+0.5;}
JsGraph.prototype.SetWindowWH=function(aXnull,aYnull,aWidth,aHeight){aXnull=xDefNum(aXnull,0);aYnull=xDefNum(aYnull,0);aWidth=xDefNum(aWidth,0);aHeight=xDefNum(aHeight,0);if(aWidth==0){var aspectRatio=this.VpInnerWidth/this.VpInnerHeight;aWidth=aHeight*aspectRatio;}else if(aHeight==0){var aspectRatio=this.VpInnerWidth/this.VpInnerHeight;if(aspectRatio!=0)aHeight=aWidth/aspectRatio;}
this.SetWindow(aXnull,aYnull,aXnull+aWidth,aYnull+aHeight);}
JsGraph.prototype.MapWindow=function(aXcenter,aYcenter,aWidth,aHeight,aAlign){aXcenter=xDefNum(aXcenter,0);aYcenter=xDefNum(aYcenter,0);aWidth=xDefNum(aWidth,0);aHeight=xDefNum(aHeight,0);aAlign=xDefNum(aAlign,0);var vpAspectRatio=this.VpInnerWidth/this.VpInnerHeight;if(aWidth==0){aWidth=aHeight*vpAspectRatio;}else if(aHeight==0){if(vpAspectRatio!=0)aHeight=aWidth/vpAspectRatio;}else{var winAspectRatio=aWidth/aHeight;if(vpAspectRatio>=winAspectRatio){var winWidth=aHeight*vpAspectRatio;var padding=(winWidth-aWidth)/2;aXcenter-=aAlign*padding;aWidth=winWidth;}else{var winHeight=aWidth/vpAspectRatio;var padding=(winHeight-aHeight)/2;aYcenter-=aAlign*padding;aHeight=winHeight;}}
var xmin=aXcenter-aWidth/2;var ymin=aYcenter-aHeight/2;var xmax=xmin+aWidth;var ymax=ymin+aHeight;this.SetWindow(xmin,ymin,xmax,ymax);}
JsGraph.prototype.SetClipRect=function(aX,aY,aWidth,aHeight,aTrans){aX=xDefNum(aX,0);aTrans=xDefStr(aTrans,'');var oldTrans=this.Trans;if(aTrans!=''){this.SelectTrans(aTrans);}
var otr=this.ObjTrans;var enableObjTrans=(this.Trans=='window');var oldEnable=otr.Enable(enableObjTrans);this.OpenPath();this.RectWH(aX,aY,aWidth,aHeight);this.Clip();if(this.Trans=='viewport'){this.GraphClipInnerXmin=this.VpXmin-this.GraphClipMargin;this.GraphClipInnerXmax=this.VpWidth+this.GraphClipMargin;this.GraphClipInnerYmin=this.VpYmin-this.GraphClipMargin;this.GraphClipInnerYmax=this.VpHeight+this.GraphClipMargin;}else{this.ResetInnerClipRange();}
otr.Enable(oldEnable);if(aTrans!=''){this.SelectTrans(oldTrans);}}
JsGraph.prototype.SetClipping=function(aClipRange){aClipRange=xDefStr(aClipRange,'canvas');if(aClipRange=='window'){this.SetClipRect(this.WinXmin,this.WinYmin,this.WinWidth,this.WinHeight,'window');}else if(aClipRange=='viewport'){this.SetClipRect(this.VpXmin,this.VpYmin,this.VpWidth,this.VpHeight,'canvas');}else{this.SetClipRect(0,0,this.CanvasWidth,this.CanvasHeight,'canvas');}}
JsGraph.prototype.SetGraphClipping=function(clipping,clipRange,extendFactor){this.GraphClipEnabled=xDefBool(clipping,true);if(xStr(clipRange)&&clipRange!='')this.SetClipping(clipRange);if(xNum(extendFactor))this.GraphClipExtend=extendFactor;this.UpdateGraphClipOuterRange();}
JsGraph.prototype.SetAutoScalePix=function(bAutoScale){bAutoScale=xDefBool(bAutoScale,true);var old=this.AutoScalePix;this.AutoScalePix=bAutoScale;return old;}
JsGraph.prototype.SetLimitScalePix=function(bLimtiScalePix){bLimtiScalePix=xDefBool(bLimtiScalePix,true);var old=this.LimtiScalePix;this.LimtiScalePix=bLimtiScalePix;return old;}
JsGraph.prototype.SetScalePixInt=function(bScalePixInt){bScalePixInt=xDefBool(bScalePixInt,false);var old=this.ScalePixInt;this.ScalePixInt=bScalePixInt;return old;}
JsGraph.prototype.SetScaleRef=function(aScaleRef,bLimitScalePix,bAutoScalePix,bScalePixInt){if(xObj(aScaleRef)){this.SetScaleRef(aScaleRef.ScaleRef,aScaleRef.LimitScalePix,aScaleRef.AutoScalePix,aScaleRef.ScalePixInt);return;}
if(xNum(aScaleRef)){this.ScaleRef=aScaleRef;this.SavedDefaultAttrs.ScaleRef=aScaleRef;}
if(xBool(bLimitScalePix)){this.LimitScalePix=bLimitScalePix;this.SavedDefaultAttrs.LimitScalePix=bLimitScalePix;}
if(xBool(bAutoScalePix)){this.AutoScalePix=bAutoScalePix;this.SavedDefaultAttrs.AutoScalePix=bAutoScalePix;}
if(xBool(bScalePixInt)){this.ScalePixInt=bScalePixInt;this.SavedDefaultAttrs.ScalePixInt=bScalePixInt;}}
JsGraph.prototype.GetPixScaling=function(){var r=this.CanvasWidth/this.ScaleRef;if(this.LimitScalePix&&r>1)r=1;return r;}
JsGraph.prototype.ScalePix=function(aSize,bInt){var m=aSize<0?-1:1;var r=m*aSize*this.GetPixScaling();if(bInt){r=Math.round(r);if(r<1)r=1;}
return m*r;}
JsGraph.prototype.ScalePixI=function(aSize){return this.ScalePix(aSize,true);}
JsGraph.prototype.ScalePixMax=function(aSize,aMaxSize,bInt){var m=aSize<0?-1:1;var r=m*aSize*this.GetPixScaling();if(r>aMaxSize)r=aMaxSize;if(bInt){r=Math.round(r);if(r<1)r=1;}
return m*r;}
JsGraph.prototype.ScalePixMaxI=function(aSize,aMaxSize){return this.ScalePixMax(aSize,aMaxSize,true);}
JsGraph.prototype.ScalePixMin=function(aSize,aMinSize,bInt){var m=aSize<0?-1:1;var r=m*aSize*this.GetPixScaling();if(r<aMinSize)r=aMinSize;if(bInt){r=Math.round(r);if(r<1)r=1;}
return m*r;}
JsGraph.prototype.ScalePixMinI=function(aSize,aMinSize){return this.ScalePixMin(aSize,aMinSize,true);}
JsGraph.prototype.ScalePixMinMax=function(aSize,aMinSize,aMaxSize,bInt){var m=aSize<0?-1:1;var r=m*aSize*this.GetPixScaling();if(r<aMinSize)r=aMinSize;if(r>aMaxSize)r=aMaxSize;if(bInt){r=Math.round(r);if(r<1)r=1;}
return m*r;}
JsGraph.prototype.ScalePixMinMaxI=function(aSize,aMinSize,aMaxSize){return this.ScalePixMinMax(aSize,aMinSize,aMaxSize,true);}
JsGraph.prototype.MinSize=function(aSize,aMinSize){return(aSize<aMinSize)?aMinSize:aSize;}
JsGraph.prototype.MaxSize=function(aSize,aMaxSize){return(aSize>aMaxSize)?aMaxSize:aSize;}
JsGraph.prototype.MinMaxSize=function(aSize,aMinSize,aMaxSize){var r=aSize;if(r<aMinSize)r=aMinSize;if(r>aMaxSize)r=aMaxSize;return r;}
JsGraph.prototype.Limit01=function(x){return(x<0)?0:((x>1)?1:x);}
JsGraph.prototype.ScaleToTic=function(aValue,aTic){var v=(Math.round(Math.abs(aValue)/aTic+0.3)+0.5)*aTic
return(aValue<0)?-v:v;}
JsGraph.prototype.ScaleWinX=function(){return Math.abs(this.WinTrans.ScaleX);}
JsGraph.prototype.ScaleWinY=function(){return Math.abs(this.WinTrans.ScaleY);}
JsGraph.prototype.WinToPixX=function(x,scalePix){x=Math.abs(this.WinTrans.ScaleX)*x;scalePix=xDefBool(scalePix,this.AutoScalePix);if(scalePix)x=this.ScalePix(x);return x;}
JsGraph.prototype.WinToPixY=function(y,scalePix){y=Math.abs(this.WinTrans.ScaleY)*y;scalePix=xDefBool(scalePix,this.AutoScalePix);if(scalePix)y=this.ScalePix(y);return y;}
JsGraph.prototype.PixToWinX=function(x,scalePix){scalePix=xDefBool(scalePix,this.AutoScalePix);if(scalePix)x=this.ScalePix(x);x/=Math.abs(this.WinTrans.ScaleX);return x;}
JsGraph.prototype.PixToWinY=function(y,scalePix){scalePix=xDefBool(scalePix,this.AutoScalePix);if(scalePix)y=this.ScalePix(y);y/=Math.abs(this.WinTrans.ScaleY);return y;}
JsGraph.prototype.TransWinVpX=function(x){var cx=this.WinTrans.TransX(x);return this.VpTrans.InvTransX(cx);}
JsGraph.prototype.TransWinVpY=function(y){var cy=this.WinTrans.TransY(y);return this.VpTrans.InvTransY(cy);}
JsGraph.prototype.TransWinCnvsX=function(x){return this.WinTrans.TransX(x);}
JsGraph.prototype.TransWinCnvsY=function(y){return this.WinTrans.TransY(y);}
JsGraph.prototype.TransVpCnvsX=function(x){return this.VpTrans.TransX(x);}
JsGraph.prototype.TransVpCnvsY=function(y){return this.VpTrans.TransY(y);}
JsGraph.prototype.TransVpWinX=function(x){var cx=this.VpTrans.TransX(x);return this.WinTrans.InvTransX(cx);}
JsGraph.prototype.TransVpWinY=function(y){var cy=this.VpTrans.TransY(y);return this.WinTrans.InvTransY(cy);}
JsGraph.prototype.TransCnvsWinX=function(x){return this.WinTrans.InvTransX(x);}
JsGraph.prototype.TransCnvsWinY=function(y){return this.WinTrans.InvTransY(y);}
JsGraph.prototype.TransCnvsVpX=function(x){return this.VpTrans.InvTransX(x);}
JsGraph.prototype.TransCnvsVpY=function(y){return this.VpTrans.InvTransY(y);}
JsGraph.prototype.GetAttrs=function(){return new JsgAttrs(this);}
JsGraph.prototype.SetAttrs=function(aAttrs){if(!xObj(aAttrs))return;if(aAttrs.Reset)this.ResetAttrs();this.SetScaleRef(aAttrs);if(xDef(aAttrs.CurvePrecision))this.CurvePrecision=aAttrs.CurvePrecision;if(xDef(aAttrs.AngleMeasure))this.SetAngleMeasure(aAttrs.AngleMeasure);if(xDef(aAttrs.ObjTrans))this.ObjTrans.CopyFrom(aAttrs.ObjTrans);if(xDef(aAttrs.Trans))this.SelectTrans(aAttrs.Trans);if(xDef(aAttrs.Alpha))this.SetAlpha(aAttrs.Alpha);if(xDef(aAttrs.LineJoin))this.SetLineJoin(aAttrs.LineJoin);if(xDef(aAttrs.LineCap))this.SetLineCap(aAttrs.LineCap);if(xDef(aAttrs.Color))this.SetColor(aAttrs.Color);if(xObj(aAttrs.BgGradient)){this.SetBgColor(aAttrs.BgGradient);}else if(xDef(aAttrs.BgColor)){this.SetBgColor(aAttrs.BgColor);}
if(xDef(aAttrs.LineWidth))this.SetLineWidth(aAttrs.LineWidth);if(xDef(aAttrs.MarkerSymbol))this.SetMarkerSymbol(aAttrs.MarkerSymbol);if(xDef(aAttrs.MarkerSize))this.SetMarkerSize(aAttrs.MarkerSize);if(xDef(aAttrs.TextRendering))this.SetTextRendering(aAttrs.TextRendering);if(xDef(aAttrs.TextClass))this.SetTextClass(aAttrs.TextClass);if(xDef(aAttrs.TextFont))this.SetTextFont(aAttrs.TextFont);if(xDef(aAttrs.TextSize))this.SetTextSize(aAttrs.TextSize);if(xDef(aAttrs.TextRotation))this.SetTextRotation(aAttrs.TextRotation);if(xDef(aAttrs.TextColor))this.SetTextColor(aAttrs.TextColor);if(xDef(aAttrs.FontStyle))this.SetFontStyle(aAttrs.FontStyle);if(xDef(aAttrs.FontWeight))this.SetFontWeight(aAttrs.FontWeight);if(xDef(aAttrs.TextHAlign))this.SetTextHAlign(aAttrs.TextHAlign);if(xDef(aAttrs.TextVAlign))this.SetTextVAlign(aAttrs.TextVAlign);if(xDef(aAttrs.TextHPad))this.SetTextPadding(aAttrs.TextHPad,this.TextVPad);if(xDef(aAttrs.TextVPad))this.SetTextPadding(this.TextHPad,aAttrs.TextVPad);if(xDef(aAttrs.LineHeight))this.SetLineHeight(aAttrs.LineHeight);}
JsGraph.prototype.SaveAttrs=function(){this.SavedAttrs=this.GetAttrs();}
JsGraph.prototype.RestoreAttrs=function(){if(!this.SavedAttrs)return;this.SetAttrs(this.SavedAttrs);}
JsGraph.prototype.SaveDefaultAttrs=function(){this.SavedDefaultAttrs=this.GetAttrs();}
JsGraph.prototype.ResetAttrs=function(){this.SetAttrs(this.SavedDefaultAttrs);}
JsGraph.prototype.BoxWHOverlapping=function(aBox1,aBox2){if(!aBox1||!aBox2)return false;var xmin1=aBox1.x;var xmax1=aBox1.x+aBox1.w;if(xmin1>xmax1){var tmp=xmin1;xmin1=xmax1;xmax1=tmp;}
var xmin2=aBox2.x;var xmax2=aBox2.x+aBox2.w;if(xmin2>xmax2){var tmp=xmin2;xmin2=xmax2;xmax2=tmp;}
if(xmax1<xmin2||xmax2<xmin1)return false;var ymin1=aBox1.y;var ymax1=aBox1.y+aBox1.h;if(ymin1>ymax1){var tmp=ymin1;ymin1=ymax1;ymax1=tmp;}
var ymin2=aBox2.y;var ymax2=aBox2.y+aBox2.h;if(ymin2>ymax2){var tmp=ymin2;ymin2=ymax2;ymax2=tmp;}
if(ymax1<ymin2||ymax2<ymin1)return false;return true;}
JsGraph.prototype.MapToRange=function(val,range){var absVal=Math.abs(val);var n=Math.floor(absVal/range);var newVal=absVal-n*range;if(val<0){newVal=range-newVal;if(newVal>=range)newVal-=range;}else{if(newVal<0)newVal+=range;}
return newVal;}
JsGraph.prototype.NormalizeAngles=function(angles){var Pi2=Math.PI*2;if(angles.delta>=0){var angleDiff=angles.end-angles.start;if(angleDiff>0){if(angleDiff>Pi2)angleDiff=Pi2;angles.start=this.MapToRange(angles.start,Pi2);angles.end=angles.start+angleDiff;if(angles.end>Pi2){angles.start-=Pi2;angles.end-=Pi2;}}else{angles.start=this.MapToRange(angles.start,Pi2);angles.end=this.MapToRange(angles.end,Pi2);if(angles.start>angles.end)angles.start-=Pi2;}}else{var angleDiff=angles.end-angles.start;if(angleDiff<0){if(angleDiff<-Pi2)angleDiff=-Pi2;angles.start=this.MapToRange(angles.start,Pi2);angles.end=angles.start+angleDiff;}else{angles.start=this.MapToRange(angles.start,Pi2);angles.end=this.MapToRange(angles.end,Pi2);if(angles.end>angles.start)angles.end-=Pi2;}}}
JsGraph.prototype.NormalizeAngle=function(angle){return this.MapToRange(angle,2*Math.PI);}
JsGraph.prototype.CompDeltaAngle=function(radius,precision){var da=2*Math.acos((radius-precision)/radius);da=(Math.PI/2)/(Math.floor(Math.PI/2/da)+1);if(da>Math.PI/4)da=Math.PI/4;if(this.MaxCurveSegments>0&&da<Math.PI/this.MaxCurveSegments)da=Math.PI/this.MaxCurveSegments;return da;}
JsGraph.prototype.MakeUnityArcPolygon=function(aAngles){var poly=this.WorkPoly.Reset();var sin=Math.sin;var cos=Math.cos;if(aAngles.delta>0){var delta=aAngles.delta-this.MapToRange(aAngles.start,aAngles.delta);if(delta==0)delta=aAngles.delta;var currAng=aAngles.start;var lastAng=aAngles.end-aAngles.delta/1000;while(currAng<lastAng){poly.AddPoint(cos(currAng),sin(currAng));currAng+=delta;delta=aAngles.delta;}
poly.AddPoint(cos(aAngles.end),sin(aAngles.end));}else if(aAngles.delta<0){var delta=-this.MapToRange(aAngles.start,-aAngles.delta);if(delta==0)delta=aAngles.delta;var currAng=aAngles.start;var lastAng=aAngles.end+aAngles.delta/1000;while(currAng>lastAng){poly.AddPoint(cos(currAng),sin(currAng));currAng+=delta;delta=aAngles.delta;}
poly.AddPoint(cos(aAngles.end),sin(aAngles.end));}
return poly;}
JsGraph.prototype.SetAlpha=function(a){this.Alpha=this.MinMaxSize(xDefNum(a,1),0,1);this.Context2D.globalAlpha=this.Alpha;}
JsGraph.prototype.SetLineJoin=function(j){this.LineJoin=j;this.Context2D.lineJoin=j;}
JsGraph.prototype.SetLineCap=function(c){this.LineCap=c;this.Context2D.lineCap=c;}
JsGraph.prototype.SetLineAttr=function(color,width){if(xAny(color))this.SetColor(color);if(xAny(width))this.SetLineWidth(width);}
JsGraph.prototype.SetAreaAttr=function(bgColor,borderColor,borderWidth){if(xAny(bgColor))this.SetBgColor(bgColor);if(xAny(borderColor))this.SetColor(borderColor);if(xAny(borderWidth))this.SetLineWidth(borderWidth);}
JsGraph.prototype.SetMarkerAttr=function(aSymbolName,size,borderColor,bgColor,borderWidth){if(xAny(aSymbolName))this.SetMarkerSymbol(aSymbolName);if(xAny(size))this.SetMarkerSize(size);this.SetAreaAttr(bgColor,borderColor,borderWidth);}
JsGraph.prototype.SetTextAttr=function(aFont,aSize,aColor,aWeight,aStyle,aHAlign,aVAlign,aHPad,aVPad,aRot){if(xAny(aFont))this.SetTextFont(aFont);if(xAny(aSize))this.SetTextSize(aSize);if(xAny(aRot))this.SetTextRotation(aRot);if(xAny(aColor))this.SetTextColor(aColor);if(xAny(aWeight))this.SetFontWeight(aWeight);if(xAny(aStyle))this.SetFontStyle(aStyle);if(xAny(aHAlign))this.SetTextHAlign(aHAlign);if(xAny(aVAlign))this.SetTextVAlign(aVAlign);if(xAny(aHPad))this.SetTextPadding(aHPad,aVPad);}
JsGraph.prototype.SetTextAttrS=function(aFont,aSize,aColor,aAttr,aHPad,aVPad,aRot){if(xAny(aFont))this.SetTextFont(aFont);if(xAny(aSize))this.SetTextSize(aSize);if(xAny(aRot))this.SetTextRotation(aRot);if(xAny(aColor))this.SetTextColor(aColor);if(xAny(aHPad))this.SetTextPadding(aHPad,aVPad);aAttr=xDefStr(aAttr,'');this.SetFontAttr(aAttr);this.SetTextAlignS(aAttr);}
JsGraph.prototype.ClearTextAttr=function(){this.SetTextAttr('',0,'','','','','',0,0);this.SetLineHeight(-1);}
JsGraph.prototype.SetColor=function(color){color=xDefAny(color,this.SavedDefaultAttrs.Color);if(JsgColor.Ok(color))color=JsgColor.ToString(color);this.Color=color;this.Context2D.strokeStyle=this.Color;}
JsGraph.prototype.SetBgColor=function(color){color=xDefAny(color,this.SavedDefaultAttrs.BgColor);if(JsgColor.Ok(color))color=JsgColor.ToString(color);if(xStr(color)){this.BgColor=color;this.BgGradient=null;this.Context2D.fillStyle=this.BgColor;}else if(JsgGradient.Ok(color)){this.BgGradient=color;this.Context2D.fillStyle=color.CanvasGradient;}}
JsGraph.prototype.CreateLinearGradient=function(aGradientDef){aGradientDef.X1=xDefNum(aGradientDef.X1,0);aGradientDef.Y1=xDefNum(aGradientDef.Y1,0);aGradientDef.X2=xDefNum(aGradientDef.X2,aGradientDef.X1);aGradientDef.Y2=xDefNum(aGradientDef.Y2,aGradientDef.Y1);aGradientDef.Stops=xArray(aGradientDef.Stops)?aGradientDef.Stops:[];var ctr=this.CurrTrans;ctr.ObjTransXY2(this.GetObjTrans(),aGradientDef.X1,aGradientDef.Y1,aGradientDef.X2,aGradientDef.Y2);var grad=this.Context2D.createLinearGradient(ctr.x1,ctr.y1,ctr.x2,ctr.y2);var stops=aGradientDef.Stops;var last=stops.length-1;for(var i=0;i<=last;i++){var color=xDefAny(stops[i].Color,'gray');if(JsgColor.Ok(color))color=JsgColor.ToString(color);grad.addColorStop(xDefNum(stops[i].Pos,i/last),color);}
return new JsgGradient('linear',grad,aGradientDef);}
JsGraph.prototype.SetLinearGradientGeom=function(aLinearGradient,aGeom){var gradDef=aLinearGradient.GradientDef;gradDef.X1=xDefNum(aGeom.X1,gradDef.X1);gradDef.Y1=xDefNum(aGeom.Y1,gradDef.Y1);gradDef.X2=xDefNum(aGeom.X2,gradDef.X2);gradDef.Y2=xDefNum(aGeom.Y2,gradDef.Y2);var ctr=this.CurrTrans;ctr.ObjTransXY2(this.GetObjTrans(),gradDef.X1,gradDef.Y1,gradDef.X2,gradDef.Y2);var grad=this.Context2D.createLinearGradient(ctr.x1,ctr.y1,ctr.x2,ctr.y2);var stops=gradDef.Stops;var last=stops.length-1;for(var i=0;i<=last;i++){var color=xDefAny(stops[i].Color,'gray');if(JsgColor.Ok(color))color=JsgColor.ToString(color);grad.addColorStop(xDefNum(stops[i].Pos,i/last),color);}
aLinearGradient.CanvasGradient=grad;if(aLinearGradient==this.BgGradient){this.Context2D.fillStyle=this.BgGradient.CanvasGradient;}}
JsGraph.prototype.CreateRadialGradient=function(aGradientDef){aGradientDef.X1=xDefNum(aGradientDef.X1,0);aGradientDef.Y1=xDefNum(aGradientDef.Y1,0);aGradientDef.R1=xDefNum(aGradientDef.R1,0);aGradientDef.X2=xDefNum(aGradientDef.X2,aGradientDef.X1);aGradientDef.Y2=xDefNum(aGradientDef.Y2,aGradientDef.Y1);aGradientDef.R2=xDefNum(aGradientDef.R2,aGradientDef.R1+100);var ctr=this.CurrTrans;var otrScaling=this.ObjTrans.MaxScaling();ctr.ObjTransXY2(this.GetObjTrans(),aGradientDef.X1,aGradientDef.Y1,aGradientDef.X2,aGradientDef.Y2);var cnvsR1=ctr.ScaleX*otrScaling*aGradientDef.R1;var cnvsR2=ctr.ScaleX*otrScaling*aGradientDef.R2;var grad=this.Context2D.createRadialGradient(ctr.x1,ctr.y1,cnvsR1,ctr.x2,ctr.y2,cnvsR2);var stops=xDefArray(aGradientDef.Stops,[]);var last=stops.length-1;for(var i=0;i<=last;i++){var color=xDefAny(stops[i].Color,'gray');if(JsgColor.Ok(color))color=JsgColor.ToString(color);grad.addColorStop(xDefNum(stops[i].Pos,i/last),color);}
return new JsgGradient('radial',grad,aGradientDef);}
JsGraph.prototype.SetRadialGradientGeom=function(aRadialGradient,aGeom){var gradDef=aRadialGradient.GradientDef;gradDef.X1=xDefNum(aGeom.X1,gradDef.X1);gradDef.Y1=xDefNum(aGeom.Y1,gradDef.Y1);gradDef.R1=xDefNum(aGeom.R1,gradDef.R1);gradDef.X2=xDefNum(aGeom.X2,gradDef.X2);gradDef.Y2=xDefNum(aGeom.Y2,gradDef.Y2);gradDef.R2=xDefNum(aGeom.R2,gradDef.R2);var ctr=this.CurrTrans;var otrScaling=this.ObjTrans.MaxScaling();ctr.ObjTransXY2(this.GetObjTrans(),gradDef.X1,gradDef.Y1,gradDef.X2,gradDef.Y2);var cnvsR1=ctr.ScaleX*otrScaling*gradDef.R1;var cnvsR2=ctr.ScaleX*otrScaling*gradDef.R2;var grad=this.Context2D.createRadialGradient(ctr.x1,ctr.y1,cnvsR1,ctr.x2,ctr.y2,cnvsR2);var stops=gradDef.Stops;var last=stops.length-1;for(var i=0;i<=last;i++){var color=xDefAny(stops[i].Color,'gray');if(JsgColor.Ok(color))color=JsgColor.ToString(color);grad.addColorStop(xDefNum(stops[i].Pos,i/last),color);}
aRadialGradient.CanvasGradient=grad;if(aRadialGradient==this.BgGradient){this.Context2D.fillStyle=this.BgGradient.CanvasGradient;}}
JsGraph.prototype.SetLineWidth=function(width){width=xDefNum(width,this.SavedDefaultAttrs.LineWidth);if(width<0)width=0;this.LineWidth=width;if(this.AutoScalePix&&width>0)width=this.ScalePixMin(width,this.MinLineWidth,this.ScalePixInt);if(width==0)width=1/this.DevicePixelRatio;this.Context2D.lineWidth=width;}
JsGraph.prototype.SetTextClass=function(aClassName,aClearAttrs){aClassName=xDefStr(aClassName,'');aClearAttrs=xDefBool(aClearAttrs,false);if(aClearAttrs)this.ClearTextAttr();this.TextClass=aClassName;this.HtmlTextHandler.TextClass=aClassName;}
JsGraph.prototype.SetTextRendering=function(aRenderMethod){var oldRendering=this.TextRendering;if(!(this.Context2D.strokeText&&this.Context2D.fillText))aRenderMethod='html';if(aRenderMethod=='html'){this.TextRendering='html';this.TextCanvasRendering=false;}else{this.TextRendering='canvas';this.TextCanvasRendering=true;}
return oldRendering;}
JsGraph.prototype.SetTextFont=function(aFont){this.TextFont=xDefStr(aFont,this.SavedDefaultAttrs.TextFont);this.HtmlTextHandler.TextStyles.fontFamily=this.TextFont;this.CTextCurrFontVers++;}
JsGraph.prototype.SetTextSize=function(aSize){aSize=xDefNum(aSize,this.SavedDefaultAttrs.TextSize);if(aSize<0)aSize=0;this.TextSize=aSize;if(aSize>0){if(this.AutoScalePix)aSize=this.ScalePixMin(aSize,this.MinTextSize,this.ScalePixInt);this.HtmlTextHandler.TextStyles.fontSize=aSize+'px';this.CanvasFontSize=aSize;}else{this.HtmlTextHandler.TextStyles.fontSize='';this.CanvasFontSize=15;}
this.CTextCurrFontVers++;}
JsGraph.prototype.SetTextRotation=function(aRot){aRot=xDefNum(aRot,this.SavedDefaultAttrs.TextRotation);this.TextRotation=aRot;}
JsGraph.prototype.SetTextColor=function(color){color=xDefAny(color,this.SavedDefaultAttrs.TextColor);if(JsgColor.Ok(color))color=JsgColor.ToString(color);this.TextColor=color;this.HtmlTextHandler.TextStyles.color=this.TextColor;}
JsGraph.prototype.SetLineHeight=function(aHeight){aHeight=xDefNum(aHeight,this.SavedDefaultAttrs.LineHeight);if(aHeight<0)aHeight=-1;this.LineHeight=aHeight;if(aHeight>0){if(this.AutoScalePix)aHeight=this.ScalePix(aHeight,this.ScalePixInt);this.HtmlTextHandler.TextStyles.lineHeight=aHeight+'px';this.CanvasLineHeight=aHeight;}else if(aHeight==0){this.HtmlTextHandler.TextStyles.lineHeight='100%';this.CanvasLineHeight=0;}else{this.HtmlTextHandler.TextStyles.lineHeight='';this.CanvasLineHeight=0;}
this.CTextCurrFontVers++;}
JsGraph.prototype.SetFontStyle=function(aStyle,aWeight){aStyle=xDefStr(aStyle,this.SavedDefaultAttrs.FontStyle);this.FontStyle=aStyle;this.HtmlTextHandler.TextStyles.fontStyle=aStyle;if(xStr(aWeight))this.SetFontWeight(aWeight);this.CTextCurrFontVers++;}
JsGraph.prototype.SetFontWeight=function(aWeight,aStyle){aWeight=xDefStr(aWeight,this.SavedDefaultAttrs.FontWeight);this.FontWeight=aWeight;this.HtmlTextHandler.TextStyles.fontWeight=aWeight;if(xStr(aStyle))this.SetFontStyle(aStyle);this.CTextCurrFontVers++;}
JsGraph.prototype.SetFontAttr=function(aAttr){var weight=aAttr.indexOf('b')>=0?'bold':'normal';var style=aAttr.indexOf('i')>=0?'italic':'normal';this.SetFontStyle(style,weight);}
JsGraph.prototype.SetTextAlign=function(aHAlign,aVAlign){if(xStr(aHAlign))this.SetTextHAlign(aHAlign);if(xStr(aVAlign))this.SetTextVAlign(aVAlign);}
JsGraph.prototype.SetTextAlignS=function(aAlign){var h='center';var v='middle';if(aAlign.indexOf('N')>=0)v='top';if(aAlign.indexOf('S')>=0)v='bottom';if(aAlign.indexOf('W')>=0)h='left';if(aAlign.indexOf('E')>=0)h='right';this.SetTextHAlign(h);this.SetTextVAlign(v);}
JsGraph.prototype.SetTextHAlign=function(aAlign){aAlign=xDefStr(aAlign,this.SavedDefaultAttrs.TextHAlign);this.TextHAlign=aAlign;this.HtmlTextHandler.TextStyles.textAlign=aAlign;if(aAlign=='justify')aAlign='center';this.HtmlTextHandler.TextHAlign=aAlign;}
JsGraph.prototype.SetTextVAlign=function(aAlign){aAlign=xDefStr(aAlign,this.SavedDefaultAttrs.TextVAlign);this.TextVAlign=aAlign;this.HtmlTextHandler.TextVAlign=aAlign;}
JsGraph.prototype.SetTextPadding=function(aHPad,aVPad){aHPad=xDefNum(aHPad,0);aVPad=xDefNum(aVPad,aHPad);this.TextHPad=aHPad;this.TextVPad=aVPad;if(this.AutoScalePix){aHPad=this.ScalePix(aHPad,this.ScalePixInt);aVPad=this.ScalePix(aVPad,this.ScalePixInt);}
this.CanvasTextHPad=aHPad;this.HtmlTextHandler.TextHPad=aHPad;this.CanvasTextVPad=aVPad;this.HtmlTextHandler.TextVPad=aVPad;}
JsGraph.prototype.SetMarkerSymbol=function(aSymbolName){aSymbolName=xDefStr(aSymbolName,this.SavedDefaultAttrs.MarkerSymbol);if(!xDef(this.Markers[aSymbolName]))return;this.MarkerSymbol=aSymbolName;}
JsGraph.prototype.SetMarkerSize=function(aSize){aSize=xDefNum(aSize,this.SavedDefaultAttrs.MarkerSize);if(aSize<0)aSize=0;this.MarkerSize=aSize;if(this.AutoScalePix)aSize=this.ScalePixMin(aSize,this.MinMarkerSize,this.ScalePixInt);this.DriverMarkerSize=aSize;}
JsGraph.prototype.OpenPath=function(penUp){this.ClearPath();this.IsPathOpen=true;if(xDef(penUp))this.PenDown=!penUp;}
JsGraph.prototype.ClearPath=function(){this.CurrPathSize=0;this.CommonPathElePoolSize=0;this.ArcPathElePoolSize=0;this.BezierPathElePoolSize=0;this.IsPathOpen=false;}
JsGraph.prototype.Path=function(mode,clear){mode=xDefNum(mode,1);clear=xDefBool(clear,true);if(mode&2){if(this.DriverDrawPath(false,true)){this.Context2D.fill();}}
if(mode&1){if(this.DriverDrawPath((mode&4)>0,false)){this.Context2D.stroke();}}
if(clear)this.ClearPath();}
JsGraph.prototype.Clip=function(clear){clear=xDefBool(clear,true);var oldClipEnabled=this.GraphClipEnabled;this.GraphClipEnabled=false;if(this.DriverDrawPath(false,false)){this.Context2D.restore();this.Context2D.save();this.Context2D.clip();}
if(clear)this.ClearPath();this.GraphClipEnabled=oldClipEnabled;if(!this.IsResettingAll)this.SetDriverAttrs();this.ResetInnerClipRange();}
JsGraph.prototype.NewCommonPathEle=function(t,x,y){var ele,pool=this.CommonPathElePool;if(this.CommonPathElePoolSize<pool.length){ele=pool[this.CommonPathElePoolSize++];ele.t=t;ele.x=x;ele.y=y;}else{ele={t:t,x:x,y:y};pool[this.CommonPathElePoolSize++]=ele;}
return ele;}
JsGraph.prototype.NewArcPathEle=function(x,y,r,sa,ea,cc){var ele,pool=this.ArcPathElePool;if(this.ArcPathElePoolSize<pool.length){ele=pool[this.ArcPathElePoolSize++];ele.t=3;ele.x=x;ele.y=y;ele.r=r;ele.sa=sa;ele.ea=ea;ele.cc=cc;}else{ele={t:3,x:x,y:y,r:r,sa:sa,ea:ea,cc:cc};pool[this.ArcPathElePoolSize++]=ele;}
return ele;}
JsGraph.prototype.NewBezierPathEle=function(cx1,cy1,cx2,cy2,ex,ey){var ele,pool=this.BezierPathElePool;if(this.BezierPathElePoolSize<pool.length){ele=pool[this.BezierPathElePoolSize++];ele.t=4;ele.cx1=cx1;ele.cy1=cy1;ele.cx2=cx2;ele.cy2=cy2;ele.ex=ex;ele.ey=ey;}else{ele={t:4,cx1:cx1,cy1:cy1,cx2:cx2,cy2:cy2,ex:ex,ey:ey};pool[this.BezierPathElePoolSize++]=ele;}
return ele;}
JsGraph.prototype.ClosePath=function(){this.CurrPath[this.CurrPathSize++]=this.NewCommonPathEle(0,0,0);}
JsGraph.prototype.PathMoveTo=function(x,y){this.CurrPath[this.CurrPathSize++]=this.NewCommonPathEle(2,x,y);}
JsGraph.prototype.PathLineTo=function(x,y){this.CurrPath[this.CurrPathSize++]=this.NewCommonPathEle(1,x,y);}
JsGraph.prototype.PathAppendArc=function(x,y,r,sa,ea,cc,cont,close){var arcStartX=x+r*Math.cos(sa);var arcStartY=y+r*Math.sin(sa);if(!cont){this.PathMoveTo(arcStartX,arcStartY);}
this.CurrPath[this.CurrPathSize++]=this.NewArcPathEle(x,y,r,sa,ea,cc);if(close){this.PathLineTo(arcStartX,arcStartY);}}
JsGraph.prototype.PathAppendPolygon=function(xArray,yArray,cont,close,size){var ctr=this.CurrTrans;var otr=this.GetObjTrans();ctr.ObjTransXY(otr,xArray[0],yArray[0]);if(cont){this.PathLineTo(ctr.x,ctr.y);}else{this.PathMoveTo(ctr.x,ctr.y);}
size=xDefNum(size,xArray.length);for(var i=1;i<size;i++){ctr.ObjTransXY(otr,xArray[i],yArray[i]);this.PathLineTo(ctr.x,ctr.y);}
if(close){if(xArray[0]!=xArray[xArray.length-1]||yArray[0]!=yArray[yArray.length-1]){ctr.ObjTransXY(otr,xArray[0],yArray[0]);this.PathLineTo(ctr.x,ctr.y);}}}
JsGraph.prototype.PathAppendBezierTo=function(cx1,cy1,cx2,cy2,ex,ey){this.CurrPath[this.CurrPathSize++]=this.NewBezierPathEle(cx1,cy1,cx2,cy2,ex,ey);}
JsGraph.prototype.DriverPathPoly=new JsgPolygon(false,'JsGraph.DriverPathPoly');JsGraph.prototype.DriverPathClipPoly=new JsgPolygon(false,'JsGraph.DrverPathClipPoly');JsGraph.prototype.DriverPathClipPolyList=new JsgPolygonList(false,'JsGraph.DriverPathClipPolyList');JsGraph.prototype.DriverDrawPath=function(close,areaMode){var plen=this.CurrPathSize;if(!this.GraphClipEnabled){return this.DriverDrawPathPart(0,plen,true,close);}
if(areaMode){var quadrant=this.GetPathClipQuadrant(0,plen);if(quadrant==0){return this.DriverDrawPathPart(0,plen,true,close);}else if(quadrant==1){return false;}
var poly=this.DriverGetPathPoly(0,0,false);var polyClipped=this.ClipPolygonArea(poly,this.GraphClipInnerXmin,this.GraphClipInnerXmax,this.GraphClipInnerYmin,this.GraphClipInnerYmax,this.DriverPathClipPoly);return this.DriverDrawPathPoly(polyClipped,true,false);}else{var last;var from=0;var newPath=true;while((last=this.DriverNextPathEnd(from+1))>0){if(last-from>1){var closeLast=(last==plen&&close);var quadrant=this.GetPathClipQuadrant(from,last);if(quadrant==0){if(this.DriverDrawPathPart(from,last,newPath,closeLast)){newPath=false;}}else if(quadrant==2){var poly=this.DriverGetPathPoly(from,last,closeLast);var polyListClipped=this.ClipPolygon(poly,this.GraphClipInnerXmin,this.GraphClipInnerXmax,this.GraphClipInnerYmin,this.GraphClipInnerYmax,this.Context2D.lineWidth/2,this.DriverPathClipPolyList);if(polyListClipped.Size>0){for(var i=0;i<polyListClipped.Size;i++){var polyClipped=polyListClipped.PolyList[i];if(this.DriverDrawPathPoly(polyClipped,newPath,false)){newPath=false;}}}}}
from=last;}
return!newPath;}}
JsGraph.prototype.DriverGetPathPoly=function(from,to,closeLast){var poly=this.DriverPathPoly.Reset();var p=this.CurrPath;var plen=this.CurrPathSize;var closeArea=false;if(to==0){from=0;to=plen;closeArea=true;}
var lastMoveIx=from;for(var i=from;i<to;i++){var c=p[i];var t=c.t;if(t==1){poly.AddPoint(c.x,c.y);}else if(t==2){if(i>from){if(p[i-1].t==2){poly.RemoveLastPoint();}else{var cl=p[lastMoveIx];poly.AddPoint(cl.x,cl.y);}}
poly.AddPoint(c.x,c.y);lastMoveIx=i;}else if(t==0){var c=p[lastMoveIx];poly.AddPoint(c.x,c.y);}else if(t==3){var startAng=this.RadToAngle(c.sa);var endAng=this.RadToAngle(c.ea)
var rad=c.cc?-c.r:c.r;var ell=this.MakeEllipseArcPolygon(c.x,c.y,rad,c.r,0,startAng,endAng);poly.AddPoly(ell);}else if(t==4){var cprev=p[i-1];var bezier=this.MakeBezierPolygon(cprev.x,cprev.y,c.cx1,c.cy1,c.cx2,c.cy2,c.ex,c.ey,this.NumBezierSegments);poly.AddPoly(bezier);}}
if(closeArea||closeLast){var px=p[lastMoveIx].x;var py=p[lastMoveIx].y;var last=poly.Size-1;if(px!=poly.X[last]||py!=poly.Y[last]){poly.AddPoint(px,py);}}
if(closeArea){var px=p[0].x;var py=p[0].y;var last=poly.Size-1;if(px!=poly.X[last]||py!=poly.Y[last]){poly.AddPoint(px,py);}}
return poly;}
JsGraph.prototype.DriverDrawPathPart=function(from,to,newPath,close){var p=this.CurrPath;var ctx=this.Context2D;if(newPath)ctx.beginPath();for(var i=from;i<to;i++){var c=p[i];var t=c.t;if(t==1){ctx.lineTo(c.x,c.y);}else if(t==2){ctx.moveTo(c.x,c.y);}else if(t==0){ctx.closePath();}else if(t==3){ctx.arc(c.x,c.y,c.r,c.sa,c.ea,c.cc);}else if(t==4){ctx.bezierCurveTo(c.cx1,c.cy1,c.cx2,c.cy2,c.ex,c.ey);}}
if(close)ctx.closePath();return to>from;}
JsGraph.prototype.DriverDrawPathPoly=function(poly,newPath,close){var size=poly.Size;if(size<2)return false;var ctx=this.Context2D;var xs=poly.X;var ys=poly.Y;if(newPath)ctx.beginPath();ctx.moveTo(xs[0],ys[0]);for(var i=1;i<size;i++){ctx.lineTo(xs[i],ys[i]);}
if(close)ctx.closePath();return true;}
JsGraph.prototype.DriverNextPathEnd=function(from){var plen=this.CurrPathSize;if(from>=plen)return-1;var p=this.CurrPath;for(var i=from;i<plen;i++){var c=p[i];var t=c.t;if(t==2){return i;}}
return plen;}
JsGraph.prototype.GetPathClipQuadrant=function(from,to){function minmax(x,y){if(x<xmin)xmin=x;if(x>xmax)xmax=x;if(y<ymin)ymin=y;if(y>ymax)ymax=y;}
if(this.DriverIsPathInsideRect(from,to,this.GraphClipInnerXmin,this.GraphClipInnerXmax,this.GraphClipInnerYmin,this.GraphClipInnerYmax)){return 0;}
var xmin=this.GraphClipOuterXmax+1000;var xmax=this.GraphClipOuterXmin-1000;var ymin=this.GraphClipOuterYmax+1000;var ymax=this.GraphClipOuterYmin-1000;var p=this.CurrPath;for(var i=from;i<to;i++){var c=p[i];var t=c.t;if(t==1||t==2){minmax(c.x,c.y);}else if(t==3){minmax(c.x-c.r,c.y-c.r);minmax(c.x+c.r,c.y+c.r);}else if(t==4){minmax(c.cx1,c.cy1);minmax(c.cx2,c.cy2);minmax(c.ex,c.ey);}}
return this.GetRectClipQuadrant(xmin,xmax,ymin,ymax);}
JsGraph.prototype.DriverIsPathInsideRect=function(from,to,xmin,xmax,ymin,ymax){var p=this.CurrPath;for(var i=from;i<to;i++){var c=p[i];var t=c.t;if(t==1||t==2){if(c.x<xmin||c.x>xmax||c.y<ymin||c.y>ymax)return false;}else if(t==3){var x=c.x-c.r;var y=c.y-c.r;if(x<xmin||x>xmax||y<ymin||y>ymax)return false;var x=c.x+c.r;var y=c.y+c.r;if(x<xmin||x>xmax||y<ymin||y>ymax)return false;}else if(t==4){if(c.cx1<xmin||c.cx1>xmax||c.cy1<ymin||c.cy1>ymax)return false;if(c.cx2<xmin||c.cx2>xmax||c.cy2<ymin||c.cy2>ymax)return false;if(c.ex<xmin||c.ex>xmax||c.ey<ymin||c.ey>ymax)return false;}}
return true;}
JsGraph.prototype.PenUp=function(){this.PenDown=false;}
JsGraph.prototype.MoveTo=function(x,y){if(JsgVect2.Ok(x))return this.MoveTo(x[0],x[1]);this.LastX=x;this.LastY=y;if(this.IsPathOpen){var ctr=this.CurrTrans;ctr.ObjTransXY(this.GetObjTrans(),x,y);this.PathMoveTo(ctr.x,ctr.y);}
this.PenDown=true;return this;}
JsGraph.prototype.LineTo=function(x,y){if(JsgVect2.Ok(x))return this.LineTo(x[0],x[1]);var ctr=this.CurrTrans;if(this.IsPathOpen){ctr.ObjTransXY(this.GetObjTrans(),x,y);if(this.PenDown){this.PathLineTo(ctr.x,ctr.y);}else{this.PathMoveTo(ctr.x,ctr.y);}}else{if(this.PenDown){this.WorkLineXArray[0]=this.LastX;this.WorkLineXArray[1]=x;this.WorkLineYArray[0]=this.LastY;this.WorkLineYArray[1]=y;this.DriverDrawPoly(this.WorkLineXArray,this.WorkLineYArray,2,false,false);}}
this.PenDown=true;this.LastX=x;this.LastY=y;return this;}
JsGraph.prototype.WorkLineXArray=[0,0];JsGraph.prototype.WorkLineYArray=[0,0];JsGraph.prototype.Line=function(x1,y1,x2,y2,append){if(JsgVect2.Ok(x1))return this.Line(x1[0],x1[1],y1[0],y1[1],x2);append=xDefBool(append,false);if(this.IsPathOpen){var ctr=this.CurrTrans;ctr.ObjTransXY2(this.GetObjTrans(),x1,y1,x2,y2);if(append){this.PathLineTo(ctr.x1,ctr.y1);}else{this.PathMoveTo(ctr.x1,ctr.y1);}
this.PathLineTo(ctr.x2,ctr.y2);}else{this.WorkLineXArray[0]=x1;this.WorkLineXArray[1]=x2;this.WorkLineYArray[0]=y1;this.WorkLineYArray[1]=y2;this.DriverDrawPoly(this.WorkLineXArray,this.WorkLineYArray,2,false,false);}
this.PenDown=true;this.LastX=x2;this.LastY=y2;return this;}
JsGraph.prototype.Arrow=function(x1,y1,x2,y2,variant,mode,sym1,sym2){if(JsgVect2.Ok(x1))return this.Arrow(x1[0],x1[1],y1[0],y1[1],x2,y2);variant=xDefNum(variant,1);mode=xDefNum(mode,1+2);var ctr=this.CurrTrans;ctr.ObjTransXY2(this.GetObjTrans(),x1,y1,x2,y2);if(this.IsPathOpen&&(mode&8)){this.PathLineTo(ctr.x1,ctr.y1);}
if(x1==x2&&y1==y2){if(this.IsPathOpen){this.PathMoveTo(ctr.x2,ctr.y2);}
this.PenDown=true;this.LastX=x2;this.LastY=y2;return this;}
var otr=this.ObjTrans;var cnvsX1=ctr.x1,cnvsY1=ctr.y1,cnvsX2=ctr.x2,cnvsY2=ctr.y2;otr.TransXY2(x1,y1,x2,y2);var x1orig=otr.x1,y1orig=otr.y1,x2orig=otr.x2,y2orig=otr.y2;var x1corr=otr.x1,y1corr=otr.y1,x2corr=otr.x2,y2corr=otr.y2;var oldTransState=otr.Enable(false);if((variant&8)&&(variant&1)){var v=JsgVect2.New(cnvsX2-cnvsX1,cnvsY2-cnvsY1);var vd=JsgVect2.Scale(JsgVect2.Norm(v),-this.Context2D.lineWidth/2);var vs=JsgVect2.Add(v,vd);if(JsgVect2.ScalarProd(vs,v)<=0){variant|=4;}
x2corr=ctr.InvTransX(vs[0]+cnvsX1);y2corr=ctr.InvTransY(vs[1]+cnvsY1);}
if((variant&8)&&(variant&2)){var v=JsgVect2.New(cnvsX1-cnvsX2,cnvsY1-cnvsY2);var vd=JsgVect2.Scale(JsgVect2.Norm(v),-this.Context2D.lineWidth/2);var vs=JsgVect2.Add(v,vd);if(JsgVect2.ScalarProd(vs,v)<=0){variant|=4;}
var x1corr=ctr.InvTransX(vs[0]+cnvsX2);var y1corr=ctr.InvTransY(vs[1]+cnvsY2);}
if(!(variant&4)){var drawit=true;if(variant&8){var v1=JsgVect2.New(x2orig-x1orig,y2orig-y1orig);var v2=JsgVect2.New(x2corr-x1corr,y2corr-y1corr);drawit=(JsgVect2.ScalarProd(v1,v2)>0);}
if(drawit){this.Line(x1corr,y1corr,x2corr,y2corr);}}
if(xStr(sym1))this.SetMarkerSymbol(sym1);if(variant&2){var mat=JsgMat2.RotatingToXY(cnvsX1-cnvsX2,cnvsY1-cnvsY2);this.Marker(x1corr,y1corr,mode&3,mat);}
if(xStr(sym2))this.SetMarkerSymbol(sym2);if(variant&1){var mat=JsgMat2.RotatingToXY(cnvsX2-cnvsX1,cnvsY2-cnvsY1);this.Marker(x2corr,y2corr,mode&3,mat);}
otr.Enable(oldTransState);if(this.IsPathOpen){this.PathMoveTo(cnvsX2,cnvsY2);}
this.PenDown=true;this.LastX=x2;this.LastY=y2;return this;}
JsGraph.prototype.PolygonArrow=function(xArray,yArray,variant,lineMode,arrowMode,size,sym1,sym2){if(JsgPolygon.Ok(xArray)){return this.PolygonArrow(xArray.X,xArray.Y,yArray,variant,lineMode,xArray.Size,arrowMode,size);}
variant=xDefNum(variant,1);lineMode=xDefNum(lineMode,1);arrowMode=xDefNum(arrowMode,1+2);size=xDefNum(size,xArray.length);if(size<1)return this;if(size==1)return this.Line(xArray[0],yArray[0],xArray[0],yArray[0],((lineMode&8)>0));if(size==2)return this.Arrow(xArray[0],yArray[0],xArray[1],yArray[1],variant,arrowMode);var last=size-1;if(this.IsPathOpen&&(lineMode&8)){var ctr=this.CurrTrans;ctr.ObjTransXY(this.GetObjTrans(),xArray[0],yArray[0]);this.PathLineTo(ctr.x,ctr.y);}
if(!(variant&4)){if(lineMode&4){this.Polygon(xArray,yArray,lineMode&~8,size);}else{var skip=((variant&1)&&(variant&2)&&(size==3));if(!skip){if(this.IsPathOpen){this.Polygon(xArray,yArray,lineMode&3,size);}else{var x1=xArray[0];var y1=yArray[0];var x2=xArray[last];var y2=yArray[last];if(variant&2){xArray[0]=xArray[1];yArray[0]=yArray[1];}
if(variant&1){xArray[last]=xArray[last-1]
yArray[last]=yArray[last-1]}
this.Polygon(xArray,yArray,lineMode&3,size);xArray[0]=x1;yArray[0]=y1;xArray[last]=x2;yArray[last]=y2;}}}}
var hideSeg=this.IsPathOpen?4:0;if(variant&2){var x1=xArray[0],y1=yArray[0];var x2=xArray[1],y2=yArray[1];var i=1;while((i<last)&&(x1==x2)&&(y1==y2)){i++;x2=xArray[i];y2=yArray[i];}
this.Arrow(x1,y1,x2,y2,(variant&8)+hideSeg+2,arrowMode&(1+2),sym1);}
if(variant&1){var x1=xArray[last-1],y1=yArray[last-1];var x2=xArray[last],y2=yArray[last];var i=last-1;while((i>0)&&(x1==x2)&&(y1==y2)){i--;x1=xArray[i];y1=yArray[i];}
this.Arrow(x1,y1,x2,y2,(variant&8)+hideSeg+1,arrowMode&(1+2),sym2);}
var i=(lineMode&4)?0:last;this.PenDown=true;this.LastX=xArray[i];this.LastY=yArray[i];if(this.IsPathOpen){var ctr=this.CurrTrans;ctr.ObjTransXY(this.GetObjTrans(),this.LastX,this.LastY);this.PathMoveTo(ctr.x,ctr.y);}
return this;}
JsGraph.prototype.RectWH=function(x,y,w,h,mode,roll){if(JsgRect.Ok(x))return this.Rect(x.x,x.y,x.x+x.w,x.y+x.h,y,w);return this.Rect(x,y,x+w,y+h,mode,roll);}
JsGraph.prototype.Rect=function(x1,y1,x2,y2,mode,roll){if(!xDef(x1)){var oldTransState=this.ObjTrans.Enable(false);this.Rect(this.GetFrame(),1)
this.ObjTrans.Endable(oldTransState);return this;}
if(xObj(x1)){if(JsgRect.Ok(x1))return this.Rect(x1.x,x1.y,x1.x+x1.w,x1.y+x1.h,y1,x2);return this.Rect(x1.xmin,x1.ymin,x1.xmax,x1.ymax,y1,x2);}
if(JsgVect2.Ok(x1))return this.Rect(x1[0],x1[1],y1[0],y1[1],x2,y2);this.DriverDrawRect(x1,y1,x2,y2,mode,roll);return this;}
JsGraph.prototype.DriverDrawRect=function(x1,y1,x2,y2,mode,roll){mode=xDefNum(mode,1);roll=xDefNum(roll,0);var ctr=this.CurrTrans;var otr=this.ObjTrans;var inv=!!(mode&4);if(this.IsPathOpen){var poly=this.MakeRectPolygon(x1,y1,x2,y2,inv,roll);this.Polygon(poly,mode&11);return;}
if(otr.Enabled&&!otr.IsMoveOnly){this.RectAsPolygon(x1,y1,x2,y2,mode,inv,roll);return;}
ctr.ObjTransXY2(this.GetObjTrans(),x1,y1,x2,y2);if(ctr.x1>ctr.x2){var tmp=ctr.x1;ctr.x1=ctr.x2;ctr.x2=tmp;}
if(ctr.y1>ctr.y2){var tmp=ctr.y1;ctr.y1=ctr.y2;ctr.y2=tmp;}
var ctx=this.Context2D;var quadrant=0;if(this.GraphClipEnabled){quadrant=this.GetRectClipQuadrant(ctr.x1,ctr.x2,ctr.y1,ctr.y2);}
if(quadrant==0){if(mode&2){ctx.fillRect(ctr.x1,ctr.y1,ctr.x2-ctr.x1,ctr.y2-ctr.y1);}
if(mode&1){var oldJoin=ctx.lineJoin;var oldCap=ctx.lineCap;if(oldJoin=='round'){ctx.lineCap='round';}else{ctx.lineJoin='miter';ctx.lineCap='square';}
ctx.strokeRect(ctr.x1,ctr.y1,ctr.x2-ctr.x1,ctr.y2-ctr.y1);ctx.lineJoin=oldJoin;ctx.lineCap=oldCap;}}else if(quadrant==2){this.RectAsPolygon(x1,y1,x2,y2,mode,inv,roll);}}
JsGraph.prototype.RectAsPolygon=function(x1,y1,x2,y2,mode,inv,roll){var poly=this.MakeRectPolygon(x1,y1,x2,y2,inv,roll);var oldJoin=this.LineJoin;var oldCap=this.LineCap;if(oldJoin=='round'){this.SetLineCap('round');}else{this.SetLineJoin('miter');this.SetLineCap('square');}
this.Polygon(poly,mode&11);this.SetLineJoin(oldJoin);this.SetLineCap(oldCap);}
JsGraph.prototype.MakeRectPolygon=function(x1,y1,x2,y2,inverse,roll){if(JsgVect2.Ok(x1))return this.MakeRectPolygon(x1[0],x1[1],y1[0],y1[1],x2,y2);if(xObj(x1)){if(JsgRect.Ok(x1))return this.MakeRectPolygon(x1.x,x1.y,x1.x+x1.w,x1.y+x1.h,y1,x2);return this.MakeRectPolygon(x1.xmin,x1.ymin,x1.xmax,x1.ymax,y1,x2);}
inverse=xDefBool(inverse,false);roll=xDefNum(roll,0);if(x1>x2){var tmp=x1;x1=x2;x2=tmp;}
if(y1>y2){var tmp=y1;y1=y2;y2=tmp;}
var poly=this.WorkPoly.Reset();poly.AddPoint(x1,y1);poly.AddPoint(x2,y1);poly.AddPoint(x2,y2);poly.AddPoint(x1,y2);if(roll!==0)poly.Roll(roll);poly.AddPoint(poly.X[0],poly.Y[0]);if(inverse)poly.Invert();return poly;}
JsGraph.prototype.DegToRad=function(a){return a/180*Math.PI;}
JsGraph.prototype.RadToDeg=function(a){return a/Math.PI*180;}
JsGraph.prototype.AngleToRad=function(a){return this.AngleMeasure=='deg'?this.DegToRad(a):a;}
JsGraph.prototype.RadToAngle=function(a){return this.AngleMeasure=='deg'?this.RadToDeg(a):a;}
JsGraph.prototype.AngleOfVector=function(x,y){if(JsgVect2.Ok(x))return this.AngleOfVector(x[0],x[1]);var r=Math.sqrt(x*x+y*y);var ang=0;if(r>0)ang=Math.acos(x/r);if(y<0)ang=2*Math.PI-ang;if(this.AngleMeasure=='deg')ang=this.RadToDeg(ang);return ang;}
JsGraph.prototype.MakeArcFromPoints=function(x1,y1,x2,y2,r,big){var arc={x:x1,y:y1,r:r,start:0,end:0};var absr=Math.abs(r);var mx=(x2-x1)/2;var my=(y2-y1)/2;var ml=Math.sqrt(mx*mx+my*my);if(ml==0)return arc;var hl=0;if(absr>ml)hl=Math.sqrt(absr*absr-ml*ml);var hx=-hl*my/ml;var hy=hl*mx/ml;if((r<0)^big){hx=-hx;hy=-hy;}
arc.x=x1+mx+hx;arc.y=y1+my+hy;arc.start=this.AngleOfVector(x1-arc.x,y1-arc.y);arc.end=this.AngleOfVector(x2-arc.x,y2-arc.y);return arc;}
JsGraph.prototype.MakeEllipseArcPolygon=function(x,y,rx,ry,rot,start,end,rPixel,nSegments){if(JsgVect2.Ok(x))return this.MakeEllipseArcPolygon(x[0],x[1],y,rx,ry,rot,start,end,rPixel);ry=xDefNum(ry,Math.abs(rx));rot=xDefNum(rot,0);start=xDefNum(start,0);end=xDefNum(end,start+this.RadToAngle(2*Math.PI));var abs=Math.abs,max=Math.max;var ctr=this.CurrTrans;var otr=this.ObjTrans;var absRx=abs(rx);var absRy=abs(ry);if(!xDef(rPixel)&&!xDef(nSegments)){var maxR=max(absRx,absRy);var s=otr.MaxScaling();var cnvsRx=abs(s*ctr.ScaleX*maxR);var cnvsRy=abs(s*ctr.ScaleY*maxR);rPixel=max(cnvsRx,cnvsRy);}
rot=this.AngleToRad(rot);start=this.AngleToRad(start);end=this.AngleToRad(end);var delta;if(xDef(nSegments)){delta=Math.abs(start-end)/nSegments;}else{delta=this.CompDeltaAngle(rPixel,this.CurvePrecision/this.DevicePixelRatio);}
var angles={delta:delta,start:start,end:end};if(rx<0)angles.delta*=-1;this.NormalizeAngles(angles);rot=this.NormalizeAngle(rot);var poly=this.MakeUnityArcPolygon(angles);var mat=JsgMat2.Transformation(absRx,absRy,rot,x,y);JsgMat2.TransPolyXY(mat,poly.X,poly.Y,poly.Size);return poly;}
JsGraph.prototype.Circle=function(x,y,r,mode,startAngle){if(JsgVect2.Ok(x))return this.Circle(x[0],x[1],y,r,mode);startAngle=xDefNum(startAngle,0);var start=startAngle;var end=startAngle+this.RadToAngle(2*Math.PI);if(r<0){start=end;end=startAngle;}
this.Arc(x,y,r,start,end,mode);return this;}
JsGraph.prototype.Arc=function(x,y,r,start,end,mode){if(JsgVect2.Ok(x))return this.Arc(x[0],x[1],y,r,start,end);var ctr=this.CurrTrans;var cnvsRX=Math.abs(ctr.ScaleX*r);var cnvsRY=Math.abs(ctr.ScaleY*r);var cnvsRDiff=Math.abs(cnvsRX-cnvsRY);if(this.DisableNativeArc||!this.ObjTrans.IsMoveOnly||cnvsRDiff>this.CurvePrecision/this.DevicePixelRatio){this.EllipseArcAsPolygon(x,y,r,Math.abs(r),0,start,end,mode);}else{this.DriverDrawArc(x,y,r,start,end,mode);}
return this;}
JsGraph.prototype.ArcTo=function(x,y,r,big,mode){if(JsgVect2.Ok(x))return this.ArcTo(x[0],x[1],y,r,big);this.ArcPt(this.LastX,this.LastY,x,y,r,big,mode|8);return this;}
JsGraph.prototype.ArcPt=function(x1,y1,x2,y2,r,big,mode){if(JsgVect2.Ok(x1))return this.ArcPt(x1[0],x1[1],y1[0],y1[1],x2,y2,r);big=xDefBool(big,false);mode=xDefNum(mode,1);var arc=this.MakeArcFromPoints(x1,y1,x2,y2,r,big);this.Arc(arc.x,arc.y,arc.r,arc.start,arc.end,mode);this.PenDown=true;this.LastX=x2;this.LastY=y2;return this;}
JsGraph.prototype.DriverDrawArc=function(x,y,r,start,end,mode){start=xDefNum(start,0);end=xDefNum(end,start+this.RadToAngle(2*Math.PI));mode=xDefNum(mode,1);var cnvsStart=this.AngleToRad(start);var cnvsEnd=this.AngleToRad(end);var ctx=this.Context2D;var ctr=this.CurrTrans;ctr.ObjTransXY(this.GetObjTrans(),x,y);var cnvsRX=Math.abs(ctr.ScaleX*r);var angles={delta:r,start:cnvsStart,end:cnvsEnd};if(ctr.ScaleX*ctr.ScaleY<0){angles.delta*=-1;angles.start*=-1;angles.end*=-1;}
this.NormalizeAngles(angles);var inverse=(angles.delta<0);if(this.IsPathOpen){this.PathAppendArc(ctr.x,ctr.y,cnvsRX,angles.start,angles.end,inverse,((mode&8)>0),((mode&4)>0));}else{var quadrant=0;if(this.GraphClipEnabled){quadrant=this.GetCircleClipQuadrant(ctr.x,ctr.y,cnvsRX);}
if(quadrant==0){if(mode&2){ctx.beginPath();ctx.arc(ctr.x,ctr.y,cnvsRX,angles.start,angles.end,inverse);ctx.fill();}
if(mode&1){ctx.beginPath();ctx.arc(ctr.x,ctr.y,cnvsRX,angles.start,angles.end,inverse);if(mode&4)ctx.closePath();ctx.stroke();}}else if(quadrant==2){this.EllipseArcAsPolygon(x,y,r,Math.abs(r),0,start,end,mode);}}
var rAbs=Math.abs(r);this.LastX=x+rAbs*Math.cos(end);this.LastY=y+rAbs*Math.sin(end);}
JsGraph.prototype.Ellipse=function(x,y,rx,ry,rot,mode,startAngle){if(JsgVect2.Ok(x))return this.Ellipse(x[0],x[1],y,rx,ry,rot,mode);startAngle=xDefNum(startAngle,0);var start=startAngle;var end=startAngle+this.RadToAngle(2*Math.PI);if(rx<0){start=end;end=startAngle;}
this.EllipseArc(x,y,rx,ry,rot,start,end,mode);return this;}
JsGraph.prototype.EllipseArc=function(x,y,rx,ry,rot,start,end,mode){if(JsgVect2.Ok(x))return this.EllipseArc(x[0],x[1],y,rx,ry,rot,start,end);var ctr=this.CurrTrans;var abs=Math.abs;var precision=this.CurvePrecision/this.DevicePixelRatio;var isCircular=!this.DisableNativeArc&&this.ObjTrans.IsMoveOnly;if(isCircular){var cnvsRxx=abs(ctr.ScaleX*rx);var cnvsRxy=abs(ctr.ScaleY*rx);if(abs(cnvsRxx-cnvsRxy)>precision)isCircular=false;if(isCircular){var cnvsRyx=abs(ctr.ScaleX*ry);var cnvsRyy=abs(ctr.ScaleY*ry);if(abs(cnvsRyx-cnvsRyy)>precision)isCircular=false;if(isCircular){if(abs(cnvsRxx-cnvsRyx)>precision)isCircular=false;}}}
if(isCircular){rot=xDefNum(rot,0);start=xDefNum(start,0);end=xDefNum(end,start+this.RadToAngle(2*Math.PI));this.DriverDrawArc(x,y,rx,start+rot,end+rot,mode);}else{this.EllipseArcAsPolygon(x,y,rx,ry,rot,start,end,mode);}
return this;}
JsGraph.prototype.IsClosedPolygon=function(xArray,yArray,size){if(JsgPolygon.Ok(xArray))return this.IsClosedPolygon(xArray.X,xArray.Y,xArray.Size);size=xDefNum(size,xArray.length);var closed=false;var last=size-1;if(last>=2){var refLen=0.5/this.DevicePixelRatio;if(JsgVect2.Length2(xArray[0]-xArray[last],yArray[0]-yArray[last])<=(refLen*refLen))closed=true;}
return closed;}
JsGraph.prototype.EllipseArcAsPolygon=function(x,y,rx,ry,rot,start,end,mode){mode=xDefNum(mode,1);var ell=this.MakeEllipseArcPolygon(x,y,rx,ry,rot,start,end);var closed=this.IsClosedPolygon(ell.X,ell.Y,ell.Size);if(closed){var ctx=this.Context2D
var oldJoin=ctx.lineJoin;var oldCap=ctx.lineCap;ctx.lineJoin='round';ctx.lineCap='round';this.Polygon(ell,mode);ctx.lineJoin=oldJoin;ctx.lineCap=oldCap;}else{this.Polygon(ell,mode);}}
JsGraph.prototype.DriverWorkPoly=new JsgPolygon(false,'JsGraph.DriverWorkPoly');JsGraph.prototype.DriverWorkClipPoly=new JsgPolygon(false,'JsGraph.DriverWorkClipPoly');JsGraph.prototype.DriverWorkClipPolyList=new JsgPolygonList(false,'JsGraph.DriverWorkClipPolyList');JsGraph.prototype.DriverDrawPoly=function(xArray,yArray,size,fillMode,close,poly){var ctr=this.CurrTrans;var otr=this.GetObjTrans();var ctx=this.Context2D;if(!xDef(poly)){poly=this.DriverWorkPoly.Reset();poly.Quadrant=-1;for(var i=0;i<size;i++){ctr.ObjTransXY(otr,xArray[i],yArray[i]);poly.AddPoint(ctr.x,ctr.y);}}
if(this.GraphClipEnabled){var quadrant=poly.Quadrant;if(quadrant==-1){quadrant=this.GetPolygonClipQuadrant(poly.X,poly.Y,poly.Size);poly.Quadrant=quadrant;}
if(fillMode){var polyClipped=null;if(quadrant==0){polyClipped=poly;}else if(quadrant==2){var didClosePoly=this.ClosePolygon(poly);polyClipped=this.ClipPolygonArea(poly,this.GraphClipInnerXmin,this.GraphClipInnerXmax,this.GraphClipInnerYmin,this.GraphClipInnerYmax,this.DriverWorkClipPoly);if(didClosePoly)poly.RemoveLastPoint();}
if(polyClipped){if(this.DriverDrawPathPoly(polyClipped,true,false)){ctx.fill();}}}else{if(quadrant==0){if(this.DriverDrawPathPoly(poly,true,close)){ctx.stroke();}}else if(quadrant==2){var didClosePoly=false;if(close)didClosePoly=this.ClosePolygon(poly);var polyListClipped=this.ClipPolygon(poly,this.GraphClipInnerXmin,this.GraphClipInnerXmax,this.GraphClipInnerYmin,this.GraphClipInnerYmax,ctx.lineWidth/2,this.DriverWorkClipPolyList);if(polyListClipped.Size>0){var newPath=true;for(var i=0;i<polyListClipped.Size;i++){var polyClipped=polyListClipped.PolyList[i];if(this.DriverDrawPathPoly(polyClipped,newPath,false)){newPath=false;}}
if(!newPath)ctx.stroke();}
if(didClosePoly)poly.RemoveLastPoint();}}}else{if(this.DriverDrawPathPoly(poly,true,close)){if(fillMode){ctx.fill();}else{ctx.stroke();}}}
return poly;}
JsGraph.prototype.DriverDrawBezierCurve=function(sx,sy,cx1,cy1,cx2,cy2,ex,ey,mode,nSegments){mode=xDefNum(mode,1);var ctx=this.Context2D;var ctr=this.CurrTrans;var otr=this.GetObjTrans();ctr.ObjTransXY(otr,sx,sy);var cnvsSx=ctr.x,cnvsSy=ctr.y;ctr.ObjTransXY(otr,cx1,cy1);var cnvsCx1=ctr.x,cnvsCy1=ctr.y;ctr.ObjTransXY(otr,cx2,cy2);var cnvsCx2=ctr.x,cnvsCy2=ctr.y;ctr.ObjTransXY(otr,ex,ey);var cnvsEx=ctr.x,cnvsEy=ctr.y;if(this.IsPathOpen){if(mode&8){this.PathLineTo(cnvsSx,cnvsSy);}else{this.PathMoveTo(cnvsSx,cnvsSy);}
this.PathAppendBezierTo(cnvsCx1,cnvsCy1,cnvsCx2,cnvsCy2,cnvsEx,cnvsEy);if(mode&4){this.PathLineTo(cnvsSx,cnvsSy);}}else{if(mode&8){if(this.LastX!=sx||this.LastY!=sy){this.Line(this.LastX,this.LastY,sx,sy);}}
var quadrant=0;if(this.GraphClipEnabled){quadrant=this.GetBezierClipQuadrant(cnvsSx,cnvsSy,cnvsCx1,cnvsCy1,cnvsCx2,cnvsCy2,cnvsEx,cnvsEy);}
if(quadrant==0){if(mode&2){ctx.beginPath();ctx.moveTo(cnvsSx,cnvsSy);ctx.bezierCurveTo(cnvsCx1,cnvsCy1,cnvsCx2,cnvsCy2,cnvsEx,cnvsEy);ctx.fill();}
if(mode&1){ctx.beginPath();ctx.moveTo(cnvsSx,cnvsSy);ctx.bezierCurveTo(cnvsCx1,cnvsCy1,cnvsCx2,cnvsCy2,cnvsEx,cnvsEy);if(mode&4)ctx.closePath();ctx.stroke();}}else if(quadrant==2){this.BezierCurveAsPolygon(sx,sy,cx1,cy1,cx2,cy2,ex,ey,mode,nSegments);}}
this.PenDown=true;if(mode&4){this.LastX=sx;this.LastY=sy;}else{this.LastX=ex;this.LastY=ey;}}
JsGraph.prototype.NewPoly=function(){this.Poly.Reset();return this;}
JsGraph.prototype.CopyPoly=function(to,reuseArrays){reuseArrays=xDefBool(reuseArrays,false);return this.Poly.Copy(to,!reuseArrays);}
JsGraph.prototype.AddPointToPoly=function(x,y){this.Poly.AddPoint(x,y);return this;}
JsGraph.prototype.AddVectToPoly=function(vec){this.Poly.AddPoint(vec[0],vec[1]);return this;}
JsGraph.prototype.DrawPoly=function(mode){mode=xDefNum(mode,1);if(mode&16)this.Poly.Invert();this.Polygon(this.Poly,mode);}
JsGraph.prototype.DrawPolyArrow=function(variant,lineMode,arrowMode){this.PolygonArrow(this.Poly,variant,lineMode,arrowMode);}
JsGraph.prototype.DrawPolyMarker=function(mode,mat){this.Marker(this.Poly,mode,mat);}
JsGraph.prototype.Polygon=function(xArray,yArray,mode,size){if(JsgPolygon.Ok(xArray))return this.Polygon(xArray.X,xArray.Y,yArray,xArray.Size);mode=xDefNum(mode,1);size=xDefNum(size,xArray.length);if(size<1)return this;if(this.IsPathOpen){this.PathAppendPolygon(xArray,yArray,((mode&8)>0),((mode&4)>0),size);}else{var poly;if(mode&2){poly=this.DriverDrawPoly(xArray,yArray,size,true,false);}
if(mode&1){this.DriverDrawPoly(xArray,yArray,size,false,(mode&4)>0,poly);}}
var i=(mode&4)?0:size-1;this.PenDown=true;this.LastX=xArray[i];this.LastY=yArray[i];return this;}
JsGraph.prototype.PolygonList=function(polyList,mode){if(!JsgPolygonList.Ok(polyList))return g.Polygon(polyList,mode);for(var i=0;i<polyList.Size;i++){this.Polygon(polyList.PolyList[i],mode);}
return this;}
JsGraph.prototype.ClosePolygon=function(poly){var last=poly.Size-1;if(last<1)return false;if(poly.X[0]!=poly.X[last]||poly.Y[0]!=poly.Y[last]){poly.AddPoint(poly.X[0],poly.Y[0]);return true;}
return false;}
JsGraph.prototype.WorkPolyClipped=new JsgPolygon(false,'JsGraph.WorkPolyClipped');JsGraph.prototype.ClipPolygonArea=function(poly,xmin,xmax,ymin,ymax,polyClipped){polyClipped=polyClipped||new JsgPolygon();var polyClipped2=this.WorkPolyClipped;this.ClipPolygonAtLine(poly,xmin,false,false,polyClipped2);this.ClipPolygonAtLine(polyClipped2,ymin,false,true,polyClipped);this.ClipPolygonAtLine(polyClipped,xmax,true,false,polyClipped2);this.ClipPolygonAtLine(polyClipped2,ymax,true,true,polyClipped);return polyClipped;}
JsGraph.prototype.WorkPolyListClipped=new JsgPolygonList(false,'JsGraph.WorkPolyListClipped');JsGraph.prototype.ClipPolygon=function(poly,xmin,xmax,ymin,ymax,extend,polyListClipped){extend=xDefNum(extend,0);if(extend!=0){xmin-=extend;xmax+=extend;ymin-=extend;ymax+=extend;}
polyListClipped=polyListClipped||new JsgPolygonList();var polyListClipped2=this.WorkPolyListClipped;polyListClipped2.Reset();this.ClipPolygonAtLine(poly,xmin,false,false,polyListClipped2);polyListClipped.Reset();for(var i=0;i<polyListClipped2.Size;i++){this.ClipPolygonAtLine(polyListClipped2.PolyList[i],ymin,false,true,polyListClipped);}
polyListClipped2.Reset();for(var i=0;i<polyListClipped.Size;i++){this.ClipPolygonAtLine(polyListClipped.PolyList[i],xmax,true,false,polyListClipped2);}
polyListClipped.Reset();for(var i=0;i<polyListClipped2.Size;i++){this.ClipPolygonAtLine(polyListClipped2.PolyList[i],ymax,true,true,polyListClipped);}
return polyListClipped;}
JsGraph.prototype.ClipPolygonAtLine=function(poly,clipCoord,clipAtMax,clipHorizontal,polyClipped){function AddPointToPolyClipped(x,y){if(clipHorizontal){polyClipped.AddPoint(y,x);}else{polyClipped.AddPoint(x,y);}}
function IsInside(x){return clipAtMax?x<=clipCoord:x>=clipCoord;}
var isBorderClipMode=JsgPolygonList.Ok(polyClipped);if(!isBorderClipMode)polyClipped.Reset();if(poly.Size==0)return;var isP1Inside,isP2Inside,polyX,polyY;if(clipHorizontal){polyX=poly.Y;polyY=poly.X;}else{polyX=poly.X;polyY=poly.Y;}
isP1Inside=IsInside(polyX[0]);if(poly.Size==1){if(isP1Inside){if(isBorderClipMode)polyClipped.NewPoly();polyClipped.AddPoint(poly.X[0],poly.Y[0]);}
return;}
var polyClosed=false;if(!isBorderClipMode){polyClosed=this.ClosePolygon(poly);}
var isLastP2Added=false;var nlast=poly.Size-2;for(var i=0;i<=nlast;i++){var i2=i+1;isP2Inside=IsInside(polyX[i2]);if(isP1Inside&&isP2Inside){if(!isLastP2Added){if(isBorderClipMode)polyClipped.NewPoly();AddPointToPolyClipped(polyX[i],polyY[i]);}
AddPointToPolyClipped(polyX[i2],polyY[i2]);isLastP2Added=true;}else if(isP1Inside!=isP2Inside){var intersectCoord=this.ClipIntersectionCoord(polyX[i],polyY[i],polyX[i2],polyY[i2],clipCoord);if(isP1Inside){if(!isLastP2Added){if(isBorderClipMode)polyClipped.NewPoly();AddPointToPolyClipped(polyX[i],polyY[i]);}
AddPointToPolyClipped(clipCoord,intersectCoord);isLastP2Added=false;}else{if(isBorderClipMode)polyClipped.NewPoly();AddPointToPolyClipped(clipCoord,intersectCoord);AddPointToPolyClipped(polyX[i2],polyY[i2]);isLastP2Added=true;}}
isP1Inside=isP2Inside;}
if(polyClosed)poly.RemoveLastPoint();}
JsGraph.prototype.GetRectQuadrant=function(rxmin,rxmax,rymin,rymax,xmin,xmax,ymin,ymax){if(rxmin>=xmin&&rxmax<=xmax&&rymin>=ymin&&rymax<=ymax)return 0;if(rxmax<xmin||rxmin>xmax||rymax<ymin||rymin>ymax)return 1;return 2;}
JsGraph.prototype.GetRectClipQuadrant=function(rxmin,rxmax,rymin,rymax){if(rxmin>=this.GraphClipInnerXmin&&rxmax<=this.GraphClipInnerXmax&&rymin>=this.GraphClipInnerYmin&&rymax<=this.GraphClipInnerYmax)return 0;if(rxmax<this.GraphClipInnerXmin||rxmin>this.GraphClipInnerXmax||rymax<this.GraphClipInnerYmin||rymin>this.GraphClipInnerYmax)return 1;if(rxmin>=this.GraphClipOuterXmin&&rxmax<=this.GraphClipOuterXmax&&rymin>=this.GraphClipOuterYmin&&rymax<=this.GraphClipOuterYmax)return 0;return 2;}
JsGraph.prototype.GetPolygonClipQuadrant=function(xArray,yArray,size){if(this.IsPolygonArrayInsideRect(xArray,yArray,size,this.GraphClipInnerXmin,this.GraphClipInnerXmax,this.GraphClipInnerYmin,this.GraphClipInnerYmax)){return 0;}
var xmin=xArray[0];var xmax=xmin;var ymin=yArray[0];var ymax=ymin;for(var i=1;i<size;i++){var x=xArray[i];var y=yArray[i];if(x<xmin)xmin=x;if(x>xmax)xmax=x;if(y<ymin)ymin=y;if(y>ymax)ymax=y;}
return this.GetRectClipQuadrant(xmin,xmax,ymin,ymax);}
JsGraph.prototype.GetCircleClipQuadrant=function(x,y,r){return this.GetRectClipQuadrant(x-r,x+r,y-r,y+r);}
JsGraph.prototype.GetBezierClipQuadrant=function(px1,py1,cx1,cy1,cx2,cy2,px2,py2){var rxmin=Math.min(px1,cx1,cx2,px2);var rxmax=Math.max(px1,cx1,cx2,px2);var rymin=Math.min(py1,cy1,cy2,py2);var rymax=Math.max(py1,cy1,cy2,py2);return this.GetRectClipQuadrant(rxmin,rxmax,rymin,rymax);}
JsGraph.prototype.IsPointInsideRect=function(x,y,xmin,xmax,ymin,ymax){return(x>=xmin&&x<=xmax&&y>=ymin&&y<=ymax);}
JsGraph.prototype.IsPolygonInsideRect=function(xArray,yArray,size,xmin,xmax,ymin,ymax){if(JsgPolygon.Ok(xArray)){return this.IsPolygonArrayInsideRect(xArray.X,xArray.Y,xArray.Size,yArray,size,xmin,xmax);}else{return this.IsPolygonArrayInsideRect(xArray,yArray,size,xmin,xmax,ymin,ymax);}}
JsGraph.prototype.IsPolygonArrayInsideRect=function(xArray,yArray,size,xmin,xmax,ymin,ymax){for(var i=0;i<size;i++){if(xArray[i]<xmin||xArray[i]>xmax||yArray[i]<ymin||yArray[i]>ymax)return false;}
return true;}
JsGraph.prototype.ClipIntersectionCoord=function(x1,y1,x2,y2,clipx){return(y2-y1)*(clipx-x1)/(x2-x1)+y1;}
JsGraph.prototype.BezierCurveTo=function(cx1,cy1,cx2,cy2,ex,ey,mode){if(JsgVect2.Ok(cx1))return this.BezierCurve(this.LastX,this.LastY,cx1[0],cx1[1],cy1[0],cy1[1],cx2[0],cx2[1],cy2);if(JsgPolygon.Ok(cx1))return this.BezierCurve(this.LastX,this.LastY,sx.X[0],sx.Y[0],sx.X[1],sx.Y[1],sx.X[2],sx.Y[2],sy);mode=xDefNum(mode,1)|8;this.BezierCurve(this.LastX,this.LastY,cx1,cy1,cx2,cy2,ex,ey,mode);return this;}
JsGraph.prototype.BezierCurve=function(sx,sy,cx1,cy1,cx2,cy2,ex,ey,mode,nSegments){if(JsgVect2.Ok(sx)){return this.BezierCurve(sx[0],sx[1],sy[0],sy[1],cx1[0],cx1[1],cy1[0],cy1[1],cx2,cx1);}
if(JsgPolygon.Ok(sx)){var i=xDefNum(cx1,0);return this.BezierCurve(sx.X[i],sx.Y[i],sx.X[i+1],sx.Y[i+1],sx.X[i+2],sx.Y[i+2],sx.X[i+3],sx.Y[i+3],sy,cy1);}
if(this.DisableNativeBezier||xNum(nSegments)){this.BezierCurveAsPolygon(sx,sy,cx1,cy1,cx2,cy2,ex,ey,mode,nSegments);}else{this.DriverDrawBezierCurve(sx,sy,cx1,cy1,cx2,cy2,ex,ey,mode,nSegments);}
return this;}
JsGraph.prototype.MakeBezierPolygon=function(sx,sy,cx1,cy1,cx2,cy2,ex,ey,nSegments,add,polyRet){if(JsgVect2.Ok(sx)){return this.MakeBezierPolygon(sx[0],sx[1],sy[0],sy[1],cx1[0],cx1[1],cy1[0],cy1[1],cx2,cy2,ex);}
if(JsgPolygon.Ok(sx)){polyRet=polyRet||this.WorkPoly2;var startIx=xDefNum(sy,0);if(sx.Size<startIx+4){add=xDefBool(add,false);if(!add)polyRet.Reset();return polyRet;}
var i=xDefNum(sy,0);return this.MakeBezierPolygon(sx.X[i+0],sx.Y[i+0],sx.X[i+1],sx.Y[i+1],sx.X[i+2],sx.Y[i+2],sx.X[i+3],sx.Y[i+3],cx1,cy1,cx2);}
nSegments=xDefNum(nSegments,this.NumBezierSegments);add=xDefBool(add,false);var polyRet=polyRet||this.WorkPoly2;if(!add)polyRet.Reset();var dt=1/nSegments;var tlast=1+dt/2;for(var t=0;t<tlast;t+=dt){var t2=t*t;var t3=t*t2;var mt=1-t;var mt2=mt*mt;var mt3=mt*mt2;var x=sx*mt3+cx1*3*mt2*t+cx2*3*mt*t2+ex*t3;var y=sy*mt3+cy1*3*mt2*t+cy2*3*mt*t2+ey*t3;polyRet.AddPoint(x,y);}
return polyRet;}
JsGraph.prototype.MakeSplineCurve=function(xArray,yArray,tension,mode,size,nSegments,polyRet){if(JsgPolygon.Ok(xArray)){return this.MakeSplineCurve(xArray.X,xArray.Y,yArray,tension,xArray.Size,mode);}
var bezierPoly=this.SplineCurve(xArray,yArray,tension,mode,size);polyRet=polyRet||this.WorkPoly2;polyRet.Reset();var first=0;var last=bezierPoly.Size-1;if(!(mode&4)&&(mode&64)){if((mode&16)&&(last-first>3))first+=3;if((mode&32)&&(last-first>3))last-=3;}
for(var i=first;i<last;i+=3){this.MakeBezierPolygon(bezierPoly,i,nSegments,true,polyRet);}
return polyRet;}
JsGraph.prototype.BezierCurveAsPolygon=function(sx,sy,cx1,cy1,cx2,cy2,ex,ey,mode,nSegments){nSegments=xDefNum(nSegments,this.NumBezierSegments);var poly=this.MakeBezierPolygon(sx,sy,cx1,cy1,cx2,cy2,ex,ey,nSegments);this.Polygon(poly,mode);}
JsGraph.prototype.ComputeBezierControlPoints=function(poly,tension,last,symmetric){function LengthFor(side1,side2){return Math.sqrt(side1*side1+side2*side2);}
var fa,fb;var px=poly.X;var py=poly.Y;for(var i=1;i<=last;i++){var pivot=3*i;var left=pivot-3;var right=pivot+3;var ca=pivot-1;var cb=pivot+1;var d01=LengthFor(px[pivot]-px[left],py[pivot]-py[left]);var d12=LengthFor(px[right]-px[pivot],py[right]-py[pivot]);var d=d01+d12;if(d>0){fa=tension*d01/d;fb=tension*d12/d;if(symmetric){if(fa>fb){fa=fb;}else if(fb>fa){fb=fa;}}}else{fa=0;fb=0;}
var w=px[right]-px[left];var h=py[right]-py[left];px[ca]=px[pivot]-fa*w;py[ca]=py[pivot]-fa*h;px[cb]=px[pivot]+fb*w;py[cb]=py[pivot]+fb*h;}}
JsGraph.prototype.SplineCurve=function(xArray,yArray,tension,mode,size){if(JsgPolygon.Ok(xArray)){return this.SplineCurve(xArray.X,xArray.Y,yArray,tension,xArray.Size);}
tension=xDefNum(tension,0.5);mode=xDefNum(mode,1);size=xDefNum(size,xArray.length);if(size<2)return this;if(size==2){return this.Line(xArray[0],yArray[0],xArray[1],yArray[1],(mode&8)>0);}
var poly=this.WorkPoly.Reset();var first=0;var last=size-1;var nPoints=size;var firstIsControlPoint=(!(mode&4)&&(mode&16)&&!(mode&64)&&(nPoints>=3));if(firstIsControlPoint){first++;nPoints--;}
var lastIsControlPoint=(!(mode&4)&&(mode&32)&&!(mode&64)&&(nPoints>=3));if(lastIsControlPoint){last--;nPoints--;}
poly.AddPoint(xArray[first],yArray[first]);for(var i=first+1;i<=last;i++){poly.AddPoint(0,0);poly.AddPoint(0,0);poly.AddPoint(xArray[i],yArray[i]);}
var finalPolySize=poly.Size;if(mode&4){poly.AddPoint(0,0);poly.AddPoint(0,0);poly.AddPoint(xArray[0],yArray[0]);poly.AddPoint(0,0);poly.AddPoint(0,0);poly.AddPoint(xArray[1],yArray[1]);finalPolySize=poly.Size-3;}else{poly.X[1]=xArray[0];poly.Y[1]=yArray[0];var last=poly.Size-2;poly.X[last]=xArray[size-1];poly.Y[last]=yArray[size-1];}
var last=(mode&4)?size:size-2;if(firstIsControlPoint)last--;if(lastIsControlPoint)last--;this.ComputeBezierControlPoints(poly,tension,last,(mode&128)?true:false);if(mode&4){var i=poly.Size-3;poly.X[1]=poly.X[i];poly.Y[1]=poly.Y[i];poly.Size=finalPolySize;}
if(!(mode&3))return this.WorkPoly;var oldIsPathOpen=this.IsPathOpen;if(!oldIsPathOpen){this.OpenPath();}
first=0;last=poly.Size-1;if(!(mode&4)&&(mode&64)){if((mode&16)&&(last-first>3))first+=3;if((mode&32)&&(last-first>3))last-=3;}
var closedBorder=((mode&5)==5);mode=mode&11;for(var i=first;i<last;i+=3){this.BezierCurve(poly,mode,i);mode|=8;}
if(!oldIsPathOpen){if(closedBorder){var ctx=this.Context2D
var oldCap=ctx.lineCap;ctx.lineCap='round';this.Path(mode&3);ctx.lineCap=oldCap;}else{this.Path(mode&3);}}
return this.WorkPoly;}
JsGraph.prototype.DrawImage=function(img,x1,y1,w1,h1,x2,y2,w2,h2,fit,callback){var x,y,w,h,sx,sy,sw,sh
sx=0;sy=0;sw=0;sh=0;var effFit='';if(xObj(x1)){if(xObj(y1)){sx=x1.x;sy=x1.y;sw=x1.w;sh=x1.h;x=x2.x;y=x2.y;w=xDefNum(x2.w,0);h=xDefNum(x2.h,0);if(xStr(w1)){effFit=w1;callback=h1;}else{callback=w1;}}else if(xStr(y1)){sx=x1.x;sy=x1.y;sw=x1.w;sh=x1.h;effFit=y1;callback=w1;}else{x=x1.x;y=x1.y;w=xDefNum(x1.w,0);h=xDefNum(x1.h,0);if(xStr(y1)){effFit=y1;callback=w1;}else{callback=y1;}}}else if(xStr(x1)){effFit=x1;callback=y1;}else if(xNum(x1)){if(xNum(x2)){sx=x1;sy=y1;sw=w1;sh=h1;x=x2;y=y2;if(xNum(w2)){w=w2;h=h2;if(xStr(fit)){effFit=fit;}else{callback=fit;}}else if(xStr(w2)){w=0;h=0;effFit=w2;callback=h2;}else{w=0;h=0;callback=w2;}}else if(xStr(x2)){sx=x1;sy=y1;sw=w1;sh=h1;effFit=x2;callback=y2;}else{x=x1;y=y1;w=xDefNum(w1,0);h=xDefNum(h1,0);if(xNum(w1)){callback=x2;}else{callback=w1;}}}else{x=0;y=0;w=0;h=0;callback=x1;}
if(xStr(img)||xNum(img)){var imgID;if(xNum(img)){imgID=img;}else{var imgID=IC.FindImage(img);}
if(imgID==-1){var me=this;imgID=IC.LoadImage(img,function(imgID){if(callback)callback(me,imgID);if(me.AutoRedrawOnImgLoad)me.Redraw();});}
if(!IC.IsLoaded(imgID))return false;img=IC.Image(imgID);}
if(effFit!=''){var scaleW=1;var scaleH=1;var moveX=0;var moveY=0;if(effFit.indexOf('scale')!=-1){scaleW=w;scaleH=h;moveX=x;moveY=y;}
x=0;y=0;w=this.CanvasWidth;h=this.CanvasHeight;if(effFit.indexOf('viewport')!=-1){x=this.VpXmin;y=this.VpYmin;w=this.VpInnerWidth;h=this.VpInnerHeight;}
if(effFit.indexOf('-in')!=-1){var iw=img.naturalWidth;if(iw==0)iw=w;var ih=img.naturalHeight;if(ih==0)ih=h;var ir=iw/ih;var dr=w/h;if(ir>dr){var dh=h;h=w/ir;y+=(dh-h)/2;}else{var dw=w;w=h*ir;x+=(dw-w)/2;}}else if(effFit.indexOf('-out')!=-1){var iw=img.naturalWidth;if(iw==0)iw=w;var ih=img.naturalHeight;if(ih==0)ih=h;var ir=iw/ih;var dr=w/h;if(ir>dr){var dw=w;w=h*ir;x-=(w-dw)/2;}else{var dh=h;h=w/ir;y-=(h-dh)/2;}}
if(scaleW!=1){var cx=x+w/2;w*=scaleW;x=cx-w/2;}
if(scaleH!=1){var cy=y+h/2;h*=scaleH;y=cy-h/2;}
if(moveX!=0)x+=moveX;if(moveY!=0)y+=moveY;}else{var ctr=this.CurrTrans;var otr=this.ObjTrans;ctr.ObjTransXY2(this.GetObjTrans(),x,y,x+w,y+h);if(ctr.x1>ctr.x2){var tmp=ctr.x1;ctr.x1=ctr.x2;ctr.x2=tmp;}
if(ctr.y1>ctr.y2){var tmp=ctr.y1;ctr.y1=ctr.y2;ctr.y2=tmp;}
x=ctr.x1;y=ctr.y1;w=ctr.x2-x;h=ctr.y2-y;}
if(w==0)w=img.naturalWidth;if(sw==0)sw=img.naturalWidth;if(h==0)h=img.naturalHeight;if(sh==0)sh=img.naturalHeight;this.Context2D.drawImage(img,sx,sy,sw,sh,x,y,w,h);return true;}
JsGraph.prototype.GetTextSize=function(txt,w){var box=this.WorkRect;box.SetPos(0,0);if(this.TextCanvasRendering){this.GetCanvasTextSize(txt,box);}else{w=xDefNum(w,0);this.HtmlTextHandler.GetTextSize(txt,w,box);}
box.w/=Math.abs(this.CurrTrans.ScaleX);box.h/=Math.abs(this.CurrTrans.ScaleY);return box;}
JsGraph.prototype.GetTextBox=function(txt,x,y,w){if(!xDef(x))return this.GetTextBox(txt,0,0);if(JsgVect2.Ok(x))return this.GetTextBox(txt,x[0],x[1],y);var box=this.WorkRect;w=xDefNum(w,0);var ctr=this.CurrTrans;var cnvsX=ctr.TransX(x);var cnvsY=ctr.TransY(y);if(this.TextCanvasRendering){this.GetCanvasTextBox(txt,cnvsX,cnvsY,box);}else{this.HtmlTextHandler.GetTextBox(txt,cnvsX,cnvsY,w,box);}
var cx=ctr.InvTransX(box.x+(box.w/2));var cy=ctr.InvTransY(box.y+(box.h/2));box.w=box.w/Math.abs(ctr.ScaleX);box.h=box.h/Math.abs(ctr.ScaleY);box.x=cx-box.w/2;box.y=cy-box.h/2;return box;}
JsGraph.prototype.Text=function(txt,x,y,WidthOrMode){if(JsgVect2.Ok(x))return this.Text(txt,x[0],x[1],y);WidthOrMode=xDefNum(WidthOrMode,0);var ctr=this.CurrTrans;ctr.ObjTransXY(this.GetObjTrans(),x,y);if(this.GraphClipEnabled&&!this.IsPointInsideRect(ctr.x,ctr.y,this.GraphClipOuterXmin,this.GraphClipOuterXmax,this.GraphClipOuterYmin,this.GraphClipOuterYmax)){return this;}
if(this.TextCanvasRendering){this.DrawCanvasText(txt,ctr.x,ctr.y,WidthOrMode);}else{this.HtmlTextHandler.DrawText(txt,ctr.x,ctr.y,WidthOrMode);}
return this;}
JsGraph.prototype.TextBox=function(txt,x,y,mode,roll,width){if(JsgVect2.Ok(x))return this.TextBox(txt,x[0],x[1],y,mode,roll);if(this.TextCanvasRendering){var objTrans=this.SaveTrans(true);this.TransMove(-x,-y);this.TransScale(this.CurrTrans.ScaleX,this.CurrTrans.ScaleY);this.TransRotate(this.TextRotation);this.TransScale(1/this.CurrTrans.ScaleX,1/this.CurrTrans.ScaleY);this.TransMove(x,y);this.AddTrans(objTrans);this.Rect(this.GetTextBox(txt,x,y),mode,roll);this.RestoreTrans();}else{this.Rect(this.GetTextBox(txt,x,y,width),mode,roll);}
return this;}
JsGraph.prototype.DrawCanvasText=function(txt,x,y,mode){this.SetCanvasFont();var ctr=this.CurrTrans;var otr=this.ObjTrans;var ctx=this.Context2D;var oldFillStyle=ctx.fillStyle;if(mode==0){mode=2;ctx.fillStyle=this.TextColor;}
if(!otr.IsUnitTrans||this.TextRotation!=0){ctx.setTransform(1,0,0,1,0,0);ctx.scale(this.ContextScale,this.ContextScale);ctx.translate(x,y);ctx.scale(ctr.ScaleX,ctr.ScaleY);ctx.transform(otr.a00,otr.a10,otr.a01,otr.a11,0,0);ctx.scale(1/ctr.ScaleX,1/ctr.ScaleY);ctx.rotate(this.AngleToRad(this.TextRotation));x=y=0;}
var box=this.WorkRect;this.GetCanvasTextSize(txt,box);box.w+=2*this.CanvasTextHPad;box.h+=2*this.CanvasTextVPad;if(this.TextHAlign=='left')x+=box.w/2;if(this.TextHAlign=='right')x-=box.w/2;if(this.TextVAlign=='top')y+=box.h/2;if(this.TextVAlign=='bottom')y-=box.h/2;if(mode&2){ctx.fillText(txt,x,y);}
if(mode&1){ctx.strokeText(txt,x,y);}
if(!otr.IsUnitTrans||this.TextRotation!=0){ctx.setTransform(1,0,0,1,0,0);ctx.scale(this.ContextScale,this.ContextScale);}
ctx.fillStyle=oldFillStyle;}
JsGraph.prototype.GetCanvasTextSize=function(txt,box){this.SetCanvasFont();var data=this.Context2D.measureText(txt);box.SetSize(data.width,this.CanvasFontSize);}
JsGraph.prototype.GetCanvasTextBox=function(txt,x,y,box){this.GetCanvasTextSize(txt,box);box.SetPos(x,y);box.w+=2*this.CanvasTextHPad;box.h+=2*this.CanvasTextVPad;var hAlign=this.TextHAlign;if(hAlign=='justify')hAlign='center';var vAlign=this.TextVAlign;if(hAlign=='center')box.x-=box.w/2;if(hAlign=='right')box.x-=box.w;if(vAlign=='middle')box.y-=box.h/2;if(vAlign=='bottom')box.y-=box.h;}
JsGraph.prototype.SetCanvasFont=function(){if(!this.TextCanvasRendering||this.CTextCurrFontVers==this.CTextLastFontVers)return;this.CTextLastFontVers=this.CTextCurrFontVers;var ctx=this.Context2D;var attr='';if(this.FontStyle=='italic')attr+='italic ';if(this.FontWeight=='bold')attr+='bold ';attr+=this.CanvasFontSize+'px ';if(this.CanvasLineHeight>0)attr+='/ '+this.CanvasLineHeight+'px ';if(this.CanvasLineHeight==0)attr+='/ 100% ';attr+=this.TextFont;ctx.font=attr;ctx.textBaseline='middle';ctx.textAlign='center';}
JsGraph.prototype.StartXright=function(x,dx,winBorderLeft){if(x<winBorderLeft){x=Math.floor(winBorderLeft/dx)*dx;if(x<winBorderLeft)x+=dx;}
return x;}
JsGraph.prototype.StartXleft=function(x,dx,winBorderRight){if(x>winBorderRight){x=-Math.floor(-winBorderRight/dx)*dx;if(x>winBorderRight)x-=dx;}
return x;}
JsGraph.prototype.StartYup=function(y,dy,winBorderBottom){if(y<winBorderBottom){y=Math.floor(winBorderBottom/dy)*dy;if(y<winBorderBottom)y+=dy;}
return y;}
JsGraph.prototype.StartYdown=function(y,dy,winBorderTop){if(y>winBorderTop){y=-Math.floor(-winBorderTop/dy)*dy;if(y>winBorderTop)y-=dy;}
return y;}
JsGraph.prototype.Frame=function(mode){mode=xDefNum(mode,1);var oldTrans=this.SelectTrans('viewport');var oldObjTransEnable=this.ObjTrans.Enable(false);var oldLineJoin=this.LineJoin;var lwh=this.Context2D.lineWidth/2-0.5;this.SetLineJoin('miter');this.Rect(lwh,lwh,this.VpInnerWidth-lwh,this.VpInnerHeight-lwh,mode);this.SetLineJoin(oldLineJoin);this.ObjTrans.Enable(oldObjTransEnable);this.SelectTrans(oldTrans);}
JsGraph.prototype.GetFrame=function(){var rect=this.GetFrameRect();return{xmin:rect.x,ymin:rect.y,xmax:rect.x+rect.w,ymax:rect.y+rect.h};}
JsGraph.prototype.GetFrameRect=function(){var rect=this.GetTransRect();if(this.Trans=='viewport'){rect.w=this.VpInnerWidth;rect.h=this.VpInnerHeight;}
return rect;}
JsGraph.prototype.GetTransRect=function(aTrans){if(!xStr(aTrans)||!this.TransByName[aTrans])aTrans=this.Trans;var trans=this.TransByName[aTrans];return new JsgRect(trans.Xmin,trans.Ymin,trans.Width,trans.Height);}
JsGraph.prototype.GetCanvasRect=function(){return new JsgRect(0,0,this.CanvasWidth,this.CanvasHeight);}
JsGraph.prototype.GetViewportRect=function(){var xmin=Math.floor(this.VpXmin);var ymin=Math.floor(this.VpYmin);var xmax=Math.floor(this.VpXmin+this.VpWidth+0.9999);var ymax=Math.floor(this.VpYmin+this.VpHeight+0.9999);return new JsgRect(xmin,ymin,xmax-xmin,ymax-ymin);}
JsGraph.prototype.GetViewportDeviceRect=function(box){var xmin=Math.floor(this.VpXmin*this.DevicePixelRatio);var ymin=Math.floor(this.VpYmin*this.DevicePixelRatio);var xmax=Math.floor((this.VpXmin+this.VpWidth)*this.DevicePixelRatio+0.9999);var ymax=Math.floor((this.VpYmin+this.VpHeight)*this.DevicePixelRatio+0.9999);return new JsgRect(xmin,ymin,xmax-xmin,ymax-ymin);}
JsGraph.prototype.Grid=function(xTic,yTic,skipZero,skipLimit){this.GridX(xTic,skipZero,skipLimit);this.GridY(yTic,skipZero,skipLimit);}
JsGraph.prototype.GridX=function(dx,skipZero,skipLimit){dx=xDefNum(dx,1);if(dx<=0)return;skipZero=xDefBool(skipZero,true);skipLimit=xDefBool(skipLimit,false);var ctr=this.CurrTrans;var box=this.GetFrame();var ctx=this.Context2D;var deviceLineSpacing=(Math.abs(ctr.ScaleX*dx)-ctx.lineWidth)*this.DevicePixelRatio;if(deviceLineSpacing<1)return;var cnvsYmin=ctr.TransY(box.ymin);var cnvsYmax=ctr.TransY(box.ymax);if(box.xmin>box.xmax){var tmp=box.xmin;box.xmin=box.xmax;box.xmax=tmp;}
var epsX=1.0/Math.abs(ctr.ScaleX);ctx.beginPath();if(box.xmax>=0){var x=this.StartXright(((skipZero)?dx:0),dx,box.xmin);var xEnd=box.xmax+epsX;if(skipLimit)xEnd-=dx;while(x<=xEnd){var cnvsX=ctr.TransX(x);ctx.moveTo(cnvsX,cnvsYmin);ctx.lineTo(cnvsX,cnvsYmax);x+=dx;}}
if(box.xmin<=0){var x=this.StartXleft(-dx,dx,box.xmax);var xEnd=box.xmin-epsX;if(skipLimit)xEnd+=dx;while(x>=xEnd){var cnvsX=ctr.TransX(x);ctx.moveTo(cnvsX,cnvsYmin);ctx.lineTo(cnvsX,cnvsYmax);x-=dx;}}
var oldCap=ctx.lineCap;ctx.lineCap='butt';ctx.stroke();ctx.lineCap=oldCap;}
JsGraph.prototype.GridY=function(dy,skipZero,skipLimit){dy=xDefNum(dy,1);if(dy<=0)return;skipZero=xDefBool(skipZero,true);skipLimit=xDefBool(skipLimit,false);var ctr=this.CurrTrans;var box=this.GetFrame();var ctx=this.Context2D;var deviceLineSpacing=(Math.abs(ctr.ScaleY*dy)-ctx.lineWidth)*this.DevicePixelRatio;if(deviceLineSpacing<1)return;var cnvsXmin=ctr.TransX(box.xmin);var cnvsXmax=ctr.TransX(box.xmax);if(box.ymin>box.ymax){var tmp=box.ymin;box.ymin=box.ymax;box.ymax=tmp;}
var epsY=1.0/Math.abs(ctr.ScaleY);ctx.beginPath();if(box.ymax>=0){var y=this.StartYup(((skipZero)?dy:0),dy,box.ymin);var yEnd=box.ymax+epsY;if(skipLimit)yEnd-=dy;while(y<=yEnd){var cnvsY=ctr.TransY(y);ctx.moveTo(cnvsXmin,cnvsY);ctx.lineTo(cnvsXmax,cnvsY);y+=dy;}}
if(box.ymin<=0){var y=this.StartYdown(-dy,dy,box.ymax);var yEnd=box.ymin-epsY;if(skipLimit)yEnd+=dy;while(y>=yEnd){var cnvsY=ctr.TransY(y);ctx.moveTo(cnvsXmin,cnvsY);ctx.lineTo(cnvsXmax,cnvsY);y-=dy;}}
var oldCap=ctx.lineCap;ctx.lineCap='butt';ctx.stroke();ctx.lineCap=oldCap;}
JsGraph.prototype.Axes=function(xPos,yPos,ArrowSymbol,ArrowSize){this.AxesX(yPos,ArrowSymbol,ArrowSize);this.AxesY(xPos,ArrowSymbol,ArrowSize);}
JsGraph.prototype.AxesX=function(yPos,ArrowSymbol,ArrowSize){yPos=xDefNum(yPos,0);ArrowSymbol=xDefStr(ArrowSymbol,'');ArrowSize=xDefNum(ArrowSize,8);var box=this.GetFrame();var xMin=box.xmin;var xMax=box.xmax;if(xMin>xMax){var tmp=xMin;xMin=xMax;xMax=tmp;}
var yMin=box.ymin;var yMax=box.ymax;if(yMin>yMax){var tmp=yMin;yMin=yMax;yMax=tmp;}
var ctx=this.Context2D;var oldCap=ctx.lineCap;var oldObjTransEnable=this.ObjTrans.Enable(false);ctx.lineCap='butt';if(yPos>=yMin&&yPos<=yMax){if(ArrowSymbol!=''){this.SetMarkerSymbol(ArrowSymbol);this.SetMarkerSize(ArrowSize);this.Arrow(xMin,yPos,xMax,yPos,9);}else{this.Line(xMin,yPos,xMax,yPos);}}
ctx.lineCap=oldCap;this.ObjTrans.Enable(oldObjTransEnable);}
JsGraph.prototype.AxesY=function(xPos,ArrowSymbol,ArrowSize){xPos=xDefNum(xPos,0);ArrowSymbol=xDefStr(ArrowSymbol,'');ArrowSize=xDefNum(ArrowSize,8);var box=this.GetFrame();var xMin=box.xmin;var xMax=box.xmax;if(xMin>xMax){var tmp=xMin;xMin=xMax;xMax=tmp;}
var yMin=box.ymin;var yMax=box.ymax;if(yMin>yMax){var tmp=yMin;yMin=yMax;yMax=tmp;}
var ctx=this.Context2D;var oldCap=ctx.lineCap;var oldObjTransEnable=this.ObjTrans.Enable(false);ctx.lineCap='butt';if(xPos>=xMin&&xPos<=xMax){if(ArrowSymbol!=''){this.SetMarkerSymbol(ArrowSymbol);this.SetMarkerSize(ArrowSize);this.Arrow(xPos,yMin,xPos,yMax,9);}else{this.Line(xPos,yMin,xPos,yMax);}}
ctx.lineCap=oldCap;this.ObjTrans.Enable(oldObjTransEnable);}
JsGraph.prototype.TicsX=function(yPos,dx,ticUp,ticDown,skipZero,skipLimit){yPos=xDefNum(yPos,0);dx=xDefNum(dx,1);if(dx<=0)return;ticUp=xDefNum(ticUp,3);ticDown=xDefNum(ticDown,ticUp);skipZero=xDefBool(skipZero,true);skipLimit=xDefBool(skipLimit,false);if(this.AutoScalePix){ticUp=this.ScalePix(ticUp,this.ScalePixInt);ticDown=this.ScalePix(ticDown,this.ScalePixInt);}
var ctr=this.CurrTrans;var box=this.GetFrame();var cnvsY=ctr.TransY(yPos);var ctx=this.Context2D;var deviceLineSpacing=(Math.abs(ctr.ScaleX*dx)-ctx.lineWidth)*this.DevicePixelRatio;if(deviceLineSpacing<1)return;if(box.xmin>box.xmax){var tmp=box.xmin;box.xmin=box.xmax;box.xmax=tmp;}
var epsX=1.0/Math.abs(ctr.ScaleX);ctx.beginPath();if(box.xmax>=0){var x=this.StartXright(((skipZero)?dx:0),dx,box.xmin);var xEnd=box.xmax+epsX;if(skipLimit)xEnd-=dx;while(x<=xEnd){var cnvsX=ctr.TransX(x);ctx.moveTo(cnvsX,cnvsY-ticUp);ctx.lineTo(cnvsX,cnvsY+ticDown);x+=dx;}}
if(box.xmin<=0){var x=this.StartXleft(-dx,dx,box.xmax);var xEnd=box.xmin-epsX;if(skipLimit)xEnd+=dx;while(x>=xEnd){var cnvsX=ctr.TransX(x);ctx.moveTo(cnvsX,cnvsY-ticUp);ctx.lineTo(cnvsX,cnvsY+ticDown);x-=dx;}}
var oldCap=ctx.lineCap;ctx.lineCap='butt';ctx.stroke();ctx.lineCap=oldCap;}
JsGraph.prototype.TicsY=function(xPos,dy,ticRight,ticLeft,skipZero,skipLimit){xPos=xDefNum(xPos,0);dy=xDefNum(dy,1);if(dy<=0)return;ticRight=xDefNum(ticRight,3);ticLeft=xDefNum(ticLeft,ticRight);skipZero=xDefBool(skipZero,true);skipLimit=xDefBool(skipLimit,false);if(this.AutoScalePix){ticRight=this.ScalePix(ticRight,this.ScalePixInt);ticLeft=this.ScalePix(ticLeft,this.ScalePixInt);}
var ctr=this.CurrTrans;var box=this.GetFrame();var cnvsX=ctr.TransX(xPos);var ctx=this.Context2D;var deviceLineSpacing=(Math.abs(ctr.ScaleY*dy)-ctx.lineWidth)*this.DevicePixelRatio;if(deviceLineSpacing<1)return;if(box.ymin>box.ymax){var tmp=box.ymin;box.ymin=box.ymax;box.ymax=tmp;}
var epsY=1.0/Math.abs(ctr.ScaleY);ctx.beginPath();if(box.ymax>=0){var y=this.StartYup(((skipZero)?dy:0),dy,box.ymin);var yEnd=box.ymax+epsY;if(skipLimit)yEnd-=dy;while(y<=yEnd){var cnvsY=ctr.TransY(y);ctx.moveTo(cnvsX-ticLeft,cnvsY);ctx.lineTo(cnvsX+ticRight,cnvsY);y+=dy;}}
if(box.ymin<=0){var y=this.StartYdown(-dy,dy,box.ymax);var yEnd=box.ymin-epsY;if(skipLimit)yEnd+=dy;while(y>=yEnd){var cnvsY=ctr.TransY(y);ctx.moveTo(cnvsX-ticLeft,cnvsY);ctx.lineTo(cnvsX+ticRight,cnvsY);y-=dy;}}
var oldCap=ctx.lineCap;ctx.lineCap='butt';ctx.stroke();ctx.lineCap=oldCap;}
JsGraph.prototype.MakeLabel=function(value,scale,digits,unit){var v=(value*scale).toFixed(digits);if(!xStr(unit)||unit=='')return v;if(unit.indexOf('(#)')<0)return v+unit;return unit.replace(/\(#\)/,v);}
JsGraph.prototype.TicLabelsX=function(yPos,dx,yOff,scale,digits,skipZero,skipLimit,aUnit){yPos=xDefNum(yPos,0);dx=xDefNum(dx,1);if(dx<=0)return;yOff=xDefNum(yOff,-4);scale=xDefNum(scale,1);digits=xDefNum(digits,0);skipZero=xDefBool(skipZero,true);skipLimit=xDefBool(skipLimit,true);aUnit=xDefStr(aUnit,'');if(this.AutoScalePix)yOff=this.ScalePix(yOff,this.ScalePixInt);var ctr=this.CurrTrans;var frame=this.GetFrame();var oldAlign=this.TextVAlign;var oldHPad=this.TextHPad;var oldVPad=this.TextVPad;this.SetTextVAlign(((yOff<0)?'top':'bottom'));this.SetTextPadding(0);if(frame.xmin>frame.xmax){var tmp=frame.xmin;frame.xmin=frame.xmax;frame.xmax=tmp;}
var epsX=1.0/Math.abs(ctr.ScaleX);var box=this.GetTextSize(this.MakeLabel(frame.xmin,scale,digits,aUnit)+'m');var maxw=box.w;box=this.GetTextSize(this.MakeLabel(frame.xmax,scale,digits,aUnit)+'m');if(box.w>maxw)maxw=box.w;var ddx=(Math.floor(maxw/dx)+1)*dx;var oldObjTransEnable=this.ObjTrans.Enable(false);var y=ctr.InvTransY(ctr.TransY(yPos)-yOff);if(frame.xmax>=0){var x=this.StartXright(((skipZero)?ddx:0),ddx,frame.xmin);var xEnd=frame.xmax+epsX;if(skipLimit)xEnd-=ddx;while(x<=xEnd){this.Text(this.MakeLabel(x,scale,digits,aUnit),x,y);x+=ddx;}}
if(frame.xmin<=0){var x=this.StartXleft(-ddx,ddx,frame.xmax);var xEnd=frame.xmin-epsX;if(skipLimit)xEnd+=ddx;while(x>=xEnd){this.Text(this.MakeLabel(x,scale,digits,aUnit),x,y);x-=ddx;}}
this.SetTextVAlign(oldAlign);this.SetTextPadding(oldHPad,oldVPad);this.ObjTrans.Enable(oldObjTransEnable);}
JsGraph.prototype.TicLabelsY=function(xPos,dy,xOff,scale,digits,skipZero,skipLimit,aUnit){xPos=xDefNum(xPos,0);dy=xDefNum(dy,1);if(dy<=0)return;xOff=xDefNum(xOff,-4);scale=xDefNum(scale,1);digits=xDefNum(digits,0);skipZero=xDefBool(skipZero,true);skipLimit=xDefBool(skipLimit,true);aUnit=xDefStr(aUnit,'');if(this.AutoScalePix)xOff=this.ScalePix(xOff,this.ScalePixInt);var ctr=this.CurrTrans;var frame=this.GetFrame();var oldAlign=this.TextHAlign;var oldHPad=this.TextHPad;var oldVPad=this.TextVPad;this.SetTextHAlign(((xOff<0)?'right':'left'));this.SetTextPadding(0);if(frame.ymin>frame.ymax){var tmp=frame.ymin;frame.ymin=frame.ymax;frame.ymax=tmp;}
var epsY=1.0/Math.abs(ctr.ScaleY);var box=this.GetTextSize(this.MakeLabel(frame.ymax,scale,digits,aUnit));var maxh=box.h;var ddy=(Math.floor(maxh/dy)+1)*dy;var oldObjTransEnable=this.ObjTrans.Enable(false);var x=ctr.InvTransX(ctr.TransX(xPos)+xOff);if(frame.ymax>=0){var y=this.StartYup(((skipZero)?ddy:0),ddy,frame.ymin);var yEnd=frame.ymax+epsY;if(skipLimit)yEnd-=ddy;while(y<=yEnd){this.Text(this.MakeLabel(y,scale,digits,aUnit),x,y);y+=ddy;}}
if(frame.ymin<=0){var y=this.StartYdown(-ddy,ddy,frame.ymax);var yEnd=frame.ymin-epsY;if(skipLimit)yEnd+=ddy;while(y>=yEnd){this.Text(this.MakeLabel(y,scale,digits,aUnit),x,y);y-=ddy;}}
this.SetTextHAlign(oldAlign);this.SetTextPadding(oldHPad,oldVPad);this.ObjTrans.Enable(oldObjTransEnable);}
JsGraph.prototype.MakeMarkers=function(){this.MarkerName=['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Circle','Square','Diamond','Triangle','Triangle2','Star4','Star5','Star6','Plus','Cross','Star','Arrow1','Arrow2'];this.Markers={ArrowLeft:[{type:'Polygon',x:[0,1,1],y:[0,0.5,-0.5]}],ArrowRight:[{type:'Polygon',x:[0,-1,-1],y:[0,-0.5,0.5]}],ArrowDown:[{type:'Polygon',x:[0,0.5,-0.5],y:[0,-1,-1]}],ArrowUp:[{type:'Polygon',x:[0,-0.5,0.5],y:[0,1,1]}],Circle:[{type:'Circle',x:0,y:0,r:-0.5}],Square:[{type:'Polygon',x:[-0.5,0.5,0.5,-0.5],y:[0.5,0.5,-0.5,-0.5]}],Diamond:[{type:'Polygon',x:[0,0.5,0,-0.5],y:[0.5,0,-0.5,0]}],Triangle:[{type:'Polygon',x:[-0.5,0.5,0],y:[0.289,0.289,-0.577]}],Triangle2:[{type:'Polygon',x:[0,0.5,-0.5],y:[0.577,-0.289,-0.289]}],Star4:[{type:'Polygon',x:[0.5,0.125,0,-0.125,-0.5,-0.125,0,0.125],y:[0,-0.125,-0.5,-0.125,0,0.125,0.5,0.125]}],Star5:[{type:'Polygon',x:[0,-0.112,-0.433,-0.182,-0.294,0,0.294,0.182,0.475,0.112],y:[-0.5,-0.155,-0.155,0.059,0.405,0.155,0.405,0.059,-0.155,-0.155]}],Star6:[{type:'Polygon',x:[0,-0.145,-0.433,-0.25,-0.433,-0.145,0,0.145,0.433,0.25,0.433,0.145],y:[-0.5,-0.25,-0.25,0,0.25,0.25,0.5,0.25,0.25,0,-0.25,-0.25]}],Plus:[{type:'Line',x1:-0.5,y1:0,x2:0.5,y2:0},{type:'Line',x1:0,y1:-0.5,x2:0,y2:0.5}],Cross:[{type:'Line',x1:-0.5,y1:0.5,x2:0.5,y2:-0.5},{type:'Line',x1:-0.5,y1:-0.5,x2:0.5,y2:0.5}],Star:[{type:'Line',x1:-0.5,y1:0,x2:0.5,y2:0},{type:'Line',x1:-0.25,y1:-0.433,x2:0.25,y2:0.433},{type:'Line',x1:-0.25,y1:0.433,x2:0.25,y2:-0.433}],Arrow1:[{type:'Polygon',x:[0,-1.5,-1.5],y:[0,-0.375,0.375]}],Arrow2:[{type:'Polygon',x:[0,-1.5,-1.25,-1.5],y:[0,-0.375,0,0.375]}]};}
JsGraph.prototype.AddMarkerDef=function(aName,aMarkerDef){this.Markers[aName]=aMarkerDef;}
JsGraph.prototype.ScaleAndMovePoly=function(poly,scale,moveX,moveY){var len=poly.Size;for(var i=0;i<len;i++){poly.X[i]=poly.X[i]*scale+moveX;poly.Y[i]=poly.Y[i]*scale+moveY;}}
JsGraph.prototype.ScaleAndMoveCoord=function(coord,scale,move){return coord*scale+move;}
JsGraph.prototype.Marker=function(x,y,mode,mat,size){if(JsgPolygon.Ok(x))return this.Marker(x.X,x.Y,y,mode,x.Size);if(xArray(x)&&xArray(y)){size=xDefNum(size,x.length);for(var i=0;i<size;i++){this.Marker(x[i],y[i],mode,mat);}
return this;}
if(JsgVect2.Ok(x))return this.Marker(x[0],x[1],y,mode);mode=xDefNum(mode,3);var ctr=this.CurrTrans;var otr=this.ObjTrans;ctr.ObjTransXY(this.GetObjTrans(),x,y);var oldTrans=this.SelectTrans('canvas');var oldObjTransEnable=otr.Enable(false);var symbol=this.Markers[this.MarkerSymbol];var ix=0;var deltaIx=1;var inverse=false;if(mode&4){ix=symbol.length-1;deltaIx=-1;inverse=true;}
var drawMode=mode&3;for(var i=0;i<symbol.length;i++){var element=symbol[ix];if(element.type=='Polygon'){var poly=this.WorkPolyMarker.Reset();var len=element.x.length;for(var j=0;j<len;j++)poly.AddPoint(element.x[j],element.y[j]);if(JsgMat2.Ok(mat)){JsgMat2.TransPolyXY(mat,poly.X,poly.Y,poly.Size);}
this.ScaleAndMovePoly(poly,this.DriverMarkerSize,ctr.x,ctr.y);if(inverse)poly.Invert();this.Polygon(poly,drawMode+4);}
else if(element.type=='Line'){var poly=this.WorkPolyMarker.Reset();poly.AddPoint(element.x1,element.y1);poly.AddPoint(element.x2,element.y2);if(JsgMat2.Ok(mat)){JsgMat2.TransPolyXY(mat,poly.X,poly.Y,poly.Size);}
this.ScaleAndMovePoly(poly,this.DriverMarkerSize,ctr.x,ctr.y);this.Line(poly.X[0],poly.Y[0],poly.X[1],poly.Y[1]);}
else if(element.type=='Circle'){var cx=this.ScaleAndMoveCoord(element.x,this.DriverMarkerSize,ctr.x);var cy=this.ScaleAndMoveCoord(element.y,this.DriverMarkerSize,ctr.y);var cr=element.r*this.DriverMarkerSize;if(inverse)cr*=-1;this.Circle(cx,cy,cr,drawMode);}
ix+=deltaIx;}
otr.Enable(oldObjTransEnable);this.SelectTrans(oldTrans);return this;}
function JsgHtmlTextHandler(clippingDiv,canvas,context2d){this.ClippingDiv=clippingDiv;this.Canvas=canvas;this.Context2D=context2d;this.TextHAlign='left';this.TextVAlign='top';this.TextHPad=0;this.TextVPad=0;this.WorkRect=new JsgRect(0,0,0,0);this.Text=[];this.Cache=[];this.CachePtr=0;this.TextClass='';this.TextStyles=this.NewTextStyles();}
JsgHtmlTextHandler.AppliedTextStyles='color fontFamily fontSize fontStyle fontWeight lineHeight textAlign'.split(' ');JsgHtmlTextHandler.prototype.NewTextStyles=function(from){var styles={};var styleNames=JsgHtmlTextHandler.AppliedTextStyles;for(var i=0;i<styleNames.length;i++){styles[styleNames[i]]='';}
if(xObj(from))this.CopyTextStyles(from,styles);return styles;}
JsgHtmlTextHandler.prototype.CopyTextStyles=function(src,dest){var styleNames=JsgHtmlTextHandler.AppliedTextStyles;for(var i=0;i<styleNames.length;i++){var name=styleNames[i];if(src[name]!='')dest[name]=src[name];}}
JsgHtmlTextHandler.prototype.SameTextStyles=function(styles1,styles2){var styleNames=JsgHtmlTextHandler.AppliedTextStyles;for(var i=0;i<styleNames.length;i++){var name=styleNames[i];if(styles1[name]!=styles2[name])return false;}
return true;}
JsgHtmlTextHandler.prototype.Clear=function(){for(var i=0;i<this.Text.length;i++){this.ClippingDiv.removeChild(this.Text[i]);}
this.Text=[];this.ResetCache();}
JsgHtmlTextHandler.prototype.ClearCache=function(){this.Cache=[];this.CachePtr=0;}
JsgHtmlTextHandler.prototype.ResetCache=function(){this.CachePtr=0;}
JsgHtmlTextHandler.prototype.FindTextSizeInCache=function(s,textClass,styles,aw,box){if(this.CachePtr>=this.Cache.length)return false;aw=xDefNum(aw,-1);var c=this.Cache[this.CachePtr];if(c.Text==s&&c.TextClass==textClass&&this.SameTextStyles(c.Styles,styles)&&c.ArgWidth==aw){this.CachePtr++;box.SetSize(c.Width,c.Height);return true;}
this.ClearCache();return false;}
JsgHtmlTextHandler.prototype.AddToCache=function(s,textClass,styles,aw,width,height){var stylesCopy=this.NewTextStyles(styles);aw=xDefNum(aw,-1);this.Cache.push({Text:s,TextClass:textClass,Styles:stylesCopy,ArgWidth:aw,Width:width,Height:height});this.CachePtr++;}
JsgHtmlTextHandler.prototype.CreateTextNode=function(s,w){var txt=document.createElement('div');this.CopyTextStyles(this.TextStyles,txt.style)
if(this.TextClass==''){txt.style.margin='0';txt.style.padding='0';}else{txt.className=this.TextClass;}
txt.style.position='absolute';txt.style.boxSizing='border-box';if(w>0)txt.style.width=w+'px';txt.innerHTML=s;return txt;}
JsgHtmlTextHandler.prototype.GetTextSize=function(s,w,box){if(this.FindTextSizeInCache(s,this.TextClass,this.TextStyles,w,box))return;var txtNode=this.CreateTextNode(s,w);txtNode.style.visibility='hidden';this.ClippingDiv.appendChild(txtNode);box.SetSize(txtNode.offsetWidth,txtNode.offsetHeight);this.ClippingDiv.removeChild(txtNode);this.AddToCache(s,this.TextClass,this.TextStyles,w,box.w,box.h);}
JsgHtmlTextHandler.prototype.GetTextBox=function(s,x,y,w,box){return this.HandleText(0,s,x,y,w,box);}
JsgHtmlTextHandler.prototype.DrawText=function(s,x,y,w){this.HandleText(1,s,x,y,w,this.WorkRect);}
JsgHtmlTextHandler.prototype.HandleText=function(mode,s,x,y,w,box){this.GetTextSize(s,w,box);box.w+=2*this.TextHPad;box.h+=2*this.TextVPad;var top=y;var left=x;var padleft=this.TextHPad;var padright=this.TextHPad;if(this.TextHAlign=='center')left-=box.w/2;if(this.TextHAlign=='right')left-=box.w;if(this.TextVAlign=='middle')top-=box.h/2;if(this.TextVAlign=='bottom')top-=box.h;if(w==0){var cw=this.ClippingDiv.offsetWidth;var right=left+box.w;var newleft=left;var newright=right;var borderCrossed=false;if(left<0&&right>0){padleft=this.TextHPad+left;if(padleft<0)padleft=0;newleft=0;borderCrossed=true;}
if(left<cw&&right>cw){padright-=right-cw;if(padright<0)padright=0;newright=cw;borderCrossed=true;}
if(borderCrossed&&newright>0&&newleft<cw){w=newright-newleft-padleft-padright;if(w<0)w=0;}
if(w>0){var top=y;var left=newleft;this.GetTextSize(s,w,box);box.w+=padleft+padright;box.h+=2*this.TextVPad;if(this.TextVAlign=='middle')top-=box.h/2;if(this.TextVAlign=='bottom')top-=box.h;}}
box.SetPos(left,top);if(mode==1){var txtNode=this.CreateTextNode(s,w);txtNode.style.left=left+padleft+'px';txtNode.style.top=top+this.TextVPad+'px';this.ClippingDiv.appendChild(txtNode);this.Text.push(txtNode);}}
Object.assign(globalThis, {
  JsgColor, JsgVect2, JsgMat2, JsgRect, JsgGradient, JsgPolygon, JsgPolygonList,
  JsgSnapshot, JsgTrans, JsgTrans2D, JsgAttrs, NewGraph2D, JsGraph, JsgHtmlTextHandler,
});
export {
  JsgColor, JsgVect2, JsgMat2, JsgRect, JsgGradient, JsgPolygon, JsgPolygonList,
  JsgSnapshot, JsgTrans, JsgTrans2D, JsgAttrs, NewGraph2D, JsGraph, JsgHtmlTextHandler,
};
