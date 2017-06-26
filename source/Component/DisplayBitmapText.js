define(
	'Component/DisplayBitmapText',
	['Core', 'Component', 'easel',
		'Core/Vector2', 'Core/SpriteSheet', 'Component/DisplayItem', ],
	function (Core, Component, createjs) {
	"use strict";
	function DisplayBitmapText(text, spriteSheet) {
		Component.DisplayItem.call(this);
		this.text = text;
		this.spriteSheet = spriteSheet; //FIXME: check that this is a valid spriteSheet
		this.centerPosition = new Core.Vector2(0, 0);
	}

	DisplayBitmapText.prototype = Object.create(Component.DisplayItem.prototype);
	DisplayBitmapText.prototype.constructor = DisplayBitmapText;

	Component.DisplayBitmapText = DisplayBitmapText;
	return DisplayBitmapText;
});
