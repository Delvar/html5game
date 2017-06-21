require.config({
	baseUrl: 'source',
	shim: {
		'easel': {
			exports: 'createjs',
		},
		'preload': {
			deps: ['easel'],
			exports: 'createjs'
		},
		'underscore': {
			exportsx: '_',
		}
	},
	paths: {
		easel: 'libs/easeljs-0.8.2.combined',
		preload: 'libs/preloadjs-0.6.2.combined',
		underscore: 'libs/underscore'
	}
});

requirejs(['DemoGame'],
	function (DemoGame) {
	game = new DemoGame();
	game.start();
});
