const timerStates = {
  READY: "ready",
  ACTIVE: "active",
  STOPPED: "stopped",
  FINISHED: "finished",
};

/**
 * Model representing a timer with its own tick mechanism.
 * @todo Add checks in methods. For example, remainingMilliseconds() returns
 * a value even if the timer is finished or didn't started.
 */
export default class Timer {
  _initialDuration = 0;
  _duration = 0;
  _launchTime = 0;
  _onSecondTick = null;
  _onFinish = null;
  _timeoutId = 0;
  _baseTickInterval = 1000;
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

  get isStopped() {
    return this._state === timerStates.STOPPED;
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
      this._duration - this._calcPassedMiliseconds() :
      this._duration;
  }

  _calcPassedMiliseconds() {
    return Date.now() - this._launchTime;
  }

  _tick() {
    if (this.remainingMilliseconds <= 0) {
      this.finish();
      return;
    }
    this._onSecondTick(this._extractTimeParts(this.remainingMilliseconds));
    this._timeoutId = setTimeout(() => this._tick(), this._calcTickInterval());
  }

  _calcTickInterval() {
    const drift = this._calcPassedMiliseconds() % this._baseTickInterval;
    const tickIntervalAffectedByDrift = this._baseTickInterval - drift;
    return tickIntervalAffectedByDrift;
  }

  _extractTimeParts(milliseconds) {
    const time = new Date(milliseconds);
    return {
      seconds: time.getSeconds(),
      minutes: time.getMinutes()
    };
  }

  _stopTicking() {
    clearTimeout(this._timeoutId);
    this._timeoutId = 0;
  }

  _launch() {
    this._launchTime = Date.now();
    this._timeoutId = setTimeout(() => this._tick(), this._baseTickInterval);
  }

  start() {
    if (this._state === timerStates.READY) {
      this._launch();
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
      this._launch();
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
      this._onFinish();
      this._state = timerStates.FINISHED;
    }
  }

  restart() {
    this.reset();
    this.start();
  }
}