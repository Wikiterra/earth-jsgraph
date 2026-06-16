// (C) http://walter.bislins.ch/doku/jsgMouseHandler

function JsgMouseHandler(model, g, params) {
    this.ScrollNormal = 1.1; this.ScrollAlt = 1.01; this.ScrollCtrl = 1.2; this.MoveNormal = 2; this.MoveAlt = 1; this.MoveCtrl = 4; this.ClickRange = 12; this.MouseIsDown = false; this.MouseMoveDistance = 0; this.MouseLastPosX = 0; this.MouseLastPosY = 0; var params = xDefObj(params, {}); this.Model = model; var me = this; var canvas = g.Canvas; addWheelListener(g.Canvas, function (e) { me.OnMouseScroll(e); }); g.AddEventHandler('mousedown', function (e) { me.OnMouseDown(e); }); g.AddEventHandler('touchstart', function (e) { me.OnTouchStart(e); }); g.AddEventHandler('mouseup', function (e) { me.OnMouseUp(e); }); g.AddEventHandler('touchend', function (e) { me.OnTouchEnd(e); }); g.AddEventHandler('mousemove', function (e) { me.OnMouseMove(e); }); g.AddEventHandler('touchmove', function (e) { me.OnTouchMove(e) }); g.AddEventHandler('mouseleave', function (e) { me.OnMouseLeave(e); }); g.AddEventHandler('touchcancel', function (e) { me.OnTouchCancel(e); }); canvas.oncontextmenu = function () { return false; }; if (xNum(params.ScrollNormal)) { this.ScrollNormal = params.ScrollNormal; this.ScrollAlt = ((this.ScrollNormal - 1) / 10) + 1; this.ScrollCtrl = ((this.ScrollNormal - 1) * 2) + 1; }
    if (xNum(params.ScrollAlt)) { this.ScrollAlt = params.ScrollAlt; }
    if (xNum(params.ScrollCtrl)) { this.ScrollCtrl = params.ScrollCtrl; }
    if (xNum(params.MoveNormal)) { this.MoveNormal = params.MoveNormal; this.MoveAlt = this.MoveNormal / 2; this.MoveCtrl = this.MoveNormal * 2; }
    if (xNum(params.MoveAlt)) { this.MoveAlt = params.MoveAlt; }
    if (xNum(params.MoveCtrl)) { this.MoveCtrl = params.MoveCtr; }
    if (xNum(params.ClickRange)) { this.ClickRange = params.ClickRange; }
}
JsgMouseHandler.prototype.OnMouseScroll = function (event) {
    if (xFunc(this.Model.OnScroll)) {
        var factor = this.ScrollNormal; if (event.ctrlKey) factor = this.ScrollCtrl; if (event.altKey) factor = this.ScrollAlt; var scrollUp = event.deltaY < 0; if (!scrollUp) { factor = 1 / factor; }
        this.Model.OnScroll(scrollUp, factor, event);
    }
    event.preventDefault(); return true;
}
JsgMouseHandler.prototype.GetTouchOffsetPos = function (event) { var rect = event.target.getBoundingClientRect(); var x = event.targetTouches[0].clientX - rect.left; var y = event.targetTouches[0].clientY - rect.top; return [x, y]; }
JsgMouseHandler.prototype.OnTouchStart = function (event) {
    var originalEvent = event.event; if (!originalEvent.touches) { this.MouseIsDown = false; return true; }
    var pos = this.GetTouchOffsetPos(originalEvent); return this.StartTracking(event, pos);
}
JsgMouseHandler.prototype.OnMouseDown = function (event) { return this.StartTracking(event, [event.offsetX, event.offsetY]); }
JsgMouseHandler.prototype.OnMouseUp = function (event) { return this.StopTracking(event); }
JsgMouseHandler.prototype.OnTouchEnd = function (event) { return this.StopTracking(event); }
JsgMouseHandler.prototype.OnMouseLeave = function (event) { return this.StopTracking(event); }
JsgMouseHandler.prototype.StopTracking = function (event) {
    if (!this.MouseIsDown) return false; this.MouseIsDown = false; event.PreventDefault(); if (xFunc(this.Model.OnMouseUp)) { if (!xDef(event.button)) event.button = 0; this.Model.OnMouseUp(event.offsetX, event.offsetY, event); }
    if (this.MouseMoveDistance <= this.ClickRange) { this.OnClick(this.MouseLastPosX, this.MouseLastPosY, event); }
    return true;
}
JsgMouseHandler.prototype.OnTouchCancel = function (event) { this.MouseIsDown = false; return true; }
JsgMouseHandler.prototype.OnMouseMove = function (event) {
    if (!this.MouseIsDown) { return true; }
    return this.ContinueTracking(event, [event.offsetX, event.offsetY]);
}
JsgMouseHandler.prototype.OnTouchMove = function (event) {
    var originalEvent = event.event; if (!this.MouseIsDown || !originalEvent.touches || originalEvent.touches.length != 1) { this.MouseIsDown = false; return true; }
    var pos = this.GetTouchOffsetPos(originalEvent); return this.ContinueTracking(event, pos);
}
JsgMouseHandler.prototype.StartTracking = function (event, pos) {
    event.PreventDefault(); this.MouseIsDown = true; this.MouseLastPosX = pos[0]; this.MouseLastPosY = pos[1]; this.MouseMoveDistance = 0; if (xFunc(this.Model.OnMouseDown)) { if (!xDef(event.button)) event.button = 0; this.Model.OnMouseDown(pos[0], pos[1], event); }
    return true;
}
JsgMouseHandler.prototype.ContinueTracking = function (event, pos) {
    event.PreventDefault(); var moveX = pos[0] - this.MouseLastPosX; var moveY = pos[1] - this.MouseLastPosY; if (moveX == 0 && moveY == 0) { return true; }
    this.MouseMoveDistance += Math.abs(moveX) + Math.abs(moveY); this.MouseLastPosX = pos[0]; this.MouseLastPosY = pos[1]; if (xFunc(this.Model.OnMouseMove)) { var boost = this.MoveNormal; if (event.ctrlKey) boost = this.MoveCtrl; if (event.altKey) boost = this.MoveAlt; if (!xDef(event.button)) event.button = 0; this.Model.OnMouseMove(pos[0], pos[1], moveX, moveY, boost, event); }
    return true;
}
JsgMouseHandler.prototype.OnClick = function (x, y, event) { if (xFunc(this.Model.OnClick)) { if (!xDef(event.button)) event.button = 0; this.Model.OnClick(x, y, event, this.MouseMoveDistance); } }; (function (window, document) {
    var prefix = "", _addEventListener, support; if (window.addEventListener) { _addEventListener = "addEventListener"; } else { _addEventListener = "attachEvent"; prefix = "on"; }
    support = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll"; window.addWheelListener = function (elem, callback, useCapture) { _addWheelListener(elem, support, callback, useCapture); if (support == "DOMMouseScroll") { _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture); } }; function _addWheelListener(elem, eventName, callback, useCapture) {
        elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function (originalEvent) {
            !originalEvent && (originalEvent = window.event); var event = { originalEvent: originalEvent, target: originalEvent.target || originalEvent.srcElement, type: "wheel", deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1, deltaX: 0, deltaY: 0, deltaZ: 0, shiftKey: originalEvent.shiftKey, altKey: originalEvent.altKey, ctrlKey: originalEvent.ctrlKey, preventDefault: function () { originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false; } }; if (support == "mousewheel") { event.deltaY = -1 / 40 * originalEvent.wheelDelta; originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX); } else { event.deltaY = originalEvent.deltaY || originalEvent.detail; }
            return callback(event);
        }, useCapture || false);
    }
})(window, document);
Object.assign(globalThis, { JsgMouseHandler });
export { JsgMouseHandler };
