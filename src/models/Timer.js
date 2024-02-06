export default class Timer {
  #initialDuration = 0;
  #duration = 0;
  #startTime = 0;
  #onSecondTick = null;
  #onFinish = null;
  #intervalId = 0;

  constructor({ duration: { seconds, minutes }, onSecondTick, onFinish }) {
    this.#initialDuration = minutes * 60 * 1000 + seconds * 1000;
    this.#duration = this.#initialDuration;
    this.#onSecondTick = onSecondTick;
    this.#onFinish = onFinish;
  }

  get isActive() {
    return Boolean(this.#intervalId);
  }

  get duration() {
    return this.#duration;
  }

  get remainingMilliseconds() {
    return this.#duration - (Date.now() - this.#startTime);
  }

  #tick() {
    if (this.remainingMilliseconds <= 0) {
      clearInterval(this.#intervalId);
      this.#onFinish();
      return;
    }
    this.#onSecondTick(this.#extractTimeParts(this.remainingMilliseconds));
  }

  #extractTimeParts(milliseconds) {
    const time = new Date(milliseconds);
    return {
      seconds: time.getSeconds(),
      minutes: time.getMinutes()
    };
  }

  start() {
    this.#startTime = Date.now();
    this.#intervalId = setInterval(() => this.#tick(), 1000);
  }

  stop() {
    this.clearInterval(this.#intervalId);
    this.#duration = this.remainingMilliseconds;
  }

  continue() {
    this.start();
  }

  restart() {
    this.reset();
    this.start();
  }

  reset() {
    clearInterval(this.#intervalId);
    this.#duration = this.#startTime;
  }
}