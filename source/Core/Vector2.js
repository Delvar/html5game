define(
	'Core/Vector2',
	['Core'],
	function (Core) {
	function Vector2(x, y) {
		if (x instanceof Vector2) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	};

	Vector2.prototype.clone = function () {
		return new Vector2(this.x, this.y);
	};

	Core.Vector2 = Vector2;
	return Vector2;
});
