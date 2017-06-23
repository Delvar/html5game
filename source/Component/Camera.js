define(
	'Component/Camera',
	['Core', 'Component', 
		'Core/Component'],
	function (Core, Component) {

	function Camera() {
		Core.Component.call(this);
		//this.targetContainerObject = undefined;
		//this.transform = undefined;
		this.zoomLevel = 1;
		
		this.zoomLevelMin = 0.1;
		this.zoomLevelMax = 5;
	}

	Camera.prototype = Object.create(Core.Component.prototype);
	Camera.prototype.constructor = Camera;

/*
	Camera.prototype.Awake = function () {
		Core.Component.prototype.Awake.call(this);
		this.transform = this.gameObject.transform;
		this.targetContainerObject = this.gameObject.transform.parent.getContainerObject();
	}

	Camera.prototype.Update = function () {
		Core.Component.prototype.Update.call(this);
		this.targetContainerObject.regX = this.transform.localPosition.x;
		this.targetContainerObject.regY = this.transform.localPosition.y;
		this.targetContainerObject.rotation = -this.transform.localRotation;
		this.targetContainerObject.scaleX = this.targetContainerObject.scaleY = this.zoomLevel;
		this.targetContainerObject.x=500;
		this.targetContainerObject.y=500;
	}
*/
	Component.Camera = Camera;
	return Camera;
});
