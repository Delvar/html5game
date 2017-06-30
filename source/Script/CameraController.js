define(
	'Script/CameraController',
	['Core', 'Component', 'Script',
		'Core/Input', 'Component/Script'],
	function (Core, Component, Script) {
	"use strict";
	function CameraController() {
		Component.Script.call(this);
		this.cameraComponent = undefined;
	}

	CameraController.prototype = Object.create(Component.Script.prototype);
	CameraController.prototype.constructor = CameraController;

	CameraController.prototype.setCameraComponent = function (cameraComponent) {
		this.cameraComponent = cameraComponent;
	}

	CameraController.prototype.LateUpdate = function () {
		Core.Input._mouse.deltaY
		this.cameraComponent.zoomLevel -= (Core.Input._mouse.deltaY / (1000 / this.cameraComponent.zoomLevel));
		this.cameraComponent.zoomLevel = Math.min(Math.max(this.cameraComponent.zoomLevelMin, this.cameraComponent.zoomLevel), this.cameraComponent.zoomLevelMax);

		this.cameraComponent.displaceWorld = Core.Input.isPressed("E".charCodeAt(0)) ? (!(this.cameraComponent.displaceWorld)) : this.cameraComponent.displaceWorld;
		this.cameraComponent.rotateWorld = Core.Input.isPressed("R".charCodeAt(0)) ? (!(this.cameraComponent.rotateWorld)) : this.cameraComponent.rotateWorld;
		this.cameraComponent.scaleWorld = Core.Input.isPressed("T".charCodeAt(0)) ? (!(this.cameraComponent.scaleWorld)) : this.cameraComponent.scaleWorld;
	}

	Script.CameraController = CameraController;
	return CameraController;
});
