define(
	'Core/Time',
	['Core', 'easel'],
	function (Core, createjs) {
	"use strict";
	var Time = {};

	//FIXME: allow injection from createjs isntead of hard code or maybe re-implement myown.
	Time.getMeasuredTickTime = createjs.Ticker.getMeasuredTickTime;
	Time.getMeasuredFPS = createjs.Ticker.getMeasuredFPS;

	Time.delta = 0;
	Time.paused = false;
	Time.time = 0;
	Time.runTime = 0;
	Time.deltaSeconds = 0;
	// javascriptplayground.com/blog/2013/12/es5-getters-setters/
	/*
	try {
	Object.defineProperties(Ticker, {
	interval: { get: Ticker.getInterval, set: Ticker.setInterval },
	framerate: { get: Ticker.getFPS, set: Ticker.setFPS }
	});
	} catch (e) { console.log(e); }

	Object.defineProperty(Time, 'fullName', {
	get: function () {
	return firstName + ' ' + lastName;
	},
	set: function (name) {
	var words = name.split(' ');
	this.firstName = words[0] || '';
	this.lastName = words[1] || '';
	}
	});
	 */
	Core.Time = Time;
	return Time;
});
