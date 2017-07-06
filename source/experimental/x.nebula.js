/*
Look at this shit!
http://wwwtyro.net/2016/10/22/2D-space-scene-procgen.html
http://wwwtyro.github.io/procedural.js/space/main.js
 */

require.config({
	baseUrl: 'source'
});

requirejs(['Noise', 'Random',
		'Noise/Perlin', 'Noise/Simplex', 'Random/SeedRandom'],
	function (Noise, Random) {

	seedRandom = new Random.SeedRandom("seed");
	var prng = function() { return seedRandom.random(); };
	
	var s = {
		density: 0.5,
		brightness: 0.5
	};
	var l = {};

	var rgba = function (r, g, b, a) {
		r = Math.floor(r * 255);
		g = Math.floor(g * 255);
		b = Math.floor(b * 255);
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	}

	var Colour = function (r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;

		return this;
	};

	//var c = new Colour(0.1, 0.2, 0.3, 1);

	
	
	

	var canvas = document.getElementById("canvas");
	var width = s.width = canvas.width;
	var height = s.height = canvas.height;
	var context = canvas.getContext("2d");
	context.fillStyle = rgba(0, 0, 0, 1);
	context.fillRect(0, 0, width, height);

	// Random stars
	l.stars = (
		function () {
		var count = Math.round(s.width * s.height * s.density);
		var m = [];//new Float32Array(s.width * s.height);
		for (var i = 0; i < count; i++) {
			var r = Math.floor(prng() * s.width * s.height);
			var c = Math.round(Math.log(1 - prng()) * -s.brightness);
			m[r] = c;
		}

		return m;
	})();

	console.log(l);

});
