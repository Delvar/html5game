define(
    'DemoGame',
    ['DemoEaselDisplay', 'DemoModule', 'underscore'],
    function (DemoEaselDisplay, DemoModule, _) {
        function DemoGame (options) {
			this.display = new DemoEaselDisplay();
			var defaults = {
                module: new DemoModule(this.display)
            };
            this.settings = _.extend(defaults, options);
        };

        DemoGame.prototype.start = function() {
			this.settings.module.run();
        };

        return DemoGame;
    }
);