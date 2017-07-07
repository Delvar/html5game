/*
Look at this shit!
http://wwwtyro.net/2016/10/22/2D-space-scene-procgen.html
http://wwwtyro.github.io/procedural.js/space/main.js
 */

require.config({
	baseUrl: 'source'
});

requirejs(['Noise', 'Random',
		'Noise/Perlin', 'Noise/Simplex', 'Noise/Blender', 'Random/SeedRandom'],
	function (Noise, Random) {

	seedRandom = new Random.SeedRandom();
	var prng = function () {
		return seedRandom.random();
	};

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

	function hslToColour(h, s, l, a) {
		var r,
		g,
		b;
		a=a==undefined?1:a;

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

		return new Colour(r, g, b, a);
	}

	function clamp(min, v, max) {
		return Math.max(min, Math.min(v, max));
	}

	function normalizeFloatArray(floatArray, toMin, toMax) {
		var min = 0;
		var max = 0;
		var i,
		l = floatArray.length;
		for (i = 0; i < l; i++) {
			if (floatArray[i] < min) {
				min = floatArray[i];
			} else if (floatArray[i] > max) {
				max = floatArray[i];
			}
		}
		var range = toMax - toMin;
		var ratio = range / (max - min);

		for (i = 0; i < l; i++) {
			floatArray[i] = ((floatArray[i] - min) * ratio) + toMin;
		}
	}

	var floatArrayToImageDataUint8 = function (floatArray, imageDataUint8) {
		var i,
		j,
		l,
		t;
		for (i = 0, j = 0, l = imageDataUint8.length; i < l; i += 4, j++) {
			t = floatArray[j] || 0;
			t = clamp(0, t, 1);
			imageDataUint8[i] = Math.floor(t * 256);
			imageDataUint8[i + 1] = Math.floor(t * 256);
			imageDataUint8[i + 2] = Math.floor(t * 256);
			imageDataUint8[i + 3] = 256;
		}
	}

	var floatArrayToCanvas = function (floatArray, canvas) {
		imageDataUint8 = new Uint8ClampedArray(canvas.width * canvas.height * 4);
		floatArrayToImageDataUint8(floatArray, imageDataUint8);
		var context = canvas.getContext("2d");
		context.putImageData(new ImageData(imageDataUint8, canvas.width, canvas.height), 0, 0);
	}

	var colourArrayToImageDataUint8 = function (colourArray, imageDataUint8) {
		var i,
		j,
		l,
		t;
		for (i = 0, j = 0, l = imageDataUint8.length; i < l; i += 4, j++) {
			t = colourArray[j] || new Colour(0, 0, 0, 1);
			imageDataUint8[i] = Math.floor(t.r * 256);
			imageDataUint8[i + 1] = Math.floor(t.g * 256);
			imageDataUint8[i + 2] = Math.floor(t.b * 256);
			imageDataUint8[i + 3] = Math.floor(t.a * 256);
		}
	}

	var colourArrayToCanvas = function (colourArray, canvas) {
		imageDataUint8 = new Uint8ClampedArray(canvas.width * canvas.height * 4);
		colourArrayToImageDataUint8(colourArray, imageDataUint8);
		var context = canvas.getContext("2d");
		context.putImageData(new ImageData(imageDataUint8, canvas.width, canvas.height), 0, 0);
	}

	var mixToCanvasToCanvas = function (sourceCanvas, destinationCanvas) {
		var context = destinationCanvas.getContext("2d");
		context.drawImage(sourceCanvas, 0, 0);
	}

	function getDistortion(x, y, z, distortion, distortionScale, noisefunc) {
		var rv1,
		rv2,
		rv3 = 0;
		/* get a random vector and scale the randomization */
		rv0 = noisefunc((x + 13.5) * distortionScale, (y + 13.5) * distortionScale, (z + 13.5) * distortionScale) * distortion;
		rv1 = noisefunc((x) * distortionScale, (y) * distortionScale, (z) * distortionScale) * distortion;
		rv2 = noisefunc((x - 13.5) * distortionScale, (y - 13.5) * distortionScale, (z - 13.5) * distortionScale) * distortion;
		return {
			x: x + rv0,
			y: y + rv1,
			z: z + rv2
		};
	}

	function nebulaDensityNoise(x, y, z, H, lacunarity, octaves, offset, noisefunc, distortion, distortionScale, distortfunk) {
		var value,
		increment,
		rmd;
		var i;
		var pwHL = Math.pow(lacunarity, -H);
		var pwr = pwHL; /* starts with i=1 instead of 0 */

		var d = getDistortion(x, y, z, distortion, distortionScale, distortfunk);
		//x = d.x;
		//y = d.y;
		//z = d.z;
		/* first unscaled octave of function; later octaves are scaled */
		value = offset + noisefunc(d.x, d.y, d.z);
		//value = offset + noisefunc(x, y, z);
		x *= lacunarity;
		y *= lacunarity;
		z *= lacunarity;

		for (i = 1; i < Math.floor(octaves); i++) {
			var d = getDistortion(x, y, z, distortion, distortionScale, distortfunk);
			increment = (noisefunc(d.x, d.y, d.z) + offset) * pwr * value;
			value += increment;
			pwr *= pwHL;
			x *= lacunarity;
			y *= lacunarity;
			z *= lacunarity;
		}

		rmd = octaves - Math.floor(octaves);
		if (rmd != 0.0) {
			increment = (noisefunc(x, y, z) + offset) * pwr * value;
			value += rmd * increment;
		}
		return value; ///(octaves*octaves);
	}

	function randomBetween(min, max) {
		if (min > max) {
			var t = max;
			max = min;
			min = t;
		}
		var range = max - min;
		return min + prng() * range;
	}

	function generateNebulaDensity(canvas, s) {
		var m = new Float32Array(canvas.width * canvas.height);
		for (var x = 0, j = 0; x < canvas.height; x++) {
			for (var y = 0; y < canvas.width; y++, j++) {
				m[j] = nebulaDensityNoise(s.dx + x / s.scale, s.dy + y / s.scale, 0, s.h, s.lacunarity, s.octaves, s.offset, Noise.Blender.voronoi_F1, s.distortion, s.distortionScale, Noise.perlin2);
				m[j] = Math.pow(m[j],s.exponent);
			}
		}
		return m;
	}

	function generateNebula(canvas, nebulaDensity, s) {
		var m = new Array(canvas.width * canvas.height); //new Float32Array(s.width * s.height);

		for (var x = 0, j = 0; x < canvas.height; x++) {
			for (var y = 0; y < canvas.width; y++, j++) {
				m[j] = hslToColour(s.h,s.s,(nebulaDensity[j]*0.5+0.5)*s.l,nebulaDensity[j]*s.a);//new Colour(nebulaDensity[j]*s.r, nebulaDensity[j]*s.g, nebulaDensity[j]*s.b, nebulaDensity[j]*s.a);
				//m[j] = new Colour(s.r, s.g, s.b, nebulaDensity[j]*s.a);
			}
		}
		return m;
	};

	var settings = {
		star: {
			density: randomBetween(0.01, 0.05),
			brightness: randomBetween(0.1, 0.2)
		},
	};

	var nebulaCount = 3;
	for (var i=1; i<=nebulaCount;i++) {
		settings['nebulaDensity'+i] = {
			scale: randomBetween(100,2000), //1 / randomBetween(200, 5000),
			h: randomBetween(0.1, 0.5),
			lacunarity: 1.5,
			octaves: 8,
			dx: randomBetween(0, 500),
			dy: randomBetween(0, 500),
			exponent: 1+prng()*2,
			offset: randomBetween(-0.2, 0.2),
			distortion: randomBetween(1, 2),
			distortionScale: randomBetween(1, 2),
		};
		settings['nebula'+i] = {
			h: randomBetween(0, 1),
			s: randomBetween(0.5, 1),
			l: randomBetween(0, 1),
			a: randomBetween(0, 1),
		};
	}
	
	var canvasNames = ['stars', 'nebulaDensity1', 'nebulaDensity2', 'nebulaDensity3', 'nebula1', 'nebula2', 'nebula3', 'main'];
	var c = {};
	var l = {};
	for (var i = 0; i < canvasNames.length; i++) {
		var name = canvasNames[i];
		var canvas = document.getElementById(name);
		c[name] = canvas;
	}

	// Random stars
	l.stars = (
		function (canvas, s) {
		var wxh = canvas.width * canvas.height;
		var count = Math.round(wxh * s.density);
		var m = new Array(wxh);
		for (var i = 0; i < count; i++) {
			var p = Math.floor(prng() * wxh);
			var hue = Math.round(prng() * 360) / 360;
			var saturation = (prng() * 0.3);
			var lightness = Math.log(1 - prng()) * -s.brightness;
			m[p] = hslToColour(hue, saturation, lightness);
		}

		return m;
	})(c.stars, settings.star);
	colourArrayToCanvas(l.stars, c.stars);

	// --------------
	l.nebulaDensity1 = generateNebulaDensity(c.nebulaDensity1, settings.nebulaDensity1);
	normalizeFloatArray(l.nebulaDensity1, 0, 1);
	floatArrayToCanvas(l.nebulaDensity1, c.nebulaDensity1);

	l.nebulaDensity2 = generateNebulaDensity(c.nebulaDensity2, settings.nebulaDensity2);
	normalizeFloatArray(l.nebulaDensity2, 0, 1);
	floatArrayToCanvas(l.nebulaDensity2, c.nebulaDensity2);

	l.nebulaDensity3 = generateNebulaDensity(c.nebulaDensity3, settings.nebulaDensity3);
	normalizeFloatArray(l.nebulaDensity3, 0, 1);
	floatArrayToCanvas(l.nebulaDensity3, c.nebulaDensity3);
	// --------------

	// --------------
	l.nebula1 = generateNebula(c.nebula1, l.nebulaDensity1, settings.nebula1);
	colourArrayToCanvas(l.nebula1, c.nebula1);

	l.nebula2 = generateNebula(c.nebula2, l.nebulaDensity2, settings.nebula2);
	colourArrayToCanvas(l.nebula2, c.nebula2);

	l.nebula3 = generateNebula(c.nebula3, l.nebulaDensity3, settings.nebula3);
	colourArrayToCanvas(l.nebula3, c.nebula3);
	// --------------


	mixToCanvasToCanvas(c.stars, c.main);
	mixToCanvasToCanvas(c.nebula1, c.main);
	mixToCanvasToCanvas(c.nebula2, c.main);
	mixToCanvasToCanvas(c.nebula3, c.main);
});
