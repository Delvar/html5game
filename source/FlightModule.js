define(
	'FlightModule',
	['underscore', 'Core', 'Component',
		'Core/Vector2', 'Core/Vector3', 'Core/Vector4', 'Core/GameObject', 'Core/Scene', 'Component/Camera', 'Component/DisplayBitmap', 'Component/DisplayText'],
	function (_, Core, Component) {
	function FlightModule(display) {
		this.display = display;
	}

	FlightModule.prototype.run = function () {
		var scene = new Core.Scene();

		var world = new Core.GameObject();
		world.transform.setParent(scene.transform);

		var gui = new Core.GameObject();
		gui.transform.setParent(scene.transform);

		var go1 = new Core.GameObject('go1');
		go1.transform.localPosition = new Core.Vector2(200, 200);
		//go1.addComponent(new Component.Camera());
		go1.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));
		go1.transform.setParent(world.transform);

		go1.transform.Update = function () {
			Component.Transform.prototype.Update.call(this);
			this.localRotation += 1;
		}

		/*
		var go2 = new Core.GameObject('go2');
		go2.transform.localPosition = new Core.Vector2(400, 200);
		go2.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));

		var go3 = new Core.GameObject('go3');
		go3.transform.localPosition = new Core.Vector2(200, 400);
		go3.addComponent(new Component.DisplayBitmap('images/ships/MillionthVector/smallfighter/smallfighter0006.png'));


		go2.transform.setParent(world.transform);
		go3.transform.setParent(world.transform);
		 */
		var fps = new Core.GameObject('fps');
		fps.transform.localPosition = new Core.Vector2(20, 20);

		var displayText = new Component.DisplayText("SOME TEXT!!!!!!", "20px Arial", "#ff7700");
		fps.addComponent(displayText);
		fps.transform.setParent(gui.transform);

		displayText.Update = function () {
			//console.log(this);
			displayText.text = Math.random(); //createjs.Ticker.getMeasuredFPS()).toFixed(2);
		}

		scene.Awake();
		this.display.setScene(scene);
		this.display.prepareScene();
		this.display.startScene();

		//console.log(go1, go2, go3);
	};

	return FlightModule;
});
