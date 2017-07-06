define(
	'Core/Vector2',
	['Core'],
	function (Core) {
	"use strict";
	function Vector2(x, y) {
		this._x
		this._y;
		if (x instanceof Vector2) {
			this._x = x.x || 0;
			this._y = x.y || 0;
		} else {
			this._x = x || 0;
			this._y = y || 0;
		}
		return this;
	};

	Object.defineProperties(Vector2.prototype, {
		'x': {
			get: function () {
				return this._x;
			},
			//set: function(x) { this._x = x; },
			enumerable: true
		},
		'y': {
			get: function () {
				return this._y;
			},
			//set: function(y) { this._y = y; },
			enumerable: true
		},
	});

	Vector2.prototype.add = function (v) {
		var r = new Core.Vector2(this._x + v.x, this._y + v.y);
		return r;
	};

	Vector2.prototype.multiply = function (m) {
		var r = new Core.Vector2(this._x * m, this._y * m);
		return r;
	};

	Vector2.prototype.clone = function () {
		return new Vector2(this._x, this._y);
	};

	Vector2.prototype.getMagnitude = function () {
		return Math.sqrt(this.getSqrMagnitude());
	};

	Vector2.prototype.getSqrMagnitude = function () {
		return this._x * this._x + this._y * this._y;
	};

	Vector2.prototype.normalise = function () {
		var vMag = this.getMagnitude();
		if (vMag == 0) {
			return new Vector2(0, 0);
		}
		return new Vector2(this._x / vMag, this._y / vMag);
	};

	Core.Vector2 = Vector2;
	return Vector2;
});
