define(
	'Component/DisplayItem',
	['Core', 'Component',
		'Core/Component'],
	function (Core, Component) {
	"use strict";
	function DisplayItem(text, font, color) {
		Core.Component.call(this);
		this.centerPosition = new Core.Vector2(0, 0);
	}

	DisplayItem.prototype = Object.create(Core.Component.prototype);
	DisplayItem.prototype.constructor = DisplayItem;

	Component.DisplayItem = DisplayItem;
	return DisplayItem;
});
