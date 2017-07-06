define(
	'Script/Fps',
	['Core', 'Component', 'Script',
		'Core/Time', 'Component/Script'],
	function (Core, Component, Script) {
	"use strict";
	function Fps() {
		Component.Script.call(this);
		this.target = undefined;
	}

	Fps.prototype = Object.create(Component.Script.prototype);
	Fps.prototype.constructor = Fps;

	Fps.prototype.setTarget = function (target) {
		this.target = target;
	}

	Fps.prototype.Update = function () {
		this.target.text =
			' P:' + Core.Time.physicsTicker.getMeasuredFPS().toFixed(2) +
			' G:' + Core.Time.graphicsTicker.getMeasuredFPS().toFixed(2) +
			' U:' + Core.Time.updateTicker.getMeasuredFPS().toFixed(2);
	}

	Script.Fps = Fps;
	return Fps;
});
