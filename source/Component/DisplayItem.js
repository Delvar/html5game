define(
	'Component/DisplayItem',
	['Core', 'Component',
		'Core/Component'],
	function (Core, Component) {
	"use strict";
	function DisplayItem() {
		Core.Component.call(this);
		this.centerPosition = new Core.Vector2(0, 0);
		this.offset = new Core.Vector2(0, 0);
		this.rotation = 0;
		this.scale = new Core.Vector2(1, 1);
	}

	DisplayItem.prototype = Object.create(Core.Component.prototype);
	DisplayItem.prototype.constructor = DisplayItem;

	Component.DisplayItem = DisplayItem;
	return DisplayItem;
});
