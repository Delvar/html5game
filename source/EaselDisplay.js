define(
	'EaselDisplay',
	['underscore', 'easel', 'preload', 'Core', 'Component',
		'Core/Time', 'Core/SpriteSheet', 'Component/DisplayItem', 'Component/Transform', 'Component/DisplayText', 'Component/DisplayBitmap', 'Component/DisplayBitmapText'],

	function (_, createjs, preload, Core, Component) {
	"use strict";
	function EaselDisplay(canvas) {
		this.canvas = canvas;
		this.stage = new createjs.Stage(canvas);
		this.scene = undefined;
		//used to prefix the name of injected objects
		this.id = Math.random().toString(36).substring(2, 6).toUpperCase();
		this.injectPoint = '_EaselDisplay_' + this.id;

		//FIXME: need to decide on how best to set the canvas size.
		this.stage.canvas.width = window.innerWidth; //canvas.parentElement.clientWidth; //window.innerWidth;
		this.stage.canvas.height = window.innerHeight; //canvas.parentElement.clientHeight;//window.innerHeight;
	}

	//hotwire the width and height to the canvas.
	Object.defineProperty(EaselDisplay.prototype, 'width', {
		get: function () {
			return this.stage.canvas.width;
		}
	});
	Object.defineProperty(EaselDisplay.prototype, 'height', {
		get: function () {
			return this.stage.canvas.height;
		}
	});

	EaselDisplay.prototype.setScene = function (scene) {
		this.scene = scene;
	};

	function getName() {
		var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((this).constructor.toString());
		return (results && results.length > 1) ? results[1] : "";
	};

	//FIXME: split these switches and use an array of types, then I simply call the 
	// function directly via the array, i can then do the inject and update in one round.
	EaselDisplay.prototype.setupInjections = function () {
		//alias the injectionPoint for use in the below functiuon.
		var ip = this.injectPoint;
		//here we inject easle into everything we care about and hookup the hierarchy
		this.scene.recursiveCallbackOnComponents(function () {
			//console.log("EaselDisplay:setupInjections", this);
			var t = {};

			if (this instanceof Component.Transform) {
				t.display = new createjs.Container();
			} else if (this instanceof Component.DisplayBitmap) {
				t.display = new createjs.Bitmap(this.imageUri); //FIXME: setup preload
				this.image = t.display.image;
			} else if (this instanceof Component.DisplayText) {
				t.display = new createjs.Text();
				//t.display.textBaseline = "alphabetic";
			} else if (this instanceof Component.DisplayBitmapText) {
				//inject into the sprite sheet
				//FIXME: check that we have not already injected this...
				var ss = this.spriteSheet;
				var data = {
					images: ss.imageUris,
					frames: ss.frames,
					animations: ss.animations
				};
				var sso = new createjs.SpriteSheet(data);
				ss[ip] = {
					display: sso
				};
				t.display = new createjs.BitmapText(this.text, sso);
			} else {
				console.error("Unknown type", this);
				return;
			}

			if (!(this instanceof Component.Transform)) {
				this.gameObject.transform[ip].display.addChild(t.display);
			} else if (this.gameObject.transform.parent != undefined) {
				this.gameObject.transform.parent[ip].display.addChild(t.display);
			}

			this[ip] = t;
		});
		this.stage.addChild(this.scene.transform[ip].display);

		//now go though and populate the object values.. could do thi sat the same time but didnt want to duplicate teh setting.
		this.updateInjections();
	};

	EaselDisplay.prototype.updateInjections = function () {
		//alias the injectionPoint for use in the below functiuon.
		var ip = this.injectPoint;
		//here we inject easle into everything we care about and hookup the hierarchy
		this.scene.recursiveCallbackOnComponents(function () {
			//console.log("EaselDisplay:updateInjections", this);
			var t = this[ip];

			if (t == undefined) {
				return;
			}

			//FIXME: check if these are dirty first!
			if (this instanceof Component.Transform) {
				t.display.x = this.gameObject.transform.localPosition.x;
				t.display.y = this.gameObject.transform.localPosition.y;
				t.display.rotation = this.gameObject.transform.localRotation;
				t.display.scaleX = this.gameObject.transform.localScale.x;
				t.display.scaleY = this.gameObject.transform.localScale.y;
			} else if (this instanceof Component.DisplayBitmap) {
				//FIXME: update image URI ?!!
				if (this.autoCenter && t.display.isVisible()) {
					this.centerPosition.x = t.display.image.width / 2;
					this.centerPosition.y = t.display.image.height / 2;
					this.autoCenter = false;
				}
			} else if (this instanceof Component.DisplayText) {
				t.display.text = this.text;
				t.display.font = this.font;
				t.display.color = this.color;
			} else if (this instanceof Component.DisplayBitmapText) {
				t.display.text = this.text;
			} else {
				console.error("Unknown type", this);
				return;
			}
			t.display.regX = this.centerPosition.x;
			t.display.regY = this.centerPosition.y;
		});

		this.stage.addChild(this.scene.transform[ip].display);
	};

	EaselDisplay.prototype.startScene = function () {
		var display = this;
		createjs.Ticker.setFPS(15);
//createjs.Ticker.setFPS(1);
		//FIXME: move the scene updating out of here
		createjs.Ticker.addEventListener("tick", function (event) {

			//FIXME: need a better way to do this
			//patch in the frame rate stuff...
			Core.Time.delta = event.delta;
			Core.Time.paused = event.paused;
			Core.Time.time = event.time;
			Core.Time.runTime = event.runTime;
			Core.Time.deltaSeconds = event.delta / 1000;

			display.scene.Update();
			display.updateInjections();
			display.stage.update();
		});
	};

	EaselDisplay.prototype.runScene = function (scene) {
		this.scene = scene;
		this.setupInjections();
		this.startScene();
	};

	/*
	EaselDisplay.prototype.runScene = function (scene) {
	this.currentScene = scene;
	//this.loadSprites(scene.getSpriteConfig(), this.startScene, this);
	this.startScene();
	};

	EaselDisplay.prototype.loadSprites = function (config, onComplete, context) {
	var manifest = [];

	_.each(config, function (configItem) {
	this.sprites[configItem.name] = createSprite(configItem);

	// Add image to loader manifiest - not expecting sprites with > 1 image
	manifest.push({
	src: configItem.spritesheet.images[0],
	id: configItem.name
	});
	}, this);

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", function () {
	onComplete.call(context);
	});
	loader.loadManifest(manifest);
	};

	EaselDisplay.prototype.getSprite = function (name) {
	return this.sprites[name];
	};

	EaselDisplay.prototype.startScene = function () {

	//_.each(this.sprites, function (sprite) {
	//sprite.gotoAndPlay('idle');
	//this.stage.addChild(sprite);
	//}, this);

	var that = this;

	this.stage.addChild(this.currentScene.transform.getContainerObject());

	createjs.Ticker.setFPS(30);

	createjs.Ticker.addEventListener("tick", function () {
	//updateSprites(This.sprites, This.getCurrentScene());
	that.currentScene.Update();
	that.stage.update();
	});
	};

	EaselDisplay.prototype.getCurrentScene = function () {
	return this.currentScene;
	};

	function updateSprites(sprites, scene) {
	// _.each(scene.getCharacters(), function(characterName) {
	//     updateCharacterSprite(sprites, scene.getCharacter(characterName));
	// });

	// _.each(scene.getSetPieces(), function(setPieceName) {
	//     updateSetPieceSprite(sprites, scene.getSetPiece(setPieceName));
	// });
	};

	function updateCharacterSprite(sprites, character) {
	_.each(character.getSprites(), function (spriteName) {
	sprites[spriteName].x = character.x;
	sprites[spriteName].y = character.y;

	if (sprites[spriteName].currentAnimation != character.state) {
	sprites[spriteName].gotoAndPlay(character.state);
	}
	});
	}

	function updateSetPieceSprite(sprites, setPiece) {
	_.each(setPiece.getSprites(), function (spriteName) {
	if (sprites[spriteName].currentAnimation != setPiece.state) {
	sprites[spriteName].gotoAndPlay(setPiece.state);
	}
	});
	}

	function createSprite(config) {
	var spritesheet = new createjs.SpriteSheet(config.spritesheet),
	sprite = new createjs.Sprite(spritesheet);

	// Set sprite properties - x, y, scale etc
	_.each(config.properties, function (property, propertyName) {
	sprite[propertyName] = property;
	}, this);

	return sprite;
	}
	 */
	return EaselDisplay;
});
