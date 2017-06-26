define(
	'Component/Transform',
	['Core', 'Component',
		'Core/Component', 'Core/Vector2'],
	function (Core, Component) {
	"use strict";
	function Transform() {
		Core.Component.call(this);
		this.localPosition = new Core.Vector2(0, 0);
		this.localRotation = 0;
		this.localScale = new Core.Vector2(1, 1);
		this.centerPosition = new Core.Vector2(0, 0);

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
	/*
	Transform.prototype.getContainerObject = function () {
	return this.containerObject;
	};

	Transform.prototype.setContainerObject = function (containerObject) {
	this.containerObject = containerObject;
	return this;
	};

	Transform.prototype.Awake = function () {
	Core.Component.prototype.Awake.call(this);
	var that = this;
	//FIXME: needs to be moved out to cammera functions for world to screen space/scale conversion.
	this.containerObject.x = this.localPosition.x;
	this.containerObject.y = this.localPosition.y;
	_.each(this.gameObject.getComponentsByType(Component.EaselWrap), function (easelWrap) {
	if (!(easelWrap instanceof Component.Transform)) {
	that.containerObject.addChild(easelWrap.getWrapped());
	}
	});
	//for each child game game object we go and get the containers and append to our container.
	_.each(this.children, function (child) {
	that.containerObject.addChild(child.getContainerObject());
	});
	};

	Transform.prototype.Update = function () {
	Core.Component.prototype.Update.call(this);
	this.containerObject.x = this.localPosition.x;
	this.containerObject.y = this.localPosition.y;
	this.containerObject.rotation = this.localRotation;
	}
	 */
	Component.Transform = Transform;
	return Transform;
});
