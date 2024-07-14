<template>
  <v-card class="mt-4">
    <v-card-item class="text-center">
      <span class="text-h2">
        {{ minutesToDisplay }} : {{ secondsToDisplay }}
      </span>
    </v-card-item>

    <v-card-actions class="d-flex justify-center align-center">
      <v-btn @click="startTicking" prepend-icon="mdi-play">Start</v-btn>
      <v-btn @click="stopTicking" prepend-icon="mdi-stop">Stop</v-btn>
      <v-btn @click="resetTimer" prepend-icon="mdi-restore">Reset</v-btn>
    </v-card-actions>

    <v-card-item>
      <v-progress-linear
        :model-value="passedTimePercent"
        :height="6"
        color="purple"
      />
    </v-card-item>
  </v-card>
</template>

<script>
import Timer from "@/models/Timer";

export default {
  emits: [
    'finished',
    'registerTimerResetter',
    'registerTimerStarter'
  ],

  props: {
    startTimeInMinutes: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  data() {
    return {
      currentTimeInSeconds: 0,
      timer: new Timer({
        duration: {
          minutes: this.startTimeInMinutes,
          seconds: 0,
        },
        onSecondTick: this.tick,
        onFinish: this.onFinish,
      }),
    };
  },

  computed: {
    minutesToDisplay() {
      return Math.trunc(this.currentTimeInSeconds / 60);
    },

    secondsToDisplay() {
      return this.zeroStartFormat(this.currentTimeInSeconds % 60);
    },

    passedTimePercent() {
      const allSeconds = 60 * this.startTimeInMinutes;
      const passedSeconds = allSeconds - this.currentTimeInSeconds;
      const percent = Math.round((passedSeconds / allSeconds) * 10000) / 100;

      return percent;
    },
  },

  methods: {
    zeroStartFormat(number) {
      if (-10 < number && number < 10) {
        return "0" + number;
      }

      return number;
    },

    stopTicking() {
      this.timer.stop();
    },

    tick({ minutes, seconds }) {
      this.currentTimeInSeconds = minutes * 60 + seconds;
    },

    startTicking() {
      if (!this.timer.isActive && this.currentTimeInSeconds) {
        this.timer.isStopped
          ? this.timer.continue()
          : this.timer.start();
      }
    },

    onFinish() {
      this.$emit("finished");
    },

    resetTimer() {
      this.timer.reset();
      this.init();
    },

    init() {
      this.currentTimeInSeconds = 60 * this.startTimeInMinutes;
      this.timer = new Timer({
        duration: {
          minutes: this.startTimeInMinutes,
          seconds: 0,
        },
        onSecondTick: this.tick,
        onFinish: this.onFinish,
      });

      this.$emit("registerTimerResetter", this.resetTimer);
      this.$emit("registerTimerStarter", this.startTicking);
    },
  },

  created() {
    this.init();
  },
};
</script>
