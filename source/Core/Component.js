define(
	'Core/Component',
	['Core'],
	function (Core) {
	function Component() {
		this.gameObject = undefined;
	}

	Component.prototype.setGameObject = function (gameObject) {
		this.gameObject = gameObject;
		return this;
	};

	Component.prototype.getGameObject = function (gameObject) {
		return this.gameObject;
	};

	Component.prototype.Awake = function () {
		console.log("Awake", this);
	};
	Component.prototype.Start = function () {
		console.log("Start", this);
	};
	Component.prototype.Update = function () {
		//console.log("Update", this);
	};
	Component.prototype.FixedUpdate = function () {
		console.log("FixedUpdate", this);
	};
	Component.prototype.LateUpdate = function () {
		console.log("LateUpdate", this);
	};
	Component.prototype.OnGUI = function () {
		console.log("OnGUI", this);
	};
	Component.prototype.OnDisable = function () {
		console.log("OnDisable", this);
	};
	Component.prototype.OnEnabled = function () {
		console.log("OnEnabled", this);
	};

	Core.Component = Component;
	return Component;
});
