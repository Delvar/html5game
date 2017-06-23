define(
	'Component/DisplayBitmap',
	['Component', 'easel',
		'Component/DisplayItem', ],
	function (Component, createjs) {
	function DisplayBitmap(imageUri) {
		Component.DisplayItem.call(this);
		this.imageUri = imageUri;
	}

	DisplayBitmap.prototype = Object.create(Component.DisplayItem.prototype);
	DisplayBitmap.prototype.constructor = DisplayBitmap;

	Component.DisplayBitmap = DisplayBitmap;
	return DisplayBitmap;
});
