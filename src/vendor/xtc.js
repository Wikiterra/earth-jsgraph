// (C) http://walter.bislins.ch/doku/xtc

function xNormString(aStr) { return aStr.replace(/\r\n/g, '\n'); }
function xTextControl(aTextControl) {
    this.TextControl = aTextControl; this.SelStart = 0; this.SelEnd = 0; this.SelText = ''; this.Text = ''; this.Enabled = this.GetDataFromControl(); this.LineHeight = 0; var ft = ''; for (var i = 0; i < 32; i++) { ft += 'x\nx\nx\nx\nx\nx\nx\nx\n'; }
    this.FillText = ft;
}
xTextControl.prototype.GetDataFromControl = function () {
    if (typeof (this.TextControl) == 'undefined') { return false; }
    this.Text = xNormString(this.TextControl.value); if (document.selection) {
        this.TextControl.focus(); var originalRange = document.selection.createRange(); var testRange = originalRange.duplicate(); testRange.moveToElementText(this.TextControl); var len = this.Text.length; var pos = 0; var step = Math.floor(len / 2) + 1; while (step > 0) {
            while ((pos + step <= len) && testRange.inRange(originalRange)) { testRange.moveStart('character', step); pos += step; }
            if (!testRange.inRange(originalRange)) { testRange.moveStart('character', -step); pos -= step; }
            step = Math.floor(step / 2);
        }
        this.SelStart = pos; testRange.moveToElementText(this.TextControl); var pos = len; var step = Math.floor(len / 2) + 1; while (step > 0) {
            while ((pos - step >= 0) && testRange.inRange(originalRange)) { testRange.moveEnd('character', -step); pos -= step; }
            if (!testRange.inRange(originalRange)) { testRange.moveEnd('character', step); pos += step; }
            step = Math.floor(step / 2);
        }
        this.SelEnd = pos; this.SelText = this.Text.substring(this.SelStart, this.SelEnd); return true;
    }
    else if (this.TextControl.setSelectionRange) { this.SelStart = this.TextControl.selectionStart; this.SelEnd = this.TextControl.selectionEnd; this.SelText = this.Text.substring(this.SelStart, this.SelEnd); return true; }
    return false;
}; xTextControl.prototype.GetScrollTop = function () {
    if (typeof (this.TextControl.scrollTop) == 'number') { return this.TextControl.scrollTop; }
    return 0;
}
xTextControl.prototype.SetScrollTop = function (aTop) { if (typeof (this.TextControl.scrollTop) == 'number') { this.TextControl.scrollTop = aTop; } }
xTextControl.prototype.GetLineHeight = function () {
    if (this.LineHeight == 0) { var dummy = this.GetCursorScrollTop(); }
    return this.LineHeight;
}
xTextControl.prototype.GetCursorScrollTop = function () {
    if (typeof (this.TextControl.scrollHeight) != 'number') { return 0; }
    var startPos = this.SelStart; var endPos = this.SelEnd; var fullText = this.Text; this.SetText(this.FillText); var topOffset = this.TextControl.scrollHeight; var topText = this.FillText + fullText.substring(0, startPos); this.SetText(topText); var top = this.TextControl.scrollHeight - topOffset; this.SetText(topText + '\nx'); var lineHeight = this.TextControl.scrollHeight - top - topOffset; this.LineHeight = lineHeight; this.SetText(fullText); this.SetSelectionRange(startPos, endPos, true); return top;
}
xTextControl.prototype.SetText = function (aText) {
    if (this.TextControl.setSelectionRange) { var scrollTop = this.TextControl.scrollTop; this.TextControl.value = aText; this.TextControl.scrollTop = scrollTop; } else { this.TextControl.value = aText; }
    this.Text = aText;
}; xTextControl.prototype.ChangeSelection = function (aSelStart, aSelEnd, aReplaceText, aUpdateControlSelection) { var preText = this.Text.substring(0, aSelStart); var pstText = this.Text.substring(aSelEnd); var newText = preText + aReplaceText + pstText; this.SetText(newText); this.SelStart = aSelStart; this.SelEnd = aSelStart + aReplaceText.length; this.SelText = aReplaceText; if (aUpdateControlSelection) { this.UpdateControlSelection(); } }; xTextControl.prototype.SetSelectionRange = function (aSelStart, aSelEnd, aUpdateControlSelection) { this.SelStart = aSelStart; this.SelEnd = aSelEnd; this.SelText = this.Text.substring(aSelStart, aSelEnd); if (aUpdateControlSelection) { this.UpdateControlSelection(); } }; xTextControl.prototype.ChangeSelectionText = function (aReplaceText, aUpdateControlSelection) { this.ChangeSelection(this.SelStart, this.SelEnd, aReplaceText, aUpdateControlSelection); }; xTextControl.prototype.SetCaretPos = function (aPos) { this.SetSelectionRange(aPos, aPos, true); }; xTextControl.prototype.UpdateControlSelection = function () {
    this.TextControl.focus(); if (this.TextControl.setSelectionRange) { this.TextControl.setSelectionRange(this.SelStart, this.SelEnd); }
    else if (this.TextControl.createTextRange) { var range = this.TextControl.createTextRange(); range.collapse(true); range.moveEnd('character', this.SelEnd); range.moveStart('character', this.SelStart); range.select(); }
};