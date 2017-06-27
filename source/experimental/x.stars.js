var stage, canvasWidth, canvasHeight, loader;
var fpsText;
var smallfighter;
var starFieldLayers = [];
var starField = [];
var starFieldOuterBand = 20;

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

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
	var r,
	g,
	b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0)
				t += 1;
			if (t > 1)
				t -= 1;
			if (t < 1 / 6)
				return p + (q - p) * 6 * t;
			if (t < 1 / 2)
				return q;
			if (t < 2 / 3)
				return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b) {
	r /= 255,
	g /= 255,
	b /= 255;
	var max = Math.max(r, g, b),
	min = Math.min(r, g, b);
	var h,
	s,
	l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
		case r:
			h = (g - b) / d + (g < b ? 6 : 0);
			break;
		case g:
			h = (b - r) / d + 2;
			break;
		case b:
			h = (r - g) / d + 4;
			break;
		}
		h /= 6;
	}

	return [h, s, l];
}

function setupStarField() {}

function handleComplete() {
	var i,
	j;
	var starFieldLayerCount = 6;
	var starDensity = (canvasWidth * canvasHeight) / 122368;
	var starDensityLayerRatio = 2;

	var c;

	var b1 = starFieldOuterBand;
	var b2 = b1 * 2;

	starField = new createjs.Container();
	for (i = 0; i < starFieldLayerCount; i++) {
		var starFieldLayer = new createjs.Container();
		starFieldLayers[i] = starFieldLayer;

		var ii = (starFieldLayerCount - i);
		var starCount = starDensity * starDensityLayerRatio * ii * ii;

		console.log("starDensity: " + starDensity + " i: " + i + " ii: " + ii + " starCount: " + starCount);

		for (j = 0; j < starCount; j++) {
			var radiusRange = (i + 2) * 0.5;
			var centerRadius = (i + 1) + (Math.random() * radiusRange);
			var brightness = (Math.random() * 0.25) + 0.75;
			var pointyness = (brightness * 0.1) + 0.8;
			var outerRadius = centerRadius + (brightness * 2);

			var hue = Math.round(Math.random() * 360) / 360;
			var saturation = Math.round(Math.random() * 100) / 100;
			var lightness = brightness; //(70 + Math.round(Math.random() * 30)) / 100;

			var c = hslToRgb(hue, saturation, lightness);
			var cs1 = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ",1)";
			var cs2 = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ",1)";

			var px = (Math.random() * (canvasWidth + b2)) - b1;
			var py = (Math.random() * (canvasHeight + b2)) - b1;

			var cx = outerRadius;
			var cy = outerRadius;

			var sides = 5 + Math.round(Math.random() * 2);
			var angle = Math.random() * 360;

			var star = new createjs.Shape();
			star.graphics.beginRadialGradientFill([cs1, cs1, cs2], [0, 0.1, 1], 0, 0, centerRadius, 0, 0, outerRadius / 2).drawPolyStar(0, 0, outerRadius, sides, pointyness, angle);
			star.x = px;
			star.y = py;

			var blurFilter;

			if (ii == 2) {
				blurFilter = new createjs.BlurFilter(6, 6, 3);
			} else if (ii == 1) {
				blurFilter = new createjs.BlurFilter(10, 10, 4);
			} else {
				blurFilter = new createjs.BlurFilter(1, 1, 2);
			}
			star.filters = [blurFilter];

			var bounds = blurFilter.getBounds();
			star.cache( - (outerRadius + bounds.x),  - (outerRadius + bounds.y), (2 * outerRadius) + bounds.width, (2 * outerRadius) + bounds.height);

			starFieldLayer.addChild(star);
		}
		starField.addChild(starFieldLayer);
	}

	stage.addChild(starField);

	smallfighter = new createjs.Bitmap(loader.getResult("smallfighter"));
	smallfighter.x = canvasWidth / 2;
	smallfighter.y = canvasHeight / 2;
	smallfighter.regX = smallfighter.image.width / 2;
	smallfighter.regY = smallfighter.image.height / 2;

	stage.addChild(smallfighter);

	fpsText = new createjs.Text("-", "20px Arial", "#ff7700");
	fpsText.x = 10;
	fpsText.y = 20;
	fpsText.textBaseline = "alphabetic";
	stage.addChild(fpsText);

	//createjs.Ticker.setFPS(30);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {

	fpsText.text = (createjs.Ticker.getMeasuredFPS()).toFixed(2);

	smallfighter.rotation = (smallfighter.rotation + Math.sin(event.runTime / 5000)) % 360;
	//smallfighter.scaleX = smallfighter.scaleY = 0.2 + ((Math.sin(smallfighter.rotation / 100) + 1) * 0.4);

	var i,
	j,
	l,
	m;
	l = starFieldLayers.length;

	var axisCheck = function (aMin, aMax, a) {
		if (a > aMax) {
			return 1;
		} else if (a < aMin) {
			return -1;
		}
		return 0;
	}

	var moveStar = function (star, dx, dy) {
		var b1 = starFieldOuterBand;
		var b2 = b1 * 2;

		var x = star.x + dx;
		var y = star.y + dy;

		var xt = axisCheck(-b2, canvasWidth + b2, x);
		var yt = axisCheck(-b2, canvasHeight + b2, y);

		if (xt == 1) {
			x = -b1;
			y = (Math.random() * (canvasHeight + b2) - b1);
		}
		if (xt == -1) {
			x = canvasWidth + b1;
			y = (Math.random() * (canvasHeight + b2) - b1);
		}

		if (yt == 1) {
			y = -b1;
			x = (Math.random() * (canvasWidth + b2) - b1);
		}
		if (yt == -1) {
			y = canvasHeight + b1;
			x = (Math.random() * (canvasWidth + b2) - b1);
		}

		star.x = x;
		star.y = y;
	}

	var speed = 10 + ((Math.sin(event.runTime / 7000) + 1) * 0.5 * 30);
	speed = (speed / 50) * event.delta;
	var a = (90 + smallfighter.rotation) * Math.PI / 180;
	var dx = (speed * Math.cos(a));
	var dy = (speed * Math.sin(a));

	for (i = 0; i < l; i++) {
		var dx2 = dx / (l - i);
		var dy2 = dy / (l - i);
		var m = starFieldLayers[i].numChildren;
		for (j = 0; j < m; j++) {

			moveStar(starFieldLayers[i].getChildAt(j), dx2, dy2);
		}
	}

	stage.update(event);
}

window.addEventListener('resize', resize, false);

function resize() {
	stage.canvas.width = canvasWidth = window.innerWidth;
	stage.canvas.height = canvasHeight = window.innerHeight;
	if (smallfighter) {
		smallfighter.x = canvasWidth / 2;
		smallfighter.y = canvasHeight / 2;
	}
}
