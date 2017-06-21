define(
	'Game',
	['EaselDisplay', 'FlightModule', 'underscore'],
	function (EaselDisplay, FlightModule, _) {
	function Game(options) {
		this.display = new EaselDisplay();
		var defaults = {
			module: new FlightModule(this.display, this.options)
		};
		this.settings = _.extend(defaults, options);
	};

	Game.prototype.start = function () {
		this.settings.module.run();
	};

	return Game;
});
