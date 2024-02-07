const timerStates = {
  READY: "ready",
  ACTIVE: "active",
  STOPPED: "stopped",
  FINISHED: "finished",
};

/**
 * Model representing a timer with its own tick mechanism.
 * @todo Do tick mechanism more accurate (time of next tick shouldn't be 
 * constant, it should be calculated). Use setTimeout() html api.
 * @todo Add checks in methods. For example, remainingMilliseconds() returns
 * a value even if the timer is finished or didn't started.
 */
export default class Timer {
  _initialDuration = 0;
  _duration = 0;
  _startTime = 0;
  _onSecondTick = null;
  _onFinish = null;
  _intervalId = 0;
  _state = timerStates.READY;

  constructor({ duration: { seconds, minutes }, onSecondTick, onFinish }) {
    this._initialDuration = minutes * 60 * 1000 + seconds * 1000;
    this._duration = this._initialDuration;
    this._onSecondTick = onSecondTick;
    this._onFinish = onFinish;
  }

  setDuration({ seconds, minutes }) {
    this._initialDuration = minutes * 60 * 1000 + seconds * 1000;
    this._duration = this._initialDuration;
  }

  get isFinished() {
    return this._state === timerStates.FINISHED;
  }

  get isActive() {
    return this._state === timerStates.ACTIVE;
  }

  get duration() {
    return this._duration;
  }

  /**
   * Calculate and returns the time after which the timer will be stopped.
   * If timer is stopped or hasn't been started yet, returns 
   * @returns {number} Time in milliseconds
   */
  get remainingMilliseconds() {
    return this.isActive ?
      this._duration - (Date.now() - this._startTime) :
      this._duration;
  }

  _tick() {
    if (this.remainingMilliseconds <= 0) {
      this.finish();
      this._onFinish();
      return;
    }
    this._onSecondTick(this._extractTimeParts(this.remainingMilliseconds));
  }

  _extractTimeParts(milliseconds) {
    const time = new Date(milliseconds);
    return {
      seconds: time.getSeconds(),
      minutes: time.getMinutes()
    };
  }

  _stopTicking() {
    clearInterval(this._intervalId);
    this._intervalId = 0;
  }

  _run() {
    this._startTime = Date.now();
    this._intervalId = setInterval(() => this._tick(), 1000);
  }

  start() {
    if (this._state === timerStates.READY) {
      this._run();
      this._state = timerStates.ACTIVE;
    }
  }

  stop() {
    if (this._state === timerStates.ACTIVE) {
      this._duration = this.remainingMilliseconds;
      this._stopTicking();
      this._state = timerStates.STOPPED;
    }
  }

  continue() {
    if (this._state === timerStates.STOPPED) {
      this._run();
      this._state = timerStates.ACTIVE;
    }
  }

  reset() {
    if (this._state !== timerStates.READY) {
      if (this._state !== timerStates.FINISHED) {
        this._stopTicking();
      }
      this._duration = this._initialDuration;
      this._state = timerStates.READY;
    }
  }

  finish() {
    if (this._state === timerStates.ACTIVE) {
      this._stopTicking();
      this._state = timerStates.FINISHED;
    }
  }

  restart() {
    this.reset();
    this.start();
  }
}