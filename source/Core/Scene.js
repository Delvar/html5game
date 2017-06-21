
define(
	'Core/Scene',
	['Core', 'Component', 'underscore',
		'Core/GameObject', 'Component/Transform'],
	function (Core, Component, _) {
	function Scene() {
		Core.GameObject.call(this, 'Scene');
	}

	Scene.prototype = Object.create(Core.GameObject.prototype);
	Scene.prototype.constructor = Scene;

	Scene.prototype.recursiveCallOnComponents = function (functionName) {
		var gameObjectQueue = new Array();
		gameObjectQueue.push(this)
		var gameObject;
		var components;
		while (gameObjectQueue.length) {
			gameObject = gameObjectQueue.shift();
			_.each(gameObject.getComponents(), function (component) {
				if (component instanceof Component.Transform) {
					_.each(component.getChildren(), function (child) {
						gameObjectQueue.push(child.gameObject);
					});
				}
				component[functionName]();
			});
		}
	}

	Scene.prototype.Awake = function () {
		this.recursiveCallOnComponents("Awake");
	};
	Scene.prototype.Start = function () {
		this.recursiveCallOnComponents("Start");
	};
	Scene.prototype.Update = function () {
		this.recursiveCallOnComponents("Update");
	};
	Scene.prototype.FixedUpdate = function () {
		this.recursiveCallOnComponents("FixedUpdate");
	};
	Scene.prototype.LateUpdate = function () {
		this.recursiveCallOnComponents("LateUpdate");
	};
	Scene.prototype.OnGUI = function () {
		this.recursiveCallOnComponents("OnGUI");
	};
	Scene.prototype.OnDisable = function () {
		this.recursiveCallOnComponents("OnDisable");
	};
	Scene.prototype.OnEnabled = function () {
		this.recursiveCallOnComponents("OnEnabled");
	};

	Core.Scene = Scene;
	return Scene;
});
