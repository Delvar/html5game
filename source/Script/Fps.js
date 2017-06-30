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
		this.target.text = Core.Time.getMeasuredFPS().toFixed(2);
	}

	Script.Fps = Fps;
	return Fps;
});
