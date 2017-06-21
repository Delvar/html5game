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

	Component.prototype.Awake = function () {};
	Component.prototype.Start = function () {};
	Component.prototype.Update = function () {};
	Component.prototype.FixedUpdate = function () {};
	Component.prototype.LateUpdate = function () {};
	Component.prototype.OnGUI = function () {};
	Component.prototype.OnDisable = function () {};
	Component.prototype.OnEnabled = function () {};

	Core.Component = Component;
	return Component;
});
