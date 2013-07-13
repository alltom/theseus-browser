"use strict";

/**
shape: "circle" or "square"
color: CSS color string like "#1f77b4"
**/
function Glyph(shape, color) {
	this._shape = shape;
	this._color = color;
}
Glyph.prototype = {
	svg: function () {
		if (this._shape === "circle") {
			return "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' class='glyph'><circle cx='5' cy='5' r='5' fill='" + this._color + "' /></svg>";
		} else if (this._shape === "square") {
			return "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' class='glyph'><rect x='1' y='1' width='8' height='8' fill='" + this._color + "' /></svg>";
		}
	},
};
