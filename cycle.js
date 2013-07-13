function Cycle(values) {
	"use strict";

	this._values = values;
	this._next = 0;
}

Cycle.prototype = {
	next: function () {
		"use strict";

		var value = this._values[this._next];
		this._next = (this._next + 1) % this._values.length;
		return value;
	}
};
