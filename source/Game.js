define(
	'Game',
	['EaselDisplay', 'FlightModule', 'underscore', 'Core',
		'Core/Input'],
	function (EaselDisplay, FlightModule, _, Core) {
	"use strict";
	function Game(options, canvas) {
		canvas.addEventListener('click', function (event) {
			window.focus();
			this.focus();
		}, false);
		this.display = new EaselDisplay(canvas);
		this.input = Core.Input;
		var defaults = {
			module: new FlightModule(this.display, this.input)
		};
		this.settings = _.extend(defaults, options);
	};

	Game.prototype.start = function () {
		this.settings.module.run();
	};

	return Game;
});
