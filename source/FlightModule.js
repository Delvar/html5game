define(
	'FlightModule',
	['underscore', 'easel', 'Core', 'Component', 'Script',
		'Core/Ticker', 'Core/Scene', 'Script/PlayerController', 'Script/CameraController', 'Component/DisplayBitmap', 'Script/Fps', 'Script/ParalaxStars',
		'Component/Camera', 'Component/DisplayText', 'Component/Rigidbody'],
	function (_, createjs, Core, Component, Script) {
	"use strict";
	function FlightModule(display) {
		this.display = display;
	}

	FlightModule.prototype.run = function () {
		var scene = new Core.Scene();
		var world = new Core.GameObject("World");
		var gui = new Core.GameObject("Gui");
		var player = setupPlayer();
		var camera = setupCamera(player, world);
		var fps = setupFps();
		var paralaxStars = setupParalaxStars(player, camera);

		var npc = new Core.GameObject('Npc');
		npc.transform.localPosition = new Core.Vector2(101, 102);
		npc.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		npc.transform.setParent(world.transform);

		paralaxStars.transform.setParent(scene.transform);
		world.transform.setParent(scene.transform);
		player.transform.setParent(world.transform);
		camera.transform.setParent(player.transform);
		gui.transform.setParent(scene.transform);
		fps.transform.setParent(gui.transform);

		scene.setMainCamera(camera);
		scene.Awake();
		this.scene = scene;

		//Ticker.RAF
		//Ticker.useRAF = true;
		//Core.Ticker.timingMode = Core.Ticker.RAF;
		//Core.Ticker.setFPS(60);
		Core.Time.updateTicker.on("tick", function (event) {
			Core.Input.startTick();

			Core.Time.delta = event.delta;
			Core.Time.paused = event.paused;
			Core.Time.time = event.time;
			Core.Time.runTime = event.runTime;
			Core.Time.deltaSeconds = event.delta / 1000;

			this.scene.Update();
			this.scene.LateUpdate();

			Core.Input.endTick();
		}, this);

		Core.Time.physicsTicker.on("tick", function (event) {
			//Core.Input.startTick();

			Core.Time.delta = event.delta;
			Core.Time.paused = event.paused;
			Core.Time.time = event.time;
			Core.Time.runTime = event.runTime;
			Core.Time.deltaSeconds = event.delta / 1000;

			this.scene.FixedUpdate();

			//Core.Input.endTick();
		}, this);

		//this.display.setScene(scene);
		//this.display.setCamera(camera);
		this.display.runScene(scene, camera.getFirstComponentByType(Component.Camera));
	}

	function setupPlayer() {
		var player = new Core.GameObject('Player');
		player.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		var pc = new Script.PlayerController();
		pc.acceleration = 100;
		pc.angularAcceleration = 360;
		player.addComponent(pc);
		var r = new Component.Rigidbody();
		r.drag = 50;
		r.minVelocity = 0.1;
		r.maxVelocity = 500;

		r.angularDrag = 300;
		r.minAngularVelocity = 0.01; //FIXME: ?
		r.maxAngularVelocity = 180; //FIXME: ?

		player.addComponent(r);

		return player;
	}

	function setupCamera(player, world) {
		var camera = new Core.GameObject('Camera');
		var cameraComponent = new Component.Camera();
		var cameraController = new Script.CameraController();
		cameraComponent.setWorld(world.transform);
		cameraController.setCameraComponent(cameraComponent);

		cameraComponent.zoomLevel = 1;
		cameraComponent.zoomLevelMin = 0.5;
		cameraComponent.zoomLevelMax = 1;

		camera.addComponent(cameraComponent);
		camera.addComponent(cameraController);
		return camera;
	}

	function setupFps() {
		var fps = new Core.GameObject('Fps');
		fps.transform.localPosition = new Core.Vector2(20, 20);
		var fpsDisplayText = new Component.DisplayText("-", "20px 'Press Start 2P', cursive", "#ff7700");
		fps.addComponent(fpsDisplayText);
		var fpsScript = new Script.Fps();
		fpsScript.setTarget(fpsDisplayText);
		fps.addComponent(fpsScript);
		return fps;
	}

	function setupParalaxStars(player, camera) {
		var paralaxStars = new Core.GameObject('Paralax Stars');

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
		var layerCount = 5;

		var cameraCom = camera.getComponentsByType(Component.Camera)[0];
		var gridSize = Math.floor((1 / cameraCom.zoomLevelMin) + 2);
		var tileSize = new Core.Vector2(window.innerWidth, window.innerHeight);

		var paralaxStarsScript = new Script.ParalaxStars();
		paralaxStars.addComponent(paralaxStarsScript);
		paralaxStarsScript.tileSize = tileSize;
		paralaxStarsScript.gridSize = gridSize;

		//Do this backwards so the layers are in the right order, smallest to bigest.
		//for (var i = layerCount-1; i >= 0; i--) {
		for (var i = 0; i < layerCount; i++) {
			var layer = new Core.GameObject("Paralax Stars-" + i);
			layer.transform.setParent(paralaxStars.transform);

			for (var j = 0, x = 0; x < gridSize; x++) {
				for (var y = 0; y < gridSize; y++, j++) {
					var tile = new Core.GameObject("Paralax Stars-" + i + "-[" + x + "," + y + "]");
					tile.transform.setParent(layer.transform);
					//tile.transform.localPosition.set(x * tileSize.x, y * tileSize.y);
					tile.transform.localPosition = new Core.Vector2(x * tileSize.x, y * tileSize.y);

					for (var k = 0; k < (i / 2 + 1); k++) {
						var frame = Math.floor((1 - Math.pow(Math.random(), 4)) * 16);
						var sprite = new Component.DisplaySprite(spriteSheet, frame);
						sprite.paused = true;
						//sprite.offset.set(Math.random() * tileSize.x, Math.random() * tileSize.y);
						sprite.offset = new Core.Vector2(Math.random() * tileSize.x, Math.random() * tileSize.y);

						sprite.rotation = Math.random() * 360;
						var scale = (0.3 + (Math.random() * 0.7));
						sprite.scale = new Core.Vector2(scale, scale);

						tile.addComponent(sprite);
					}
				}
			}
		}

		return paralaxStars;
	}

	//FIXME: Debug for center of layer
	//var shapeCom = new Component.DisplayRawEaselShape();
	//shapeCom.shape = new createjs.Shape();
	//shapeCom.shape.graphics.setStrokeStyle(2).beginFill(createjs.Graphics.getRGB(255, 0, 255, 0.05)).beginStroke(createjs.Graphics.getRGB(255, 0, 255, 1)).drawCircle(0, 0, 20);
	//layer.addComponent(shapeCom);

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
	//FIXME: tile debug/bounding TileName
	//var nameCom = new Component.DisplayText(tile.name, "100px Arial", "#ff7700");
	//nameCom.offset.set(-200, -50);
	//tile.addComponent(nameCom);


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

				[44, 0, 15, 24, 0, -5, 5], /* 162 '�' */
				[212, 113, 17, 21, 0, -3, 7], /* 163 '�' */
				[106, 24, 20, 22, 0, -3, 7], /* 164 '�' */
				[106, 24, 20, 22, 0, -3, 7], /* 165 '�' */
				[60, 0, 14, 24, 0, -2, 5], /* 166 '�' */
				[0, 0, 26, 25, 0, -4, 4], /* 167 '�' */
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
