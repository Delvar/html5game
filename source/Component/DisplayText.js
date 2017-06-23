define(
	'Component/DisplayText',
	['Component',
		'Component/DisplayItem'],
	function (Component) {

	function DisplayText(text, font, color) {
		Component.DisplayItem.call(this);
		this.text = text;
		this.font = font;
		this.color = color;
	}

	DisplayText.prototype = Object.create(Component.DisplayItem.prototype);
	DisplayText.prototype.constructor = DisplayText;

	Component.DisplayText = DisplayText;
	return DisplayText;
});
