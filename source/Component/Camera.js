define(
	'Component/Camera',
	['Core', 'Component',
		'Core/Component'],
	function (Core, Component) {
	"use strict";
	function Camera() {
		Core.Component.call(this);
		//target is the transform we use as the world base.
		this.target = undefined;

		this.displaceTarget = true;
		this.rotateTarget = false;
		this.scaleTarget = true;

		this.zoomLevel = 1;
		this.zoomLevelMin = 0.1;
		this.zoomLevelMax = 5;
	}

	Camera.prototype = Object.create(Core.Component.prototype);
	Camera.prototype.constructor = Camera;

	Camera.prototype.setTarget = function (target) {
		//FIXME: check that target is a transform
		this.target = target;
		return this;
	};

	Camera.prototype.getTarget = function () {
		return this.target;
	};
		
	Component.Camera = Camera;
	return Camera;
});
