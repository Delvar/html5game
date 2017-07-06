define(
	'Core/GameObject',
	['Core', 'Component',
		'Core/Component', 'Component/Transform', 'Component/Transform', 'Component/Rigidbody'],
	function (Core, Component) {
	"use strict";
	function GameObject(name) {
		this.name = name || 'New GameObject';
		this.components = new Array();
		this.transform = undefined;
		this.addComponent(new Component.Transform());
	}

	GameObject.prototype.addComponent = function (component) {
		if (component instanceof Core.Component) {
			if (this.components.indexOf(component) == -1) {
				this.components.push(component);
				component.setGameObject(this);

				if (component instanceof Component.Transform) {
					this.transform = component;
				} else if (component instanceof Component.Rigidbody) {
					this.rigidbody = component;
				}
			}
		}
		return this;
	};

	GameObject.prototype.getFirstComponentByType = function (type) {
		var r = this.getComponentsByType(type);
		return r[0];
	}

	GameObject.prototype.getComponentsByType = function (type) {
		var r = [];

		_.each(this.components, function (component) {
			if (component instanceof type) {
				r.push(component);
			};
		});
		return r;
	}

	GameObject.prototype.getComponentsByTypes = function (types) {
		var r = [];

		_.each(this.components, function (component) {
			_.each(types, function (type) {
				if (component instanceof type) {
					r.push(component);
				};
			});
		});
		return r;
	}

	GameObject.prototype.getComponents = function () {
		return this.components;
	}

	GameObject.prototype.getChildren = function () {
		return this.transform.getChildren();
	};

	GameObject.prototype.getScene = function () {
		var t = this.transform;
		while (t.parent) {
			t = t.parent;
		}
		if (t.gameObject instanceof Core.Scene) {
			return t.gameObject;
		}
		return null;
	};

	Core.GameObject = GameObject;
	return GameObject;
});
