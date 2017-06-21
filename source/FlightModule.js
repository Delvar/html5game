define(
	'FlightModule',
	['underscore', 'Core', 'Component',
		'Core/Vector2', 'Core/Vector3', 'Core/Vector4', 'Core/GameObject', 'Core/Scene', 'Component/DisplayBitmap', 'Component/DisplayText'],
	function (_, Core, Component) {
	function FlightModule(display) {
		this.display = display;
	}

	FlightModule.prototype.run = function () {
		var scene = new Core.Scene();
		var go1 = new Core.GameObject('go1', new Core.Vector2(0, 0));
		go1.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		var go2 = new Core.GameObject('go2', new Core.Vector2(300, 0));
		go2.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		var go3 = new Core.GameObject('go3', new Core.Vector2(0, 200));
		go3.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));

		go1.setParent(scene);
		go2.setParent(go1);
		go3.setParent(go2);

		var fps = new Core.GameObject('fps', new Core.Vector2(10, 20));
		var displayText = new Component.DisplayText("-", "20px Arial", "#ff7700");
		var textObject = displayText.getTextObject();
		textObject.textBaseline = "alphabetic";
		fps.addComponent(displayText);
		fps.setParent(scene);

		fps.Update = function() {
			displayText.wrapped.text=(createjs.Ticker.getMeasuredFPS()).toFixed(2);
		}

		scene.Awake();
		this.display.runScene(scene);

		console.log(go1, go2, go3);
	};

	return FlightModule;
});
