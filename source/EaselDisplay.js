define(
	'EaselDisplay',
	['underscore', 'easel', 'preload', 'Core', 'Component',
		'Core/Time', 'Core/SpriteSheet', 'Core/Input', 'Component/DisplayRawEaselShape', 'Component/DisplaySprite', 'Component/Camera', 'Component/DisplayItem', 'Component/Transform', 'Component/DisplayText', 'Component/DisplayBitmap', 'Component/DisplayBitmapText'],

	function (_, createjs, preload, Core, Component) {
	"use strict";
	function EaselDisplay(canvas) {
		this.canvas = canvas;
		this.stage = new createjs.Stage(canvas);
		this.scene = undefined;
		this.camera = undefined;

		//used to prefix the name of injected objects
		this.id = Math.random().toString(36).substring(2, 6).toUpperCase();
		this.injectPoint = '_EaselDisplay_' + this.id;
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
		if (this.camera == undefined) {
			this.setCamera(scene.mainCamera.getFirstComponentByType(Component.Camera));
		}
	};

	EaselDisplay.prototype.setCamera = function (cameraComponent) {
		this.camera = cameraComponent;
		if (this.camera != undefined) {
			this.camera.displaySize = new Core.Vector2(this.stage.canvas.width, this.stage.canvas.height);
		}
	};

	//FIXME: split these switches and use an array of types, then I simply call the
	// function directly via the array, i can then do the inject and update in one round.
	EaselDisplay.prototype.setupInjections = function () {
		var display = this;
		//alias the injectionPoint for use in the below functiuon.
		var ip = this.injectPoint;
		//here we inject easle into everything we care about and hookup the hierarchy
		this.scene.recursiveCallbackOnComponents(function () {
			var t = this[ip] || {};

			if (this instanceof Component.Transform) {
				t.display = new createjs.Container();
			} else if (this instanceof Component.DisplayBitmap) {
				if (!this.image) {
					t.display = new createjs.Bitmap(this.imageUri); //FIXME: setup preload
					this.image = t.display.image;
				} else {
					t.display = new createjs.Bitmap(this.image);
				}
			} else if (this instanceof Component.DisplayText) {
				t.display = new createjs.Text();
				//t.display.textBaseline = "alphabetic";
			} else if (this instanceof Component.DisplayBitmapText) {
				//inject into the sprite sheet
				//FIXME: check that we have not already injected this...
				var spriteSheetObject = display.injectSpriteSheet(this.spriteSheet);
				t.display = new createjs.BitmapText(this.text, spriteSheetObject);
			} else if (this instanceof Component.DisplaySprite) {
				var spriteSheetObject = display.injectSpriteSheet(this.spriteSheet);
				t.display = new createjs.Sprite(spriteSheetObject, this.frameOrAnimation);
			} else if (this instanceof Component.Camera) {
				t.target = this.getWorld()[ip].display;
			} else if (this instanceof Component.DisplayRawEaselShape) {
				if (!this.shape) {
					this.shape = new createjs.Shape();
					this.shape.graphics.setStrokeStyle(4).beginFill(createjs.Graphics.getRGB(0, 0, 0, 0)).beginStroke("#FF0000").drawCircle(0, 0, 50);
				}
				t.display = this.shape;
			} else {
				console.error("Unknown type", this);
				return;
			}

			if (this instanceof Component.Camera) {
				//Do nothing
			} else if (this instanceof Component.Transform) {
				if (this.gameObject.transform.parent != undefined) {
					this.gameObject.transform.parent[ip].display.addChild(t.display);
				}
			} else {
				this.gameObject.transform[ip].display.addChild(t.display);
			}

			this[ip] = t;
		});
		this.stage.addChild(this.scene.transform[ip].display);

		//now go though and populate the object values.. could do this at the same time but didnt want to duplicate the setting.
		this.updateInjections();
	};

	EaselDisplay.prototype.injectSpriteSheet = function (spriteSheet) {
		var ip = this.injectPoint;
		var t = spriteSheet[ip] || {};
		if (!t.display) {
			var data = {
				images: spriteSheet.imageUris,
				frames: spriteSheet.frames,
				animations: spriteSheet.animations
			};
			var spriteSheetObject = new createjs.SpriteSheet(data);
			t.display = spriteSheetObject;
			spriteSheet[ip] = t;
		}
		return t.display;
	}

	EaselDisplay.prototype.updateInjections = function () {
		var interp = (Core.Time.graphicsTicker._lastTime - Core.Time.physicsTicker._lastTime)/1000;

		var display = this;
		var ip = this.injectPoint;

		this.scene.recursiveCallbackOnComponents(function () {
			var t = this[ip];

			if (t == undefined) {
				return;
			}

			//FIXME: check if these are dirty first!
			if (this instanceof Component.Transform) {
				if (this.gameObject.rigidbody != undefined) {
					var intRigid = this.gameObject.rigidbody.getInterpolated(interp);
					t.display.x = intRigid.localPosition.x;
					t.display.y = intRigid.localPosition.y;
					t.display.rotation = intRigid.localRotation;
				} else {
					t.display.x = this.localPosition.x;
					t.display.y = this.localPosition.y;
					t.display.rotation = this.localRotation;
				}
				t.display.scaleX = this.gameObject.transform.localScale.x;
				t.display.scaleY = this.gameObject.transform.localScale.y;
			} else if (this instanceof Component.DisplayBitmap) {
				//FIXME: update image URI ?!!
				if (this.autoCenter && t.display.isVisible()) {
					this.centerPosition = new Core.Vector2(t.display.image.width / 2, t.display.image.height / 2);
					this.autoCenter = false;
				}
			} else if (this instanceof Component.DisplayText) {
				t.display.text = this.text;
				t.display.font = this.font;
				t.display.color = this.color;
			} else if (this instanceof Component.DisplayBitmapText) {
				t.display.text = this.text;
			} else if (this instanceof Component.DisplaySprite) {
				t.display.paused = this.paused;
			} else if (this instanceof Component.Camera) {
				return;
			} else if (this instanceof Component.DisplayRawEaselShape) {
				//nothing
			} else {
				console.error("Unknown type", this);
				return;
			}
			t.display.regX = this.centerPosition.x;
			t.display.regY = this.centerPosition.y;

			if (this instanceof Component.DisplayItem) {
				t.display.x = this.offset.x;
				t.display.y = this.offset.y;
				t.display.rotation = this.rotation;
				t.display.scaleX = this.scale.x;
				t.display.scaleY = this.scale.y;
			}
		});

		this.stage.addChild(this.scene.transform[ip].display);
	};

	EaselDisplay.prototype.updateCamera = function () {
		if (this.camera == undefined) {
			return;
		}

		var t = this.camera[this.injectPoint];
		if (t == undefined || t.target == undefined) {
			return;
		}

		var interp = (Core.Time.graphicsTicker._lastTime - Core.Time.physicsTicker._lastTime)/1000;
		
		//make the cammera the center of the world
		var matrix = this.camera.gameObject.transform.getConcatenatedMatrix(new Core.Matrix3x3(),interp);
		var d = matrix.decompose();
		if (this.camera.displaceWorld) {
			t.target.regX = d.x;
			t.target.regY = d.y;
		}

		t.target.x = this.width / 2;
		t.target.y = this.height / 2;

		if (this.camera.rotateWorld) {
			t.target.rotation = -d.rotation;
		}
		if (this.camera.scaleWorld) {
			t.target.scaleX = d.scaleX * this.camera.zoomLevel;
			t.target.scaleY = d.scaleY * this.camera.zoomLevel;
		}
	}

	EaselDisplay.prototype.startScene = function () {
		Core.Time.graphicsTicker.on("tick", function (event) {
			this.updateInjections();
			this.updateCamera();
			this.stage.update();
		},this);
	};

	EaselDisplay.prototype.runScene = function (scene, camera) {
		if (scene != undefined) {
			this.setScene(scene);
		}
		if (camera != undefined) {
			this.setCamera(camera);
		}
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
