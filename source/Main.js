
require.config({
	baseUrl: 'source',
	shim: {
		easel: {
			exports: 'createjs'
		},
		preload: {
			exports: 'createjs'
		},
		underscore: {
			exports: '_'
		}
	},
	paths: {
		easel: 'libs/easeljs-0.8.2.combined',
		preload: 'libs/preloadjs-0.6.2.combined',
		underscore: 'libs/underscore'
	}
});

requirejs(['Game'],
	function (Game) {
	    game = new Game();
	    game.start();
	}
);