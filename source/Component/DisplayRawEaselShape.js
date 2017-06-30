define(
	'Component/DisplayRawEaselShape',
	['Core', 'Component', 'easel',
		'Core/Vector2', 'Component/DisplayItem', ],
	function (Core, Component, createjs) {
	"use strict";
	function DisplayRawEaselShape() {
		Component.DisplayItem.call(this);
		this.shape = undefined;
	}

	DisplayRawEaselShape.prototype = Object.create(Component.DisplayItem.prototype);
	DisplayRawEaselShape.prototype.constructor = DisplayRawEaselShape;

	Component.DisplayRawEaselShape = DisplayRawEaselShape;
	return DisplayRawEaselShape;
});
