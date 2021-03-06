"use strict";

/**
line: number or handle
Listen for clicks with pillView.on("click", function () {})
**/
function PillView(codeMirror, line, glyph) {
	this.codeMirror = codeMirror;
	this.$dom = $("<span class='theseus-call-count none'><span class='counts'>0 calls</span></span>");
	this.$dom.append(glyph.svg());
	codeMirror.setGutterMarker(line, "pill-gutter", this.$dom[0]);
	this.on = this.$dom.on.bind(this.$dom);
}
PillView.prototype = {
	setCount: function (count) {
		var html = count + " call" + (count === 1 ? "" : "s");
		this.$dom.find(".counts").html(html);
		this.$dom.toggleClass("none", count === 0);
	},
	setHasExceptions: function (hasExceptions) {
		this.hasExceptions = hasExceptions;
		this.$dom.toggleClass("exception", hasExceptions);
	},
	setActive: function (isActive) {
		this._active = isActive;
		this.$dom.toggleClass("active", isActive);
	},
	isActive: function () {
		return this._active;
	},
	toggle: function () {
		this.setActive(!this._active);
	},
};
