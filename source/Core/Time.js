define(
	'Core/Time',
	['Core', 'Core/Ticker', 'easel'],
	function (Core) {
	"use strict";
	var Time = {};

	Time.physicsTicker = undefined;
	Time.graphicsTicker = undefined;
	Time.updateTicker = undefined;

	Time.delta = 0;
	Time.paused = false;
	Time.time = 0;
	Time.runTime = 0;
	Time.deltaSeconds = 0;

	Core.Time = Time;
	return Time;
});
