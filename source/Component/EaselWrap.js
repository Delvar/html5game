define(
	'Component/EaselWrap',
	['Core', 'Component', 'easel',
		'Core/Component'],
	function (Core, Component, createjs) {

	function EaselWrap(text, font, color) {
		Core.Component.call(this);
		this.wrapped = undefined;
	}

	EaselWrap.prototype = Object.create(Core.Component.prototype);
	EaselWrap.prototype.constructor = EaselWrap;

	EaselWrap.prototype.getWrapped = function () {
		return this.wrapped;
	};

	EaselWrap.prototype.setWrapped = function (wrapped) {
		this.wrapped = wrapped;
		return this;
	};

	Component.EaselWrap = EaselWrap;
	return EaselWrap;
});
