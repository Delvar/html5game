define(
	'Script/ParalaxStars',
	['Core', 'Component', 'Script',
		'Component/Script', 'Core/Vector2', 'Component/Camera'],
	function (Core, Component, Script) {
	"use strict";
	function ParalaxStars() {
		Component.Script.call(this);
		this.gridSize = 1;
		this.tileSize = new Core.Vector2(512, 512);
		this.target = undefined;

		this.scene = undefined;
	}

	ParalaxStars.prototype = Object.create(Component.Script.prototype);
	ParalaxStars.prototype.constructor = ParalaxStars;

	ParalaxStars.prototype.Awake = function () {
		this.scene = this.scene || this.gameObject.getScene();
		if (this.scene == undefined) {
			return;
		}

		var cameraGo = this.scene.getMainCamera();
		if (cameraGo == undefined) {
			return;
		}

		this.target = this.target || cameraGo;

		this.camera = cameraGo.getComponentsByType(Component.Camera)[0];

		this.gameObject.transform.localPosition = this.camera.displaySize.multiply(0.5);
	}

	ParalaxStars.prototype.LateUpdate = function () {
		if (this.scene == undefined || this.camera == undefined || this.target == undefined) {
			return;
		}

		var interp = (Core.Time.updateTicker._lastTime - Core.Time.physicsTicker._lastTime)/1000;
		
		var matrix = this.target.transform.getConcatenatedMatrix(new Core.Matrix3x3(), interp);

		var d = matrix.decompose();

		var rotation = 0;

		if (this.camera.rotateWorld) {
			rotation = -d.rotation;
		}

		var scale;

		if (this.camera.scaleWorld) {
			scale = new Core.Vector2(this.camera.zoomLevel, this.camera.zoomLevel);
		} else {
			scale = new Core.Vector2(1, 1);
		}

		this.gameObject.transform.localRotation = rotation;
		this.gameObject.transform.localScale = scale.clone();

		var layers = this.gameObject.transform.children;
		var l = layers.length;
		for (var i = 0; i < l; i++) {
			var displace

			if (this.camera.displaceWorld) {
				var t = (1 / (l - i));
				displace = new Core.Vector2(d.x * t, d.y * t);
			} else {
				displace = new Core.Vector2(0, 0);
			}

			layers[i].centerPosition = displace;

			var tilePos = new Core.Vector2(displace.x / this.tileSize.x, displace.y / this.tileSize.y);

			for (var j = 0, x = 0; x < this.gridSize; x++) {
				for (var y = 0; y < this.gridSize; y++, j++) {
					layers[i].children[j].localPosition = new Core.Vector2((((Math.floor((tilePos.x + ((this.gridSize - 1) - x)) / this.gridSize) * this.gridSize) + x) - (this.gridSize / 2)) * this.tileSize.x,
							(((Math.floor((tilePos.y + ((this.gridSize - 1) - y)) / this.gridSize) * this.gridSize) + y) - (this.gridSize / 2)) * this.tileSize.y);
				}
			}
		}

	}

	Script.ParalaxStars = ParalaxStars;
	return ParalaxStars;
});
