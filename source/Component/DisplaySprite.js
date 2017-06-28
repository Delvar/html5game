define(
	'Component/DisplaySprite',
	['Core', 'Component', 'easel',
		'Core/Vector2', 'Component/DisplayItem', ],
	function (Core, Component, createjs) {
	"use strict";
	function DisplaySprite(spriteSheet, frameOrAnimation) {
		Component.DisplayItem.call(this);
		this.spriteSheet = spriteSheet;
		this.frameOrAnimation = frameOrAnimation;
		this.paused = false;
	}

	DisplaySprite.prototype = Object.create(Component.DisplayItem.prototype);
	DisplaySprite.prototype.constructor = DisplaySprite;

	Component.DisplaySprite = DisplaySprite;
	return DisplaySprite;
});
