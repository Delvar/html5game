define(
	'Component/DisplayText',
	['Component', 'easel',
		'Component/EaselWrap'],
	function (Component, createjs) {

	function DisplayText(text, font, color) {
		Component.EaselWrap.call(this);
		this.setWrapped( new createjs.Text(text, font, color) );
	}

	DisplayText.prototype = Object.create(Component.EaselWrap.prototype);
	DisplayText.prototype.constructor = DisplayText;

	DisplayText.prototype.getTextObject = function () {
		return this.getWrapped();
	};

	DisplayText.prototype.setTextObject = function (wrapped) {
		return this.setWrapped(wrapped);
	};

	Component.DisplayText = DisplayText;
	return DisplayText;
});
