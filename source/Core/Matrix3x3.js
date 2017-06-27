define(
	'Core/Matrix3x3',
	['Core',
		'Core/Vector2'],
	function (Core) {
	"use strict";

	/*
	a = v[0]; c = v[1]; tx/e = v[2];
	b = v[3]; d = v[4]; ty/f = v[5];
	g/0 = v[6]; h/0 = v[7];  i/1 = v[8];
	 */

	function Matrix3x3(a, b, c, d, e, f, g, h, i) {
		this.v = new Float32Array(9);
		if (a instanceof Array) {
			this.setValuesArray(a);
		} else { //if (a != undefined && b != undefined && c != undefined && d != undefined && e != undefined && f != undefined && g != undefined && h != undefined && i != undefined) {
			this.setValuesArray([a, b, c, d, e, f, g, h, i]);
		}
	}

	Matrix3x3.prototype.clone = function () {
		return new Core.Matrix3x3();
	};

	Matrix3x3.DEG_TO_RAD = Math.PI / 180;

	Matrix3x3.prototype.setValuesArray = function (u) {
		this.v[0] = (u[0] == null) ? 1 : u[0];
		this.v[1] = u[1] || 0;
		this.v[2] = u[2] || 0;
		this.v[3] = u[3] || 0;
		this.v[4] = (u[4] == null) ? 1 : u[4];
		this.v[5] = u[5] || 0;
		this.v[6] = u[6] || 0;
		this.v[7] = u[7] || 0;
		this.v[8] = (u[8] == null) ? 1 : u[8];
	}

	Matrix3x3.prototype.setValues = function (a, b, c, d, e, f, g, h, i) {
		this.setValuesArray([a, b, c, d, e, f, g, h, i]);
		return this;
	};

	Matrix3x3.prototype.appendArray = function (u) {
		var t = new Float32Array(9);
		var v = this.v;

		//var a1 = this.a;
		t[0] = v[0];
		//var b1 = this.b;
		t[1] = v[1];
		//t[2] = v[2];
		//var c1 = this.c;
		t[3] = v[3];
		//var d1 = this.d;
		t[4] = v[4];
		//t[5] = v[5];	//t[6] = v[6];
		//t[7] = v[7];	//t[8] = v[8];

		//if (a != 1 || b != 0 || c != 0 || d != 1) {
		if (u[0] != 1 || u[3] != 0 || u[1] != 0 || u[4] != 1) {
			//this.a  = a1*a+c1*b;
			v[0] = t[0] * u[0] + t[1] * u[3];
			//this.b  = b1*a+d1*b;
			v[3] = t[3] * u[0] + t[4] * u[3];
			//this.c  = a1*c+c1*d;
			v[1] = t[0] * u[1] + t[1] * u[4];
			//this.d  = b1*c+d1*d;
			v[4] = t[3] * u[1] + t[4] * u[4];
		}

		//this.tx = a1*tx+c1*ty+this.tx;
		v[2] = t[0] * u[2] + t[1] * u[5] + v[2];
		//this.ty = b1*tx+d1*ty+this.ty;
		v[5] = t[3] * u[2] + t[4] * u[5] + v[5];
		return this;
	};

	Matrix3x3.prototype.append = function (a, b, c, d, e, f, g, h, i) {
		this.appendArray([a, b, c, d, e, f, g, h, i]);
	}

	Matrix3x3.prototype.appendMatrix = function (matrix) {
		return this.appendArray(matrix.v);
	};

	Matrix3x3.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, regX, regY) {
		var r = rotation * Core.Matrix3x3.DEG_TO_RAD;
		var cos = Math.cos(r);
		var sin = Math.sin(r);

		this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);

		if (regX || regY) {
			// append the registration offset:
			//this.tx -= regX*this.a+regY*this.c;
			this.v[2] -= regX * this.v[0] + regY * this.v[1];
			//this.ty -= regX*this.b+regY*this.d;
			this.v[5] -= regX * this.v[3] + regY * this.v[4];
		}
		return this;
	};

	Matrix3x3.prototype.prependArray = function (u) {
		var t = new Float32Array(9);
		var v = this.v;

		//var a1 = this.a;
		t[0] = v[0];
		//var c1 = this.c;
		t[1] = v[1];
		//var tx1 = this.tx;
		t[2] = v[2];
		//t[3] = v[3];	//t[4] = v[4]; //t[5] = v[5];
		//t[6] = v[6];	//t[7] = v[7]; //t[8] = v[8];

		//this.a  = a*a1+c*this.b;
		v[0] = u[0] * t[0] + u[1] * v[3];
		//this.b  = b*a1+d*this.b;
		v[3] = u[3] * t[0] + u[4] * v[3];
		//this.c  = a*c1+c*this.d;
		v[1] = u[0] * t[1] + u[1] * v[4];
		//this.d  = b*c1+d*this.d;
		v[4] = u[3] * t[1] + u[4] * v[4];
		//this.tx = a*tx1+c*this.ty+tx;
		v[2] = u[0] * t[2] + u[1] * v[5] + u[2];
		//this.ty = b*tx1+d*this.ty+ty;
		v[5] = u[3] * t[2] + u[4] * v[5] + u[5];

		return this;
	};

	Matrix3x3.prototype.prepend = function (a, b, c, d, e, f, g, h, i) {
		this.prependArray([a, b, c, d, e, f, g, h, i]);
	}

	Matrix3x3.prototype.prependMatrix = function (matrix) {
		return this.prependArray(matrix.v);
	};

	Matrix3x3.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, regX, regY) {
		var r = rotation * Core.Matrix3x3.DEG_TO_RAD;
		var cos = Math.cos(r);
		var sin = Math.sin(r);

		if (regX || regY) {
			// prepend the registration offset:
			//this.tx -= regX; this.ty -= regY;
			this.v[2] -= regX;
			this.v[5] -= regY;
		}
		this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
		return this;
	};

	Matrix3x3.prototype.rotate = function (rotation) {
		var r = rotation * Core.Matrix3x3.DEG_TO_RAD;
		var cos = Math.cos(r);
		var sin = Math.sin(r);

		var t = new Float32Array(9);
		var v = this.v;
		//var a1 = this.a;
		t[0] = v[0];
		//var b1 = this.b;
		t[3] = v[3];

		//this.a = a1*cos+this.c*sin;
		v[0] = t[0] * cos + v[4] * sin;
		//this.b = b1*cos+this.d*sin;
		v[3] = t[3] * cos + v[4] * sin;
		//this.c = -a1*sin+this.c*cos;
		v[1] = -t[0] * sin + v[1] * cos;
		//this.d = -b1*sin+this.d*cos;
		v[4] = -t[3] * sin + v[4] * cos;
		return this;
	};

	Matrix3x3.prototype.scale = function (x, y) {
		this.v[0] *= x;
		this.v[3] *= x;
		this.v[1] *= y;
		this.v[4] *= y;
		return this;
	};

	Matrix3x3.prototype.translate = function (x, y) {
		this.v[2] += this.v[0] * x + this.v[1] * y;
		this.v[5] += this.v[3] + this.v[4] * y;
		return this;
	};

	Matrix3x3.prototype.identity = function () {
		var v = this.v;
		v[0] = v[4] = v[8] = 1;
		v[1] = v[2] = v[3] = v[5] = v[6] = v[7] = 0;
		return this;
	};

	Matrix3x3.prototype.invert = function () {
		var t = new Float32Array(9);
		var v = this.v;

		//var a1 = this.a;
		t[0] = v[0];
		//var b1 = this.b;
		t[3] = v[3];
		//var c1 = this.c;
		t[1] = v[1];
		//var d1 = this.d;
		t[4] = v[4];
		//var tx1 = this.tx;
		t[2] = v[2];
		//var n = a1*d1-b1*c1;
		var n = t[0] * t[4] - t[3] * t[1];

		//this.a = d1/n;
		v[0] = t[4] / n;
		//this.b = -b1/n;
		v[3] = -t[3] / n;
		//this.c = -c1/n;
		v[1] = -t[1] / n;
		//this.d = a1/n;
		v[4] = t[0] / n;
		//this.tx = (c1*this.ty-d1*tx1)/n;
		v[2] = (t[1] * v[5] - t[4] * t[2]) / n;
		//this.ty = -(a1*this.ty-b1*tx1)/n;
		v[5] =  - (t[0] * v[5] - t[3] * t[2]) / n;
		return this;
	};

	Matrix3x3.prototype.isIdentity = function () {
		return (
			this.v[0] == 1 && this.v[1] == 0 && this.v[2] == 0 &&
			this.v[3] == 0 && this.v[4] == 1 && this.v[5] == 0 &&
			this.v[6] == 0 && this.v[7] == 0 && this.v[8] == 1);
	};

	Matrix3x3.prototype.equals = function (matrix) {
		return (
			this.v[0] == matrix.v[0] && this.v[1] == matrix.v[1] && this.v[2] == matrix.v[2] &&
			this.v[3] == matrix.v[3] && this.v[4] == matrix.v[4] && this.v[5] == matrix.v[5] &&
			this.v[6] == matrix.v[6] && this.v[7] == matrix.v[7] && this.v[8] == matrix.v[8]);
	};

	Matrix3x3.prototype.transformPoint = function (x, y, pt) {
		pt = pt || new Core.Vector2(0, 0);
		//pt.x = x*this.a+y*this.c+this.tx;
		pt.x = x * this.v[0] + y * this.v[1] + this.v[2];
		//pt.y = x*this.b+y*this.d+this.ty;
		pt.y = x * this.v[3] + y * this.v[4] + this.v[5];
		return pt;
	};

	Matrix3x3.prototype.decompose = function (target) {
		if (target == null) {
			target = {};
		}
		target.x = this.v[2];
		target.y = this.v[5];
		target.scaleX = Math.sqrt(this.v[0] * this.v[0] + this.v[3] * this.v[3]);
		target.scaleY = Math.sqrt(this.v[1] * this.v[1] + this.v[4] * this.v[4]);
		return target;
	};

	Matrix3x3.prototype.copy = function (matrix) {
		return this.setValuesArray(matrix.v);
	};

	Matrix3x3.prototype.clone = function () {
		return new Core.Matrix3x3(this.v);
	};

	Matrix3x3.identity = new Matrix3x3();

	Core.Matrix3x3 = Matrix3x3;
	return Matrix3x3;
});
