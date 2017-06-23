define(
	'Game',
	['EaselDisplay', 'FlightModule', 'underscore'],
	function (EaselDisplay, FlightModule, _) {
	function Game(options, canvas) {
		this.display = new EaselDisplay(canvas);
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
