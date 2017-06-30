define(
	'Script/PlayerController',
	['Core', 'Component', 'Script',
		'Core/Input', 'Component/Script'],
	function (Core, Component, Script) {
	"use strict";
	function PlayerController() {
		Component.Script.call(this);
	}

	PlayerController.prototype = Object.create(Component.Script.prototype);
	PlayerController.prototype.constructor = PlayerController;

	PlayerController.prototype.Update = function () {
		//Component.Script.prototype.Update.call(this);
		var t = this.gameObject.transform;
		if (Core.Input.isDown("W".charCodeAt(0)) || Core.Input.isDown(38)) {
			t.localPosition.add(t.forward.multiply(Core.Time.deltaSeconds * 512));
		}
		if (Core.Input.isDown("S".charCodeAt(0)) || Core.Input.isDown(40)) {
			t.localPosition.add(t.forward.multiply(Core.Time.deltaSeconds * -512));
		}
		if (Core.Input.isDown("A".charCodeAt(0))) {
			t.localPosition.add(t.right.multiply(Core.Time.deltaSeconds * -512));
		}
		if (Core.Input.isDown("D".charCodeAt(0))) {
			t.localPosition.add(t.right.multiply(Core.Time.deltaSeconds * 512));
		}
		if (Core.Input.isDown(37)) {
			t.localRotation -= Core.Time.deltaSeconds * 180;
		}
		if (Core.Input.isDown(39)) {
			t.localRotation += Core.Time.deltaSeconds * 180;
		}
	}
	Script.PlayerController = PlayerController;
	return PlayerController;
});
