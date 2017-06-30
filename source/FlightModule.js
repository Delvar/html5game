define(
	'FlightModule',
	['underscore', 'easel', 'Core', 'Component',
		'Core/Vector2', 'Core/Vector3', 'Core/Vector4', 'Core/GameObject', 'Core/Scene', 'Core/Time', 'Core/SpriteSheet', 'Core/Input', 'Component/DisplaySprite',
		'Component/Camera', 'Component/DisplayBitmap', 'Component/DisplayText'],
	function (_, createjs, Core, Component) {
	"use strict";
	function FlightModule(display) {
		this.display = display;
	}

	FlightModule.prototype.run = function () {
		var scene = new Core.Scene();

		var go1 = new Core.GameObject('go1');

		var starsGo = setupStars(go1);
		starsGo.transform.setParent(scene.transform);

		var world = new Core.GameObject("World");
		world.transform.setParent(scene.transform);

		var gui = new Core.GameObject("GUI");
		gui.transform.setParent(scene.transform);

		go1.transform.localPosition.set(0, 0);

		go1.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		go1.transform.setParent(world.transform);

		go1.transform.Update = function () {
			Component.Transform.prototype.Update.call(this);
			if (Core.Input.isDown("W".charCodeAt(0)) || Core.Input.isDown(38)) {
				this.localPosition.add(this.forward.multiply(Core.Time.deltaSeconds * 512));
			}
			if (Core.Input.isDown("S".charCodeAt(0)) || Core.Input.isDown(40)) {
				this.localPosition.add(this.forward.multiply(Core.Time.deltaSeconds * -512));
			}
			if (Core.Input.isDown("A".charCodeAt(0))) {
				this.localPosition.add(this.right.multiply(Core.Time.deltaSeconds * -512));
			}
			if (Core.Input.isDown("D".charCodeAt(0))) {
				this.localPosition.add(this.right.multiply(Core.Time.deltaSeconds * 512));
			}
			if (Core.Input.isDown(37)) {
				this.localRotation -= Core.Time.deltaSeconds * 180;
			}
			if (Core.Input.isDown(39)) {
				this.localRotation += Core.Time.deltaSeconds * 180;
			}
		}

		var cameraGo = new Core.GameObject('camera');
		var cameraCom = new Component.Camera();
		cameraGo.addComponent(cameraCom);
		cameraGo.transform.setParent(go1.transform);
		cameraCom.setTarget(world.transform);
		scene.setCamera(cameraGo);

		cameraCom.Update = function () {
			Component.Transform.prototype.Update.call(this);
			Core.Input._mouse.deltaY
			this.zoomLevel -= (Core.Input._mouse.deltaY / (1000 / this.zoomLevel));
			this.zoomLevel = Math.min(Math.max(this.zoomLevelMin, this.zoomLevel), this.zoomLevelMax);

			this.displaceTarget = Core.Input.isPressed("E".charCodeAt(0)) ? (!(this.displaceTarget)) : this.displaceTarget;
			this.rotateTarget = Core.Input.isPressed("R".charCodeAt(0)) ? (!(this.rotateTarget)) : this.rotateTarget;
			this.scaleTarget = Core.Input.isPressed("T".charCodeAt(0)) ? (!(this.scaleTarget)) : this.scaleTarget;

		}

		var go2 = new Core.GameObject('go2');
		go2.transform.localPosition.set(101, 102);
		go2.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		go2.transform.setParent(world.transform);

		go2.transform.Update = function () {
			Component.Transform.prototype.Update.call(this);
			//this.localRotation += Core.Time.deltaSeconds * -90;
		}

		var fps = new Core.GameObject('fps');
		fps.transform.localPosition.set(20, 20);
		var fpsDisplayText = new Component.DisplayText("-", "20px 'Press Start 2P', cursive", "#ff7700");
		fps.addComponent(fpsDisplayText);
		fps.transform.setParent(gui.transform);

		fpsDisplayText.Update = function () {
			this.text = Core.Time.getMeasuredFPS().toFixed(2);
		}

		scene.Awake();
		this.display.runScene(scene);
	};

	function setupStars(focus) {
		var starsGo = new Core.GameObject("Stars");

		var tileGrid = 13;
		//var tileSize = new Core.Vector2(512, 512);
		var tileSize = new Core.Vector2(window.innerWidth, window.innerHeight);
		starsGo.transform.focus = focus;
		/*
		var shapeCom = new Component.DisplayRawEaselShape();
		shapeCom.shape = new createjs.Shape();
		shapeCom.shape.graphics.setStrokeStyle(2).beginFill(createjs.Graphics.getRGB(255, 255, 255, 0.05)).beginStroke(createjs.Graphics.getRGB(255, 255, 255, 1)).drawCircle(0, 0, 30);
		starsGo.addComponent(shapeCom);
		 */
		starsGo.transform.Update = function () {
			Component.Transform.prototype.Update.call(this);
			var scene = this.gameObject.getScene();
			if (scene == undefined) {
				return;
			}

			var cameraGo = scene.getCamera();
			if (cameraGo == undefined) {
				return;
			}

			this.focus = this.focus || cameraGo;

			var cameraCom = cameraGo.getComponentsByType(Component.Camera)[0];
			if (cameraCom == undefined) {
				return;
			}

			//make the cammera the center of the world
			//var matrix = cameraGo.transform.getConcatenatedMatrix(new Core.Matrix3x3());
			var matrix = this.focus.transform.getConcatenatedMatrix(new Core.Matrix3x3());
			var d = matrix.decompose();

			var rotation = 0;
			if (cameraCom.rotateTarget) {
				rotation = -d.rotation;
			}

			var scale = new Core.Vector2(1, 1); //.multiply(0.5);
			if (cameraCom.scaleTarget) {
				//var mMin = 0.5, mMax = 1, tMin = cameraCom.zoomLevelMin, tMax = cameraCom.zoomLevelMax;
				//var r = (cameraCom.zoomLevel - tMin) / (tMax - tMin);
				//var z = (r*(mMax-mMin)) + mMin;
				scale.set(cameraCom.zoomLevel, cameraCom.zoomLevel);
			}

			this.localRotation = rotation;
			this.localScale.set(scale);
			this.localPosition.set(new Core.Vector2(scene.displaySize).multiply(0.5));

			for (var i = 0; i < this.layers.length; i++) {
				var displace = new Core.Vector2(0, 0);
				//if (cameraCom.displaceTarget) {
				displace.x = d.x * (1 / (i + 1)); //%(tileSize.x*tileGrid);// * (1 / (i + 1));
				displace.y = d.y * (1 / (i + 1)); //%(tileSize.y*tileGrid);// * (1 / (i + 1));
				//}
				this.layers[i].transform.centerPosition.set(displace);
				//this.layers[i].transform.centerPosition.set(displace.x%tileSize.x,displace.y%tileSize.y);
				var tilePos = new Core.Vector2(displace);
				tilePos.x = Math.floor(tilePos.x / tileSize.x);
				tilePos.y = Math.floor(tilePos.y / tileSize.y);
				//console.log(tilePos);
				var tilePos2 = new Core.Vector2(tilePos);

				//console.log(tilePos, tilePos2);
				//var rPos = new Core.Vector2(tilePos);
				//rPos.x = rPos.x*-tileSize.x;
				//rPos.y = rPos.y*-tileSize.y;
				//this.layers[i].transform.centerPosition.set(rPos);

				for (var j = 0, x = 0; x < tileGrid; x++) {
					for (var y = 0; y < tileGrid; y++, j++) {
						var tile = this.layers[i].transform.children[j];
						//var text = tile.gameObject.getComponentsByType(Component.DisplayText)[0];
						//text.text = tile.gameObject.name + "\n" + "[" + x + "," + y + "] : " + i;
						//dont ask... 
						tile.localPosition.x = (((Math.floor((tilePos.x + ((tileGrid - 1) - x)) / tileGrid) * tileGrid) + x)- (tileGrid/2)) * tileSize.x;
						tile.localPosition.y = (((Math.floor((tilePos.y + ((tileGrid - 1) - y)) / tileGrid) * tileGrid) + y)- (tileGrid/2)) * tileSize.y;
					}
					//debugger;
				}
			}
		}

		var data = {
			"imageUris": ["images/Stars/stars001.png"],
			frames: {
				width: 256,
				height: 256,
				count: 16,
				regX: 128,
				regY: 128,
				spacing: 0,
				margin: 0
			}
		}
		var spriteSheet = new Core.SpriteSheet(data);

		var layers = new Array(4);
		starsGo.transform.layers = layers;
		var tiles = new Array(tileGrid * tileGrid);

		for (var i = 0; i < layers.length; i++) {
			var layer = new Core.GameObject("Stars-" + i);
			layers[i] = layer;

			//FIXME: Debug for center of layer
			//var shapeCom = new Component.DisplayRawEaselShape();
			//shapeCom.shape = new createjs.Shape();
			//shapeCom.shape.graphics.setStrokeStyle(2).beginFill(createjs.Graphics.getRGB(255, 0, 255, 0.05)).beginStroke(createjs.Graphics.getRGB(255, 0, 255, 1)).drawCircle(0, 0, 20);
			//layer.addComponent(shapeCom);

			for (var j = 0, x = 0; x < tileGrid; x++) {
				for (var y = 0; y < tileGrid; y++, j++) {
					var tile = new Core.GameObject("[" + x + "," + y + "]"); // + i + "-" + j);
					tile.transform.setParent(layer.transform);
					tile.transform.localPosition.set(x * tileSize.x, y * tileSize.y);

					//FIXME: Debug for center of tile
					//var debugShape2 = new createjs.Shape();
					//debugShape2.graphics.setStrokeStyle(2).beginFill(createjs.Graphics.getRGB(255, 255, 0, 0.05)).beginStroke(createjs.Graphics.getRGB(255, 255, 0, 1)).drawCircle(0, 0, 10);
					//var shapeCom = new Component.DisplayRawEaselShape();
					//shapeCom.shape = debugShape2.clone();
					//tile.addComponent(shapeCom);

					//FIXME: Debug bounding box for the tile
					//var shapeCom = new Component.DisplayRawEaselShape();
					//shapeCom.shape = new createjs.Shape();
					//shapeCom.shape.graphics.setStrokeStyle(4).beginFill(createjs.Graphics.getRGB(255, 0, 0, 0.05)).beginStroke(createjs.Graphics.getRGB(255, 0, 0, 1)).drawRect(0, 0, tileSize.x, tileSize.y);
					//tile.addComponent(shapeCom);

					for (var k = 0; k < (i/2 + 1); k++) {
						var frame = Math.floor((1 - Math.pow(Math.random(), 4)) * 16);
						var sprite = new Component.DisplaySprite(spriteSheet, frame);
						sprite.paused = true;
						sprite.offset.set(Math.random() * tileSize.x, Math.random() * tileSize.y);
						sprite.rotation = Math.random() * 360;
						var scale = (0.3 + (Math.random() * 0.7));
						/*
						if (frame < 8) {
						scale *= 0.25;
						} else if (frame < 12) {
						scale *= 0.5;
						}*/
						sprite.scale.set(scale, scale);
						tile.addComponent(sprite);

						/*
						//FIXME: debug, star bounding box
						var debugShape4 = new createjs.Shape();
						debugShape4.graphics.setStrokeStyle(1).beginFill(createjs.Graphics.getRGB(0, 0, 255, 0.05)).beginStroke(createjs.Graphics.getRGB(0, 0, 255, 1)).drawRect(-128, -128, 256, 256);
						shapeCom = new Component.DisplayRawEaselShape();
						shapeCom.shape = debugShape4.clone();
						shapeCom.offset = sprite.offset;
						shapeCom.rotation = sprite.rotation;
						shapeCom.scale.set(scale, scale);
						tile.addComponent(shapeCom);*/

					}

					//FIXME: tile debug/bounding TileName
					//var nameCom = new Component.DisplayText(tile.name, "100px Arial", "#ff7700");
					//nameCom.offset.set(-200, -50);
					//tile.addComponent(nameCom);
				}
			}
		}

		for (var i = layers.length - 1; i >= 0; i--) {
			layers[i].transform.setParent(starsGo.transform);
		}

		return starsGo;
	}
	function setupDisplayBitmapTextSpriteSheet() {
		var data = {
			"imageUris": ["images/Vikramarka/komika_new.png"],
			"frames": [
				[246, 0, 15, 1, 0, -1, 31], /* 32 ' ' */
				[181, 0, 14, 23, 0, -3, 6], /* 33 '!' */
				[218, 135, 16, 12, 0, -3, 5], /* 34 '"' */
				[113, 137, 20, 19, 0, -3, 5], /* 35 '#' */
				[27, 0, 16, 24, 0, -3, 5], /* 36 '$' */
				[183, 91, 19, 21, 0, -1, 7], /* 37 '%' */
				[167, 24, 19, 22, 0, -3, 6], /* 38 '&' */
				[15, 160, 11, 11, 0, -5, 10], /* 39 ''' */
				[90, 0, 12, 24, 0, -2, 5], /* 40 '(' */
				[196, 0, 14, 23, 0, -4, 6], /* 41 ')' */
				[153, 137, 18, 15, 0, -2, 0], /* 42 '*' */
				[134, 137, 18, 16, 0, -3, 0], /* 43 '+' */
				[27, 160, 12, 10, 0, -5, -10], /* 44 ',' */
				[40, 160, 15, 9, 0, -4, 0], /* 45 '-' */
				[77, 160, 10, 8, 0, -3, -5], /* 46 '.' */
				[143, 0, 18, 23, 0, -4, 6], /* 47 '/' */
				[103, 93, 19, 21, 0, -3, 7], /* 48 '0' */
				[242, 46, 13, 21, 0, -3, 7], /* 49 '1' */
				[83, 93, 19, 21, 0, -4, 7], /* 50 '2' */
				[236, 69, 19, 21, 0, -4, 7], /* 51 '3' */
				[20, 116, 19, 21, 0, -3, 7], /* 52 '4' */
				[156, 113, 18, 21, 0, -3, 7], /* 53 '5' */
				[194, 113, 17, 21, 0, -3, 7], /* 54 '6' */
				[39, 49, 18, 22, 0, -2, 7], /* 55 '7' */
				[203, 91, 19, 21, 0, -3, 7], /* 56 '8' */
				[175, 113, 18, 21, 0, -3, 7], /* 57 '9' */
				[172, 135, 11, 15, 0, -5, 0], /* 58 ':' */
				[243, 91, 11, 21, 0, -4, 0], /* 59 ';' */
				[0, 160, 14, 12, 0, -5, 0], /* 60 '<' */
				[200, 135, 17, 12, 0, -5, 0], /* 61 '=' */
				[235, 135, 15, 12, 0, -5, 0], /* 62 '>' */
				[162, 0, 18, 23, 0, -5, 6], /* 63 '?' */
				[23, 72, 21, 21, 0, -2, 7], /* 64 '@' */

				[64, 25, 20, 22, 0, -2, 7], /* 65 'A' */
				[43, 25, 20, 22, 0, -3, 7], /* 66 'B' */
				[123, 0, 19, 23, 0, -3, 7], /* 67 'C' */
				[21, 94, 20, 21, 0, -3, 7], /* 68 'D' */
				[80, 116, 18, 21, 0, -4, 7], /* 69 'E' */
				[40, 116, 19, 21, 0, -4, 7], /* 70 'F' */
				[60, 116, 19, 21, 0, -3, 7], /* 71 'G' */
				[42, 94, 20, 21, 0, -3, 7], /* 72 'H' */
				[98, 138, 14, 21, 0, -4, 7], /* 73 'I' */
				[63, 94, 19, 21, 0, -3, 7], /* 74 'J' */
				[45, 72, 21, 21, 0, -4, 7], /* 75 'K' */
				[51, 138, 15, 21, 0, -4, 7], /* 76 'L' */
				[140, 47, 26, 21, 0, -4, 7], /* 77 'M' */
				[0, 72, 22, 21, 0, -4, 7], /* 78 'N' */
				[0, 116, 19, 21, 0, -3, 7], /* 79 'O' */
				[0, 94, 20, 21, 0, -5, 7], /* 80 'P' */
				[187, 24, 19, 22, 0, -3, 7], /* 81 'Q' */
				[110, 71, 20, 21, 0, -3, 7], /* 82 'R' */
				[0, 49, 19, 22, 0, -4, 7], /* 83 'S' */
				[118, 115, 18, 21, 0, -5, 7], /* 84 'T' */
				[89, 71, 20, 21, 0, -5, 7], /* 85 'U' */
				[58, 48, 18, 22, 0, -1, 7], /* 86 'V' */
				[193, 47, 25, 21, 0, -2, 7], /* 87 'W' */
				[0, 26, 21, 22, 0, -4, 7], /* 88 'X' */
				[77, 48, 17, 22, 0, -1, 7], /* 89 'Y' */
				[207, 24, 19, 22, 0, -4, 7], /* 90 'Z' */
				[230, 113, 16, 21, 0, -3, 7], /* 91 '[' */
				[211, 0, 12, 23, 0, -1, 6], /* 92 '\' */
				[0, 138, 16, 21, 0, -4, 7], /* 93 ']' */
				[184, 135, 15, 13, 0, -1, 7], /* 94 '^' */

				[85, 25, 20, 22, 0, -2, 7], /* 97 'a' */
				[22, 26, 20, 22, 0, -3, 7], /* 98 'b' */
				[103, 0, 19, 23, 0, -3, 7], /* 99 'c' */
				[131, 69, 20, 21, 0, -3, 7], /* 100 'd' */
				[137, 115, 18, 21, 0, -4, 7], /* 101 'e' */
				[123, 93, 19, 21, 0, -4, 7], /* 102 'f' */
				[143, 91, 19, 21, 0, -3, 7], /* 103 'g' */
				[194, 69, 20, 21, 0, -3, 7], /* 104 'h' */
				[83, 138, 14, 21, 0, -4, 7], /* 105 'i' */
				[223, 91, 19, 21, 0, -3, 7], /* 106 'j' */
				[67, 71, 21, 21, 0, -4, 7], /* 107 'k' */
				[67, 138, 15, 21, 0, -4, 7], /* 108 'l' */
				[113, 47, 26, 21, 0, -4, 7], /* 109 'm' */
				[219, 47, 22, 21, 0, -4, 7], /* 110 'n' */
				[163, 91, 19, 21, 0, -3, 7], /* 111 'o' */
				[152, 69, 20, 21, 0, -5, 7], /* 112 'p' */
				[147, 24, 19, 22, 0, -3, 7], /* 113 'q' */
				[173, 69, 20, 21, 0, -3, 7], /* 114 'r' */
				[127, 24, 19, 22, 0, -4, 7], /* 115 's' */
				[99, 115, 18, 21, 0, -5, 7], /* 116 't' */
				[215, 69, 20, 21, 0, -5, 7], /* 117 'u' */
				[20, 49, 18, 22, 0, -5, 7], /* 118 'v' */
				[167, 47, 25, 21, 0, -5, 7], /* 119 'w' */
				[224, 0, 21, 22, 0, -5, 7], /* 120 'x' */
				[95, 48, 17, 22, 0, -5, 7], /* 121 'y' */
				[227, 23, 19, 22, 0, -4, 7], /* 122 'z' */

				[17, 138, 16, 21, 0, -5, 7], /* 123 '{' */
				[75, 0, 14, 24, 0, -5, 5], /* 124 '|' */
				[34, 138, 16, 21, 0, -4, 7], /* 125 '}' */
				[56, 160, 20, 8, 0, -5, 0], /* 126 '~' */

				[44, 0, 15, 24, 0, -5, 5], /* 162 '¢' */
				[212, 113, 17, 21, 0, -3, 7], /* 163 '£' */
				[106, 24, 20, 22, 0, -3, 7], /* 164 '¤' */
				[106, 24, 20, 22, 0, -3, 7], /* 165 '¥' */
				[60, 0, 14, 24, 0, -2, 5], /* 166 '¦' */
				[0, 0, 26, 25, 0, -4, 4], /* 167 '§' */
			],
		};

		var a = {};
		for (var i = 32, j = 0; i <= 94; i++, j++) {
			a[String.fromCharCode(i)] = {
				"frames": [j]
			};
		}

		for (i = 97; i <= 126; i++, j++) {
			a[String.fromCharCode(i)] = {
				"frames": [j]
			};
		}

		for (i = 162; i <= 167; i++, j++) {
			a[String.fromCharCode(i)] = {
				"frames": [j]
			};
		}

		data.animations = a;

		return new Core.SpriteSheet(data);
	}

	return FlightModule;
});
