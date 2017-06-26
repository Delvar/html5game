define(
	'Core/GameObject',
	['Core', 'Component',
		'Core/Component', 'Component/Transform', 'Component/Transform'],
	function (Core, Component) {
	"use strict";
	function GameObject(name) {
		this.name = name;
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
				}
			} else {
				console.error("Not this.components.indexOf(component) == -1");
			}
		} else {
			console.error("Not component instanceof Core.Component", component);
		}
		return this;
	};

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

	Core.GameObject = GameObject;
	return GameObject;
});
