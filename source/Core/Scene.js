
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
