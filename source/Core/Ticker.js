/*
 * Ticker
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* modified to work as an instance to allow multiple unconencted timers and wrapped in require.js 'define' */

define(
	'Core/Ticker',
	['Core',
		'Core/EventDispatcher', 'Core/Event'],
	function (Core) {
	"use strict";

	// constructor:
	/**
	 * The Ticker provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
	 * event to be notified when a set time interval has elapsed.
	 *
	 * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
	 * when under high CPU load. The Ticker class uses a static interface (ex. `Ticker.framerate = 30;`) and
	 * can not be instantiated.
	 *
	 * <h4>Example</h4>
	 *
	 *      createjs.Ticker.addEventListener("tick", handleTick);
	 *      function handleTick(event) {
	 *          // Actions carried out each tick (aka frame)
	 *          if (!event.paused) {
	 *              // Actions carried out when the Ticker is not paused.
	 *          }
	 *      }
	 *
	 * @class Ticker
	 * @uses EventDispatcher
	 * @static
	 **/
	function Ticker(timingMode) {
		/**
		 * When the ticker is paused, all listeners will still receive a tick event, but the <code>paused</code> property
		 * of the event will be `true`. Also, while paused the `runTime` will not increase. See {{#crossLink "Ticker/tick:event"}}{{/crossLink}},
		 * {{#crossLink "Ticker/getTime"}}{{/crossLink}}, and {{#crossLink "Ticker/getEventTime"}}{{/crossLink}} for more
		 * info.
		 *
		 * <h4>Example</h4>
		 *
		 *      createjs.Ticker.addEventListener("tick", handleTick);
		 *      createjs.Ticker.paused = true;
		 *      function handleTick(event) {
		 *          console.log(event.paused,
		 *          	createjs.Ticker.getTime(false),
		 *          	createjs.Ticker.getTime(true));
		 *      }
		 *
		 * @property paused
		 * @static
		 * @type {Boolean}
		 * @default false
		 **/
		this.paused = false;

		// mix-ins:
		// EventDispatcher methods:
		//Ticker.removeEventListener = null;
		//this.removeAllEventListeners = null;
		//Ticker.dispatchEvent = null;
		//Ticker.hasEventListener = null;
		//Ticker._listeners = null;
		//Core.EventDispatcher.initialize(Ticker); // inject EventDispatcher methods.
		//Ticker._addEventListener = Ticker.addEventListener;
		//Ticker.addEventListener = function () {
		//			!this._inited && Ticker.init();
		//		return Ticker._addEventListener.apply(Ticker, arguments);
		//};

		// private static properties:
		/**
		 * @property _inited
		 * @static
		 * @type {Boolean}
		 * @protected
		 **/
		this._inited = false;

		/**
		 * @property _startTime
		 * @static
		 * @type {Number}
		 * @protected
		 **/
		this._startTime = 0;

		/**
		 * @property _pausedTime
		 * @static
		 * @type {Number}
		 * @protected
		 **/
		this._pausedTime = 0;

		/**
		 * The number of ticks that have passed
		 * @property _ticks
		 * @static
		 * @type {Number}
		 * @protected
		 **/
		this._ticks = 0;

		/**
		 * The number of ticks that have passed while Ticker has been paused
		 * @property _pausedTicks
		 * @static
		 * @type {Number}
		 * @protected
		 **/
		this._pausedTicks = 0;

		/**
		 * @property _interval
		 * @static
		 * @type {Number}
		 * @protected
		 **/
		this._interval = 50;

		/**
		 * @property _lastTime
		 * @static
		 * @type {Number}
		 * @protected
		 **/
		this._lastTime = 0;

		/**
		 * @property _times
		 * @static
		 * @type {Array}
		 * @protected
		 **/
		this._times = null;

		/**
		 * @property _tickTimes
		 * @static
		 * @type {Array}
		 * @protected
		 **/
		this._tickTimes = null;

		/**
		 * Stores the timeout or requestAnimationFrame id.
		 * @property _timerId
		 * @static
		 * @type {Number}
		 * @protected
		 **/
		this._timerId = null;

		/**
		 * True if currently using requestAnimationFrame, false if using setTimeout. This may be different than timingMode
		 * if that property changed and a tick hasn't fired.
		 * @property _raf
		 * @static
		 * @type {Boolean}
		 * @protected
		 **/
		this._raf = true;

		/**
		 * Specifies the timing api (setTimeout or requestAnimationFrame) and mode to use. See
		 * {{#crossLink "Ticker/TIMEOUT"}}{{/crossLink}}, {{#crossLink "Ticker/RAF"}}{{/crossLink}}, and
		 * {{#crossLink "Ticker/RAF_SYNCHED"}}{{/crossLink}} for mode details.
		 * @property timingMode
		 * @static
		 * @type {String}
		 * @default Ticker.TIMEOUT
		 **/
		this.timingMode = timingMode;

		/**
		 * Specifies a maximum value for the delta property in the tick event object. This is useful when building time
		 * based animations and systems to prevent issues caused by large time gaps caused by background tabs, system sleep,
		 * alert dialogs, or other blocking routines. Double the expected frame duration is often an effective value
		 * (ex. maxDelta=50 when running at 40fps).
		 *
		 * This does not impact any other values (ex. time, runTime, etc), so you may experience issues if you enable maxDelta
		 * when using both delta and other values.
		 *
		 * If 0, there is no maximum.
		 * @property maxDelta
		 * @static
		 * @type {number}
		 * @default 0
		 */
		this.maxDelta = 0;
		
		this.init();
	}

	Ticker.prototype = Object.create(Core.EventDispatcher.prototype);
	Ticker.prototype.constructor = Ticker;
	
	// constants:
	/**
	 * In this mode, Ticker uses the requestAnimationFrame API, but attempts to synch the ticks to target framerate. It
	 * uses a simple heuristic that compares the time of the RAF return to the target time for the current frame and
	 * dispatches the tick when the time is within a certain threshold.
	 *
	 * This mode has a higher variance for time between frames than {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}},
	 * but does not require that content be time based as with {{#crossLink "Ticker/RAF:property"}}{{/crossLink}} while
	 * gaining the benefits of that API (screen synch, background throttling).
	 *
	 * Variance is usually lowest for framerates that are a divisor of the RAF frequency. This is usually 60, so
	 * framerates of 10, 12, 15, 20, and 30 work well.
	 *
	 * Falls back to {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
	 * supported.
	 * @property RAF_SYNCHED
	 * @static
	 * @type {String}
	 * @default "synched"
	 * @readonly
	 **/
	Ticker.RAF_SYNCHED = "synched";

	/**
	 * In this mode, Ticker passes through the requestAnimationFrame heartbeat, ignoring the target framerate completely.
	 * Because requestAnimationFrame frequency is not deterministic, any content using this mode should be time based.
	 * You can leverage {{#crossLink "Ticker/getTime"}}{{/crossLink}} and the {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
	 * event object's "delta" properties to make this easier.
	 *
	 * Falls back on {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
	 * supported.
	 * @property RAF
	 * @static
	 * @type {String}
	 * @default "raf"
	 * @readonly
	 **/
	Ticker.RAF = "raf";

	/**
	 * In this mode, Ticker uses the setTimeout API. This provides predictable, adaptive frame timing, but does not
	 * provide the benefits of requestAnimationFrame (screen synch, background throttling).
	 * @property TIMEOUT
	 * @static
	 * @type {String}
	 * @default "timeout"
	 * @readonly
	 **/
	Ticker.TIMEOUT = "timeout";

	// static events:
	/**
	 * Dispatched each tick. The event will be dispatched to each listener even when the Ticker has been paused using
	 * {{#crossLink "Ticker/setPaused"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *
	 *      createjs.Ticker.addEventListener("tick", handleTick);
	 *      function handleTick(event) {
	 *          console.log("Paused:", event.paused, event.delta);
	 *      }
	 *
	 * @event tick
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {Boolean} paused Indicates whether the ticker is currently paused.
	 * @param {Number} delta The time elapsed in ms since the last tick.
	 * @param {Number} time The total time in ms since Ticker was initialized.
	 * @param {Number} runTime The total time in ms that Ticker was not paused since it was initialized. For example,
	 * 	you could determine the amount of time that the Ticker has been paused since initialization with `time-runTime`.
	 * @since 0.6.0
	 */


	// static getter / setters:
	/**
	 * Use the {{#crossLink "Ticker/interval:property"}}{{/crossLink}} property instead.
	 * @method setInterval
	 * @static
	 * @param {Number} interval
	 * @deprecated
	 **/
	Ticker.prototype.setInterval = function (interval) {
		this._interval = interval;
		if (!this._inited) {
			return;
		}
		this._setupTick();
	};

	/**
	 * Use the {{#crossLink "Ticker/interval:property"}}{{/crossLink}} property instead.
	 * @method getInterval
	 * @static
	 * @return {Number}
	 * @deprecated
	 **/
	Ticker.prototype.getInterval = function () {
		return this._interval;
	};

	/**
	 * Use the {{#crossLink "Ticker/framerate:property"}}{{/crossLink}} property instead.
	 * @method setFPS
	 * @static
	 * @param {Number} value
	 * @deprecated
	 **/
	Ticker.prototype.setFPS = function (value) {
		this.setInterval(1000 / value);
	};

	/**
	 * Use the {{#crossLink "Ticker/framerate:property"}}{{/crossLink}} property instead.
	 * @method getFPS
	 * @static
	 * @return {Number}
	 * @deprecated
	 **/
	Ticker.prototype.getFPS = function () {
		return 1000 / this._interval;
	};

	/**
	 * Indicates the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
	 * Note that actual time between ticks may be more than specified depending on CPU load.
	 * This property is ignored if the ticker is using the `RAF` timing mode.
	 * @property interval
	 * @static
	 * @type {Number}
	 **/

	/**
	 * Indicates the target frame rate in frames per second (FPS). Effectively just a shortcut to `interval`, where
	 * `framerate == 1000/interval`.
	 * @property framerate
	 * @static
	 * @type {Number}
	 **/
	try {
		Object.defineProperties(Ticker.prototype, {
			interval: {
				get: Ticker.prototype.getInterval,
				set: Ticker.prototype.setInterval
			},
			framerate: {
				get: Ticker.prototype.getFPS,
				set: Ticker.prototype.setFPS
			}
		});
	} catch (e) {
		console.error(e);
	}

	// public static methods:
	/**
	 * Starts the tick. This is called automatically when the first listener is added.
	 * @method init
	 * @static
	 **/
	Ticker.prototype.init = function () {
		if (this._inited) {
			return;
		}
		this._inited = true;
		this._times = [];
		this._tickTimes = [];
		this._startTime = this._getTime();
		this._times.push(this._lastTime = 0);
		this.interval = this._interval;
	};

	/**
	 * Stops the Ticker and removes all listeners. Use init() to restart the Ticker.
	 * @method reset
	 * @static
	 **/
	Ticker.prototype.reset = function () {
		if (this._raf) {
			var f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
			f && f(this._timerId);
		} else {
			clearTimeout(this._timerId);
		}
		this.removeAllEventListeners("tick");
		this._timerId = this._times = this._tickTimes = null;
		this._startTime = this._lastTime = this._ticks = 0;
		this._inited = false;
	};

	/**
	 * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
	 * because it only measures the time spent within the tick execution stack.
	 *
	 * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
	 * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
	 * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
	 *
	 * Example 2: With a target FPS of 30, getFPS() returns 10fps, which indicates an average of 100ms between the end of
	 * one tick and the end of the next. However, getMeasuredTickTime() returns 20ms. This would indicate that something
	 * other than the tick is using ~80ms (another script, DOM rendering, etc).
	 * @method getMeasuredTickTime
	 * @static
	 * @param {Number} [ticks] The number of previous ticks over which to measure the average time spent in a tick.
	 * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
	 * @return {Number} The average time spent in a tick in milliseconds.
	 **/
	Ticker.prototype.getMeasuredTickTime = function (ticks) {
		var ttl = 0,
		times = this._tickTimes;
		if (!times || times.length < 1) {
			return -1;
		}

		// by default, calculate average for the past ~1 second:
		ticks = Math.min(times.length, ticks || (this.getFPS() | 0));
		for (var i = 0; i < ticks; i++) {
			ttl += times[i];
		}
		return ttl / ticks;
	};

	/**
	 * Returns the actual frames / ticks per second.
	 * @method getMeasuredFPS
	 * @static
	 * @param {Number} [ticks] The number of previous ticks over which to measure the actual frames / ticks per second.
	 * Defaults to the number of ticks per second.
	 * @return {Number} The actual frames / ticks per second. Depending on performance, this may differ
	 * from the target frames per second.
	 **/
	Ticker.prototype.getMeasuredFPS = function (ticks) {
		var times = this._times;
		if (!times || times.length < 2) {
			return -1;
		}

		// by default, calculate fps for the past ~1 second:
		ticks = Math.min(times.length - 1, ticks || (this.getFPS() | 0));
		return 1000 / ((times[0] - times[ticks]) / ticks);
	};

	/**
	 * Use the {{#crossLink "Ticker/paused:property"}}{{/crossLink}} property instead.
	 * @method setPaused
	 * @static
	 * @param {Boolean} value
	 * @deprecated
	 **/
	Ticker.prototype.setPaused = function (value) {
		// TODO: deprecated.
		this.paused = value;
	};

	/**
	 * Use the {{#crossLink "Ticker/paused:property"}}{{/crossLink}} property instead.
	 * @method getPaused
	 * @static
	 * @return {Boolean}
	 * @deprecated
	 **/
	Ticker.prototype.getPaused = function () {
		// TODO: deprecated.
		return this.paused;
	};

	/**
	 * Returns the number of milliseconds that have elapsed since Ticker was initialized via {{#crossLink "Ticker/init"}}.
	 * Returns -1 if Ticker has not been initialized. For example, you could use
	 * this in a time synchronized animation to determine the exact amount of time that has elapsed.
	 * @method getTime
	 * @static
	 * @param {Boolean} [runTime=false] If true only time elapsed while Ticker was not paused will be returned.
	 * If false, the value returned will be total time elapsed since the first tick event listener was added.
	 * @return {Number} Number of milliseconds that have elapsed since Ticker was initialized or -1.
	 **/
	Ticker.prototype.getTime = function (runTime) {
		return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
	};

	/**
	 * Similar to the {{#crossLink "Ticker/getTime"}}{{/crossLink}} method, but returns the time on the most recent {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
	 * event object.
	 * @method getEventTime
	 * @static
	 * @param runTime {Boolean} [runTime=false] If true, the runTime property will be returned instead of time.
	 * @returns {number} The time or runTime property from the most recent tick event or -1.
	 */
	Ticker.prototype.getEventTime = function (runTime) {
		return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
	};

	/**
	 * Returns the number of ticks that have been broadcast by Ticker.
	 * @method getTicks
	 * @static
	 * @param {Boolean} pauseable Indicates whether to include ticks that would have been broadcast
	 * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
	 * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
	 * value. The default value is false.
	 * @return {Number} of ticks that have been broadcast.
	 **/
	Ticker.prototype.getTicks = function (pauseable) {
		return this._ticks - (pauseable ? this._pausedTicks : 0);
	};

	// private static methods:
	/**
	 * @method _handleSynch
	 * @static
	 * @protected
	 **/
	Ticker.prototype._handleSynch = function () {
		this._timerId = null;
		this._setupTick();

		// run if enough time has elapsed, with a little bit of flexibility to be early:
		if (this._getTime() - this._lastTime >= (this._interval - 1) * 0.97) {
			this._tick();
		}
	};

	/**
	 * @method _handleRAF
	 * @static
	 * @protected
	 **/
	Ticker.prototype._handleRAF = function () {
		this._timerId = null;
		this._setupTick();
		this._tick();
	};

	/**
	 * @method _handleTimeout
	 * @static
	 * @protected
	 **/
	Ticker.prototype._handleTimeout = function () {
		this._timerId = null;
		this._setupTick();
		this._tick();
	};

	/**
	 * @method _setupTick
	 * @static
	 * @protected
	 **/
	Ticker.prototype._setupTick = function () {
		if (this._timerId != null) {
			return;
		} // avoid duplicates

		var mode = this.timingMode || (Ticker.useRAF && Ticker.RAF_SYNCHED);
		var that = this;
		if (mode == Ticker.RAF_SYNCHED || mode == Ticker.RAF) {
			var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
			if (f) {
				this._timerId = f(mode == Ticker.RAF ? function(t){that._handleRAF(t);} : function(t){that._handleSynch(t);});
				this._raf = true;
				return;
			}
		}
		this._raf = false;
		this._timerId = setTimeout(function(t){that._handleTimeout(t);}, this._interval);
	};

	/**
	 * @method _tick
	 * @static
	 * @protected
	 **/
	Ticker.prototype._tick = function () {
		var paused = this.paused;
		var time = this._getTime();
		var elapsedTime = time - this._lastTime;
		this._lastTime = time;
		this._ticks++;

		if (paused) {
			this._pausedTicks++;
			this._pausedTime += elapsedTime;
		}

		if (this.hasEventListener("tick")) {
			var event = new Core.Event("tick");
			var maxDelta = this.maxDelta;
			event.delta = (maxDelta && elapsedTime > maxDelta) ? maxDelta : elapsedTime;
			event.paused = paused;
			event.time = time;
			event.runTime = time - this._pausedTime;
			this.dispatchEvent(event);
		}

		this._tickTimes.unshift(this._getTime() - time);
		while (this._tickTimes.length > 100) {
			this._tickTimes.pop();
		}

		this._times.unshift(time);
		while (this._times.length > 100) {
			this._times.pop();
		}
	};

	/**
	 * @method _getTime
	 * @static
	 * @protected
	 **/
	var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
	Ticker.prototype._getTime = function () {
		return ((now && now.call(performance)) || (new Date().getTime())) - this._startTime;
	};

	Core.Ticker = Ticker;
	return Ticker
});
