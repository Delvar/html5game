define(
	'Component/Script',
	['Core', 'Component',
		'Core/Component'],
	function (Core, Component) {
	"use strict";
	function Script() {
		Core.Component.call(this);
	}

	Script.prototype = Object.create(Core.Component.prototype);
	Script.prototype.constructor = Script;

	/*
	//Uncomment the below for some debug info ... and lots of console spam!


	//Awake is called when the script instance is being loaded.
	Script.prototype.Awake = function () {
	console.log("Component/Script:Awake", this);
	};

	//Start is called on the frame when a script is enabled just before any of the Update methods is called the first time.
	Script.prototype.Start = function () {
	console.log("Component/Script:Start", this);
	};

	//Update is called every frame,
	Script.prototype.Update = function () {
	console.log("Component/Script:Update", this);
	};

	//LateUpdate is called every frame,
	//LateUpdate is called after all Update functions have been called.
	Script.prototype.LateUpdate = function () {
	console.log("Component/Script:LateUpdate", this);
	};
	 */
	Component.Script = Script;
	return Script;
});
