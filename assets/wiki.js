// (C) walter.bislins.ch

var xClass2Type={};(function(){var types="Boolean Number String Function Array Date RegExp Object Error".split(" ");var len=types.length;for(var i=0;i<len;i++){var name=types[i];xClass2Type["[object "+name+"]"]=name.toLowerCase();}})();function xType(obj){if(obj==null)return obj+"";return typeof obj==="object"||typeof obj==="function"?xClass2Type[Object.prototype.toString.call(obj)]||"object":typeof obj;}
function xDef(x){return(typeof(x)!=='undefined');}
function xAny(x){return(typeof(x)!=='undefined'&&x!==null);}
function xObj(x){return(typeof(x)==='object'&&!xArray(x)&&x!==null);}
function xObjOrNull(x){return(typeof(x)==='object'&&!xArray(x));}
function xFunc(x){return xType(x)==='function';}
function xFuncOrNull(x){return(x===null||xType(x)==='function');}
var xArray=Array.isArray||function(obj){return xType(obj)==='array';};function xStr(x){return(typeof(x)==='string');}
function xNum(x){return(typeof(x)==='number');}
function xBool(x){return(typeof(x)==='boolean');}
function xIsNumeric(x){return(!xArray(x)&&(x-parseFloat(x)>=0));}
function xDefAny(aRef,aDefault){return(typeof(aRef)==='undefined'||aRef===null)?aDefault:aRef;}
function xDefAnyOrNull(aRef,aDefault){return(typeof(aRef)==='undefined')?aDefault:aRef;}
function xDefObj(aRef,aDefault){return(typeof(aRef)==='object'&&!xArray(aRef)&&aRef!==null)?aRef:aDefault;}
function xDefObjOrNull(aRef,aDefault){return(typeof(aRef)==='object'&&!xArray(aRef))?aRef:aDefault;}
function xDefFunc(aRef,aDefault){return xFunc(aRef)?aRef:aDefault;}
function xDefFuncOrNull(aRef,aDefault){return xFuncOrNull(aRef)?aRef:aDefault;}
function xDefArray(aRef,aDefault){return xArray(aRef)?aRef:aDefault;}
function xDefStr(aRef,aDefault){return(typeof(aRef)==='string')?aRef:aDefault;}
function xDefNum(aRef,aDefault){return(typeof(aRef)==='number')?aRef:aDefault;}
function xDefBool(aRef,aDefault){return(typeof(aRef)==='boolean')?aRef:aDefault;}
function xArgsToArray(args){return Array.prototype.slice.call(args);}
function xFStr(format,etc){var arg=arguments;var i=1;return format.replace(/(#(#)?)/g,function(match,p1,p2){return p2||arg[i++];});}
function xArrFind(start,arr,func,thisArg){if(!xNum(start))return xArrFind(0,start,arr,func);var t,undef
if(arguments.lenth>3)t=thisArg;var n=arr.length;for(var i=start;i<n;i++){if(func.call(t,arr[i],i,arr))return arr[i];}
return undef;}
function xArrFindIndex(start,arr,func,thisArg){if(!xNum(start))return xArrFindIndex(0,start,arr,func);var t
if(arguments.lenth>3)t=thisArg;var n=arr.length;for(var i=start;i<n;i++){if(func.call(t,arr[i],i,arr))return i;}
return-1;}
function xArrForEach(arr,func,thisArg){var t
if(arguments.length>2)t=thisArg;var n=arr.length;for(var i=0;i<n;i++){func.call(t,arr[i],i,arr);}}
function xArrayMap(arr,func,thisArg){var t
if(arguments.length>2)t=thisArg;var n=arr.length;var newArr=Array(n);for(var i=0;i<n;i++){newArr[i]=func.call(t,arr[i],i,arr);}
return newArr;}
function xArrRemove(arr,func,thisArg){var t,undef
if(arguments.length>2)t=thisArg;var i=0;while(i<arr.length){if(func.call(t,arr[i],i,arr)){var ele=arr[i];arr.splice(i,1);return ele;}else{i++;}}
return undef;}
function xArrRemoveAll(arr,func,thisArg){var t
if(arguments.length>2)t=thisArg;var n=0;var i=0;while(i<arr.length){if(func.call(t,arr[i],i,arr)){arr.splice(i,1);n++;}else{i++;}}
return n;}
function xGet(id){return document.getElementById(id);}
function xGetFirst(selectors){return document.querySelector(selectors);}
function xGetAll(selectors){return document.querySelectorAll(selectors);}
function xElement(e){return(typeof(e)==='string')?document.getElementById(e):e;}
function xDataset(e,name){return xElement(e).getAttribute('data-'+name);}
function xInnerHTML(e,t){if(xStr(t)){xElement(e).innerHTML=t;}else{t=xElement(e).innerHTML;}
return t;}
function xInnerText(e,defaultText){e=xElement(e);if(xDef(e.innerText)){return e.innerText;}
if(xDef(e.textContent)){return e.textContent;}
return defaultText;}
function xTagName(e){return xElement(e).tagName;}
function xShow(e){xVisibility(e,1);}
function xHide(e){xVisibility(e,0);}
function xVisibility(e,v)
{if(xDef(v)){if(!xStr(v))v=v?'visible':'hidden';xElement(e).style.visibility=v;}else{v=xElement(e).style.visibility;}
return v;}
function xDisplay(e,v){e=xElement(e);var old=e.style.display;if(xStr(v)){e.style.display=v;if(old!=v)xTriggerEventDisplayChange(e);}else{v=old;}
return v;}
function xIsDisplayed(e){e=xElement(e);while(xIsElementAndNotRoot(e)){if(getComputedStyle(e).getPropertyValue('display')=='none')return false;e=e.parentNode;}
return true;}
function xMoveTo(e,iX,iY){e=xElement(e);e.style.left=iX+'px';e.style.top=iY+'px';}
function xLeft(e,iX){e=xElement(e);if(xStr(e.style.left)){if(xNum(iX)){e.style.left=iX+'px';}else{iX=parseInt(e.style.left,10);if(isNaN(iX))iX=0;}}
else if(xDef(e.style.pixelLeft)){if(xNum(iX)){e.style.pixelLeft=iX;}else{iX=e.style.pixelLeft;}}else{iX=0;}
return iX;}
function xTop(e,iY){e=xElement(e);if(xStr(e.style.top)){if(xNum(iY)){e.style.top=iY+'px';}else{iY=parseInt(e.style.top,10);if(isNaN(iY))iY=0;}}
else if(xDef(e.style.pixelTop)){if(xNum(iY)){e.style.pixelTop=iY;}
else{iY=e.style.pixelTop;}}else{iY=0;}
return iY;}
function xOpacity(e,uO){if(xNum(uO)){xElement(e).style.opacity=uO;}else{uO=xElement(e).style.opacity;}
return uO;}
function xResizeTo(e,uW,uH,bBorderBoxSizing){xWidth(e,uW,bBorderBoxSizing);xHeight(e,uH,bBorderBoxSizing);}
function xElementWidth(e,uW){if(xNum(uW)){xElement(e).width=uW;}
else{uW=xElement(e).width;}
return uW;}
function xWidth(e,uW,bBorderBoxSizing){if(xNum(uW)){if(uW<0)uW=0;uW=Math.round(uW);xSetCW(xElement(e),uW,bBorderBoxSizing);}else{uW=xElement(e).offsetWidth;}
return uW;}
function xScrollWidth(e){return xElement(e).scrollWidth;}
function xNaturalWidth(img){img=xElement(img);if(xDef(img.naturalWidth))return img.naturalWidth;var tmpImg=new Image();tmpImg.src=img.src;return tmpImg.width;}
function xElementHeight(e,uH){if(xNum(uH)){xElement(e).height=uH;}else{uH=xElement(e).height;}
return uH;}
function xHeight(e,uH,bBorderBoxSizing){if(xNum(uH)){if(uH<0)uH=0;uH=Math.round(uH);xSetCH(xElement(e),uH,bBorderBoxSizing);}
else{uH=xElement(e).offsetHeight;}
return uH;}
function xScrollHeight(e){return xElement(e).scrollHeight;}
function xNaturalHeight(img){img=xElement(img);if(xDef(img.naturalHeight))return img.naturalHeight;var tmpImg=new Image();tmpImg.src=img.src;return tmpImg.height;}
function xGetCS(ele,sP){return parseInt(window.getComputedStyle(ele,'').getPropertyValue(sP),10);}
function xSetCW(ele,uW,bBorderBoxSizing){var pl=0,pr=0,bl=0,br=0;bBorderBoxSizing=xDefBool(bBorderBoxSizing,true);var cssW=uW;if(bBorderBoxSizing){if(window.getComputedStyle){pl=xGetCS(ele,'padding-left');pr=xGetCS(ele,'padding-right');bl=xGetCS(ele,'border-left-width');br=xGetCS(ele,'border-right-width');}
else if(xDef(ele.currentStyle)){pl=parseInt(ele.currentStyle.paddingLeft,10);pr=parseInt(ele.currentStyle.paddingRight,10);bl=parseInt(ele.currentStyle.borderLeftWidth,10);br=parseInt(ele.currentStyle.borderRightWidth,10);}
else{ele.style.width=uW+'px';pl=ele.offsetWidth-uW;}
if(isNaN(pl))pl=0;if(isNaN(pr))pr=0;if(isNaN(bl))bl=0;if(isNaN(br))br=0;cssW-=(pl+pr+bl+br);}
if(cssW<0)cssW=0;ele.style.width=cssW+'px';}
function xSetCH(ele,uH,bBorderBoxSizing){var pt=0,pb=0,bt=0,bb=0;bBorderBoxSizing=xDefBool(bBorderBoxSizing,true);var cssH=uH;if(bBorderBoxSizing){if(window.getComputedStyle){pt=xGetCS(ele,'padding-top');pb=xGetCS(ele,'padding-bottom');bt=xGetCS(ele,'border-top-width');bb=xGetCS(ele,'border-bottom-width');}
else if(xDef(ele.currentStyle)){pt=parseInt(ele.currentStyle.paddingTop,10);pb=parseInt(ele.currentStyle.paddingBottom,10);bt=parseInt(ele.currentStyle.borderTopWidth,10);bb=parseInt(ele.currentStyle.borderBottomWidth,10);}
else{ele.style.height=uH+'px';pt=ele.offsetHeight-uH;}
if(isNaN(pt))pt=0;if(isNaN(pb))pb=0;if(isNaN(bt))bt=0;if(isNaN(bb))bb=0;cssH-=(pt+pb+bt+bb);}
if(cssH<0)cssH=0;ele.style.height=cssH+'px';}
function xClientWidth(){var w=0;if(document.compatMode=='CSS1Compat'&&!window.opera&&document.documentElement&&document.documentElement.clientWidth){w=document.documentElement.clientWidth;}
else if(document.body&&document.body.clientWidth){w=document.body.clientWidth;}
else if(xDef(window.innerWidth)&&xDef(window.innerHeight)&&xDef(document.height)){w=window.innerWidth;if(document.height>window.innerHeight){w-=16;}}
return w;}
function xClientHeight(){var h=0;if(document.compatMode=='CSS1Compat'&&!window.opera&&document.documentElement&&document.documentElement.clientHeight){h=document.documentElement.clientHeight;}
else if(document.body&&document.body.clientHeight){h=document.body.clientHeight;}
else if(xDef(window.innerWidth)&&xDef(window.innerHeight)&&xDef(document.width)){h=window.innerHeight;if(document.width>window.innerWidth){h-=16;}}
return h;}
function xPageX(e){e=xElement(e);var x=0;var n=e;while(xIsElementAndNotRoot(e)){x+=e.offsetLeft;e=e.offsetParent;}
e=n;while(xIsElementAndNotRoot(e)){x-=e.scrollLeft;e=e.parentNode;}
return x;}
function xPageY(e){e=xElement(e);var y=0;var n=e;while(xIsElementAndNotRoot(e)){y+=e.offsetTop;e=e.offsetParent;}
e=n;while(xIsElementAndNotRoot(e)){y-=e.scrollTop;e=e.parentNode;}
return y;}
function xIsRoot(e){return(xAny(e)&&(e==document||e.tagName=='HTML'||e.tagName=='BODY'));}
function xIsElementAndNotRoot(e){return(xAny(e)&&!(e==document||e.tagName=='HTML'||e.tagName=='BODY'));}
function xScrollLeft(e,bWin,val){var offset=0;if(!xDef(e)||bWin||xIsRoot(e)){var w=window;if(bWin&&e)w=e;if(w.document.documentElement&&w.document.documentElement.scrollLeft){if(xNum(val)){w.document.documentElement.scrollLeft=val;}else{offset=w.document.documentElement.scrollLeft;}}
else if(w.document.body&&xDef(w.document.body.scrollLeft)){if(xNum(val)){w.document.body.scrollLeft=val;}else{offset=w.document.body.scrollLeft;}}}
else{if(xNum(val)){xElement(e).scrollLeft=val;}else{offset=xElement(e).scrollLeft;}}
return offset;}
function xScrollTop(e,bWin,val)
{var offset=0;if(!xDef(e)||bWin||xIsRoot(e)){var w=window;if(bWin&&e)w=e;if(w.document.documentElement&&w.document.documentElement.scrollTop){if(xNum(val)){w.document.documentElement.scrollTop=val;}else{offset=w.document.documentElement.scrollTop;}}
else if(w.document.body&&xDef(w.document.body.scrollTop)){if(xNum(val)){w.document.body.scrollTop=val;}else{offset=w.document.body.scrollTop;}}}
else{if(xNum(val)){xElement(e).scrollTop=val;}else{offset=xElement(e).scrollTop;}}
return offset;}
function xZIndex(e,uZ)
{if(xNum(uZ)){xElement(e).style.zIndex=uZ;}else{uZ=parseInt(xElement(e).style.zIndex,10);}
return uZ;}
function xCursor(e,c)
{if(xStr(c)){xElement(e).style.cursor=c;}else{c=xElement(e).style.cursor;}
return c;}
function xStyle(e,sStyle,sVal){if(xDef(sVal)){xElement(e).style[sStyle]=sVal;}else{sVal=xElement(e).style[sStyle];}
return sVal;}
function xMaskRegExp(s){return s.replace(/\-/g,'\\-');}
function xHasClass(e,cls){if(!(e=xElement(e)))return false;if(xDef(e.classList)){return e.classList.contains(cls);}else{if(xIsRoot(e))return false;return xDef(e.className)&&xDef(e.className.match)&&e.className.match(new RegExp('(\\s|^)'+xMaskRegExp(cls)+'(\\s|$)'));}}
function xAddClass(e,cls){if(!(e=xElement(e)))return;if(xDef(e.classList)){e.classList.add(cls);}else{if(xIsRoot(e))return;if(xDef(e.className)&&!this.xHasClass(e,cls))e.className+=' '+cls;}}
function xRemoveClass(e,cls){if(!(e=xElement(e)))return;if(xDef(e.classList)){e.classList.remove(cls);}else{if(xIsRoot(e))return;if(xDef(e.className)&&xHasClass(e,cls)){var reg=new RegExp('(\\s|^)'+xMaskRegExp(cls)+'(\\s|$)');e.className=e.className.replace(reg,' ').replace(/^\s+|\s+$/g,'');}}}
function xToggleClass(e,cls){if(!(e=xElement(e)))return;if(xDef(e.classList)){e.classList.toggle(cls);}else{if(xHasClass(e,cls)){xRemoveClass(e,cls);}else{xAddClass(e,cls);}}}
function xSetClassIf(e,cond,cls){if(cond){xAddClass(e,cls);}else{xRemoveClass(e,cls);}}
function xSetEnabled(e,enabled,cls){xSetClassIf(e,enabled,xDefStr(cls,'enabled'));}
function xSetDisabled(e,disabled,cls){xSetClassIf(e,disabled,xDefStr(cls,'disabled'));}
function xParent(e,bNode){bNode=xDefBool(bNode,true);if(bNode){return xElement(e).parentNode;}
else{return xElement(e).offsetParent;}}
function xCreateElement(sTag){return document.createElement(sTag);}
function xCreateTextNode(s){return document.createTextNode(s);}
function xHasChildNodes(oParent){return oParent.hasChildNodes();}
function xChildNodes(oParent){return oParent.childNodes;}
function xAppendChild(oParent,oChild){return oParent.appendChild(oChild);}
function xInsertBefore(oParent,oChild,oRef){return oParent.insertBefore(oChild,oRef);}
function xRemoveChild(oParent,oChild){return oParent.removeChild(oChild);}
function xGetByTag(t,p){t=t||'*';p=p||document;return p.getElementsByTagName(t);}
function xGetByClass(className,p){p=p||document;return p.getElementsByClassName(className);}
function xAddEvent(e,eventType,callback,cap)
{cap=xDefBool(cap,false);var wrapper=function xOnCallbackEventWrapper(e){callback(new xEvent(e));};callback.xWrapperFunc=wrapper;xElement(e).addEventListener(eventType,wrapper,cap);}
function xRemoveEvent(e,eventType,callback,cap){cap=xDefBool(cap,false);xElement(e).removeEventListener(eventType,callback.xWrapperFunc,cap);}
function xEvent(evt){this.Init(evt);}
xEvent.prototype.Init=function(evt){var e=evt||window.event;if(!e)return;this.event=e;this.type=e.type;this.target=e.target||e.srcElement;if(this.target.nodeType==3)this.target=this.target.parentNode;this.relatedTarget=e.relatedTarget;if(e.type=='mouseover'){this.relatedTarget=e.fromElement;}
else if(e.type=='mouseout'){this.relatedTarget=e.toElement;}
if(xDef(e.pageX)){this.pageX=e.pageX;this.pageY=e.pageY;}
else if(xDef(e.clientX)){this.pageX=e.clientX+xScrollLeft();this.pageY=e.clientY+xScrollTop();}
if(xDef(e.offsetX)){this.offsetX=e.offsetX;this.offsetY=e.offsetY;}
else{this.offsetX=this.pageX-xPageX(this.target);this.offsetY=this.pageY-xPageY(this.target);}
this.keyCode=e.keyCode||e.which||0;this.shiftKey=e.shiftKey;this.ctrlKey=e.ctrlKey;this.altKey=e.altKey;if(typeof e.type=='string'){if(e.type.indexOf('click')!=-1){this.button=0;}
else if(e.type.indexOf('mouse')!=-1){this.button=e.button;if(e.button&1){this.button=0;}
else if(e.button&4){this.button=1;}
else if(e.button&2){this.button=2;}}}};xEvent.prototype.PreventDefault=function(){if(!this.event)return;if(this.event.preventDefault)this.event.preventDefault();this.event.returnValue=false;};xEvent.prototype.StopPropagation=function(){if(!this.event)return;if(this.event.stopPropagation)this.event.stopPropagation();this.event.cancelBubble=true;};function xImgOnLoad(img,loadCallback,errorCallback){img=xElement(img);loadCallback=xDefFuncOrNull(loadCallback,null);errorCallback=xDefFuncOrNull(errorCallback,null);var helperImg=new Image();img._xHelperImg=helperImg;if(loadCallback){helperImg.addEventListener('load',function CB_OnImgLoad(){img._xHelperImg=null;loadCallback(img);},false);}
if(errorCallback){helperImg.addEventListener('error',function CB_OnImgError(){img._xHelperImg=null;errorCallback(img,false);},false);helperImg.addEventListener('abort',function CB_OnImgAbort(){img._xHelperImg=null;errorCallback(img,true);},false);}
helperImg.src=img.src;}
function xCallbackChain(){this.FuncList=[];this.ParamList=[];this.Active=false;}
xCallbackChain.prototype.Add=function(aFunc,once,param){once=xDefBool(once,false);param=xDefAny(param,null);if(once&&this.Containes(aFunc))return false;this.FuncList.push(aFunc);this.ParamList.push(param);return true;}
xCallbackChain.prototype.Contains=function(aFunc){return xDef(xArrFind(this.FuncList,function CB_Compare_Funcs(func){return func==aFunc;}));}
xCallbackChain.prototype.Remove=function(aFunc){return xArrRemoveAll(this.FuncList,function CB_Compare_Funcs(func){return func==aFunc;});}
xCallbackChain.prototype.Call=function(aArg,aExceptionFunc){if(this.FuncList.length==0||this.Active)return;this.Active=true;var funcListCopy=this.FuncList.slice();var paramListCopy=this.ParamList.slice();for(var i=0;i<funcListCopy.length;i++){try{funcListCopy[i](aArg,paramListCopy[i]);}catch(e){if(xFunc(aExceptionFunc))aExceptionFunc(e);}}
this.Active=false;}
var xOnLoadFinished=false;var xEventManager={DomReadyHandlers:new xCallbackChain(),MyDomReadyHandlers:[],DomReadyFired:false,PageLoadHandlers:new xCallbackChain(),MyPageLoadHandler:null,PageLoadFired:false,PageUnloadHandlers:new xCallbackChain(),OldWindowOnUnloadHandler:null,MyPageUnloadHandler:null,LayoutChangeHandlers:new xCallbackChain(),MyLayoutChangeHandler:null,WindowResizeHandlers:new xCallbackChain(),WindowResizeTimer:null,MyWindowResizeHandler:null,DisplayChangeHandlers:new xCallbackChain(),AddDomReadyHandler:function(aFunc){var myDomReadyHandler=function xOnEventManager_DomReady(){xEventManager.DomReadyFired=true;xEventManager.RemoveDomReadyHandler(aFunc);try{aFunc();}catch(e){};}
this.MyDomReadyHandlers.push({Func:aFunc,Handler:myDomReadyHandler});if(this.DomReadyFired){setTimeout(myDomReadyHandler,1);}else if(document.addEventListener){document.addEventListener("DOMContentLoaded",myDomReadyHandler,false);}else{this.DomReadyHandlers.Add(myDomReadyHandler);}},RemoveDomReadyHandler:function(aFunc){var handlerInfo=xArrFind(this.MyDomReadyHandlers,function CB_Compare_Funcs(item){return item.Func==aFunc;});if(!handlerInfo)return;var myDomReadyHandler=handlerInfo.Handler;if(document.addEventListener){document.removeEventListener("DOMContentLoaded",myDomReadyHandler,false);}else{this.DomReadyHandlers.Remove(myDomReadyHandler);}
xArrRemoveAll(this.MyDomReadyHandlers,function CB_Compare_Funcs(item){return item.Func==aFunc;});},AddPageLoadHandler:function(aFunc){if(!this.MyPageLoadHandler){this.MyPageLoadHandler=function xOnEventManager_PageLoad(){xEventManager.PageLoadFired=true;xEventManager.DomReadyHandlers.Call();xEventManager.PageLoadHandlers.Call();xOnLoadFinished=true;globalThis.xOnLoadFinished=true;}
window.addEventListener('load',this.MyPageLoadHandler);}
if(this.PageLoadFired){setTimeout(function CB_OnTimeout_PageLoadFired(){try{aFunc();}catch(e){}},1);}else{this.PageLoadHandlers.Add(aFunc);}},RemovePageLoadHander:function(aFunc){this.PageLoadHandlers.Remove(aFunc);},TriggerPageLoad:function(){this.PageLoadHandlers.Call(window);},AddPageUnloadHandler:function(aFunc){if(!this.MyPageUnloadHandler){this.OldWindowOnUnloadHandler=window.onunload;this.MyPageUnloadHandler=function xOnEventManager_CallingOldUnloadHandler(){if(xEventManager.OldWindowOnUnloadHandler){try{xEventManager.OldWindowOnUnloadHandler();}catch(e){}}
xEventManager.PageUnloadHandlers.Call();}
window.onunload=this.MyPageUnloadHandler;}
this.PageUnloadHandlers.Add(aFunc);},RemovePageUnloadHander:function(aFunc){this.PageUnloadHandlers.Remove(aFunc);},TriggerPageUnload:function(){this.PageUnloadHandlers.Call(window);},AddLayoutChangeHandler:function(aFunc,any){this.LayoutChangeHandlers.Add(aFunc,false,any);if(!this.MyLayoutChangeHandler){this.MyLayoutChangeHandler=function xOnEventManager_OnLayoutChange(arg){xEventManager.TriggerLayoutChange(arg);}
this.AddWindowResizeHandler(this.MyLayoutChangeHandler);}},RemoveLayoutChangeHandler:function(aFunc){this.LayoutChangeHandlers.Remove(aFunc);},LayoutChangeTimer:null,LayoutChangeTimerDelay:1,TriggerLayoutChange:function(aArg){if(this.LayoutChangeTimer){clearTimeout(this.LayoutChangeTimer);this.LayoutChangeTimer=null;}
var self=this;this.LayoutChangeTimer=setTimeout(function OnLayoutChangeEvent(aArg){clearTimeout(self.LayoutChangeTimer);self.LayoutChangeTimer=null;xOptions.Transform.OffsetElement=null;self.LayoutChangeHandlers.Call(aArg);},this.LayoutChangeTimerDelay);},AddWindowResizeHandler:function(aFunc){if(!this.MyWindowResizeHandler){this.MyWindowResizeHandler=function xOnEventManager_OnWindowResize(){if(xEventManager.WindowResizeTimer){clearTimeout(xEventManager.WindowResizeTimer);}
xEventManager.WindowResizeTimer=setTimeout(function CB_OnTimeout_WindowResize(){clearTimeout(xEventManager.WindowResizeTimer);xEventManager.WindowResizeTimer=null;xEventManager.WindowResizeHandlers.Call();},250);}
xAddEvent(window,'resize',this.MyWindowResizeHandler);}
this.WindowResizeHandlers.Add(aFunc);},RemoveWindowResizeHandler:function(aFunc){this.WindowResizeHandlers.Remove(aFunc);},TriggerWindowResize:function(aArg){this.WindowResizeHandlers.Call(aArg);},AddDisplayChangeHandler:function(aFunc){this.DisplayChangeHandlers.Add(aFunc);},RemoveDisplayChangeHandler:function(aFunc){this.DisplayChangeHandlers.Remove(aFunc);},TriggerDisplayChange:function(aArg){this.DisplayChangeHandlers.Call(aArg);},};function xAddEventLayoutChange(aFunc,any){xEventManager.AddLayoutChangeHandler(aFunc,any);}
function xRemoveEventLayoutChange(aFunc){xEventManager.RemoveLayoutChangeHandler(aFunc);}
function xTriggerEventLayoutChange(aArg){xEventManager.TriggerLayoutChange(aArg);}
function xAddEventDisplayChange(aFunc){xEventManager.AddDisplayChangeHandler(aFunc);}
function xRemoveEventDisplayChange(aFunc){xEventManager.RemoveDisplayChangeHandler(aFunc);}
function xTriggerEventDisplayChange(aEle){xEventManager.TriggerDisplayChange(aEle);}
function xAddEventWindowResize(aFunc){xEventManager.AddWindowResizeHandler(aFunc);}
function xRemoveEventWindowResize(aFunc){xEventManager.RemoveWindowResizeHandler(aFunc);}
function xOnDomReady(aFunc){xEventManager.AddDomReadyHandler(aFunc);}
function xOnLoad(aFunc){xEventManager.AddPageLoadHandler(aFunc);}
function xOnUnload(aFunc){xEventManager.AddPageUnloadHandler(aFunc);}
var xOptions={Transform:{PropertyNames:['webkitTransform','MozTransform','msTransform','OTransform','transform'],PropertyName:'?',OffsetElement:null,OffsetX:0,OffsetY:0}};function xGetTransformPropertyName(e){var tf=xOptions.Transform;if(tf.PropertyName!='?')return tf.PropertyName;var names=tf.PropertyNames;var len=names.length;for(var i=0;i<len;i++){var name=names[i];if(xDef(e.style[name])){tf.PropertyName=name;return name;}}
tf.PropertyName='';return'';}
function xSupportsTransform(e){if(!e)e=document.createElement('div');return xGetTransformPropertyName(e)!='';}
function xTransform(e,trans){e=xElement(e);var name=xGetTransformPropertyName(e);if(name=='')return false;e.style[name]=trans;return true;}
function xTransformOrigin(e,origin){e=xElement(e);var name=xGetTransformPropertyName(e);if(name=='')return false;e.style[name+'Origin']=origin;return true;}
function xGetTransformDocOffset(e){var tf=xOptions.Transform;if(tf.OffsetElement!=e){tf.OffsetElement=e;tf.OffsetX=0;tf.OffsetY=0;if(!xTransform(e,'translate(0px,0px)'))return tf;tf.OffsetX=xPageX(e);tf.OffsetY=xPageY(e);}
return tf;}
function xTransformNone(e){e=xElement(e);if(!xTransform(e,'none'))xMoveTo(e,0,0);}
function xTransformTranslate(e,x,y,useWinOrigin){e=xElement(e);useWinOrigin=xDefBool(useWinOrigin,false);var tx=x,ty=y;if(useWinOrigin){var tf=xGetTransformDocOffset(e);tx-=tf.OffsetX;ty-=tf.OffsetY;}
if(!xTransform(e,xFStr('translate(#px,#px)',tx,ty)))xMoveTo(e,x,y);}
function xTransformTranslateScale(e,x,y,w,h,wRef,hRef,useWinOrigin){e=xElement(e);useWinOrigin=xDefBool(useWinOrigin,false);var tx=x,ty=y;if(useWinOrigin){var t=xGetTransformDocOffset(e);tx-=t.OffsetX;ty-=t.OffsetY;}
var xScale=w/wRef;var yScale=h/hRef;var xMove=(wRef/2)*(xScale-1)+tx;var yMove=(hRef/2)*(yScale-1)+ty;var trans=xFStr('matrix(#,0,0,#,#,#)',xScale,yScale,xMove,yMove);if(!xTransform(e,trans)){xMoveTo(e,x,y);xResizeTo(e,w,h);}}
var xClipboardBuffer=null;function xToClipboard(text){if(xDef(window.clipboardData)){window.clipboardData.setData('Text',text);return true;}
else if(document.queryCommandSupported&&document.queryCommandSupported('copy')){var textArea=document.createElement("textarea");textArea.style.position='fixed';textArea.style.width='2em';textArea.style.height='2em';textArea.style.padding=0;textArea.style.border='none';textArea.style.outline='none';textArea.style.boxShadow='none';textArea.style.background='transparent';textArea.value=text;document.body.appendChild(textArea);textArea.select();var done=false;try{done=document.execCommand('copy');}catch(clipboardError){}
document.body.removeChild(textArea);return done;}
return false;}
function xTimeMS(){return(new Date()).getTime();}
function xImage(aImgFilename){var img=new Image();img.src=aImgFilename;return img;}
function xChangeImage(aImgID,aImg){var img=xElement(aImgID);if(img){img.src=aImg.src;}}
function xMultiImage(aImgID){this.ImgID=aImgID;this.Images=[];var a=xMultiImage.arguments;for(var i=1;i<a.length;i++){this.Images[i-1]=xImage(a[i]);}}
xMultiImage.prototype.Show=function(aImageNumber){xChangeImage(this.ImgID,this.Images[aImageNumber]);};var xDbgMess='';var xDbgSep='\n';function xDbg(aMess){if(aMess){xDbgMess+=aMess+xDbgSep;}
else{alert(xDbgMess);}}
function xDbgOut(x){var o=xGet('xdbgout');if(o){o.value=x;}}
function xDbgApp(x){var o=xGet('xdbgout');if(o){o.value+=x+'\n';}}
function xSetCookie(name,value,days){days=days||1;var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires='; expires='+date.toGMTString();document.cookie=name+'='+escape(value)+expires+'; path=/';}
function xGetCookie(name){var cName;var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];var eqPos=c.indexOf('=');if(eqPos>=0){cName=c.substr(0,eqPos).replace(/^\s+|\s+$/g,'');}else{cName=c.replace(/^\s+|\s+$/g,'');}
if(name==cName){if(eqPos<0)return'';return unescape(c.substr(eqPos+1));}}
return null;}
function xDeleteCookie(name){xSetCookie(name,'',-1);}
function htmlString(aStr){var s=aStr;s=s.replace(/</g,'&lt;');s=s.replace(/>/g,'&gt;');return s;}
var xGreekNameUnicodeDict={'alpha':'\u03B1','beta':'\u03B2','gamma':'\u03B3','delta':'\u03B4','epsilon':'\u03B5','zeta':'\u03B6','eta':'\u03B7','theta':'\u03B8','iota':'\u03B9','kappa':'\u03BA','lambda':'\u03BB','mu':'\u03BC','nu':'\u03BD','xi':'\u03BE','omicron':'\u03BF','pi':'\u03C0','rho':'\u03C1','sigmaf':'\u03C2','sigma':'\u03C3','tau':'\u03C4','upsilon':'\u03C5','phi':'\u03C6','chi':'\u03C7','psi':'\u03C8','omega':'\u03C9','thetasym':'\u03D1','straightphi':'\u03D5','piv':'\u03D6','Gamma':'\u0393','Delta':'\u0394','Theta':'\u0398','Lambda':'\u039B','Pi':'\u03A0','Sigma':'\u03A3','Tau':'\u03A4','Phi':'\u03A6','Chi':'\u03A7','Psi':'\u03A8','Omega':'\u03A9',};function xGetUnicodeOfGreekName(entityStr){var s=xGreekNameUnicodeDict[entityStr];if(!s){s=entityStr;}
return s;}
function xGreekNamesToUnicode(aStr){var s=aStr.replace(/&([a-zA-Z]+);/g,function(match,htmlEntity){return xGetUnicodeOfGreekName(htmlEntity);})
return s;}
(function(){var lastTime=0;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame'];}
if(!window.requestAnimationFrame)
window.requestAnimationFrame=function(callback,element){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall);},timeToCall);lastTime=currTime+timeToCall;return id;};if(!window.cancelAnimationFrame)
window.cancelAnimationFrame=function(id){clearTimeout(id);};}());if(typeof Object.create!='function'){Object.create=(function(){var Temp=function(){};return function(prototype){if(arguments.length>1){throw Error('Second argument not supported');}
if(typeof prototype!='object'){throw TypeError('Argument must be an object');}
Temp.prototype=prototype;var result=new Temp();Temp.prototype=null;return result;};})();}
Function.prototype.inheritsFrom=function(parentClass){this.prototype=Object.create(parentClass.prototype);this.prototype.constructor=this;this.prototype.parentClass=parentClass.prototype;return this;}
Math.log10=Math.log10||function(x){return Math.log(x)/Math.LN10;};var xDebug=false;var xDebugOutId='';function xLog(msg,args){if(!xDebug)return;var arg=arguments;var i=1;var s=msg.replace(/(#(#)?)/g,function(match,p1,p2){return p2||arg[i++];});var dom=xElement(xDebugOutId);if(dom){var txt=xInnerHTML(dom);if(txt!='')txt+='\n';xInnerHTML(dom,txt+s);}else{console.log(s);}}
function xClearLog(){var dom=xElement(xDebugOutId);if(xDebug&&dom)xInnerHTML(dom,'');}// 

function CImgCache(){this.CheckLoadInterval=100;this.MaxNLoading=2;this.LoadDelay=0;this.EnableStatusDisplay=false;this.NImages=0;this.NLoading=0;this.NUnloaded=0;this.NError=0;this.NAbort=0;this.NLoaded=0;this.Images=[];this.CState={LoadPending:0,Loading:1,Loaded:2,Error:3,Abort:4};this.ErrorMsg='';this.OnAllLoaded=new xCallbackChain();this.OnImgLoaded=new xCallbackChain();this.OnLoadCalling=false;this.LoadNextCalling=false;this.PrioList=[];this.Timer=null;var me=this;this.OnCheckLoaded=function(){me.CheckLoaded();};}
CImgCache.prototype.AddOnAllLoaded=function(aFunc){this.OnAllLoaded.Add(aFunc);};CImgCache.prototype.AddOnImgLoaded=function(aFunc){this.OnImgLoaded.Add(aFunc);};CImgCache.prototype.IsValid=function(aImageID){return((aImageID>=0)&&(aImageID<this.NImages));};CImgCache.prototype.PreloadImages=function(aUrls,aRoot)
{aRoot=xDefStr(aRoot,'');var len=aUrls.length;for(var i=0;i<len;i++){this.PreloadImage(aRoot+aUrls[i]);}};CImgCache.prototype.PreloadImage=function(aUrl,aOnLoadFunc,bPriority)
{bPriority=xDefBool(bPriority,false);var id=this.FindImage(aUrl);if(id>=0){var img=this.Images[id];if(img.CacheState==this.CState.Error||img.CacheState==this.CState.Abort){this.ReloadImage(id,aOnLoadFunc);}else{this.AddOnLoadFunc(img,aOnLoadFunc);}}else{id=this.AddImage(aUrl,aOnLoadFunc);}
if(bPriority){if(this.Images[id].CacheState==this.CState.LoadPending&&!this.InPrioList(id)){this.PrioList[this.PrioList.length]=id;}}
this.LoadNext();return id;};CImgCache.prototype.LoadImage=function(aUrl,aOnLoadFunc)
{return this.PreloadImage(aUrl,aOnLoadFunc,true);};CImgCache.prototype.ReloadImage=function(aImgID,aOnLoadFunc)
{var img=this.Images[aImgID];this.AddOnLoadFunc(img,aOnLoadFunc);if(img.CacheState!=this.CState.LoadPending){img.CacheState=this.CState.LoadPending;this.NUnloaded++;this.DisplayStatus('ReloadImage');}};CImgCache.prototype.FindImage=function(aUrl){var images=this.Images;var len=this.NImages;for(var i=0;i<len;i++){if(images[i].CacheUrl==aUrl)return i;}
return-1;};CImgCache.prototype.Image=function(aImageID){return this.Images[aImageID];};CImgCache.prototype.ImageByUrl=function(aUrl){var imgID=this.FindImage(aUrl);return(imgID>=0)?this.Image(imgID):null;};CImgCache.prototype.GetNUnloaded=function(){this.CheckLoaded();return this.NUnloaded;};CImgCache.prototype.IsLoaded=function(aImageID){if(!this.IsValid(aImageID))return false;var image=this.Images[aImageID];return(image.CacheState==this.CState.Loaded&&!image.WasError&&!image.WasAbort);};CImgCache.prototype.IsError=function(aImageID){if(!this.IsValid(aImageID))return false;var image=this.Images[aImageID];return(image.CacheState==this.CState.Error||image.WasError);};CImgCache.prototype.IsAbort=function(aImageID){if(!this.IsValid(aImageID))return false;var image=this.Images[aImageID];return(image.CacheState==this.CState.Abort||image.WasAbort);};CImgCache.prototype.IsErrorOrAbort=function(aImageID){return this.IsError(aImageID)||this.IsAbort(aImageID);};CImgCache.prototype.IsLoadedByUrl=function(aUrl){return this.IsLoaded(this.FindImage(aUrl));};CImgCache.prototype.ImageState=function(aImageID){return(this.Images[aImageID].CacheState);};CImgCache.prototype.ImageStateByUrl=function(aUrl){var imgID=this.FindImage(aUrl);return(imgID>=0)?this.ImageState(imgID):-1;};CImgCache.prototype.ImageUrl=function(aImageID){return this.Image(aImageID).CacheUrl;};CImgCache.prototype.GetStatus=function(funcName)
{if(!xDef(funcName)&&this.NError==0&&this.NAbort==0)return'';funcName=xDefStr(funcName,'GetStatus');var s=xFStr('CImgCache.#: Images to load: # of #. ',funcName,this.NUnloaded,this.NImages);if(this.NError>0||this.NAbort>0){s+='(Loaded: '+this.NLoaded+'; ';s+='Error: '+this.NError+'; ';s+='Abort: '+this.NAbort+')';}
return s;};CImgCache.prototype.ResetStatus=function(){this.ErrorMsg='';this.NError=0;this.NAbort=0;};CImgCache.prototype.DisplayStatus=function(funcName)
{if(this.EnableStatusDisplay){xLog(this.GetStatus(funcName));}};CImgCache.prototype.AddImage=function(aUrl,aOnLoadFunc)
{var id=this.NImages;var img=new Image();img.ImageId=id;img.crossOrigin="Anonymous";img.CacheUrl=aUrl;img.CacheState=this.CState.LoadPending;img.WasLoaded=false;img.WasError=false;img.WasAbort=false;img.onload=function(){this.WasLoaded=true;};img.onerror=function(){this.WasError=true;};img.onabort=function(){this.WasAbrort=true;};img.OnLoadFuncs=null;this.AddOnLoadFunc(img,aOnLoadFunc);this.Images[id]=img;this.NUnloaded++;this.NImages++;this.DisplayStatus('AddImage');return id;};CImgCache.prototype.InPrioList=function(aImageID){var pl=this.PrioList;var len=pl.length;for(var i=0;i<len;i++){if(pl[i]==aImageID)return true;}
return false;};CImgCache.prototype.LoadNext=function()
{if(this.LoadNextCalling)return;this.LoadNextCalling=true;if(this.NUnloaded==0){for(var id=0;id<this.NImages;id++){if(this.Images[id].OnLoadFuncs){this.StartLoading(id);}}
this.LoadNextCalling=false;return;}
while((this.NUnloaded>0)&&(this.PrioList.length>0)&&(this.NLoading<this.MaxNLoading)){var id=this.PrioList.shift();this.StartLoading(id);}
var found=true;while((this.NUnloaded>0)&&found&&(this.NLoading<this.MaxNLoading)){var id=this.FindLoadPending();if(id==-1){found=false;}else{this.StartLoading(id);}}
this.LoadNextCalling=false;};CImgCache.prototype.FindLoadPending=function(){var images=this.Images;var len=images.length;for(var id=0;id<len;id++){if(images[id].CacheState==this.CState.LoadPending)return id;}
return-1;};CImgCache.prototype.StartLoading=function(aImageID){if(this.Timer){clearTimeout(this.Timer);this.Timer=null;}
var img=this.Images[aImageID];if(img.CacheState==this.CState.LoadPending||img.CacheState==this.CState.Abort){this.NLoading++;this.DisplayStatus('StartLoading');img.CacheState=this.CState.Loading;if(this.LoadDelay>0){setTimeout(function(){img.src=img.CacheUrl;},this.LoadDelay);}else{img.src=img.CacheUrl;}}
if((this.NLoading>0||this.OnLoadFuncsPending())&&this.Timer==null){this.Timer=setTimeout(this.OnCheckLoaded,this.CheckLoadInterval);}};CImgCache.prototype.OnLoadFuncsPending=function(){for(var id=0;id<this.NImages;id++){var img=this.Images[id];if(img.OnLoadFuncs)return true;}
return false;}
CImgCache.prototype.CheckLoaded=function()
{if(this.Timer){clearTimeout(this.Timer);this.Timer=null;}
for(var id=0;id<this.NImages;id++){var img=this.Images[id];if(img.CacheState==this.CState.Loading||img.OnLoadFuncs){if(img.complete||img.WasLoaded){if(img.WasError){this.OnError(id);}else if(img.WasAbort){this.OnAbort(id);}else{this.OnLoad(id);}}else if(img.WasError){this.OnError(id);}else if(img.WasAbort){this.OnAbort(id);}}}
if((this.NLoading>0||this.OnLoadFuncsPending())&&this.Timer==null){this.Timer=setTimeout(this.OnCheckLoaded,this.CheckLoadInterval);}};CImgCache.prototype.OnImage=function(aImageID)
{this.NLoading--;this.NUnloaded--;this.DisplayStatus('OnImage');this.CallOnLoadFuncs(aImageID);this.OnImgLoaded.Call(aImageID);if(this.NUnloaded==0){this.OnAllLoaded.Call();}else{this.LoadNext();}};CImgCache.prototype.OnLoad=function(aImageID)
{if(this.Images[aImageID].CacheState!=this.CState.Loading)return;this.NLoaded++;this.DisplayStatus('OnLoad');this.Images[aImageID].CacheState=this.CState.Loaded;this.OnImage(aImageID);};CImgCache.prototype.OnError=function(aImageID)
{if(this.Images[aImageID].CacheState==this.CState.Loaded){this.Images[aImageID].CacheState=this.CState.Loading;this.NLoaded--;this.NLoading++;this.NUnloaded++;}
if(this.Images[aImageID].CacheState!=this.CState.Loading)return;this.NError++;this.ErrorMsg+=' Error loading '+this.Images[aImageID].src;this.DisplayStatus('OnError');this.Images[aImageID].CacheState=this.CState.Error;this.OnImage(aImageID);};CImgCache.prototype.OnAbort=function(aImageID)
{if(this.Images[aImageID].CacheState==this.CState.Loaded){this.Images[aImageID].CacheState=this.CState.Loading;this.NLoaded--;this.NLoading++;this.NUnloaded++;}
if(this.Images[aImageID].CacheState!=this.CState.Loading)return;this.NAbort++;this.DisplayStatus('OnAbort');this.Images[aImageID].CacheState=this.CState.Abort;this.OnImage(aImageID);};CImgCache.prototype.AddOnLoadFunc=function(aImage,aFunc){if(!xFunc(aFunc))return;var id=aImage.ImageId;var funcs=aImage.OnLoadFuncs;aImage.OnLoadFuncs=function(id){try{if(funcs){funcs(id);}
aFunc(id);}catch(e){}}}
CImgCache.prototype.CallOnLoadFuncs=function(aImageID){var img=this.Images[aImageID];if(this.OnLoadCalling||!img.OnLoadFuncs)return;this.OnLoadCalling=true;try{var funcs=img.OnLoadFuncs;img.OnLoadFuncs=null;if(funcs){funcs(aImageID);}}catch(e){}
this.OnLoadCalling=false;};var IC=new CImgCache();// 

var Zoom=null;function ZoomInit(){Zoom.Init(xArgsToArray(arguments));}
function ZoomPics(){Zoom.LoadPicsOnPageLoad(xArgsToArray(arguments));}
function ZoomDebug(){Zoom.DebugOn=true;}
function ZoomIn(aImgName,aBigImgUrl,aXOffset,aYOffset,aRelEleID){Zoom.ZoomIn(aImgName,aBigImgUrl,aXOffset,aYOffset,aRelEleID);}
function ZoomOut(){Zoom.ZoomOut();}
function ZoomEnable(){Zoom.Enable();}
function ZoomDisable(){Zoom.Disable();}
function CZoom()
{if(Zoom){return;}
this.CState={Hidden:0,Loading:1,ZoomIn:2,Zoomed:3,ZoomOut:4};this.DebugOn=false;this.AutoPreload=true;this.EnableInitOnClick=false;this.EnableDblClick=true;this.ZoomWindowName='Zoom';this.ZoomWindowFeatures='';this.NewWindowOnDblClick=false;this.BorderColor='black';this.BorderWidth=1;this.SizeLimit='Window';this.HideSmall=false;this.BaseZIndex=1;this.ZIndex=100;this.ZoomSpeed=300;this.TimeSpan=650;this.MinTimeSpan=150;this.TimerInterval=20;this.GiveUpTime=10000;this.TimeModifyFunc=null;this.Enabled=true;this.VAlign='ToMiddle';this.HAlign='ToCenter';this.VMargin=0;this.HMargin=0;this.TargetOffsetX=0;this.TargetOffsetY=0;this.TargetElement='';this.LoadText='Lade...';this.ErrorText='Zoom-Fehler!';this.ErrMsg='';this.ZoomFunctionName='ZoomIn';this.AddPosX=0;this.AddPosY=0;this.SmallPosX=0;this.SmallPosY=0;this.SmallWidth=0;this.SmallHeight=0;this.PrevPosX=0;this.PrevPosY=0;this.PrevWidth=0;this.PrevHeight=0;this.InitialScrollLeft=0;this.IsReZooming=false;this.BigPosX=0;this.BigPosY=0;this.BigWidth=0;this.BigHeight=0;this.BigNativeWidth=0;this.BigNativeHeight=0;this.CurrVAlign=this.VAlign;this.CurrHAlign=this.HAlign;this.CurrTargetEle=null;this.CurrTargetOffX=0;this.CurrTargetOffY=0;this.StartTime=0;this.ComputedTimeSpan=this.TimeSpan;this.Timer=null;this.AnimationTimer=null;this.BigImgID=-1;this.SmallImg=null;this.WaitObj=null;this.ErrObj=null;this.ZoomImg=null;this.State=this.CState.Hidden;this.PreloadExecuted=false;this.HtmlWritten=false;this.DblClickActive=false;this.DebugDisplayed=false;this.ImgUrlList=[];this.LastWinWidth=0;this.LastWinHeight=0;this.LastWinResizeWidth=0;this.LastWinResizeHeight=0;Zoom=this;var me=this;this.InitExecuted=false;this.InitForced=false;function AfterPageLoad(){me.CreateHtmlObjects();if(xArray(me.ImgUrlList)&&me.ImgUrlList.length>0){me.Preload(me.ImgUrlList);}
if(me.AutoPreload){me.FindAndPreloadImages();}
me.InitExecuted=true;}
xOnLoad(AfterPageLoad);}
CZoom.prototype.Init=function(aImgUrlList){this.ImgUrlList=aImgUrlList;};CZoom.prototype.ForceInit=function(){if(this.InitExecuted){return;}
this.CreateHtmlObjects();this.InitExecuted=true;this.InitForced=true;};CZoom.prototype.FindAndPreloadImages=function(){var urlList=[];var callList=this.FindZoomFunctionCalls();for(var i=0;i<callList.length;i++){urlList.push(this.GetPathFromZoomFunctionCall(callList[i]));}
if(urlList.length>0){this.Preload(urlList);}}
CZoom.prototype.FindZoomFunctionCalls=function(){var callList=[];var el=xGetByTag('*');for(var i=0;i<el.length;i++){var e=el[i];if(e.onclick){var src=this.IsZoomFunctionCall(e.onclick);if(src!=''){callList.push(src);}}
if(e.tagName=='A'){var href=e.href||'';if(href.indexOf('javascript:')>=0){var src=this.IsZoomFunctionCall(href);if(src!=''){callList.push(src);}}}}
return callList;}
CZoom.prototype.IsZoomFunctionCall=function(aHandler){var s=''+aHandler;var p=s.indexOf(this.ZoomFunctionName);return(p>=0)?s:'';}
CZoom.prototype.GetPathFromZoomFunctionCall=function(aCallStr){var p=aCallStr.indexOf(this.ZoomFunctionName);if(p<0){return'';}
p=aCallStr.indexOf(',',p);var sp=aCallStr.indexOf('\'',p);var ep=aCallStr.indexOf('\'',sp+1);return aCallStr.substring(sp+1,ep);}
CZoom.prototype.GetIdFromZoomFunctionCall=function(aCallStr){var p=aCallStr.indexOf(this.ZoomFunctionName);if(p<0){return'';}
p=aCallStr.indexOf('(',p);var sp=aCallStr.indexOf('\'',p);var ep=aCallStr.indexOf('\'',sp+1);return aCallStr.substring(sp+1,ep);}
CZoom.prototype.LoadPicsOnPageLoad=function(aImgUrlList){var me=this;function AfterPageLoad(){if(aImgUrlList.length>0){me.Preload(aImgUrlList);}}
xOnLoad(AfterPageLoad);};CZoom.prototype.Preload=function(aImgUrlList){if(aImgUrlList.length==2&&xArray(aImgUrlList[1])){IC.PreloadImages(aImgUrlList[1],aImgUrlList[0]);}
else{IC.PreloadImages(aImgUrlList);}
this.PreloadExecuted=true;};CZoom.prototype.Diagnose=function(){var ics=IC.GetStatus();var s='';if(this.ErrMsg!=''){s+='Errors:\n';s+=this.ErrMsg+'\n';}
if(!this.PreloadExecuted){s+='Warning: No images preloaded!\nUse Zoom.Init to preload the zoom images or set Zoom.AutoPreload = true.';this.PreloadExecuted=true;}
if(s==''){if(ics!=''){s='Zoom Status: ok.\nBut problems with some images detected.\nCheck url\'s in Zoom.Init and ZoomIn!';}}else{s='Zoom Status:\n\n'+s;}
if(ics!=''){s+='\n\nIC Status (IC = Image Caching and Preload):\n'+ics+'\n'+IC.ErrorMsg;IC.ResetStatus();}
if(s!=''||!this.DebugDisplayed){if(s==''){s='Zoom Status: all fine!\n\nTo remove this message,\ndelete or comment the line with ZoomDebug(); from your script.';}
alert(s);}
this.ErrMsg='';this.DebugDisplayed=true;};CZoom.prototype.AddError=function(aMsg){this.ErrMsg+=aMsg+'\n';};CZoom.prototype.CreateHtmlObjects=function()
{var me=this;var msgFailed='CZoom.CreateHtmlObjects: creating Zoom HTML failed ';function OnClick(){me.ZoomOut();}
function OnDblClick(){me.NewWindow();}
var oImg=xCreateElement('img');if(!oImg||!oImg.style){this.AddError(msgFailed+'(xCreateElement)');return;}
oImg.id='ZoomPic';oImg.style.position='absolute';oImg.style.visibility='hidden';oImg.style.zIndex=this.ZIndex;oImg.alt='';oImg.title='';xAddClass(oImg,"ImageTypeZoom");if(this.BorderWidth>0){oImg.style.border=this.BorderWidth+'px solid '+this.BorderColor;}
oImg.onclick=OnClick;if(this.EnableDblClick){oImg.ondblclick=OnDblClick;}
var oDivWait=xCreateElement('div');var oDivError=xCreateElement('div');var oTextWait=xCreateTextNode(this.LoadText);var oTextError=xCreateTextNode(this.ErrorText);if(!oDivWait||!oDivError||!oTextWait||!oTextError){this.AddError(msgFailed+'(xCreateTextNode)');return;}
xAppendChild(oDivWait,oTextWait);xAppendChild(oDivError,oTextError);oDivWait.id='ZoomPicWait';oDivWait.style.position='absolute';oDivWait.style.visibility='hidden';oDivWait.style.zIndex=this.BaseZIndex+1;oDivWait.style.backgroundColor='white';oDivWait.style.color='black';oDivWait.style.padding='0 4px';oDivWait.style.fontSize='10pt';oDivWait.style.border='1px solid black';oDivError.id='ZoomPicError';oDivError.style.position='absolute';oDivError.style.visibility='hidden';oDivError.style.zIndex=this.BaseZIndex+1;oDivError.style.backgroundColor='white';oDivError.style.color='black';oDivError.style.padding='0 4px';oDivError.style.fontSize='10pt';oDivError.style.border='1px solid black';var oElements=xGetByTag('body');if(!oElements||oElements.length<1){this.AddError(msgFailed+'(no body tag found)');return;}
var oBody=oElements[0];if(!xHasChildNodes(oBody)){this.AddError(msgFailed+'(no html elements in body tag found)');return;}
oElements=xChildNodes(oBody);xInsertBefore(oBody,oDivError,oElements[0]);xInsertBefore(oBody,oDivWait,oDivError);xInsertBefore(oBody,oImg,oDivWait);this.WaitObj=oDivWait;this.ErrObj=oDivError;this.ZoomImg=oImg;this.HtmlWritten=true;};CZoom.prototype.ReZoom=function(){this.PrevPosX=this.BigPosX;this.PrevPosY=this.BigPosY;this.PrevWidth=this.BigWidth;this.PrevHeight=this.BigHeight;this.IsReZooming=true;this.ComputeZoomParametersAndTriggerZoom();}
CZoom.prototype.ZoomIn=function(aImgName,aBigImgUrl,aXOffset,aYOffset,aRelEleID)
{this.ResetTimer();if(!this.InitExecuted){if(this.EnableInitOnClick){this.AddError('ZoomIn: Zoom not initialized - forcing init now!\nCheck Zoom.Init and ensure no onload is in body tag!');this.ForceInit();if(!this.HtmlWritten){this.AddError('ZoomIn: forced Init failed, give up here.');return;}}else{if(this.DebugOn){this.AddError('ZoomIn: Zoom not initialized!\nCheck Zoom.Init and ensure no onload is in body tag\nor set Zoom.EnableInitOnClick = true;');this.Diagnose();}
return;}}
if(this.DebugOn){this.Diagnose();}
if(!this.Enabled){return;}
if(!this.WaitObj){this.WaitObj=xGet('ZoomPicWait');}
if(!this.ErrObj){this.ErrObj=xGet('ZoomPicError');}
if(!this.ZoomImg){this.ZoomImg=xGet('ZoomPic');}
this.HideMessages();var bigImgID=IC.FindImage(aBigImgUrl);if(this.EnableDblClick&&this.DblClickActive){return;}
this.CurrVAlign=this.VAlign;this.CurrHAlign=this.HAlign;this.CurrTargetEle=null;this.CurrTargetOffX=this.TargetOffsetX;this.CurrTargetOffY=this.TargetOffsetY;if(this.TargetElement!=''){var relEle=xGet(this.TargetElement);if(relEle){this.CurrTargetEle=relEle;}}
if(xNum(aXOffset)||xNum(aYOffset)||xStr(aRelEleID)){this.CurrVAlign='Relative';this.CurrHAlign='Relative';this.CurrTargetEle=null;this.CurrTargetOffX=0;this.CurrTargetOffY=0;}
if(xNum(aXOffset)){this.CurrTargetOffX=aXOffset;}
if(xNum(aYOffset)){this.CurrTargetOffY=aYOffset;}
if(xStr(aRelEleID)){var relEle=xGet(aRelEleID);if(relEle){this.CurrTargetEle=relEle;}}
if((this.State!=this.CState.Hidden)&&(bigImgID!=-1)&&(bigImgID==this.BigImgID)){if(this.State==this.CState.Loading){this.State=this.CState.Hidden;return;}
if(this.State==this.CState.ZoomIn||this.State==this.CState.Zoomed){this.ZoomOut();return;}
this.StartTime=xTimeMS()-this.ComputedTimeSpan+(xTimeMS()-this.StartTime);this.State=this.CState.ZoomIn;var me=this;this.SetTimer(function(){me.Enlarge();},this.TimerInterval);return;}
if(this.State==this.CState.Loading){this.State=this.CState.Hidden;}
else if(this.State!=this.CState.Hidden){this.HideZoomImg();}
this.SmallImg=xGet(aImgName);if(!this.SmallImg){if(this.DebugOn)alert('ZoomIn: Nonexistent Element. ID = '+aImgName);return;}
if((bigImgID!=-1)&&IC.IsLoaded(bigImgID)){this.BigImgID=bigImgID;this.StartZoom();}
else{this.ShowLoadingMessage();if(bigImgID!=-1&&IC.ImageState(bigImgID)>=IC.CState.Error){this.ShowErrorMessage();}else{this.State=this.CState.Loading;var me=this;this.BigImgID=IC.LoadImage(aBigImgUrl,function(aImgID){me.OnLoad(aImgID);});var me=this;this.SetTimer(function(){me.ClearTimer();me.State=me.CState.Hidden;me.ShowErrorMessage();},this.GiveUpTime);}}};CZoom.prototype.RequestAnimationFrame=function(fn){this.ResetTimer();this.AnimationTimer=requestAnimationFrame(fn);}
CZoom.prototype.CancelAnimationFrame=function(){if(this.AnimationTimer){cancelAnimationFrame(this.AnimationTimer);this.AnimationTimer=null;}}
CZoom.prototype.SetTimer=function(fn,t){this.ResetTimer();this.Timer=setTimeout(fn,t);}
CZoom.prototype.ResetTimer=function(){if(this.Timer){clearTimeout(this.Timer);this.Timer=null;}
this.CancelAnimationFrame();}
CZoom.prototype.ShowLoadingMessage=function(){this.GetSmallImgData();var x=this.SmallPosX+0.5*this.SmallWidth-0.5*xWidth(this.WaitObj);var y=this.SmallPosY+0.5*this.SmallHeight-0.5*xHeight(this.WaitObj);xMoveTo(this.WaitObj,x,y);var x=this.SmallPosX+0.5*this.SmallWidth-0.5*xWidth(this.ErrObj);var y=this.SmallPosY+0.5*this.SmallHeight-0.5*xHeight(this.ErrObj);xMoveTo(this.ErrObj,x,y);xShow(this.WaitObj);}
CZoom.prototype.ShowErrorMessage=function(){xHide(this.WaitObj);xShow(this.ErrObj);var me=this;this.SetTimer(function(){xHide(me.ErrObj);},2500);}
CZoom.prototype.HideMessages=function(){xHide(this.WaitObj);xHide(this.ErrObj);}
CZoom.prototype.HideZoomImg=function()
{if(this.HideSmall)xShow(this.SmallImg);xHide(this.ZoomImg);xTransformTranslateScale(this.ZoomImg,0,0,10,10,this.BigNativeWidth,this.BigNativeHeight);this.ZoomImg.src='';this.State=this.CState.Hidden;};CZoom.prototype.Enable=function(){this.Enabled=true;};CZoom.prototype.Disable=function(){this.Enabled=false;};CZoom.prototype.GetSmallImgData=function()
{this.SmallWidth=xWidth(this.SmallImg)+2*this.BorderWidth;this.SmallHeight=xHeight(this.SmallImg)+2*this.BorderWidth;this.SmallPosX=xPageX(this.SmallImg)+(xWidth(this.SmallImg)-this.SmallWidth)/2+this.AddPosX;this.SmallPosY=xPageY(this.SmallImg)+(xHeight(this.SmallImg)-this.SmallHeight)/2+this.AddPosY;};CZoom.prototype.OnLoad=function(aImgID)
{this.ResetTimer();if((this.State==this.CState.Loading)&&(this.BigImgID==aImgID)){var imgState=IC.Image(aImgID).CacheState;if(imgState==IC.CState.Loaded){this.StartZoom();}
else if(imgState==IC.CState.Error||imgState==IC.CState.Abort){this.State=this.CState.Hidden;this.ShowErrorMessage();}}};CZoom.prototype.Range=function(aValue,aMin,aMax){return aMin+(aMax-aMin)*aValue;};CZoom.prototype.StartZoom=function()
{var me=this;function go(){me.ResetTimer();me.HideMessages();me.ZoomImg.onload=null;me.ComputeZoomParametersAndTriggerZoom();}
function TryAgain(){this.ResetTimer();if(me.ZoomImg.complete){go();}
if(xTimeMS()>me.StartTime+this.GiveUpTime){me.ShowErrorMessage();return;}
me.ShowLoadingMessage();me.SetTimer(TryAgain,100);}
this.BigImg=IC.Image(this.BigImgID);this.ZoomImg.onload=function(){me.ZoomImg.onload=null;me.SetTimer(go,100);};this.ZoomImg.src=this.BigImg.src;if(this.ZoomImg.complete){this.ZoomImg.onload=null;this.SetTimer(go,100);return;}
this.StartTime=xTimeMS();this.SetTimer(TryAgain,100);};CZoom.prototype.ComputeZoomParametersAndTriggerZoom=function()
{this.BigWidth=this.BigImg.width+2*this.BorderWidth;this.BigHeight=this.BigImg.height+2*this.BorderWidth;this.BigNativeWidth=this.BigWidth;this.BigNativeHeight=this.BigHeight;this.GetSmallImgData();if(!this.IsReZooming){if((this.SmallWidth>=this.BigWidth)||(this.SmallHeight>=this.BigHeight)){return;}}
var winW=xClientWidth();var winH=xClientHeight();var winX=xScrollLeft();var winY=xScrollTop();if(this.LastWinResizeWidth!=winW||this.LastWinResizeHeight!=winH){this.LastWinResizeWidth=winW;this.LastWinResizeHeigth=winH;xTriggerEventLayoutChange();}
if(this.IsReZooming){winX=this.InitialScrollLeft;}else{this.InitialScrollLeft=winX;}
var clW=winW;var clX=winX;var clH=winH;var clY=winY;var limitEle=null;if(this.SizeLimit!=''){var maxWidth=this.BigWidth;var maxHeight=this.BigHeight;var ratio=this.BigWidth/this.BigHeight;if(this.SizeLimit=='Window'){if(maxWidth>winW)maxWidth=winW;if(maxHeight>winH)maxHeight=winH;}else if(this.SizeLimit=='WindowWidth'){if(maxWidth>winW)maxWidth=winW;}else if(this.SizeLimit=='WindowHeight'){if(maxHeight>winH)maxHeight=winH;}else if(this.SizeLimit=='WindowFill'){if(winW/winH>ratio){if(maxWidth>winW)maxWidth=winW;}else{if(maxHeight>winH)maxHeight=winH;}}else{limitEle=xGet(this.SizeLimit);if(limitEle){clX=xPageX(limitEle);clY=xPageY(limitEle);clW=xWidth(limitEle);clH=xHeight(limitEle);if(maxWidth>clW)maxWidth=clW;if(maxHeight>clH)maxHeight=clH;if(maxWidth>winW)maxWidth=winW;if(maxHeight>winH)maxHeight=winH;var clXX=clX+clW;if(clXX>winX+winW)clXX=winX+winW;if(clX<winX)clX=winX;clW=clXX-clX;var clYY=clY+clH;if(clYY>winY+winH)clYY=winY+winH;if(clY<winY)clY=winY;clH=clYY-clY;}}
if(maxWidth==0)maxWidth=winW;if(maxHeight==0)maxHeight=winH;if(this.BigWidth>maxWidth){this.BigWidth=maxWidth;this.BigHeight=this.BigWidth/ratio;}
if(this.BigHeight>maxHeight){this.BigHeight=maxHeight;this.BigWidth=this.BigHeight*ratio;}}
if(this.CurrHAlign=='Left'){this.BigPosX=clX+this.HMargin;}else if(this.CurrHAlign=='Right'){this.BigPosX=(clX+clW)-this.BigWidth-this.HMargin;}else if(this.CurrHAlign=='Relative'){var ref=this.SmallImg;if(this.CurrTargetEle){ref=this.CurrTargetEle;}
this.BigPosX=xPageX(ref)+this.CurrTargetOffX;}else{var dxCenter=1;if(this.BigWidth<=clW){dxCenter=(this.BigWidth-this.SmallWidth)/(clW-this.SmallWidth);if(dxCenter<0){dxCenter=0;}}
if(this.CurrHAlign=='Center'){dxCenter=1;}
var cxBig=clW/2;var cxSrc=this.SmallPosX-clX+(this.SmallWidth/2);var cx=dxCenter*(cxBig-cxSrc)+cxSrc;this.BigPosX=clX+cx-this.BigWidth/2;if(this.BigPosX<0){this.BigPosX=0;}}
if(this.CurrVAlign=='Top'){this.BigPosY=clY+this.VMargin;}else if(this.CurrVAlign=='Bottom'){this.BigPosY=(clY+clH)-this.BigHeight-this.VMargin;}else if(this.CurrVAlign=='Relative'){var ref=this.SmallImg;if(this.CurrTargetEle){ref=this.CurrTargetEle;}
this.BigPosY=xPageY(ref)+this.CurrTargetOffY;}else{var dyCenter=1;if(this.BigHeight<=clH){dyCenter=(this.BigHeight-this.SmallHeight)/(clH-this.SmallHeight);if(dyCenter<0){dyCenter=0;}}
if(this.CurrVAlign=='Middle'){dyCenter=1;}
var cyBig=clH/2;var cySrc=this.SmallPosY-clY+(this.SmallHeight/2);var cy=dyCenter*(cyBig-cySrc)+cySrc;this.BigPosY=clY+cy-this.BigHeight/2;if(this.BigPosY<0){this.BigPosY=0;}}
if((this.BigPosX+this.BigWidth)>(winX+winW)){this.BigPosX=(winX+winW)-this.BigWidth;}
if((this.BigPosX)<(winX)){this.BigPosX=winX;}
if((this.BigPosY+this.BigHeight)>(winY+winH)){this.BigPosY=(winY+winH)-this.BigHeight;}
if((this.BigPosY)<(winY)){this.BigPosY=winY;}
if(this.BigWidth>winW){var winC=winX+winW/2;this.BigPosX=winC-this.BigWidth/2;if(this.BigPosX<0)this.BigPosX=0;}
if(this.BigHeight>winH){var winC=winY+winH/2;this.BigPosY=winC-this.BigHeight/2;if(this.BigPosY<0)this.BigPosY=0;}
this.ComputeTimeSpan();this.StartTime=xTimeMS();var me=this;this.RequestAnimationFrame(function(){me.Enlarge();});};CZoom.prototype.ComputeTimeSpan=function(){if(this.ZoomSpeed>0){var ref=this.SmallHeight;if(ref<1)ref=1;var scaleW=this.BigHeight/ref;var scaleX=2*((this.BigPosX+this.BigWidth/2)-(this.SmallPosX+this.SmallWidth/2))/ref;var scaleY=2*((this.BigPosY+this.BigHeight/2)-(this.SmallPosY+this.SmallHeight/2))/ref;var scale=Math.sqrt(scaleW*scaleW+scaleX*scaleX+scaleY*scaleY);if(scale<1)scale=1;var time=(Math.log(scale)/Math.log(2))*(this.ZoomSpeed/1000);var deltaSpan=(this.TimeSpan-this.MinTimeSpan)/1000;time=time/Math.pow(Math.pow(time/deltaSpan,4)+1,0.25)+(this.MinTimeSpan/1000);this.ComputedTimeSpan=Math.round(1000*time);}else{this.ComputedTimeSpan=this.TimeSpan;}}
CZoom.prototype.Enlarge=function()
{this.ResetTimer();if(this.DblClickActive)return;var param=(xTimeMS()-this.StartTime)/this.ComputedTimeSpan;var eom=param>=1;if(param>1){param=1;}
if(this.TimeModifyFunc){param=this.TimeModifyFunc(param);}
if(param<0){param=0;}
if(param>1){param=1;}
if(this.IsReZooming){var srcX=this.PrevPosX;var srcY=this.PrevPosY;var srcW=this.PrevWidth;var srcH=this.PrevHeight;}else{var srcX=this.SmallPosX;var srcY=this.SmallPosY;var srcW=this.SmallWidth;var srcH=this.SmallHeight;}
var x=this.Range(param,srcX,this.BigPosX);var y=this.Range(param,srcY,this.BigPosY);var w=this.Range(param,srcW,this.BigWidth);var h=this.Range(param,srcH,this.BigHeight);xTransformTranslateScale(this.ZoomImg,x,y,w,h,this.BigNativeWidth,this.BigNativeHeight,true);if(this.State!=this.CState.ZoomIn){this.HideMessages();xShow(this.ZoomImg);if(this.HideSmall){xHide(this.SmallImg);}
this.State=this.CState.ZoomIn;}
var me=this;if(eom)
{this.State=this.CState.Zoomed;this.IsReZooming=false;this.SetTimer(function(){me.MonitorOutOfWindowOrResize();},200);}
else
{this.RequestAnimationFrame(function(){me.Enlarge();});}};CZoom.prototype.MonitorWindowResize=function(){var me=this;this.ResetTimer();var winW=xClientWidth();var winH=xClientHeight();if(this.LastWinResizeWidth!=winW||this.LastWinResizeHeight!=winH){this.LastWinResizeWidth=winW;this.LastWinResizeHeigth=winH;xTriggerEventLayoutChange();}
if(winW!=this.LastWinWidth||winH!=this.LastWinHeight){this.LastWinWidth=winW;this.LastWinHeight=winH;this.SetTimer(function(){me.MonitorWindowResize();},500);return;}
this.LastWinWidth=0;this.LastWinHeight=0;if(this.BigImgID>=0){this.ReZoom();}}
CZoom.prototype.MonitorOutOfWindowOrResize=function()
{var me=this;this.ResetTimer();var winW=xClientWidth();var winH=xClientHeight();if(this.LastWinResizeWidth!=winW||this.LastWinResizeHeight!=winH){this.LastWinResizeWidth=winW;this.LastWinResizeHeigth=winH;xTriggerEventLayoutChange();}
if(this.LastWinWidth==0||this.LastWinHeight==0){this.LastWinWidth=winW;this.LastWinHeight=winH;}else if(winW!=this.LastWinWidth||winH!=this.LastWinHeight){this.MonitorWindowResize();return;}
var space=(winH-this.BigHeight)/2;var newY=xScrollTop()+space;var toleranz;if(space>0){toleranz=space+(this.BigHeight*2/3);}else{toleranz=-space+(winH*2/3);}
if(Math.abs(newY-this.BigPosY)>toleranz){this.ZoomOut();return;}
this.SetTimer(function(){me.MonitorOutOfWindowOrResize();},200);};CZoom.prototype.NewWindow=function()
{function CancelDblClick(){me.DblClickActive=false;}
if(!this.HtmlWritten){return;}
var me=this;if(!this.DblClickActive){this.DblClickActive=true;setTimeout(function(){CancelDblClick();},500);}
this.HideZoomImg();if(this.NewWindowOnDblClick){var features=this.ZoomWindowFeatures;features=features.replace(/%w/gi,this.BigWidth.toString());features=features.replace(/%h/gi,this.BigHeight.toString());var w=window.open(IC.ImageUrl(this.BigImgID),this.ZoomWindowName,features);}else{location.href=IC.ImageUrl(this.BigImgID);}};CZoom.prototype.ZoomOut=function()
{this.IsReZooming=false;if(!this.HtmlWritten){return;}
if(this.State==this.CState.Hidden||this.State==this.CState.ZoomOut){return;}
if(this.State==this.CState.Loading){this.HideMessages();this.State=this.CState.Hidden;return;}
this.ResetTimer();this.GetSmallImgData();this.SmallPosX=xPageX(this.SmallImg)+(xWidth(this.SmallImg)-this.SmallWidth)/2+this.AddPosX;this.SmallPosY=xPageY(this.SmallImg)+(xHeight(this.SmallImg)-this.SmallHeight)/2+this.AddPosY;if(this.State==this.CState.ZoomIn){this.StartTime=xTimeMS()-this.ComputedTimeSpan+(xTimeMS()-this.StartTime);}else{this.StartTime=xTimeMS();}
this.ComputeTimeSpan();this.State=this.CState.ZoomOut;var me=this;this.RequestAnimationFrame(function(){me.Shrink();});};CZoom.prototype.Shrink=function()
{this.ResetTimer();var param=(xTimeMS()-this.StartTime)/this.ComputedTimeSpan;var eom=param>=1;if(param>1){param=1;}
if(this.TimeModifyFunc){param=this.TimeModifyFunc(param);}
if(param<0){param=0;}
if(param>1){param=1;}
var x=this.Range(param,this.BigPosX,this.SmallPosX);var y=this.Range(param,this.BigPosY,this.SmallPosY);var w=this.Range(param,this.BigWidth,this.SmallWidth);var h=this.Range(param,this.BigHeight,this.SmallHeight);xTransformTranslateScale(this.ZoomImg,x,y,w,h,this.BigNativeWidth,this.BigNativeHeight,true);if(eom){this.HideZoomImg();this.BigImgID=-1;this.LastWinWidth=0;this.LastWinHeight=0;}else{var me=this;this.RequestAnimationFrame(function(){me.Shrink();});}};Zoom=new CZoom();Zoom.TimeModifyFunc=function(aValue){return(0.5-0.5*Math.cos(Math.PI*aValue));};// 

function CProgressbar(){var me=this;this.ActionStack=[];this.TextStack=[];this.NStack=[];this.OfStack=[];this.CounterStack=[];this.SP=-1;this.MaxSP=-1;this.Box=null;this.WaitText='waiting for Server...';this.Timer=null;this.WaitTime=3000;this.ServerTimeout=function(){me.OnServerTimeout();}}
CProgressbar.prototype.Start=function(aAction,aTotal){this.SP++;if(this.SP>this.MaxSP){this.MaxSP=this.SP;}
if(!this.Box){this.Box=this.CreateHTML();}else{if(this.SP==0){xDisplay(this.Box,'');}}
this.ActionStack[this.SP]=aAction;this.TextStack[this.SP]='';this.NStack[this.SP]=0;this.OfStack[this.SP]=aTotal||0;this.CounterStack[this.SP]=0;this.Show();}
CProgressbar.prototype.End=function(bAll){if(this.SP<0){this.SP=-1;return;}
this.ActionStack[this.SP]='';this.TextStack[this.SP]='';this.NStack[this.SP]=0;this.OfStack[this.SP]=0;this.CounterStack[this.SP]=0;this.SP--;if(this.SP<0||bAll){this.Hide();if(bAll){this.SP=-1;}
return;}}
CProgressbar.prototype.Next=function(aNum,aText){if(this.SP<0)return;this.TextStack[this.SP]=aText;this.NStack[this.SP]=aNum;this.CounterStack[this.SP]++;this.Show();}
CProgressbar.prototype.Hide=function(){if(this.Timer){clearTimeout(this.Timer);this.Timer=null;}
xDisplay(this.Box,'none');}
CProgressbar.prototype.CreateHTML=function(){var s='<div id="ProgressBarBox">Bitte warten...</div>';document.writeln(s);return xGet('ProgressBarBox');}
CProgressbar.prototype.Show=function(){if(this.Timer){clearTimeout(this.Timer);this.Timer=null;}
xInnerHTML(this.Box,this.MakeMsg()+'&nbsp;');this.Timer=setTimeout(this.ServerTimeout,this.WaitTime);}
CProgressbar.prototype.OnServerTimeout=function(){this.Timer=null;xInnerHTML(this.Box,this.MakeMsg()+'<div><i>'+this.WaitText+'</i></div>');}
CProgressbar.prototype.MakeMsg=function(){if(this.SP<0)return;var s='';for(var i=0;i<=this.MaxSP;i++){s+=this.MakeLine(i);}
return s;}
CProgressbar.prototype.MakeLine=function(i){var line='<div>';var action=this.ActionStack[i];if(action!=''){if(i==0){line+='<b>';}
line+=action+': ';if(i==0){line+='</b>';}}
if(this.NStack[i]>0){line+=this.MakeNum(i)+' '+this.TextStack[i]+'</div>';}else{line+=this.TextStack[i]+'</div>';}
line+=this.MakeBar(i);return line;}
CProgressbar.prototype.MakeNum=function(i){if(this.OfStack[i]==0){return this.NStack[i].toString();}else{return(100*(this.NStack[i]/this.OfStack[i])).toFixed(0)+'%';}}
CProgressbar.prototype.MakeBar=function(i){var prog=0;if(this.NStack[i]>0){if(this.OfStack[i]==0){prog=this.NStack[i]/(this.NStack[i]+2);}else{prog=this.NStack[i]/this.OfStack[i];}}else{prog=this.CounterStack[i]/(this.CounterStack[i]+2);}
return'<div style="border:2px solid black;width:100%;height:1em;margin:0;"><div style="background-color:gray;width:'+(100*prog)+'%;height:100%;"></div></div>';}
var Progressbar=new CProgressbar;// 

var WIKI_MinHiliWordLength=1;var WIKI_MaxHiliItems=100;var WIKI_NumHiliColors=3;var WIKI_KeyPressed=false;var WIKI_HtmlBody=null;var WIKI_RedirectList=[];var WIKI_HiliStateOn=false;var WIKI_NumHiliItems=0;function EditPage(event,aHeaderText){if(PAGE_MODE==''){if(ENABLE_EDIT){var asp=ASP_PAGE;var op='&op=edit';if(!IS_LOGED_IN&&!event.shiftKey){op='&op=login';}
if(aHeaderText){if(op){op+='&';}
op+='hd='+UrlEncode(aHeaderText);}
location.href=asp+'?page='+UrlEncode(PAGE_NAME)+op;event.PreventDefault();event.StopPropagation();}}else{}}
function ShowUploadForm(event){if(PAGE_MODE==''&&ENABLE_EDIT){var asp=ASP_PAGE;var op='&op=upload';location.href=asp+'?page='+UrlEncode(PAGE_NAME)+op;event.PreventDefault();event.StopPropagation();}}
function ShowWikiFunctions(event){if(PAGE_MODE==''&&IS_LOGED_IN){var asp=ASP_PAGE;var op='&op=wiki';location.href=asp+'?page='+UrlEncode(PAGE_NAME)+op;event.PreventDefault();event.StopPropagation();}}
function OnDocKeyDown(ev){if(!WIKI_KeyPressed&&(ev.keyCode==13||(ev.keyCode>=49&&ev.keyCode<=57))){var i=ev.keyCode-49;if(i<0){i=0;}
if(WIKI_RedirectList.length-1>=i){location.href=WIKI_RedirectList[i];}}
WIKI_KeyPressed=true;if(ev.keyCode==88&&ev.ctrlKey&&!ev.altKey&&!HAS_FORMS)EditPage(ev,'');if(ev.keyCode==85&&ev.ctrlKey&&!ev.altKey&&!HAS_FORMS)ShowUploadForm(ev);if(ev.keyCode==90&&ev.ctrlKey&&!ev.altKey&&!HAS_FORMS)ShowWikiFunctions(ev);}
function UrlEncode(s){var ss=s;ss=escape(ss);ss=ss.replace(/\//g,'%2F');ss=ss.replace(/\+/g,'%2B');ss=ss.replace(/\*/g,'%2A');ss=ss.replace(/@/g,'%40');ss=ss.replace(/%20/g,'+');return ss;}
function Trim(aText){var s=aText.replace(/[\t\n]/g,' ');s=s.replace(/^[ ]*(.*?)[ ]*$/,'$1');return s;}
function OnDblCklick(event){var target=event.target;while(target&&target.nodeName.charAt(0)!='H'){target=target.parentNode;}
if(!target){return;}
var txt=xInnerHTML(target);txt=txt.replace(/title=\".*?\"/g,'');var aref=txt.indexOf('<a ')>=0;txt=txt.replace(/<.+?>/g,'');if(aref)txt='[['+txt+']]';EditPage(event,Trim(txt));}
function InitWikiJS(){WIKI_HtmlBody=xGet('body');var oHtmlList=xGetByTag("html");if(oHtmlList.length>0){xAddEvent(oHtmlList[0],'keydown',OnDocKeyDown,false);}
for(var lvl=1;lvl<=4;lvl++){var topHeaderList=xGetByTag('h'+lvl);if(topHeaderList&&topHeaderList.length>0){for(var i=0;i<topHeaderList.length;i++){xAddEvent(topHeaderList[i],'dblclick',OnDblCklick,false);}}}}
function LayoutMaximize(removeLimitWidth){if(xFunc(window.OnLayoutMaximize)){try{OnLayoutMaximize();}catch(e){}}
removeLimitWidth=xDefBool(removeLimitWidth,xDefBool(window.OnLayoutMaxRemoveLimitWidth,false));if(removeLimitWidth){xRemoveClass('Layout-Root','limitWidth');xAddClass('Layout-Root','limitWidthRemoved');}
xAddClass('Layout-ContentPart','maximize');xAddClass('Layout-SidebarPart','minimize');xAddClass('SidebarOffButton','hide');xRemoveClass('SidebarOnButton','hide');xTriggerEventLayoutChange();}
function LayoutNormal(){if(xFunc(window.OnLayoutNormal)){try{OnLayoutNormal();}catch(e){}}
xRemoveClass('Layout-ContentPart','maximize');xRemoveClass('Layout-SidebarPart','minimize');xAddClass('SidebarOnButton','hide');xRemoveClass('SidebarOffButton','hide');if(xHasClass('Layout-Root','limitWidthRemoved')){xRemoveClass('Layout-Root','limitWidthRemoved');xAddClass('Layout-Root','limitWidth');}
xTriggerEventLayoutChange();}
function IsLayoutMaximized(){return xHasClass('Layout-ContentPart','maximize');}
function LayoutFullscreenOn(){if(xFunc(window.OnFullscreenOn)){try{OnFullscreenOn();}catch(e){}}
xRemoveClass('Layout-Root','limitWidth');xAddClass('FullscreenOnButton','hide');xRemoveClass('FullscreenOffButton','hide');xTriggerEventLayoutChange();}
function LayoutFullscreenOff(){if(xFunc(window.OnFullscreenOff)){try{OnFullscreenOff();}catch(e){}}
xAddClass('Layout-Root','limitWidth');xAddClass('FullscreenOffButton','hide');xRemoveClass('FullscreenOnButton','hide');xTriggerEventLayoutChange();}
function IsLayoutFullscreen(){return!xHasClass('Layout-Root','limitWidth');}
function AddToCookie(aName,aValue,aSep,aDays){var value=xGetCookie(aName)||'';if(value!=''){value+=aSep;}
value+=aValue;xSetCookie(aName,value,aDays);}
function AddCBReq(aText){AddToCookie('AddCBReq',aText,'ï¿½',1);}
xOnDomReady(InitWikiJS);function SEL(grp,idList,bUpdateLayout){function isInList(l,ele){for(var i=0;i<l.length;i++){if(l[i]==ele){return true;}}
return false;}
bUpdateLayout=xDefBool(bUpdateLayout,false);var top=xScrollTop(null,true);for(var i=0;i<grp.length;i++){if(isInList(idList,grp[i])){xDisplay('SEL_ELE_'+grp[i],'');}}
for(var i=0;i<grp.length;i++){if(!isInList(idList,grp[i])){xDisplay('SEL_ELE_'+grp[i],'none');}}
xScrollTop(null,true,top);if(bUpdateLayout){xTriggerEventLayoutChange();}}
function SplitWords(words){if(words==''){return[];}
if(words.charAt(0)=='='){return[words.substr(1,words.length-1)];}
var pl=words.split('"');if(pl.length>1){for(var i=1;i<pl.length;i+=2){pl[i]=pl[i].replace(/ /g,'%20');pl[i]=pl[i].replace(/\|/g,'%7C');}
words='';for(var i=0;i<pl.length;i++){if(i>0){words+='"';}
words+=pl[i];}}
words=words.replace(/\|/g,' ');pl=words.split(' ');for(var i=0;i<pl.length;i++){var s=pl[i];s=s.replace(/%20/g,' ');s=s.replace(/%7C/g,'|');if(s.length>2&&s.charAt(0)=='"'&&s.charAt(s.length-1)=='"'){s=s.substr(1,s.length-2);}
pl[i]=s;}
return pl;}
function decodeHtml(s){var div=xCreateElement('div');xAppendChild(div,xCreateTextNode(s));xInnerHTML(div,s);return xInnerText(div,s);}
function highlightWord(node,word,n){if(word.length<WIKI_MinHiliWordLength||WIKI_NumHiliItems>WIKI_MaxHiliItems){return false;}
if(xHasChildNodes(node)){var hi_cn;var cnl=node.childNodes;for(hi_cn=0;hi_cn<cnl.length;hi_cn++){if(!highlightWord(cnl[hi_cn],word,n)){return false;}}}
if(node.nodeType==3){var tempNodeVal=node.nodeValue.toLowerCase();if(tempNodeVal.indexOf(word)!=-1){var pn=xParent(node,true);if(pn.className.substr(0,10)!='searchword'){var nv=node.nodeValue;var ni=tempNodeVal.indexOf(word);var before=xCreateTextNode(nv.substr(0,ni));if(!before){return false;}
var docWordVal=nv.substr(ni,word.length);var after=xCreateTextNode(nv.substr(ni+word.length));var hiwordtext=xCreateTextNode(docWordVal);var hiword=xCreateElement('span');if(!hiword){return false;}
hiword.className='searchword'+(n%WIKI_NumHiliColors);hiword.onclick=ToggleMarks;xAppendChild(hiword,hiwordtext);xInsertBefore(pn,before,node);xInsertBefore(pn,hiword,node);xInsertBefore(pn,after,node);xRemoveChild(pn,node);WIKI_NumHiliItems++;}}}
return true;}
function highlightRegExp(node,word,n){if(WIKI_NumHiliItems>WIKI_MaxHiliItems){return false;}
if(xDef(node.className)&&!xHasClass(node,'nohili')&&xHasChildNodes(node)){var hi_cn;var cnl=node.childNodes;for(hi_cn=0;hi_cn<cnl.length;hi_cn++){if(!highlightRegExp(cnl[hi_cn],word,n)){return false;}}}
if(node.nodeType==3){try{var re=new RegExp(word,'ig');var rematch=re.exec(node.nodeValue);if(rematch&&xDef(RegExp)&&xDef(RegExp.leftContext)&&xDef(RegExp.rightContext)&&xDef(RegExp.lastMatch)&&(RegExp.lastMatch!='')){var pn=xParent(node,true);if(xStr(pn.className)&&pn.className.substr(0,10)!='searchword'){var before=xCreateTextNode(RegExp.leftContext);if(!before){return false;}
var after=xCreateTextNode(RegExp.rightContext);var hiwordtext=xCreateTextNode(RegExp.lastMatch);var hiword=xCreateElement('span');if(!hiword){return false;}
hiword.className='searchword'+(n%WIKI_NumHiliColors);hiword.onclick=ToggleMarks;xAppendChild(hiword,hiwordtext);xInsertBefore(pn,before,node);xInsertBefore(pn,hiword,node);xInsertBefore(pn,after,node);xRemoveChild(pn,node);WIKI_NumHiliItems++;}}}catch(e){return false;}}
return true;}
function MarkSearch(htmlRange){htmlRange=xDefStr(htmlRange,'Wiki');if(WIKI_HiliWordList.length==0){return;}
var o=xGet(htmlRange);if(!o){return;}
DoMarkSearch(o,WIKI_HiliWordList);o=xGet('moreinfos');if(o){DoMarkSearch(o,WIKI_HiliWordList);}
WIKI_HiliStateOn=true;}
function DoMarkSearch(aHtmlObj,aSearchList){var n=aSearchList.length/2;var c=0;for(var i=0;i<aSearchList.length;i+=2){var pattern=aSearchList[i+1];if(aSearchList[i]==1){highlightRegExp(aHtmlObj,pattern,c);}else{highlightWord(aHtmlObj,decodeHtml(pattern).toLowerCase(),c);}
c++;}}
function ToggleMarks(){var tags=xGetByTag('span');if(tags.length>0&&xDef(tags[0].className)){if(WIKI_HiliStateOn){for(var i=0;i<tags.length;i++){if(xDef(tags[i].className)&&tags[i].className.substr(0,10)=='searchword'){tags[i].className='_'+tags[i].className;}}}else{for(var i=0;i<tags.length;i++){if(xDef(tags[i].className)&&tags[i].className.substr(0,11)=='_searchword'){tags[i].className=tags[i].className.substr(1,11);}}}
WIKI_HiliStateOn=!WIKI_HiliStateOn;}}
function MarkupMathText(aText,aBlockMode){if(MATH_PROCESSOR=='jsMath'){if(aBlockMode){return'<div class="math">'+aText+'</div>';}else{return'<span class="math">'+aText+'</span';}}
if(MATH_PROCESSOR=='MathJax'){if(aBlockMode){return'<script type="math/tex; mode=display">'+aText+'</script>';}else{return'<MathJax><script type="math/tex">'+aText+'</script></MathJax>';}}
return aText;}
function ProcessMathText(HtmlElement){if(MATH_PROCESSOR=='jsMath'){jsMath.ProcessBeforeShowing(HtmlElement);}
if(MATH_PROCESSOR=='MathJax'){MathJax.Hub.Queue(["Typeset",MathJax.Hub,HtmlElement]);}}
var WikiMenuBarHandling={menuIsOpen:false,docClickInstalled:false,bodyCursor:'',GetChildUl:function(ele){var childList=ele.childNodes;for(var i=0;i<childList.length;i++){var child=childList[i];if(child.tagName=='UL'){return child;}
var subChild=this.GetChildUl(child);if(subChild){return subChild;}}
return null;},GetChildLiList:function(ul){var liList=[];var ulChildList=ul.childNodes;for(var i=0;i<ulChildList.length;i++){var ulChild=ulChildList[i];if(ulChild.tagName=='LI'){liList.push(ulChild);}}
return liList;},CloseSubmenuTree:function(li){var ul=this.GetChildUl(li);if(!ul)return;xRemoveClass(li,'is-open');ul.style.display='none';var liList=this.GetChildLiList(ul);for(var i=0;i<liList.length;i++){this.CloseSubmenuTree(liList[i]);}},CloseOtherSubmenus:function(currentLi){var parentUl=currentLi.parentNode;var liList=this.GetChildLiList(parentUl);for(var i=0;i<liList.length;i++){var li=liList[i];if(li!=currentLi){this.CloseSubmenuTree(li);}}},OnDocumentClick:function(){this.CloseAllMenus();document.body.style.cursor=this.bodyCursor;this.menuIsOpen=false;},OnClick:function(event){var li=event.target;while(li&&li.tagName!='LI'){li=li.parentNode;}
if(!li)return;var childUl=this.GetChildUl(li);if(!childUl)return;xAddClass(li,'is-open');if(childUl.style.display=='none'){childUl.style.display='block';this.CloseOtherSubmenus(li);event.PreventDefault();event.StopPropagation();if(!this.menuIsOpen){document.body.style.cursor='pointer';}
if(!this.docClickInstalled){var me=this;xAddEvent(document.body,'click',function(event){me.OnDocumentClick();});this.docClickInstalled=true;}
this.menuIsOpen=true;}},RegisterSubmenuClickHandlers:function(ul){ul.style.display='none';var childLiList=this.GetChildLiList(ul);for(var i=0;i<childLiList.length;i++){var li=childLiList[i];var childUl=this.GetChildUl(li);if(childUl){var me=this;xAddEvent(li,'click',function(event){me.OnClick(event);});this.RegisterSubmenuClickHandlers(childUl);}}},RegisterMenuClickHandlers:function(menuDiv){var menuUl=this.GetChildUl(menuDiv);if(!menuUl)return;this.RegisterSubmenuClickHandlers(menuUl);menuUl.style.display='';},Init:function(){var menuDivList=xGetAll('div.menubar');for(i=0;i<menuDivList.length;i++){this.RegisterMenuClickHandlers(menuDivList[i]);}
this.bodyCursor=body.style.cursor;},CloseAllMenus:function(){var menuList=xGetAll('div.menubar');for(i=0;i<menuList.length;i++){var menuDiv=menuList[i];var ul=this.GetChildUl(menuDiv);if(ul){var liList=this.GetChildLiList(ul);for(var j=0;j<liList.length;j++){this.CloseSubmenuTree(liList[j]);}}}},};var UrlParams={params:null,Parse:function(url){if(!xStr(url)&&this.params)return;this.params={};url=xDefStr(url,location.href);var pos=url.indexOf('?');if(pos<0)return;var paramListStr=url.substr(pos+1);if(paramListStr=='')return;var pos=paramListStr.indexOf('#');if(pos>=0)paramListStr=paramListStr.substr(0,pos);if(paramListStr=='')return;var paramList=paramListStr.split('&');for(i=0;i<paramList.length;i++){var paramStr=paramList[i];var pos=paramStr.indexOf('=');if(pos>0){var name=paramStr.substr(0,pos).toLowerCase();var value=paramStr.substr(pos+1);try{value=decodeURIComponent(value);}catch(err){}
this.params[name]=value;}}},GetStr:function(name,def){this.Parse();name=name.toLowerCase();if(xDef(this.params[name]))return this.params[name];return xDef(def)?def:'';},GetInt:function(name,def){this.Parse();var param=this.GetStr(name);if(param!=''){var val=parseInt(param);if(!isNaN(val))return val;}
return xDef(def)?def:'';},GetNum:function(name,def){this.Parse();var param=this.GetStr(name);if(param!=''){var val=parseFloat(param);if(!isNaN(val))return val;}
return xDef(def)?def:'';},};var OnOffSections={HandleUrlParameters:function(){var idStr=UrlParams.GetStr('open');if(idStr!=''){this.SetStates(idStr,true);}
var idStr=UrlParams.GetStr('close');if(idStr!=''){this.SetStates(idStr,false);}
var url=location.href;var p=url.indexOf('#');if(p>=0){var urlHeader=url.substr(p+1);if(urlHeader!=''){urlHeader=urlHeader.replace(/H_/,'').replace(/_/g,' ');var onOffHeaderList=xGetAll('[data-onoffid]');for(var i=0;i<onOffHeaderList.length;i++){var headerElement=onOffHeaderList[i];var headerText=xInnerHTML(headerElement);if(headerText.indexOf(urlHeader)==0){var id=headerElement.dataset.onoffid;this.SetState(id,true);break;}}}}},SetStates:function(idStr,state){var idList=idStr.split(',');for(var i=0;i<idList.length;i++){var id=idList[i];if(id!=''){this.SetState(id,state);}}},SetState:function(id,state){var grp='SEL_GRP_'+id;var stateStr=state?'ON':'OFF';if(xDef(window[grp])){try{SEL(window[grp],[id+stateStr],true);}catch(e){}}},};xOnDomReady(function(){WikiMenuBarHandling.Init();});xOnLoad(function(){UrlParams.Parse();OnOffSections.HandleUrlParameters();MarkSearch();});
Object.assign(globalThis, {
  xClass2Type, xType, xDef, xAny, xObj, xObjOrNull, xFunc, xFuncOrNull, xArray, xStr, xNum, xBool, xIsNumeric,
  xDefAny, xDefAnyOrNull, xDefObj, xDefObjOrNull, xDefFunc, xDefFuncOrNull, xDefArray, xDefStr, xDefNum, xDefBool,
  xArgsToArray, xFStr, xArrFind, xArrFindIndex, xArrForEach, xArrayMap, xArrRemove, xArrRemoveAll,
  xGet, xGetFirst, xGetAll, xElement, xDataset, xInnerHTML, xInnerText, xTagName,
  xShow, xHide, xVisibility, xDisplay, xIsDisplayed, xMoveTo, xLeft, xTop, xOpacity,
  xResizeTo, xElementWidth, xWidth, xScrollWidth, xNaturalWidth, xElementHeight, xHeight, xScrollHeight, xNaturalHeight,
  xGetCS, xSetCW, xSetCH, xClientWidth, xClientHeight,
  xPageX, xPageY, xIsRoot, xIsElementAndNotRoot, xScrollLeft, xScrollTop, xZIndex, xCursor, xStyle,
  xMaskRegExp, xHasClass, xAddClass, xRemoveClass, xToggleClass, xSetClassIf, xSetEnabled, xSetDisabled,
  xParent, xCreateElement, xCreateTextNode, xHasChildNodes, xChildNodes, xAppendChild, xInsertBefore, xRemoveChild,
  xGetByTag, xGetByClass, xAddEvent, xRemoveEvent, xEvent,
  xCallbackChain, xOnLoadFinished, xEventManager,
  xAddEventLayoutChange, xRemoveEventLayoutChange, xTriggerEventLayoutChange,
  xAddEventDisplayChange, xRemoveEventDisplayChange, xTriggerEventDisplayChange,
  xAddEventWindowResize, xRemoveEventWindowResize,
  xOnDomReady, xOnLoad, xOnUnload,
  xOptions, xGetTransformPropertyName, xSupportsTransform, xTransform, xTransformOrigin,
  xGetTransformDocOffset, xTransformNone, xTransformTranslate, xTransformTranslateScale,
  xClipboardBuffer, xToClipboard, xTimeMS, xImage, xChangeImage, xMultiImage,
  xDbgOut, xDbgApp, xSetCookie, xGetCookie, xDeleteCookie,
  htmlString, xGreekNameUnicodeDict, xGetUnicodeOfGreekName, xGreekNamesToUnicode,
  xDebug, xDebugOutId, xLog, xClearLog,
  CImgCache, IC,
  Zoom, ZoomInit, ZoomPics, ZoomDebug, ZoomIn, ZoomOut, ZoomEnable, ZoomDisable, CZoom,
  CProgressbar, Progressbar,
  WIKI_MinHiliWordLength, WIKI_MaxHiliItems, WIKI_NumHiliColors, WIKI_KeyPressed,
  WIKI_HtmlBody, WIKI_RedirectList, WIKI_HiliStateOn, WIKI_NumHiliItems,
  EditPage, ShowUploadForm, ShowWikiFunctions, OnDocKeyDown, UrlEncode, Trim, OnDblCklick,
  InitWikiJS, LayoutMaximize, LayoutNormal, IsLayoutMaximized,
  LayoutFullscreenOn, LayoutFullscreenOff, IsLayoutFullscreen,
  AddToCookie, AddCBReq, SplitWords, decodeHtml,
  highlightWord, highlightRegExp, MarkSearch, DoMarkSearch, ToggleMarks,
  MarkupMathText, ProcessMathText,
  WikiMenuBarHandling, UrlParams, OnOffSections,
});
export {
  xClass2Type, xType, xDef, xAny, xObj, xObjOrNull, xFunc, xFuncOrNull, xArray, xStr, xNum, xBool, xIsNumeric,
  xDefAny, xDefAnyOrNull, xDefObj, xDefObjOrNull, xDefFunc, xDefFuncOrNull, xDefArray, xDefStr, xDefNum, xDefBool,
  xArgsToArray, xFStr, xArrFind, xArrFindIndex, xArrForEach, xArrayMap, xArrRemove, xArrRemoveAll,
  xGet, xGetFirst, xGetAll, xElement, xDataset, xInnerHTML, xInnerText, xTagName,
  xShow, xHide, xVisibility, xDisplay, xIsDisplayed, xMoveTo, xLeft, xTop, xOpacity,
  xResizeTo, xElementWidth, xWidth, xScrollWidth, xNaturalWidth, xElementHeight, xHeight, xScrollHeight, xNaturalHeight,
  xGetCS, xSetCW, xSetCH, xClientWidth, xClientHeight,
  xPageX, xPageY, xIsRoot, xIsElementAndNotRoot, xScrollLeft, xScrollTop, xZIndex, xCursor, xStyle,
  xMaskRegExp, xHasClass, xAddClass, xRemoveClass, xToggleClass, xSetClassIf, xSetEnabled, xSetDisabled,
  xParent, xCreateElement, xCreateTextNode, xHasChildNodes, xChildNodes, xAppendChild, xInsertBefore, xRemoveChild,
  xGetByTag, xGetByClass, xAddEvent, xRemoveEvent, xEvent,
  xCallbackChain, xOnLoadFinished, xEventManager,
  xAddEventLayoutChange, xRemoveEventLayoutChange, xTriggerEventLayoutChange,
  xAddEventDisplayChange, xRemoveEventDisplayChange, xTriggerEventDisplayChange,
  xAddEventWindowResize, xRemoveEventWindowResize,
  xOnDomReady, xOnLoad, xOnUnload,
  xOptions, xGetTransformPropertyName, xSupportsTransform, xTransform, xTransformOrigin,
  xGetTransformDocOffset, xTransformNone, xTransformTranslate, xTransformTranslateScale,
  xClipboardBuffer, xToClipboard, xTimeMS, xImage, xChangeImage, xMultiImage,
  xDbgOut, xDbgApp, xSetCookie, xGetCookie, xDeleteCookie,
  htmlString, xGreekNameUnicodeDict, xGetUnicodeOfGreekName, xGreekNamesToUnicode,
  xDebug, xDebugOutId, xLog, xClearLog,
  CImgCache, IC,
  Zoom, ZoomInit, ZoomPics, ZoomDebug, ZoomIn, ZoomOut, ZoomEnable, ZoomDisable, CZoom,
  CProgressbar, Progressbar,
  WIKI_MinHiliWordLength, WIKI_MaxHiliItems, WIKI_NumHiliColors, WIKI_KeyPressed,
  WIKI_HtmlBody, WIKI_RedirectList, WIKI_HiliStateOn, WIKI_NumHiliItems,
  EditPage, ShowUploadForm, ShowWikiFunctions, OnDocKeyDown, UrlEncode, Trim, OnDblCklick,
  InitWikiJS, LayoutMaximize, LayoutNormal, IsLayoutMaximized,
  LayoutFullscreenOn, LayoutFullscreenOff, IsLayoutFullscreen,
  AddToCookie, AddCBReq, SplitWords, decodeHtml,
  highlightWord, highlightRegExp, MarkSearch, DoMarkSearch, ToggleMarks,
  MarkupMathText, ProcessMathText,
  WikiMenuBarHandling, UrlParams, OnOffSections,
};
