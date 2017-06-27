define(
	'Core/Vector2',
	['Core'],
	function (Core) {
	"use strict";
	function Vector2(x, y) {
		this.set(x, y);
	};

	Vector2.prototype.set = function (x, y) {
		if (x instanceof Vector2) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
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
