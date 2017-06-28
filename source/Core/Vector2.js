define(
	'Core/Vector2',
	['Core'],
	function (Core) {
	"use strict";
	function Vector2(x, y) {
		this.set(x, y);
	};
/*
	Object.defineProperties(Vector2.prototype, {
		'x':{get: function() { return this._x; },
			set: function(x) { this._x = x; this._ts = Date.now();},
			enumerable: true},
		'y':{get: function() { return this._y; },
			set: function(y) { this._y = y; this._ts = Date.now();},
			enumerable: true},
	});
*/
	Vector2.prototype.set = function (x, y) {
		if (x instanceof Vector2) {
			this.x = x.x||0;
			this.y = x.y||0;
		} else {
			this.x = x||0;
			this.y = y||0;
		}
		return this;
	};

	Vector2.prototype.add = function (v) {
		this.x = this.x + v.x;
		this.y = this.y + v.y;
		return this;
	};

	Vector2.prototype.multiply = function (m) {
		this.x = this.x * m;
		this.y = this.y * m;
		return this;
	};

	Vector2.prototype.clone = function () {
		return new Vector2(this.x, this.y);
	};

	Core.Vector2 = Vector2;
	return Vector2;
});
