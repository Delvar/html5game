define(
	'Component/Camera',
	['Core', 'Component',
		'Core/Component'],
	function (Core, Component) {
	"use strict";
	function Camera() {
		Core.Component.call(this);
		//world is the transform we use as the world base.
		this.world = undefined;

		this.displaceWorld = true;
		this.rotateWorld = false;
		this.scaleWorld = true;

		this.zoomLevel = 1;
		this.zoomLevelMin = 0.1;
		this.zoomLevelMax = 1;

		this.displaySize = new Core.Vector2(128,128);
	}

	Camera.prototype = Object.create(Core.Component.prototype);
	Camera.prototype.constructor = Camera;

	Camera.prototype.setWorld = function (world) {
		//FIXME: check that world is a transform
		this.world = world;
		return this;
	};

	Camera.prototype.getWorld = function () {
		return this.world;
	};

	Component.Camera = Camera;
	return Camera;
});
