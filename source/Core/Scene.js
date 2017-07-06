define(
	'Core/Scene',
	['Core', 'Component', 'underscore',
		'Core/GameObject', 'Core/Vector2', 'Component/Transform', 'Component/Script'],
	function (Core, Component, _) {
	"use strict";
	function Scene() {
		Core.GameObject.call(this, 'Scene');
		this.mainCamera = undefined;
	}

	Scene.prototype = Object.create(Core.GameObject.prototype);
	Scene.prototype.constructor = Scene;

	Scene.prototype.setMainCamera = function (mainCamera) {
		//FIXME: check that camera is a camera component
		this.mainCamera = mainCamera;
		return this;
	};

	Scene.prototype.getMainCamera = function () {
		return this.mainCamera;
	};

	Scene.prototype.recursiveCallbackOnComponents = function (func, typeList) {
		var gameObjectQueue = new Array();
		gameObjectQueue.push(this)
		var gameObject,
		components,
		component;
		while (gameObjectQueue.length) {
			gameObject = gameObjectQueue.shift();
			_.each(gameObject.getComponents(), function (component) {
				if (component instanceof Component.Transform) {
					_.each(component.getChildren(), function (child) {
						gameObjectQueue.push(child.gameObject);
					});
				}
				if (typeList != undefined) {
					_.each(typeList, function (type) {
						if (component instanceof type) {
							func.call(component);
						};
					});
				} else {
					func.call(component);
				}
			});
		}
	}

	Scene.prototype.Awake = function () {
		this.recursiveCallbackOnComponents(function () {
			this.Awake && this.Awake();
		}, [Component.Script]);
	};
	Scene.prototype.Start = function () {
		this.recursiveCallbackOnComponents(function () {
			this.Start && this.Start();
		}, [Component.Script]);

	};
	Scene.prototype.Update = function () {
		this.recursiveCallbackOnComponents(function () {
			this.Update && this.Update();
		}, [Component.Script]);

	};
	Scene.prototype.LateUpdate = function () {
		this.recursiveCallbackOnComponents(function () {
			this.LateUpdate && this.LateUpdate();
		}, [Component.Script]);

	};

	Scene.prototype.FixedUpdate = function () {
		this.recursiveCallbackOnComponents(function () {
			this.FixedUpdate && this.FixedUpdate();
		}, [Component.Rigidbody,Component.Script]);

	};
	
	Core.Scene = Scene;
	return Scene;
});
