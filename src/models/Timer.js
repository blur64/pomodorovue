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

  get isActive() {
    return Boolean(this._intervalId);
  }

  get duration() {
    return this._duration;
  }

  get remainingMilliseconds() {
    return this._duration - (Date.now() - this._startTime);
  }

  _tick() {
    if (this.remainingMilliseconds <= 0) {
      clearInterval(this._intervalId);
      this._intervalId = 0;
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

  start() {
    this._startTime = Date.now();
    this._intervalId = setInterval(() => this._tick(), 1000);
  }

  stop() {
    clearInterval(this._intervalId);
    this._intervalId = 0;
    this._duration = this.remainingMilliseconds;
  }

  continue() {
    this.start();
  }

  restart() {
    this.reset();
    this.start();
  }

  reset() {
    clearInterval(this._intervalId);
    this._intervalId = 0;
    this._duration = this._initialDuration;
  }
}