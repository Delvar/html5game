define(
	'FlightModule',
	['underscore', 'Core', 'Component',
		'Core/Vector2', 'Core/Vector3', 'Core/Vector4', 'Core/GameObject', 'Core/Scene', 'Core/Time', 'Core/SpriteSheet', 'Component/Camera', 'Component/DisplayBitmap', 'Component/DisplayText'],
	function (_, Core, Component) {
	"use strict";
	function FlightModule(display) {
		this.display = display;
	}

	FlightModule.prototype.run = function () {
		var scene = new Core.Scene();

		var world = new Core.GameObject("World");
		world.transform.setParent(scene.transform);

		var gui = new Core.GameObject("GUI");
		gui.transform.setParent(scene.transform);

		var camera = new Component.Camera();

		var go1 = new Core.GameObject('go1');
		go1.transform.localPosition = new Core.Vector2(200, 200);
		go1.addComponent(camera);
		go1.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		go1.transform.setParent(world.transform);

		go1.transform.Update = function () {
			Component.Transform.prototype.Update.call(this);
			this.localRotation += Core.Time.deltaSeconds * 45;
		}

		var go2 = new Core.GameObject('go2');
		go2.transform.localPosition = new Core.Vector2(100, 100);
		go2.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		go2.transform.setParent(go1.transform);

		go2.transform.Update = function () {
			Component.Transform.prototype.Update.call(this);
			this.localRotation += Core.Time.deltaSeconds * -90;
		}

		var fps = new Core.GameObject('fps');
		fps.transform.localPosition = new Core.Vector2(20, 20);
		var displayText = new Component.DisplayText("-", "20px 'Press Start 2P', cursive", "#ff7700");
		fps.addComponent(displayText);
		fps.transform.setParent(gui.transform);

		displayText.Update = function () {
			displayText.text = Core.Time.getMeasuredFPS().toFixed(2);
		}

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

		var titleGo = new Core.GameObject('Title');
		titleGo.transform.localPosition = new Core.Vector2(20, 400);
		var titleSpriteSheet = new Core.SpriteSheet(data);
		var titleBitmapText = new Component.DisplayBitmapText("SPACE FLIGHT MODULE TEST", titleSpriteSheet);

		titleGo.addComponent(titleBitmapText);
		titleGo.transform.setParent(gui.transform);

		scene.Awake();
		this.display.runScene(scene);

	};

	return FlightModule;
});
