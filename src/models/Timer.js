const timerStates = {
  READY: "ready",
  ACTIVE: "active",
  STOPPED: "stopped",
  FINISHED: "finished",
};

export default class Timer {
  _allDuration = 0;
  _remainingDuration = 0;
  _launchTime = 0;
  _timeoutId = 0;
  _baseTickInterval = 1000;
  _state = timerStates.READY;

  _onSecondTick = null;
  _onFinish = null;

  constructor({ duration, onSecondTick = () => {}, onFinish = () => {} }) {
    this._validateParams({ duration, onSecondTick, onFinish });

    this._allDuration = duration.minutes * 60 * 1000 + duration.seconds * 1000;
    this._remainingDuration = this._allDuration;
    this._onSecondTick = onSecondTick;
    this._onFinish = onFinish;
  }

  get _millisecondsLeftToWork() {
    return this._remainingDuration - this._passedMillisecondsFromLaunchMoment;
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
      throw new Error("Provided duration should be more than zero");
    }

    if (!(onSecondTick instanceof Function && onFinish instanceof Function)) {
      throw new TypeError("Provided callbacks are not functions");
    }
  }

  _ceilTimestampMilliseconds(timestamp) {
    return Math.ceil(timestamp / 1000) * 1000;
  }

  _roundTimestampMilliseconds(timestamp) {
    return Math.round(timestamp / 1000) * 1000;
  }

  _extractTimeParts(milliseconds) {
    const roundedMilliseconds = this._roundTimestampMilliseconds(milliseconds);
    const time = new Date(roundedMilliseconds);

    return {
      seconds: time.getSeconds(),
      minutes: time.getMinutes()
    };
  }

  _tick() {
    if (this._millisecondsLeftToWork <= 0) {
      this._onSecondTick(this._extractTimeParts(0));
      this.finish();

      return;
    }

    this._onSecondTick(this._extractTimeParts(this._millisecondsLeftToWork));
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
      this._remainingDuration = this._ceilTimestampMilliseconds(this._millisecondsLeftToWork);
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

    this._remainingDuration = this._allDuration;
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
