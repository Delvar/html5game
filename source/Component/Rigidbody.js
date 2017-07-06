define(
	'Component/Rigidbody',
	['Core', 'Component',
		'Core/Component', 'Core/Vector2', 'Core/Time'],
	function (Core, Component) {
	"use strict";
	function Rigidbody() {
		Core.Component.call(this);

		this.localPosition = new Core.Vector2(0, 0);
		this.localRotation = 0;

		this.mass = 1;
		this.centerOfMass = new Core.Vector2(0, 0);

		this.angularDrag = 0;
		this.angularVelocity = 0;
		this.minAngularVelocity = 0.0001; //FIXME: ?
		this.maxAngularVelocity = 360; //FIXME: ?

		this.drag = 0;
		this.velocity = new Core.Vector2(0, 0);

		this.minVelocity = 0.0001; //FIXME: ?
		this.maxVelocity = 1000; //FIXME: ?
	};

	Rigidbody.prototype = Object.create(Core.Component.prototype);
	Rigidbody.prototype.constructor = Rigidbody;

	Rigidbody.prototype.FixedUpdate = function () {
		var r = this.getInterpolated(1 / Core.Time.physicsTicker.getFPS());
		this.velocity = r.velocity;
		this.angularVelocity = r.angularVelocity;
		this.gameObject.transform.localPosition = this.localPosition = r.localPosition;
		this.gameObject.transform.localRotation = this.localRotation = r.localRotation;
		return this;
	};

	Rigidbody.prototype.getInterpolated = function (timeStep) {
		var r = {};

		r.velocity = this.velocity;
		var vMag = r.velocity.getMagnitude();

		if ((this.drag * timeStep) > vMag || vMag < this.minVelocity) {
			r.velocity = new Core.Vector2(0, 0);
		} else if (this.drag > 0) {
			var vDrag = r.velocity.multiply((this.drag / vMag) * -timeStep);
			r.velocity = r.velocity.add(vDrag);
		}

		if (vMag > this.maxVelocity) {
			r.velocity = r.velocity.multiply(this.maxVelocity / vMag);
		}
		r.localPosition = this.localPosition.add(r.velocity.multiply(timeStep));

		r.angularVelocity = this.angularVelocity;
		var avMag = Math.abs(r.angularVelocity);

		if ((this.angularDrag * timeStep) > avMag || avMag < this.minAngularVelocity) {
			r.angularVelocity = 0;
		} else if (this.angularDrag > 0) {
			var aDrag = r.angularVelocity * ((this.angularDrag / avMag) * -timeStep);
			r.angularVelocity = r.angularVelocity + aDrag;
		}

		if (avMag > this.maxAngularVelocity) {
			r.angularVelocity = r.angularVelocity * (this.maxAngularVelocity / avMag);
		}

		r.localRotation = this.localRotation + (r.angularVelocity * timeStep);

		return r;
	}

	Component.Rigidbody = Rigidbody;
	return Rigidbody;
});
