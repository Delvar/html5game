define(
	'Component/DisplayItem',
	['Core', 'Component',
		'Core/Component'],
	function (Core, Component) {

	function DisplayItem(text, font, color) {
		Core.Component.call(this);
		this.wrapped = undefined;
	}

	DisplayItem.prototype = Object.create(Core.Component.prototype);
	DisplayItem.prototype.constructor = DisplayItem;

	DisplayItem.prototype.getWrapped = function () {
		return this.wrapped;
	};

	DisplayItem.prototype.setWrapped = function (wrapped) {
		this.wrapped = wrapped;
		return this;
	};

	Component.DisplayItem = DisplayItem;
	return DisplayItem;
});
