define(
	'Core/GameObject',
	['Core', 'Component',
		'Core/Vector2', 'Core/Component', 'Component/DisplayContainer'],
	function (Core, Component) {
	function GameObject(name, position) {
		this.name = name;
		this.components = new Array();
		this.parent;
		this.children = new Array();

		if (position !== undefined && position instanceof Core.Vector2) {
			this.position = position;
		} else {
			this.position = new Core.Vector2(0, 0);
		}

		this.addComponent(new Component.DisplayContainer(this));
	}

	GameObject.prototype.setParent = function (parent) {
		if (parent == undefined) {
			return this.removeParent();
		}
		if (parent instanceof Core.GameObject && parent != this.parent) {
			if (this.parent instanceof Core.GameObject) {
				this.parent.removeChild(this);
			}
			this.parent = parent;
			parent.addChild(this);
		}
		return this;
	};

	GameObject.prototype.getParent = function () {
		return this.parent;
	};

	GameObject.prototype.removeParent = function () {
		var oldParent = this.parent;
		this.parent = undefined;

		if (oldParent instanceof Core.GameObject) {
			oldParent.removeChild(this);
		}
		return this;
	};

	GameObject.prototype.addChild = function (child) {
		if (child instanceof Core.GameObject) {
			child.setParent(this);
			if (this.children.indexOf(child) == -1) {
				this.children.push(child);
			}
		}
		return this;
	};

	GameObject.prototype.removeChild = function (child) {
		if (child instanceof Core.GameObject) {
			child.removeParent();
			var index = this.children.indexOf(child);
			if (index != -1) {
				this.children.splice(index, 1);
			}
		}
		return this;
	};

	GameObject.prototype.addComponent = function (component) {
		if (component instanceof Core.Component) {
			if (this.components.indexOf(component) == -1) {
				this.components.push(component);
				component.setGameObject(this);
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

	//simply pass the call on to all componants, then all children... really?!
	GameObject.prototype.Awake = function () {
		_.each(this.components, function (component) {
			component.Awake();
		});
		_.each(this.children, function (child) {
			child.Awake();
		});
	};
	//GameObject.prototype.Start = function () {};
	GameObject.prototype.Update = function () {
		_.each(this.components, function (component) {
			component.Update();
		});
		_.each(this.children, function (child) {
			child.Update();
		});
	};
	//GameObject.prototype.FixedUpdate = function () {};
	//GameObject.prototype.LateUpdate = function () {};
	//GameObject.prototype.OnGUI = function () {};
	//GameObject.prototype.OnDisable = function () {};
	//GameObject.prototype.OnEnabled = function () {};

	Core.GameObject = GameObject;
	return GameObject;
});
