define(
	'Component/DisplayBitmap',
	['Core', 'Component', 'easel',
		'Core/Vector2', 'Component/DisplayItem', ],
	function (Core, Component, createjs) {
	"use strict";
	function DisplayBitmap(imageUri) {
		Component.DisplayItem.call(this);
		this.imageUri = imageUri;
		this.image = undefined;
		this.centerPosition = new Core.Vector2(0, 0);
		this.autoCenter = true;
	}

	DisplayBitmap.prototype = Object.create(Component.DisplayItem.prototype);
	DisplayBitmap.prototype.constructor = DisplayBitmap;

	Component.DisplayBitmap = DisplayBitmap;
	return DisplayBitmap;
});
