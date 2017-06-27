define(
	'Component/Transform',
	['Core', 'Component',
		'Core/Component', 'Core/Vector2', 'Core/TransformProperties', 'Core/Matrix3x3'],
	function (Core, Component) {
	"use strict";
	function Transform() {
		Core.Component.call(this);
		this.localPosition = new Core.Vector2(0, 0);
		this.localRotation = 0;
		this.localScale = new Core.Vector2(1, 1);
		this.centerPosition = new Core.Vector2(0, 0);
		this._props = new Core.TransformProperties();
		this.parent = undefined;
		this.children = new Array();
	}

	Transform.prototype = Object.create(Core.Component.prototype);
	Transform.prototype.constructor = Transform;

	Transform.prototype.setParent = function (parent) {
		if (parent == undefined) {
			return this.removeParent();
		}
		if (parent instanceof Component.Transform && parent != this.parent) {
			if (this.parent instanceof Component.Transform) {
				this.parent.removeChild(this);
			}
			this.parent = parent;
			parent.addChild(this);
		}
		return this;
	};

	Transform.prototype.getParent = function () {
		return this.parent;
	};

	Transform.prototype.removeParent = function () {
		var oldParent = this.parent;
		this.parent = undefined;

		if (oldParent instanceof Component.Transform) {
			oldParent.removeChild(this);
		}
		return this;
	};

	Transform.prototype.getChildren = function () {
		return this.children;
	};

	Transform.prototype.addChild = function (child) {
		if (child instanceof Component.Transform) {
			child.setParent(this);
			if (this.children.indexOf(child) == -1) {
				this.children.push(child);
			}
		}
		return this;
	};

	Transform.prototype.removeChild = function (child) {
		if (child instanceof Component.Transform) {
			child.removeParent();
			var index = this.children.indexOf(child);
			if (index != -1) {
				this.children.splice(index, 1);
			}
		}
		return this;
	};

	//Transform.prototype.forward

	//the forward direction of this transform,
	Object.defineProperty(Transform.prototype, 'forward', {
		get: function () {
			var sin = Math.sin(this.localRotation * Core.Matrix3x3.DEG_TO_RAD);
			var cos = Math.cos(this.localRotation * Core.Matrix3x3.DEG_TO_RAD);
			return new Core.Vector2(sin, -cos);
			//return new Core.Vector2((cos * tx + sin * ty),(sin * tx - cos * ty));
		}
	});

	Object.defineProperty(Transform.prototype, 'right', {
		get: function () {
			var sin = Math.sin(this.localRotation * Core.Matrix3x3.DEG_TO_RAD);
			var cos = Math.cos(this.localRotation * Core.Matrix3x3.DEG_TO_RAD);
			return new Core.Vector2(cos, sin);
			//return new Core.Vector2((cos * tx + sin * ty),(sin * tx - cos * ty));
		}
	});

	Component.Transform = Transform;
	return Transform;
});
