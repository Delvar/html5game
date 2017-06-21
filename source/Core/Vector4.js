define(
	'Core/Vector4',
	['Core',
		'Core/Vector3'],
	function (Core) {
	function Vector4(x, y, z, w) {
		if (x instanceof Vector4) {
			Core.Vector3.call(this, x.x, x.y, x.z);
			this.w = x.w;
		} else {
			Core.Vector3.call(this, x, y, z);
			this.w = w;
		}
	}

	Vector4.prototype = Object.create(Core.Vector3.prototype);
	Vector4.prototype.constructor = Vector4;

	Vector4.prototype.clone = function () {
		return new Vector4(this.x, this.y, this.z, this.w);
	};

	Core.Vector4 = Vector4;
	return Vector4;
});
