<template>
  <v-card class="mt-4">
    <v-card-item class="text-center">
      <span class="text-h2">
        {{ minutesToDisplay }} : {{ secondsToDisplay }}
      </span>
    </v-card-item>

    <v-card-actions class="d-flex justify-center align-center">
      <v-btn
        prepend-icon="mdi-play"
        @click="startTicking"
      >
        Start
      </v-btn>
      <v-btn
        prepend-icon="mdi-stop"
        @click="stopTicking"
      >
        Stop
      </v-btn>
      <v-btn
        prepend-icon="mdi-restore"
        @click="resetTimer"
      >
        Reset
      </v-btn>
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
  name: "TheTimer",

  props: {
    startTimeInMinutes: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  emits: [
    "finished",
    "registerTimerResetter",
    "registerTimerStarter"
  ],

  data() {
    return {
      currentTimeInSeconds: 0,
      timer: this.getTimer(),
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

  created() {
    this.init();
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

    getTimer() {
      return new Timer({
        duration: {
          minutes: this.startTimeInMinutes,
          seconds: 0,
        },
        onSecondTick: this.tick,
        onFinish: this.onFinish,
      });
    },

    init() {
      this.currentTimeInSeconds = 60 * this.startTimeInMinutes;
      this.timer = this.getTimer();

      this.$emit("registerTimerResetter", this.resetTimer);
      this.$emit("registerTimerStarter", this.startTicking);
    },
  },
};
</script>
