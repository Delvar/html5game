define(
	'EaselDisplay',
	['underscore', 'easel', 'preload', 'Component',
		'Component/DisplayItem', 'Component/Transform', 'Component/DisplayText'],

	function (_, createjs, preload, Component) {
	function EaselDisplay(canvas) {
		this.canvas = canvas;
		this.stage = new createjs.Stage(canvas);
		this.scene = undefined;
		//used to prefix the name of injected objects
		this.id = Math.random().toString(36).substring(2, 6).toUpperCase();
	}

	EaselDisplay.prototype.setScene = function (scene) {
		this.scene = scene;
	};

	getName = function () {
		var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((this).constructor.toString());
		return (results && results.length > 1) ? results[1] : "";
	};

	EaselDisplay.prototype.prepareScene = function () {
		//loop though all gameObjects>Component and inject Containers and easel graphics
		var id = '_EaselDisplay_' + this.id;

		//here we inject easle into everything we care about and hookup the hierarchy
		this.scene.recursiveCallbackOnComponents(function () {
			//console.log("EaselDisplay:prepareScene", this);
			var t = {};

			if (this instanceof Component.Transform) {
				t.display = new createjs.Container();
				t.display.x = this.gameObject.transform.localPosition.x;
				t.display.y = this.gameObject.transform.localPosition.y;
				t.display.rotation = this.gameObject.transform.localRotation;
			} else if (this instanceof Component.DisplayBitmap) {
				t.display = new createjs.Bitmap(this.imageUri); //FIXME: setup preload
			} else if (this instanceof Component.DisplayText) {
				t.display = new createjs.Text(this.text, this.font, this.color);
				t.display.textBaseline = "alphabetic";
			} else {
				console.error("Unknown type", this);
				return;
			}

			if (!(this instanceof Component.Transform)) {
				this.gameObject.transform[id].display.addChild(t.display);
			} else if (this.gameObject.transform.parent != undefined) {
				this.gameObject.transform.parent[id].display.addChild(t.display);
			}

			this[id] = t;
		});

		this.stage.addChild(this.scene.transform[id].display);
	};

	EaselDisplay.prototype.updateScene = function () {
		//loop though all gameObjects>Component and UPDATE Containers and easel graphics
		var id = '_EaselDisplay_' + this.id;

		//here we inject easle into everything we care about and hookup the hierarchy
		this.scene.recursiveCallbackOnComponents(function () {
			//console.log("EaselDisplay:updateScene", this);
			var t = this[id];

			if (t == undefined) {
				return;
			}

			if (this instanceof Component.Transform) {
				t.display.x = this.gameObject.transform.localPosition.x;
				t.display.y = this.gameObject.transform.localPosition.y;
				t.display.rotation = this.gameObject.transform.localRotation;
			} else if (this instanceof Component.DisplayBitmap) {
				//FIXME: update image URI ?!!
			} else if (this instanceof Component.DisplayText) {
				t.display.text = this.text;
				t.display.font = this.font;
				t.display.color = this.color;
			} else {
				console.error("Unknown type", this);
				return;
			}
		});

		this.stage.addChild(this.scene.transform[id].display);
	};

	EaselDisplay.prototype.startScene = function () {
		var display = this;
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", function () {
			//updateSprites(This.sprites, This.getCurrentScene());
			display.scene.Update();
			display.updateScene();
			display.stage.update();
		});
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
