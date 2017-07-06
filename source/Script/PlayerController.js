define(
	'Script/PlayerController',
	['Core', 'Component', 'Script',
		'Core/Input', 'Component/Script'],
	function (Core, Component, Script) {
	"use strict";
	function PlayerController() {
		Component.Script.call(this);
		this.acceleration = 50;
		this.angularAcceleration = 50;
	}

	PlayerController.prototype = Object.create(Component.Script.prototype);
	PlayerController.prototype.constructor = PlayerController;

	PlayerController.prototype.Update = function () {
		//Component.Script.prototype.Update.call(this);
		var t = this.gameObject.transform;
		var r = this.gameObject.rigidbody;
		//console.log(r);
		//r.velocity = new Core.Vector2(0,0);
		
		if (Core.Input.isDown("W".charCodeAt(0)) || Core.Input.isDown(38)) {
			//t.localPosition = t.localPosition.add(t.forward.multiply(Core.Time.deltaSeconds * 512));
			r.velocity = r.velocity.add(t.forward.multiply(Core.Time.deltaSeconds * this.acceleration));
			//console.log(r.velocity);
		}
		if (Core.Input.isDown("S".charCodeAt(0)) || Core.Input.isDown(40)) {
			//t.localPosition = t.localPosition.add(t.forward.multiply(Core.Time.deltaSeconds * -512));
			r.velocity = r.velocity.add(t.forward.multiply(Core.Time.deltaSeconds * -this.acceleration));
		}
		if (Core.Input.isDown("A".charCodeAt(0))) {
			//t.localPosition = t.localPosition.add(t.right.multiply(Core.Time.deltaSeconds * -512));
			r.velocity = r.velocity.add(t.right.multiply(Core.Time.deltaSeconds * -this.acceleration/2));
		}
		if (Core.Input.isDown("D".charCodeAt(0))) {
			//t.localPosition = t.localPosition.add(t.right.multiply(Core.Time.deltaSeconds * 512));
			r.velocity = r.velocity.add(t.right.multiply(Core.Time.deltaSeconds * this.acceleration/2));
		}
		if (Core.Input.isDown(37)) {
			//t.localRotation -= Core.Time.deltaSeconds * 180;
			r.angularVelocity -= Core.Time.deltaSeconds * this.angularAcceleration;
		}
		if (Core.Input.isDown(39)) {
			//t.localRotation += Core.Time.deltaSeconds * 180;
			r.angularVelocity += Core.Time.deltaSeconds * this.angularAcceleration;
		}
	}
	Script.PlayerController = PlayerController;
	return PlayerController;
});
