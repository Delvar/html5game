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

		var cameraGo = this.scene.getCamera();
		if (cameraGo == undefined) {
			return;
		}

		this.target = this.target || cameraGo;

		this.camera = cameraGo.getComponentsByType(Component.Camera)[0];

		this.gameObject.transform.localPosition.set(new Core.Vector2(this.camera.displaySize).multiply(0.5));
	}

	ParalaxStars.prototype.LateUpdate = function () {
		if (this.scene == undefined || this.camera == undefined || this.target == undefined) {
			return;
		}

		var matrix = this.target.transform.getConcatenatedMatrix(new Core.Matrix3x3());

		var d = matrix.decompose();

		var rotation = 0;

		if (this.camera.rotateWorld) {
			rotation = -d.rotation;
		}

		var scale = new Core.Vector2(1, 1);

		if (this.camera.scaleWorld) {
			scale.set(this.camera.zoomLevel, this.camera.zoomLevel);
		}

		this.gameObject.transform.localRotation = rotation;
		this.gameObject.transform.localScale.set(scale);

		var layers = this.gameObject.transform.children;
		var l = layers.length;
		for (var i = 0; i < l; i++) {
			var displace = new Core.Vector2(0, 0);
			if (this.camera.displaceWorld) {
				displace.x = d.x * (1 / (l - i));
				displace.y = d.y * (1 / (l - i));
			}

			layers[i].centerPosition.set(displace);

			var tilePos = new Core.Vector2(displace);
			tilePos.x = Math.floor(tilePos.x / this.tileSize.x);
			tilePos.y = Math.floor(tilePos.y / this.tileSize.y);
			var tilePos2 = new Core.Vector2(tilePos);

			for (var j = 0, x = 0; x < this.gridSize; x++) {
				for (var y = 0; y < this.gridSize; y++, j++) {
					var tile = layers[i].children[j];
					tile.localPosition.x = (((Math.floor((tilePos.x + ((this.gridSize - 1) - x)) / this.gridSize) * this.gridSize) + x) - (this.gridSize / 2)) * this.tileSize.x;
					tile.localPosition.y = (((Math.floor((tilePos.y + ((this.gridSize - 1) - y)) / this.gridSize) * this.gridSize) + y) - (this.gridSize / 2)) * this.tileSize.y;
				}
			}
		}

	}

	Script.ParalaxStars = ParalaxStars;
	return ParalaxStars;
});
