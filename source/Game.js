define(
	'Game',
	['EaselDisplay', 'FlightModule', 'underscore', 'Core', 
		'Core/Input', 'Core/Ticker', 'Core/Time',],
	function (EaselDisplay, FlightModule, _, Core) {
	"use strict";
	function Game(options, canvas) {
		
		canvas.addEventListener('click', function (event) {
			window.focus();
			this.focus();
		}, false);
		
		this.display = new EaselDisplay(canvas);
		
		Core.Time.physicsTicker = new Core.Ticker(Core.Ticker.RAF_SYNCHED);
		Core.Time.physicsTicker.setFPS(30);
		
		Core.Time.graphicsTicker = new Core.Ticker(Core.Ticker.RAF);
		//Core.Time.graphicsTicker.setFPS(60);
		
		Core.Time.updateTicker = new Core.Ticker(Core.Ticker.RAF_SYNCHED);
		Core.Time.updateTicker.setFPS(30);
		
		var defaults = {
			module: new FlightModule(this.display)
		};
		this.settings = _.extend(defaults, options);
	};

	Game.prototype.start = function () {
		this.settings.module.run();
	};

	return Game;
});
