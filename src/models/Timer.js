const timerStates = {
  READY: "ready",
  ACTIVE: "active",
  STOPPED: "stopped",
  FINISHED: "finished",
};

/**
 * Model representing a timer with its own tick mechanism.
 * @todo Add checks in methods. For example, _remainingMilliseconds() returns
 * a value even if the timer is finished or didn't started.
 */
export default class Timer {
  _duration = 0;
  _millisecondsLeftToWork = 0;
  _launchTime = 0;
  _timeoutId = 0;
  _baseTickInterval = 1000;
  _state = timerStates.READY;
  
  _onSecondTick = null;
  _onFinish = null;

  constructor({ duration, onSecondTick, onFinish }) {
    this._validateParams({ duration, onSecondTick, onFinish });

    this._duration = duration.minutes * 60 * 1000 + duration.seconds * 1000;
    this._millisecondsLeftToWork = this._duration;
    this._onSecondTick = onSecondTick ?? function () {};
    this._onFinish = onFinish ?? function () {};
  }

  get _remainingMilliseconds() {
    return this.isActive
      ? this._millisecondsLeftToWork - this._passedMillisecondsFromLaunchMoment
      : this._millisecondsLeftToWork;
  }

  get _passedMillisecondsFromLaunchMoment() {
    return Date.now() - this._launchTime;
  }

  _toActive() {
    this._state = timerStates.ACTIVE;
  }

  _toStopped() {
    this._state = timerStates.STOPPED;
  }

  _toReady() {
    this._state = timerStates.READY;
  }

  _toFinished() {
    this._state = timerStates.FINISHED;
  }

  _validateParams({ duration, onSecondTick, onFinish }) {
    if (duration.seconds < 0 || duration.minutes < 0) {
      throw new Error('Provided duration should be more than zero');
    }

    if (onSecondTick !== undefined && !(onSecondTick instanceof Function)
        || onFinish !== undefined && !(onFinish instanceof Function)) {
      throw new TypeError('Provided callbacks are not functions');
    }
  }

  _extractTimeParts(milliseconds) {
    const roundedMilliseconds = Math.round(milliseconds / 1000) * 1000;
    const time = new Date(roundedMilliseconds);

    return {
      seconds: time.getSeconds(),
      minutes: time.getMinutes()
    };
  }

  _tick() {
    if (this._remainingMilliseconds <= 0) {
      this._onSecondTick(this._extractTimeParts(0));
      this.finish();
      return;
    }

    this._onSecondTick(this._extractTimeParts(this._remainingMilliseconds));
    this._timeoutId = setTimeout(() => this._tick(), this._calcTickInterval());
  }

  _calcTickInterval() {
    const drift = this._passedMillisecondsFromLaunchMoment % this._baseTickInterval;
    const tickIntervalAffectedByDrift = this._baseTickInterval - drift;

    return tickIntervalAffectedByDrift;
  }

  _stopTicking() {
    clearTimeout(this._timeoutId);
    this._timeoutId = 0;
  }

  _launch() {
    this._launchTime = Date.now();
    this._timeoutId = setTimeout(() => this._tick(), this._baseTickInterval);
  }

  /** Public */

  get isFinished() {
    return this._state === timerStates.FINISHED;
  }

  get isActive() {
    return this._state === timerStates.ACTIVE;
  }

  get isStopped() {
    return this._state === timerStates.STOPPED;
  }

  get isReady() {
    return this._state === timerStates.READY;
  }

  start() {
    if (this.isReady) {
      this._launch();
      this._toActive();
    }
  }

  stop() {
    if (this.isActive) {
      this._millisecondsLeftToWork = Math.ceil(this._remainingMilliseconds / 1000) * 1000;
      this._stopTicking();
      this._toStopped();
    }
  }

  continue() {
    if (this.isStopped) {
      this._launch();
      this._toActive();
    }
  }

  reset() {
    if (this.isReady) { 
      return; 
    }

    if (!this.isFinished) { 
      this._stopTicking(); 
    }

    this._millisecondsLeftToWork = this._duration;
    this._toReady();
  }

  finish() {
    if (this.isActive) {
      this._stopTicking();
      this._onFinish();
      this._toFinished();
    }
  }

  restart() {
    this.reset();
    this.start();
  }
}
