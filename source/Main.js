//NOTE to self: look at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal

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
			exports: '_',
		}
	},
	paths: {
		easel: 'libs/easeljs-0.8.2.combined',
		preload: 'libs/preloadjs-0.6.2.combined',
		//underscore: 'libs/underscore', // migrated to lodash, the clone function seems to actualy work.
		underscore: 'libs/lodash-4.17.4'
	}
});

requirejs(['Game'],
	function (Game) {
	game = new Game({}, document.getElementById("canvas"));
	game.start();
});
