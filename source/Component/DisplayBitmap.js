define(
	'Component/DisplayBitmap',
	['Component', 'easel', 
		'Component/EaselWrap', ],
	function (Component, createjs) {

	function DisplayBitmap(imageOrUri) {
		Component.EaselWrap.call(this);

		if (imageOrUri instanceof createjs.Bitmap || imageOrUri == undefined) {
			this.setWrapped(imageOrUri);
		} else {
			this.setWrapped(new createjs.Bitmap(imageOrUri));
		}
	}

	DisplayBitmap.prototype = Object.create(Component.EaselWrap.prototype);
	DisplayBitmap.prototype.constructor = DisplayBitmap;

	DisplayBitmap.prototype.getBitmapObject = function () {
		return this.getWrapped();
	};

	DisplayBitmap.prototype.setBitmapObject = function (wrapped) {
		return this.setWrapped(wrapped);
	};

	DisplayBitmap.prototype.setBitmap = function (imageOrUri) {
		return this.setWrapped(new createjs.Bitmap(imageOrUri));
	};

	DisplayBitmap.prototype.Awake = function () {
		var that = this;
	};

	Component.DisplayBitmap = DisplayBitmap;
	return DisplayBitmap;
});
