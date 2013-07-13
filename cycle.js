"use strict";

function Cycle(values) {
	this._values = values;
	this._next = 0;
}

Cycle.prototype = {
	next: function () {
		var value = this._values[this._next];
		this._next = (this._next + 1) % this._values.length;
		return value;
	}
};
