/**
returns a new NodesHandle
listen with handle.on("nodes", callback)
close with handle.close(), which emits "close"

unlike this other handles, this one remembers all the nodes it has seen so that
you can ask about them (even after the handle has been closed).

tracer_: a fondue instance
refreshInterval: milliseconds (default 30)
**/
function NodesHandle(tracer_, refreshInterval) {
	refreshInterval = (refreshInterval || 30);

	var handle = tracer_.trackNodes();

	var nodesById = {}; // nodeId -> node

	var timer = setInterval(function () {
		var delta = tracer_.newNodes(handle);
		delta.forEach(function (node) {
			nodesById[node.id] = node;
		});
		if (delta.length > 0) {
			self.emit("nodes", delta);
		}
	}, refreshInterval);

	var self = smokesignals.convert({
		nodeWithId: function (id) {
			return nodesById[id];
		},
		close: function () {
			self.close = function () {};

			tracer_.untrackNodes(handle);
			handle = undefined;

			clearInterval(timer);
			timer = undefined;

			self.emit("close");
		},
	});

	return self;
}

/**
returns a new LogHandle
listen for log entries with handle.on("entries", callback)
listen for query changes with handle.on("queryChanged", callback)
close with handle.close(), which emits "close"

tracer_: a fondue instance
autoFetch: whether to fetch entries, or just report the counts (default true)
	when false, emits "pending" events with the number of waiting log entries
	call fetch() to trigger a fetch on the next update
query: { ids: [], eventNames: [], exceptions: false, logs: false }
refreshInterval: milliseconds (default 30)
numEntries: number of entries to request at a time (default 50)
**/
function LogHandle(tracer_, query, autoFetch, refreshInterval, numEntries) {
	// setting default argument values
	if (autoFetch === undefined) autoFetch = true;
	refreshInterval = (refreshInterval || 30);
	numEntries = (numEntries || 50);

	var handle = tracer_.trackLogs(query);

	var fetch = autoFetch;
	var lastCount = 0;

	var timer = setInterval(function () {
		if (fetch) {
			if (!autoFetch) fetch = false;
			var entries = tracer_.logDelta(handle, numEntries);
			lastCount = 0;
			if (entries.length > 0) {
				self.emit("entries", entries);
			}
		} else {
			var count = tracer_.logCount(handle);
			if (count !== lastCount) {
				lastCount = count;
				self.emit("pending", count);
			}
		}
	}, refreshInterval);

	var self = smokesignals.convert({
		fetch: function () {
			fetch = true;
		},
		setQuery: function (newQuery) {
			// tracer_.unquery(handle); // XXX: this doesn't exist yet
			self.lastQuery = query = newQuery;
			handle = tracer_.trackLogs(query);
			self.emit("queryChanged", query);
		},
		lastQuery: query,
		close: function () {
			self.close = function () {};

			// tracer_.unquery(handle); // XXX: this doesn't exist yet
			handle = undefined;

			clearInterval(timer);
			timer = undefined;

			self.emit("close");
		},
	});

	return self;
}

/**
returns a new HitsHandle
listen with handle.on("hits", callback)
close with handle.close(), which emits "close"

tracer_: a fondue instance
refreshInterval: milliseconds (default 30)
**/
function HitsHandle(tracer_, refreshInterval) {
	refreshInterval = (refreshInterval || 30);

	var handle = tracer_.trackHits();

	var timer = setInterval(function () {
		var delta = tracer_.hitCountDeltas(handle);
		if (Object.keys(delta).length > 0) {
			self.emit("hits", delta);
		}
	}, refreshInterval);

	var self = smokesignals.convert({
		close: function () {
			self.close = function () {};

			// tracer_.unquery(handle); // XXX: this doesn't exist yet
			handle = undefined;

			clearInterval(timer);
			timer = undefined;

			self.emit("close");
		},
	});

	return self;
}

/**
returns a new EpochsHandle
listen with handle.on("epochs", callback)
close with handle.close(), which emits "close"

tracer_: a fondue instance
refreshInterval: milliseconds (default 30)
**/
function EpochsHandle(tracer_, refreshInterval) {
	refreshInterval = (refreshInterval || 30);

	var handle = tracer_.trackEpochs();

	var timer = setInterval(function () {
		var delta = tracer_.epochDelta(handle);
		if (Object.keys(delta).length > 0) {
			self.emit("epochs", delta);
		}
	}, refreshInterval);

	var self = smokesignals.convert({
		close: function () {
			self.close = function () {};

			tracer_.untrackEpochs(handle);
			handle = undefined;

			clearInterval(timer);
			timer = undefined;

			self.emit("close");
		},
	});

	return self;
}
