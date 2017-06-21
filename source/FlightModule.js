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
		var go1 = new Core.GameObject('go1');
		go1.transform.localPosition = new Core.Vector2(10, 10);

		go1.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		var go2 = new Core.GameObject('go2');
		go2.transform.localPosition = new Core.Vector2(100, 0);

		go2.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		var go3 = new Core.GameObject('go3');
		go3.transform.localPosition = new Core.Vector2(0, 100);
		go3.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));

		go1.transform.setParent(scene.transform);
		go2.transform.setParent(go1.transform);
		go3.transform.setParent(go2.transform);

		var fps = new Core.GameObject('fps');
		var displayText = new Component.DisplayText("-", "20px Arial", "#ff7700");
		var textObject = displayText.getTextObject();
		textObject.textBaseline = "alphabetic";
		fps.addComponent(displayText);
		fps.transform.localPosition = new Core.Vector2(20, 20);

		fps.transform.setParent(scene.transform);

		displayText.Update = function () {
			this.getTextObject().text = (createjs.Ticker.getMeasuredFPS()).toFixed(2);
		}

		scene.Awake();
		this.display.runScene(scene);

		console.log(go1, go2, go3);
	};

	return FlightModule;
});
