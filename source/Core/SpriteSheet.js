define(
	'Core/SpriteSheet',
	['Core', 'underscore',
	],
	function (Core, _) {
	"use strict";
	function SpriteSheet(data) {
		this.framerate = data.framerate || 0;
		this.imageUris = data.imageUris || [];
		this.images = data.images || [];
		this.frames = data.frames || []; //FIXME: these are not frames as in easle which is a list of rects, here we just list the data.
		this.animations = data.animations || [];
	}

	Core.SpriteSheet = SpriteSheet;
	return SpriteSheet;
});
