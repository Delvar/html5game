define(
	'Core/Time',
	['Core', 'easel'],
	function (Core, createjs) {
	"use strict";
	var Time = {};

	//FIXME: allow injection from createjs isntead of hard code or maybe re-implement my own.
	Time.getMeasuredTickTime = createjs.Ticker.getMeasuredTickTime;
	Time.getMeasuredFPS = createjs.Ticker.getMeasuredFPS;

	Time.delta = 0;
	Time.paused = false;
	Time.time = 0;
	Time.runTime = 0;
	Time.deltaSeconds = 0;
	
	Core.Time = Time;
	return Time;
});
