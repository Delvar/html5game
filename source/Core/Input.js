define(
	'Core/Input',
	['Core'],
	function (Core) {
	"use strict";
	function Input() {};

	Input._pressed = {};

	Input.isDown = function (keyCode) {
		return (Input._pressed[keyCode] != undefined);
	};
	Input.onKeydown = function (event) {
		if (!Input.isDown(event.keyCode)) {
			Input._pressed[event.keyCode] = Date.now();
		}
	};
	Input.onKeyup = function (event) {
		delete Input._pressed[event.keyCode];
	}

	window.addEventListener('keyup', function (event) {
		Input.onKeyup(event);
	}, false);
	window.addEventListener('keydown', function (event) {
		Input.onKeydown(event);
	}, false);

	Core.Input = Input;
	return Input;
});
