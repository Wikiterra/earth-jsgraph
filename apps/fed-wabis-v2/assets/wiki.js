// (C) walter.bislins.ch

var xClass2Type = {}; (function () { var types = "Boolean Number String Function Array Date RegExp Object Error".split(" "); var len = types.length; for (var i = 0; i < len; i++) { var name = types[i]; xClass2Type["[object " + name + "]"] = name.toLowerCase(); } })(); function xType(obj) { if (obj == null) return obj + ""; return typeof obj === "object" || typeof obj === "function" ? xClass2Type[Object.prototype.toString.call(obj)] || "object" : typeof obj; }
function xDef(x) { return (typeof (x) !== 'undefined'); }
function xAny(x) { return (typeof (x) !== 'undefined' && x !== null); }
function xObj(x) { return (typeof (x) === 'object' && !xArray(x) && x !== null); }
function xObjOrNull(x) { return (typeof (x) === 'object' && !xArray(x)); }
function xFunc(x) { return xType(x) === 'function'; }
function xFuncOrNull(x) { return (x === null || xType(x) === 'function'); }
var xArray = Array.isArray || function (obj) { return xType(obj) === 'array'; }; function xStr(x) { return (typeof (x) === 'string'); }
function xNum(x) { return (typeof (x) === 'number'); }
function xBool(x) { return (typeof (x) === 'boolean'); }
function xIsNumeric(x) { return (!xArray(x) && (x - parseFloat(x) >= 0)); }
function xDefAny(aRef, aDefault) { return (typeof (aRef) === 'undefined' || aRef === null) ? aDefault : aRef; }
function xDefAnyOrNull(aRef, aDefault) { return (typeof (aRef) === 'undefined') ? aDefault : aRef; }
function xDefObj(aRef, aDefault) { return (typeof (aRef) === 'object' && !xArray(aRef) && aRef !== null) ? aRef : aDefault; }
function xDefObjOrNull(aRef, aDefault) { return (typeof (aRef) === 'object' && !xArray(aRef)) ? aRef : aDefault; }
function xDefFunc(aRef, aDefault) { return xFunc(aRef) ? aRef : aDefault; }
function xDefFuncOrNull(aRef, aDefault) { return xFuncOrNull(aRef) ? aRef : aDefault; }
function xDefArray(aRef, aDefault) { return xArray(aRef) ? aRef : aDefault; }
function xDefStr(aRef, aDefault) { return (typeof (aRef) === 'string') ? aRef : aDefault; }
function xDefNum(aRef, aDefault) { return (typeof (aRef) === 'number') ? aRef : aDefault; }
function xDefBool(aRef, aDefault) { return (typeof (aRef) === 'boolean') ? aRef : aDefault; }
function xFStr(format, etc) { var arg = arguments; var i = 1; return format.replace(/(#(#)?)/g, function (match, p1, p2) { return p2 || arg[i++]; }); }
function xArrFind(start, arr, func, thisArg) {
  if (!xNum(start)) return xArrFind(0, start, arr, func); var t, undef
  if (arguments.length > 3) t = thisArg; var n = arr.length; for (var i = start; i < n; i++) { if (func.call(t, arr[i], i, arr)) return arr[i]; }
  return undef;
}
function xArrFindIndex(start, arr, func, thisArg) {
  if (!xNum(start)) return xArrFindIndex(0, start, arr, func); var t
  if (arguments.length > 3) t = thisArg; var n = arr.length; for (var i = start; i < n; i++) { if (func.call(t, arr[i], i, arr)) return i; }
  return -1;
}
function xArrForEach(arr, func, thisArg) {
  var t
  if (arguments.length > 2) t = thisArg; var n = arr.length; for (var i = 0; i < n; i++) { func.call(t, arr[i], i, arr); }
}

function xArrRemove(arr, func, thisArg) {
  var t, undef
  if (arguments.length > 2) t = thisArg; var i = 0; while (i < arr.length) { if (func.call(t, arr[i], i, arr)) { var ele = arr[i]; arr.splice(i, 1); return ele; } else { i++; } }
  return undef;
}
function xArrRemoveAll(arr, func, thisArg) {
  var t
  if (arguments.length > 2) t = thisArg; var n = 0; var i = 0; while (i < arr.length) { if (func.call(t, arr[i], i, arr)) { arr.splice(i, 1); n++; } else { i++; } }
  return n;
}
function xGet(id) { return document.getElementById(id); }

function xElement(e) { return (typeof (e) === 'string') ? document.getElementById(e) : e; }
function xDataset(e, name) { return xElement(e).getAttribute('data-' + name); }
function xInnerHTML(e, t) {
  if (xStr(t)) { xElement(e).innerHTML = t; } else { t = xElement(e).innerHTML; }
  return t;
}












function xWidth(e, uW, bBorderBoxSizing) {
  if (xNum(uW)) { if (uW < 0) uW = 0; uW = Math.round(uW); xSetCW(xElement(e), uW, bBorderBoxSizing); } else { uW = xElement(e).offsetWidth; }
  return uW;
}



function xHeight(e, uH, bBorderBoxSizing) {
  if (xNum(uH)) { if (uH < 0) uH = 0; uH = Math.round(uH); xSetCH(xElement(e), uH, bBorderBoxSizing); }
  else { uH = xElement(e).offsetHeight; }
  return uH;
}


function xGetCS(ele, sP) { return parseInt(window.getComputedStyle(ele, '').getPropertyValue(sP), 10); }
function xSetCW(ele, uW, bBorderBoxSizing) {
  var pl = 0, pr = 0, bl = 0, br = 0; bBorderBoxSizing = xDefBool(bBorderBoxSizing, true); var cssW = uW; if (bBorderBoxSizing) {
    if (window.getComputedStyle) { pl = xGetCS(ele, 'padding-left'); pr = xGetCS(ele, 'padding-right'); bl = xGetCS(ele, 'border-left-width'); br = xGetCS(ele, 'border-right-width'); }
    else if (xDef(ele.currentStyle)) { pl = parseInt(ele.currentStyle.paddingLeft, 10); pr = parseInt(ele.currentStyle.paddingRight, 10); bl = parseInt(ele.currentStyle.borderLeftWidth, 10); br = parseInt(ele.currentStyle.borderRightWidth, 10); }
    else { ele.style.width = uW + 'px'; pl = ele.offsetWidth - uW; }
    if (isNaN(pl)) pl = 0; if (isNaN(pr)) pr = 0; if (isNaN(bl)) bl = 0; if (isNaN(br)) br = 0; cssW -= (pl + pr + bl + br);
  }
  if (cssW < 0) cssW = 0; ele.style.width = cssW + 'px';
}
function xSetCH(ele, uH, bBorderBoxSizing) {
  var pt = 0, pb = 0, bt = 0, bb = 0; bBorderBoxSizing = xDefBool(bBorderBoxSizing, true); var cssH = uH; if (bBorderBoxSizing) {
    if (window.getComputedStyle) { pt = xGetCS(ele, 'padding-top'); pb = xGetCS(ele, 'padding-bottom'); bt = xGetCS(ele, 'border-top-width'); bb = xGetCS(ele, 'border-bottom-width'); }
    else if (xDef(ele.currentStyle)) { pt = parseInt(ele.currentStyle.paddingTop, 10); pb = parseInt(ele.currentStyle.paddingBottom, 10); bt = parseInt(ele.currentStyle.borderTopWidth, 10); bb = parseInt(ele.currentStyle.borderBottomWidth, 10); }
    else { ele.style.height = uH + 'px'; pt = ele.offsetHeight - uH; }
    if (isNaN(pt)) pt = 0; if (isNaN(pb)) pb = 0; if (isNaN(bt)) bt = 0; if (isNaN(bb)) bb = 0; cssH -= (pt + pb + bt + bb);
  }
  if (cssH < 0) cssH = 0; ele.style.height = cssH + 'px';
}


function xPageX(e) {
  e = xElement(e); var x = 0; var n = e; while (xIsElementAndNotRoot(e)) { x += e.offsetLeft; e = e.offsetParent; }
  e = n; while (xIsElementAndNotRoot(e)) { x -= e.scrollLeft; e = e.parentNode; }
  return x;
}
function xPageY(e) {
  e = xElement(e); var y = 0; var n = e; while (xIsElementAndNotRoot(e)) { y += e.offsetTop; e = e.offsetParent; }
  e = n; while (xIsElementAndNotRoot(e)) { y -= e.scrollTop; e = e.parentNode; }
  return y;
}
function xIsRoot(e) { return (xAny(e) && (e == document || e.tagName == 'HTML' || e.tagName == 'BODY')); }
function xIsElementAndNotRoot(e) { return (xAny(e) && !(e == document || e.tagName == 'HTML' || e.tagName == 'BODY')); }
function xScrollLeft(e, bWin, val) {
  var offset = 0; if (!xDef(e) || bWin || xIsRoot(e)) {
    var w = window; if (bWin && e) w = e; if (w.document.documentElement && w.document.documentElement.scrollLeft) { if (xNum(val)) { w.document.documentElement.scrollLeft = val; } else { offset = w.document.documentElement.scrollLeft; } }
    else if (w.document.body && xDef(w.document.body.scrollLeft)) { if (xNum(val)) { w.document.body.scrollLeft = val; } else { offset = w.document.body.scrollLeft; } }
  }
  else { if (xNum(val)) { xElement(e).scrollLeft = val; } else { offset = xElement(e).scrollLeft; } }
  return offset;
}
function xScrollTop(e, bWin, val) {
  var offset = 0; if (!xDef(e) || bWin || xIsRoot(e)) {
    var w = window; if (bWin && e) w = e; if (w.document.documentElement && w.document.documentElement.scrollTop) { if (xNum(val)) { w.document.documentElement.scrollTop = val; } else { offset = w.document.documentElement.scrollTop; } }
    else if (w.document.body && xDef(w.document.body.scrollTop)) { if (xNum(val)) { w.document.body.scrollTop = val; } else { offset = w.document.body.scrollTop; } }
  }
  else { if (xNum(val)) { xElement(e).scrollTop = val; } else { offset = xElement(e).scrollTop; } }
  return offset;
}


function xStyle(e, sStyle, sVal) {
  if (xDef(sVal)) { xElement(e).style[sStyle] = sVal; } else { sVal = xElement(e).style[sStyle]; }
  return sVal;
}
function xMaskRegExp(s) { return s.replace(/\-/g, '\\-'); }
function xHasClass(e, cls) { if (!(e = xElement(e))) return false; if (xDef(e.classList)) { return e.classList.contains(cls); } else { if (xIsRoot(e)) return false; return xDef(e.className) && xDef(e.className.match) && e.className.match(new RegExp('(\\s|^)' + xMaskRegExp(cls) + '(\\s|$)')); } }
function xAddClass(e, cls) { if (!(e = xElement(e))) return; if (xDef(e.classList)) { e.classList.add(cls); } else { if (xIsRoot(e)) return; if (xDef(e.className) && !this.xHasClass(e, cls)) e.className += ' ' + cls; } }
function xRemoveClass(e, cls) { if (!(e = xElement(e))) return; if (xDef(e.classList)) { e.classList.remove(cls); } else { if (xIsRoot(e)) return; if (xDef(e.className) && xHasClass(e, cls)) { var reg = new RegExp('(\\s|^)' + xMaskRegExp(cls) + '(\\s|$)'); e.className = e.className.replace(reg, ' ').replace(/^\s+|\s+$/g, ''); } } }
function xParent(e, bNode) {
  bNode = xDefBool(bNode, true); if (bNode) { return xElement(e).parentNode; }
  else { return xElement(e).offsetParent; }
}
function xCreateElement(sTag) { return document.createElement(sTag); }



function xAddEvent(e, eventType, callback, cap) { cap = xDefBool(cap, false); var wrapper = function xOnCallbackEventWrapper(e) { callback(new xEvent(e)); }; callback.xWrapperFunc = wrapper; xElement(e).addEventListener(eventType, wrapper, cap); }
function xRemoveEvent(e, eventType, callback, cap) { cap = xDefBool(cap, false); xElement(e).removeEventListener(eventType, callback.xWrapperFunc, cap); }
function xEvent(evt) { this.Init(evt); }
xEvent.prototype.Init = function (evt) {
  var e = evt || window.event; if (!e) return; this.event = e; this.type = e.type; this.target = e.target || e.srcElement; if (this.target.nodeType == 3) this.target = this.target.parentNode; this.relatedTarget = e.relatedTarget; if (e.type == 'mouseover') { this.relatedTarget = e.fromElement; }
  else if (e.type == 'mouseout') { this.relatedTarget = e.toElement; }
  if (xDef(e.pageX)) { this.pageX = e.pageX; this.pageY = e.pageY; }
  else if (xDef(e.clientX)) { this.pageX = e.clientX + xScrollLeft(); this.pageY = e.clientY + xScrollTop(); }
  if (xDef(e.offsetX)) { this.offsetX = e.offsetX; this.offsetY = e.offsetY; }
  else { this.offsetX = this.pageX - xPageX(this.target); this.offsetY = this.pageY - xPageY(this.target); }
  this.keyCode = e.keyCode || e.which || 0; this.shiftKey = e.shiftKey; this.ctrlKey = e.ctrlKey; this.altKey = e.altKey; if (typeof e.type == 'string') {
    if (e.type.indexOf('click') != -1) { this.button = 0; }
    else if (e.type.indexOf('mouse') != -1) {
      this.button = e.button; if (e.button & 1) { this.button = 0; }
      else if (e.button & 4) { this.button = 1; }
      else if (e.button & 2) { this.button = 2; }
    }
  }
};
xEvent.prototype.PreventDefault = function () { if (!this.event) return; if (this.event.preventDefault) this.event.preventDefault(); this.event.returnValue = false; };

function xCallbackChain() { this.FuncList = []; this.ParamList = []; this.Active = false; }
xCallbackChain.prototype.Add = function (aFunc, once, param) { once = xDefBool(once, false); param = xDefAny(param, null); if (once && this.Contains(aFunc)) return false; this.FuncList.push(aFunc); this.ParamList.push(param); return true; }
xCallbackChain.prototype.Contains = function (aFunc) { return xDef(xArrFind(this.FuncList, function CB_Compare_Funcs(func) { return func == aFunc; })); }
xCallbackChain.prototype.Remove = function (aFunc) { return xArrRemoveAll(this.FuncList, function CB_Compare_Funcs(func) { return func == aFunc; }); }
xCallbackChain.prototype.Call = function (aArg, aExceptionFunc) {
  if (this.FuncList.length == 0 || this.Active) return; this.Active = true; var funcListCopy = this.FuncList.slice(); var paramListCopy = this.ParamList.slice(); for (var i = 0; i < funcListCopy.length; i++) { try { funcListCopy[i](aArg, paramListCopy[i]); } catch (e) { if (xFunc(aExceptionFunc)) aExceptionFunc(e); } }
  this.Active = false;
}
var xOnLoadFinished = false;
var xEventManager = {
  DomReadyHandlers: new xCallbackChain(),
  MyDomReadyHandlers: [],
  DomReadyFired: false,
  PageLoadHandlers: new xCallbackChain(),
  MyPageLoadHandler: null,
  PageLoadFired: false,
  AddDomReadyHandler: function (aFunc) {
    var myDomReadyHandler = function xOnEventManager_DomReady() {
      xEventManager.DomReadyFired = true;
      xEventManager.RemoveDomReadyHandler(aFunc);
      try { aFunc(); } catch (e) {}
    };
    this.MyDomReadyHandlers.push({ Func: aFunc, Handler: myDomReadyHandler });
    if (this.DomReadyFired) {
      setTimeout(myDomReadyHandler, 1);
    } else {
      document.addEventListener('DOMContentLoaded', myDomReadyHandler, false);
    }
  },
  RemoveDomReadyHandler: function (aFunc) {
    var handlerInfo = xArrFind(this.MyDomReadyHandlers, function (item) { return item.Func == aFunc; });
    if (!handlerInfo) return;
    document.removeEventListener('DOMContentLoaded', handlerInfo.Handler, false);
    xArrRemoveAll(this.MyDomReadyHandlers, function (item) { return item.Func == aFunc; });
  },
  AddPageLoadHandler: function (aFunc) {
    if (!this.MyPageLoadHandler) {
      this.MyPageLoadHandler = function xOnEventManager_PageLoad() {
        xEventManager.PageLoadFired = true;
        xEventManager.DomReadyHandlers.Call();
        xEventManager.PageLoadHandlers.Call();
        xOnLoadFinished = true;
        globalThis.xOnLoadFinished = true;
      };
      window.addEventListener('load', this.MyPageLoadHandler);
    }
    if (this.PageLoadFired) {
      setTimeout(function () { try { aFunc(); } catch (e) {} }, 1);
    } else {
      this.PageLoadHandlers.Add(aFunc);
    }
  },
};
function xOnDomReady(aFunc) { xEventManager.AddDomReadyHandler(aFunc); }
function xOnLoad(aFunc) { xEventManager.AddPageLoadHandler(aFunc); }
function xTimeMS() { return (new Date()).getTime(); }
function xSetCookie(name, value, days) { days = days || 1; var date = new Date(); date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); var expires = '; expires=' + date.toGMTString(); document.cookie = name + '=' + escape(value) + expires + '; path=/'; }
function xGetCookie(name) {
  var cName; var ca = document.cookie.split(';'); for (var i = 0; i < ca.length; i++) {
    var c = ca[i]; var eqPos = c.indexOf('='); if (eqPos >= 0) { cName = c.substr(0, eqPos).replace(/^\s+|\s+$/g, ''); } else { cName = c.replace(/^\s+|\s+$/g, ''); }
    if (name == cName) { if (eqPos < 0) return ''; return unescape(c.substr(eqPos + 1)); }
  }
  return null;
}
function xDeleteCookie(name) { xSetCookie(name, '', -1); }
function xLog() {}

function CImgCache() { this.CheckLoadInterval = 100; this.MaxNLoading = 2; this.LoadDelay = 0; this.EnableStatusDisplay = false; this.NImages = 0; this.NLoading = 0; this.NUnloaded = 0; this.NError = 0; this.NAbort = 0; this.NLoaded = 0; this.Images = []; this.CState = { LoadPending: 0, Loading: 1, Loaded: 2, Error: 3, Abort: 4 }; this.ErrorMsg = ''; this.OnAllLoaded = new xCallbackChain(); this.OnImgLoaded = new xCallbackChain(); this.OnLoadCalling = false; this.LoadNextCalling = false; this.PrioList = []; this.Timer = null; var me = this; this.OnCheckLoaded = function () { me.CheckLoaded(); }; }
CImgCache.prototype.AddOnAllLoaded = function (aFunc) { this.OnAllLoaded.Add(aFunc); }; CImgCache.prototype.AddOnImgLoaded = function (aFunc) { this.OnImgLoaded.Add(aFunc); }; CImgCache.prototype.IsValid = function (aImageID) { return ((aImageID >= 0) && (aImageID < this.NImages)); }; CImgCache.prototype.PreloadImages = function (aUrls, aRoot) { aRoot = xDefStr(aRoot, ''); var len = aUrls.length; for (var i = 0; i < len; i++) { this.PreloadImage(aRoot + aUrls[i]); } }; CImgCache.prototype.PreloadImage = function (aUrl, aOnLoadFunc, bPriority) {
  bPriority = xDefBool(bPriority, false); var id = this.FindImage(aUrl); if (id >= 0) { var img = this.Images[id]; if (img.CacheState == this.CState.Error || img.CacheState == this.CState.Abort) { this.ReloadImage(id, aOnLoadFunc); } else { this.AddOnLoadFunc(img, aOnLoadFunc); } } else { id = this.AddImage(aUrl, aOnLoadFunc); }
  if (bPriority) { if (this.Images[id].CacheState == this.CState.LoadPending && !this.InPrioList(id)) { this.PrioList[this.PrioList.length] = id; } }
  this.LoadNext(); return id;
}; CImgCache.prototype.LoadImage = function (aUrl, aOnLoadFunc) { return this.PreloadImage(aUrl, aOnLoadFunc, true); }; CImgCache.prototype.ReloadImage = function (aImgID, aOnLoadFunc) { var img = this.Images[aImgID]; this.AddOnLoadFunc(img, aOnLoadFunc); if (img.CacheState != this.CState.LoadPending) { img.CacheState = this.CState.LoadPending; this.NUnloaded++; this.DisplayStatus('ReloadImage'); } }; CImgCache.prototype.FindImage = function (aUrl) {
  var images = this.Images; var len = this.NImages; for (var i = 0; i < len; i++) { if (images[i].CacheUrl == aUrl) return i; }
  return -1;
}; CImgCache.prototype.Image = function (aImageID) { return this.Images[aImageID]; }; CImgCache.prototype.ImageByUrl = function (aUrl) { var imgID = this.FindImage(aUrl); return (imgID >= 0) ? this.Image(imgID) : null; }; CImgCache.prototype.GetNUnloaded = function () { this.CheckLoaded(); return this.NUnloaded; }; CImgCache.prototype.IsLoaded = function (aImageID) { if (!this.IsValid(aImageID)) return false; var image = this.Images[aImageID]; return (image.CacheState == this.CState.Loaded && !image.WasError && !image.WasAbort); }; CImgCache.prototype.IsError = function (aImageID) { if (!this.IsValid(aImageID)) return false; var image = this.Images[aImageID]; return (image.CacheState == this.CState.Error || image.WasError); }; CImgCache.prototype.IsAbort = function (aImageID) { if (!this.IsValid(aImageID)) return false; var image = this.Images[aImageID]; return (image.CacheState == this.CState.Abort || image.WasAbort); }; CImgCache.prototype.IsErrorOrAbort = function (aImageID) { return this.IsError(aImageID) || this.IsAbort(aImageID); }; CImgCache.prototype.IsLoadedByUrl = function (aUrl) { return this.IsLoaded(this.FindImage(aUrl)); }; CImgCache.prototype.ImageState = function (aImageID) { return (this.Images[aImageID].CacheState); }; CImgCache.prototype.ImageStateByUrl = function (aUrl) { var imgID = this.FindImage(aUrl); return (imgID >= 0) ? this.ImageState(imgID) : -1; }; CImgCache.prototype.ImageUrl = function (aImageID) { return this.Image(aImageID).CacheUrl; }; CImgCache.prototype.GetStatus = function (funcName) {
  if (!xDef(funcName) && this.NError == 0 && this.NAbort == 0) return ''; funcName = xDefStr(funcName, 'GetStatus'); var s = xFStr('CImgCache.#: Images to load: # of #. ', funcName, this.NUnloaded, this.NImages); if (this.NError > 0 || this.NAbort > 0) { s += '(Loaded: ' + this.NLoaded + '; '; s += 'Error: ' + this.NError + '; '; s += 'Abort: ' + this.NAbort + ')'; }
  return s;
}; CImgCache.prototype.ResetStatus = function () { this.ErrorMsg = ''; this.NError = 0; this.NAbort = 0; }; CImgCache.prototype.DisplayStatus = function (funcName) { if (this.EnableStatusDisplay) { xLog(this.GetStatus(funcName)); } }; CImgCache.prototype.AddImage = function (aUrl, aOnLoadFunc) { var id = this.NImages; var img = new Image(); img.ImageId = id; img.crossOrigin = "Anonymous"; img.CacheUrl = aUrl; img.CacheState = this.CState.LoadPending; img.WasLoaded = false; img.WasError = false; img.WasAbort = false; img.onload = function () { this.WasLoaded = true; }; img.onerror = function () { this.WasError = true; }; img.onabort = function () { this.WasAbrort = true; }; img.OnLoadFuncs = null; this.AddOnLoadFunc(img, aOnLoadFunc); this.Images[id] = img; this.NUnloaded++; this.NImages++; this.DisplayStatus('AddImage'); return id; }; CImgCache.prototype.InPrioList = function (aImageID) {
  var pl = this.PrioList; var len = pl.length; for (var i = 0; i < len; i++) { if (pl[i] == aImageID) return true; }
  return false;
}; CImgCache.prototype.LoadNext = function () {
  if (this.LoadNextCalling) return; this.LoadNextCalling = true; if (this.NUnloaded == 0) {
    for (var id = 0; id < this.NImages; id++) { if (this.Images[id].OnLoadFuncs) { this.StartLoading(id); } }
    this.LoadNextCalling = false; return;
  }
  while ((this.NUnloaded > 0) && (this.PrioList.length > 0) && (this.NLoading < this.MaxNLoading)) { var id = this.PrioList.shift(); this.StartLoading(id); }
  var found = true; while ((this.NUnloaded > 0) && found && (this.NLoading < this.MaxNLoading)) { var id = this.FindLoadPending(); if (id == -1) { found = false; } else { this.StartLoading(id); } }
  this.LoadNextCalling = false;
}; CImgCache.prototype.FindLoadPending = function () {
  var images = this.Images; var len = images.length; for (var id = 0; id < len; id++) { if (images[id].CacheState == this.CState.LoadPending) return id; }
  return -1;
}; CImgCache.prototype.StartLoading = function (aImageID) {
  if (this.Timer) { clearTimeout(this.Timer); this.Timer = null; }
  var img = this.Images[aImageID]; if (img.CacheState == this.CState.LoadPending || img.CacheState == this.CState.Abort) { this.NLoading++; this.DisplayStatus('StartLoading'); img.CacheState = this.CState.Loading; if (this.LoadDelay > 0) { setTimeout(function () { img.src = img.CacheUrl; }, this.LoadDelay); } else { img.src = img.CacheUrl; } }
  if ((this.NLoading > 0 || this.OnLoadFuncsPending()) && this.Timer == null) { this.Timer = setTimeout(this.OnCheckLoaded, this.CheckLoadInterval); }
}; CImgCache.prototype.OnLoadFuncsPending = function () {
  for (var id = 0; id < this.NImages; id++) { var img = this.Images[id]; if (img.OnLoadFuncs) return true; }
  return false;
}
CImgCache.prototype.CheckLoaded = function () {
  if (this.Timer) { clearTimeout(this.Timer); this.Timer = null; }
  for (var id = 0; id < this.NImages; id++) { var img = this.Images[id]; if (img.CacheState == this.CState.Loading || img.OnLoadFuncs) { if (img.complete || img.WasLoaded) { if (img.WasError) { this.OnError(id); } else if (img.WasAbort) { this.OnAbort(id); } else { this.OnLoad(id); } } else if (img.WasError) { this.OnError(id); } else if (img.WasAbort) { this.OnAbort(id); } } }
  if ((this.NLoading > 0 || this.OnLoadFuncsPending()) && this.Timer == null) { this.Timer = setTimeout(this.OnCheckLoaded, this.CheckLoadInterval); }
}; CImgCache.prototype.OnImage = function (aImageID) { this.NLoading--; this.NUnloaded--; this.DisplayStatus('OnImage'); this.CallOnLoadFuncs(aImageID); this.OnImgLoaded.Call(aImageID); if (this.NUnloaded == 0) { this.OnAllLoaded.Call(); } else { this.LoadNext(); } }; CImgCache.prototype.OnLoad = function (aImageID) { if (this.Images[aImageID].CacheState != this.CState.Loading) return; this.NLoaded++; this.DisplayStatus('OnLoad'); this.Images[aImageID].CacheState = this.CState.Loaded; this.OnImage(aImageID); }; CImgCache.prototype.OnError = function (aImageID) {
  if (this.Images[aImageID].CacheState == this.CState.Loaded) { this.Images[aImageID].CacheState = this.CState.Loading; this.NLoaded--; this.NLoading++; this.NUnloaded++; }
  if (this.Images[aImageID].CacheState != this.CState.Loading) return; this.NError++; this.ErrorMsg += ' Error loading ' + this.Images[aImageID].src; this.DisplayStatus('OnError'); this.Images[aImageID].CacheState = this.CState.Error; this.OnImage(aImageID);
}; CImgCache.prototype.OnAbort = function (aImageID) {
  if (this.Images[aImageID].CacheState == this.CState.Loaded) { this.Images[aImageID].CacheState = this.CState.Loading; this.NLoaded--; this.NLoading++; this.NUnloaded++; }
  if (this.Images[aImageID].CacheState != this.CState.Loading) return; this.NAbort++; this.DisplayStatus('OnAbort'); this.Images[aImageID].CacheState = this.CState.Abort; this.OnImage(aImageID);
}; CImgCache.prototype.AddOnLoadFunc = function (aImage, aFunc) {
  if (!xFunc(aFunc)) return; var id = aImage.ImageId; var funcs = aImage.OnLoadFuncs; aImage.OnLoadFuncs = function (id) {
    try {
      if (funcs) { funcs(id); }
      aFunc(id);
    } catch (e) { }
  }
}
CImgCache.prototype.CallOnLoadFuncs = function (aImageID) {
  var img = this.Images[aImageID]; if (this.OnLoadCalling || !img.OnLoadFuncs) return; this.OnLoadCalling = true; try { var funcs = img.OnLoadFuncs; img.OnLoadFuncs = null; if (funcs) { funcs(aImageID); } } catch (e) { }
  this.OnLoadCalling = false;
}; var IC = new CImgCache();// 

Object.assign(globalThis, {
  xClass2Type, xType, xDef, xAny, xObj, xObjOrNull, xFunc, xFuncOrNull, xArray, xStr, xNum, xBool, xIsNumeric,
  xDefAny, xDefAnyOrNull, xDefObj, xDefObjOrNull, xDefFunc, xDefFuncOrNull, xDefArray, xDefStr, xDefNum, xDefBool,
  xFStr, xArrFind, xArrFindIndex, xArrForEach, xArrRemove, xArrRemoveAll,
  xGet, xElement, xDataset, xInnerHTML, xWidth, xHeight, xGetCS, xSetCW, xSetCH, xPageX, xPageY, xIsRoot, xIsElementAndNotRoot, xScrollLeft, xScrollTop, xStyle,
  xMaskRegExp, xHasClass, xAddClass, xRemoveClass,
  xParent, xCreateElement, xAddEvent, xRemoveEvent, xEvent,
  xCallbackChain, xOnLoadFinished, xEventManager,
  xOnDomReady, xOnLoad,
  xTimeMS, xSetCookie, xGetCookie, xDeleteCookie,
  xLog,
  CImgCache, IC,
});
export {
  xClass2Type, xType, xDef, xAny, xObj, xObjOrNull, xFunc, xFuncOrNull, xArray, xStr, xNum, xBool, xIsNumeric,
  xDefAny, xDefAnyOrNull, xDefObj, xDefObjOrNull, xDefFunc, xDefFuncOrNull, xDefArray, xDefStr, xDefNum, xDefBool,
  xFStr, xArrFind, xArrFindIndex, xArrForEach, xArrRemove, xArrRemoveAll,
  xGet, xElement, xDataset, xInnerHTML, xWidth, xHeight, xGetCS, xSetCW, xSetCH, xPageX, xPageY, xIsRoot, xIsElementAndNotRoot, xScrollLeft, xScrollTop, xStyle,
  xMaskRegExp, xHasClass, xAddClass, xRemoveClass,
  xParent, xCreateElement, xAddEvent, xRemoveEvent, xEvent,
  xCallbackChain, xOnLoadFinished, xEventManager,
  xOnDomReady, xOnLoad,
  xTimeMS, xSetCookie, xGetCookie, xDeleteCookie,
  xLog,
  CImgCache, IC,
};
