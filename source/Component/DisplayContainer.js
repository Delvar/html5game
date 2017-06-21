define(
	'Component/DisplayContainer',
	['Component', 'easel',
		'Component/EaselWrap'],
	function (Component, createjs) {

	function DisplayContainer() {
		Component.EaselWrap.call(this);
		this.setWrapped(new createjs.Container());
	}

	DisplayContainer.prototype = Object.create(Component.EaselWrap.prototype);
	DisplayContainer.prototype.constructor = DisplayContainer;

	DisplayContainer.prototype.getContainerObject = function () {
		return this.getWrapped();
	};

	DisplayContainer.prototype.setContainerObject = function (wrapped) {
		return this.setWrapped(wrapped);
	};

	DisplayContainer.prototype.Awake = function () {
		var that = this;
		//FIXME: needs to be moved out to cammera functions for world to screen space/scale conversion.
		this.wrapped.x = this.gameObject.position.x;
		this.wrapped.y = this.gameObject.position.y;

		_.each(this.gameObject.getComponentsByType(Component.EaselWrap), function (easelWrap) {
			if (!(easelWrap instanceof Component.DisplayContainer)) {
				that.wrapped.addChild(easelWrap.getWrapped());
			}
		});

		//for each child game game object we go and get the containers and append to our container.
		_.each(this.gameObject.children, function (child) {
			_.each(child.getComponentsByType(Component.DisplayContainer), function (displayContainer) {
				that.wrapped.addChild(displayContainer.getContainerObject());
			});
		});
	};
	Component.DisplayContainer = DisplayContainer;
	return DisplayContainer;
});
