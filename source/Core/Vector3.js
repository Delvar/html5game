define(
	'Core/Vector3',
	['Core', 
		'Core/Vector2'],
	function (Core) {

	function Vector3(x, y, z) {
		if (x instanceof Vector3) {
			Core.Vector2.call(this, x.x, x.y);
			this.z = x.z;
		} else {
			Core.Vector2.call(this, x, y);
			this.z = z;
		}
	}

	Vector3.prototype = Object.create(Core.Vector2.prototype);
	Vector3.prototype.constructor = Vector3;

	Vector3.prototype.clone = function () {
		return new Vector3(this.x, this.y, this.z);
	};

	Core.Vector3 = Vector3;
	return Vector3;
});
