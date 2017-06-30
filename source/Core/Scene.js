define(
	'Core/Scene',
	['Core', 'Component', 'underscore',
		'Core/GameObject', 'Core/Vector2', 'Component/Transform'],
	function (Core, Component, _) {
	"use strict";
	function Scene() {
		Core.GameObject.call(this, 'Scene');
		this.camera = undefined;
		this.displaySize = new Core.Vector2(512,512);
	}

	Scene.prototype = Object.create(Core.GameObject.prototype);
	Scene.prototype.constructor = Scene;

	Scene.prototype.setCamera = function (camera) {
		//FIXME: check that camera is a camera component
		this.camera = camera;
		return this;
	};

	Scene.prototype.getCamera = function () {
		return this.camera;
	};
	
	Scene.prototype.recursiveCallbackOnComponents = function (func) {
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
				func.call(component);
			});
		}
	}

	Scene.prototype.Awake = function () {
		this.recursiveCallbackOnComponents(function () {
			this.Awake();
		});
	};
	Scene.prototype.Start = function () {
		this.recursiveCallbackOnComponents(function () {
			this.Start();
		});

	};
	Scene.prototype.Update = function () {
		this.recursiveCallbackOnComponents(function () {
			this.Update();
		});

	};
	Scene.prototype.FixedUpdate = function () {
		this.recursiveCallbackOnComponents(function () {
			this.FixedUpdate();
		});

	};
	Scene.prototype.LateUpdate = function () {
		this.recursiveCallbackOnComponents(function () {
			this.LateUpdate();
		});

	};
	Scene.prototype.OnGUI = function () {
		this.recursiveCallbackOnComponents(function () {
			this.OnGUI();
		});

	};
	Scene.prototype.OnDisable = function () {
		this.recursiveCallbackOnComponents(function () {
			this.OnDisable();
		});

	};
	Scene.prototype.OnEnabled = function () {
		this.recursiveCallbackOnComponents(function () {
			this.OnEnabled();
		});

	};

	Core.Scene = Scene;
	return Scene;
});
