
define(
	'Core/Scene',
	['Core', 'underscore',
		'Core/GameObject'],
	function (Core, _) {
	function Scene() {
		Core.GameObject.call(this, 'Scene');
	}

	Scene.prototype = Object.create(Core.GameObject.prototype);
	Scene.prototype.constructor = Scene;

	Core.Scene = Scene;
	return Scene;
});
