function LogHandle(tracer_, query) {
	var handle = tracer_.trackLogs(query);

	return {
		fetch: function () {
			return tracer_.logDelta(handle, 10);
		},
		count: function () {
			return tracer_.logCount(handle);
		},
	};
}

/**
returns a new HitsHandle
listen with handle.on("data", callback)
close with handle.close(), which emits "close"

tracer_ is a fondue instance
refreshInterval is in milliseconds and defaults to 100
**/
function HitsHandle(tracer_, refreshInterval) {
	refreshInterval = (refreshInterval || 30);

	var handle = tracer_.trackHits();

	var timer = setInterval(function () {
		self.emit("data", tracer_.hitCountDeltas(handle));
	}, refreshInterval);

	var self = smokesignals.convert({
		close: function () {
			clearInterval(timer);
			timer = undefined;
			self.emit("close");
		},
	});

	return self;
}
