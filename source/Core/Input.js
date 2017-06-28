define(
	'Core/Input',
	['Core'],
	function (Core) {
	"use strict";
	function Input() {};

	//FIXME: need to add an input mapping section,
	// so instead of lookign for keycodes in onkeydown
	// the rest of the program can do 'if (Core.Input.Fire1) { shoot(); };
	Input._down = {};
	//pressed keys get reset on the next frame untill the next keydown event.
	//used to single pulls an input.
	Input._pressed = {};
	//the status of the mouse.
	Input._mouse = {};
	//we queue up any events that comein while processign the frame, then at the begining of the next frame we process them all.
	//not sure this is required though...
	Input._eventQueue = new Array();

	Input.isDown = function (keyCode) {
		return (Input._down[keyCode] != undefined);
	};

	Input.isUp = function (keyCode) {
		return (Input._down[keyCode] == undefined);
	};

	Input.isPressed = function (keyCode) {
		return (Input._pressed[keyCode] != undefined);
	};

	Input.startTick = function () {
		Input._mouse.deltaX = 0;
		Input._mouse.deltaY = 0;
		Input._mouse.deltaZ = 0;
		Input._pressed = {};
		Input.handleEventQueue();
		this.start = performance.now();
	}

	Input.endTick = function () {
		this.end = performance.now();
	}

	Input.handleEventQueue = function () {
		var event;
		while (event = Input._eventQueue.shift()) {
			(Input._eventHandlers[event.type])(event);
		}
	}

	Input._eventHandlers = {};

	Input._eventHandlers.keyup = function (event) {
		delete Input._down[event.keyCode];
	};

	Input._eventHandlers.keydown = function (event) {
		if (!Input.isDown(event.keyCode)) {
			Input._pressed[event.keyCode] = Input._down[event.keyCode] = performance.now();
		}
	};

	//Note: wheel not mosuewheel.
	Input._eventHandlers.wheel = function (event) {
		Input._mouse.deltaX += event.deltaX;
		Input._mouse.deltaY += event.deltaY;
		Input._mouse.deltaZ += event.deltaZ;
	};

	function pushEvent(event) {
		Input._eventQueue.push(event);
	}

	window.addEventListener('keyup', pushEvent, false);
	window.addEventListener('keydown', pushEvent, false);
	window.addEventListener('mousewheel', pushEvent, false);

	Core.Input = Input;
	return Input;
});
