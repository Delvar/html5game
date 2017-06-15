var stage, w, h, loader;
var smallfighter;

function init() {
	stage = new createjs.Stage("testCanvas");
	resize();

	manifest = [{
			src: "smallfighter0006.png",
			id: "smallfighter"
		}
	];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest, true, "images/ships/MillionthVector/smallfighter/");
}

function handleComplete() {
	smallfighter = new createjs.Bitmap(loader.getResult("smallfighter"));
	smallfighter.x = w / 2;
	smallfighter.y = h / 2;
	smallfighter.regX = smallfighter.image.width / 2;
	smallfighter.regY = smallfighter.image.height / 2;

	stage.addChild(smallfighter);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	smallfighter.rotation = smallfighter.rotation + 1;
	smallfighter.scaleX = smallfighter.scaleY = 0.2 + ((Math.sin(smallfighter.rotation / 100) + 1) * 0.4);
	stage.update(event);
}

window.addEventListener('resize', resize, false);

function resize() {
	stage.canvas.width = w = window.innerWidth;
	stage.canvas.height = h = window.innerHeight;
	if (smallfighter) {
		smallfighter.x = w / 2;
		smallfighter.y = h / 2;
	}
}
