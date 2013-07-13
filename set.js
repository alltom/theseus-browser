/* exported addToSet, removeFromSet, setDifference */

function addToSet(array, item) {
	"use strict";

	if (array.indexOf(item) === -1) {
		array.push(item);
		return true;
	}
}

function removeFromSet(array, item) {
	"use strict";

	var idx = array.indexOf(item);
	if (idx !== -1) {
		array.splice(idx, 1);
		return true;
	}
}

/** returns a - b **/
function setDifference(a, b) {
	"use strict";

	var result = a.slice();
	b.forEach(function (item) {
		removeFromSet(result, item);
	});
	return result;
}
