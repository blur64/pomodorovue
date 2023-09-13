<template>
  <v-card class="mt-4">
    <v-card-item class="text-center">
      <span class="text-h2"
        >{{ minutesToDisplay }} : {{ secondsToDisplay }}</span
      >
    </v-card-item>

    <v-card-actions class="d-flex justify-center align-center">
      <v-btn @click="startTicking">Start</v-btn>
      <v-btn @click="stopTicking">Stop</v-btn>
      <v-btn @click="resetTimer">Reset</v-btn>
    </v-card-actions>

    <v-card-item>
      <v-progress-linear
        :model-value="passedTimePercent"
        :height="6"
        color="purple"
      ></v-progress-linear>
    </v-card-item>
  </v-card>
</template>

<script>
export default {
  emits: {
    finished: null,
  },

  props: {
    startTimeInMinutes: {
      type: Number,
      required: true,
      default: 0,
    },
    currentTimerId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      timerIntervalId: "",
      currentTimeInSeconds: 0,
      // startTimeInMinutes: 0,
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
      if (this.timerIntervalId) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = "";
      }
    },

    tick() {
      if (this.currentTimeInSeconds === 0) {
        this.stopTicking();
        this.$emit("finished", this.startTicking);
      } else {
        this.currentTimeInSeconds -= 1;
      }
    },

    startTicking() {
      if (!this.timerIntervalId && this.currentTimeInSeconds) {
        this.timerIntervalId = setInterval(this.tick, 1000);
      }
    },

    resetTimer() {
      this.stopTicking();
      this.initTimerSettings();
    },

    initTimerSettings() {
      // this.startTimeInMinutes = this.initialStartTimeInMinutes;
      this.currentTimeInSeconds = 60 * this.startTimeInMinutes;
    },
  },

  created() {
    this.initTimerSettings();
  },

  watch: {
    currentTimerId() {
      this.resetTimer();
    },
    startTimeInMinutes() {
      this.resetTimer();
    },
  },
};
</script>
