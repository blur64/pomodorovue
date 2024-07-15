<template>
  <app-container>
    <v-row>
      <v-col
        sm="6"
        offset-sm="3"
      >
        <v-dialog
          v-model="isSettingsOpened"
          max-width="300px"
        >
          <template #activator="{ props }">
            <v-btn
              color="primary"
              v-bind="props"
            >
              Settings
            </v-btn>
          </template>

          <the-settings
            :timers-settings="timers"
            :auto-starting-settings="autoStartingSettings"
            @timer-time-changed="changeTimerTime"
            @auto-starting-settings-changed="changeAutoStartingSettings"
            @all-settings-configured="closeSettingsAndSaveTimersUsingApi"
          />
        </v-dialog>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        sm="6"
        offset-sm="3"
      >
        <the-timer-navbar
          :selected-timer="currentTimer"
          :timers="timers"
          @update:selected-timer="setCurrentTimer"
        />

        <the-timer
          :start-time-in-minutes="currentTimer.timeInMinutes"
          @finished="handleTimerFinished"
          @register-timer-resetter="resetTimer = $event"
          @register-timer-starter="startTimer = $event"
        />
      </v-col>
    </v-row>
  </app-container>
</template>

<script>
import TheTimerNavbar from "./components/TheTimerNavbar.vue";
import TheTimer from "./components/TheTimer.vue";
import TheSettings from "./components/TheSettings.vue";
import AppContainer from "./layouts/AppContainer.vue";

import {
  getTimersSettings,
  saveTimersSettings,
  getSoundSettings,
  getAutoStartingSettings,
} from "./api.js";

export default {
  name: "App",

  components: {
    TheTimerNavbar,
    TheTimer,
    TheSettings,
    AppContainer,
  },

  data() {
    return {
      isSettingsOpened: false,

      timers: [],
      currentTimer: null,
      sound: {},

      autoStartingSettings: {
        autoStart: false,
        longBreakInterval: 0,
      },

      finishedPomodorosCount: 0,
      resetTimer: null,
      startTimer: null,
    };
  },

  created() {
    this.timers = getTimersSettings();
    this.setCurrentTimer(this.findTimer(0));

    const soundSettings = getSoundSettings();
    this.sound = new Audio(soundSettings.path);
    this.sound.volume = soundSettings.volume;

    this.autoStartingSettings = getAutoStartingSettings();
  },

  methods: {
    findTimer(timerId) {
      return this.timers.find(t => t.id === timerId);
    },

    setCurrentTimer(newVal) {
      this.currentTimer = newVal;
      this.$nextTick(this.resetTimer);
    },

    changeAutoStartingSettings(newAutoStartingSettings) {
      Object.assign(this.autoStartingSettings, newAutoStartingSettings);
    },

    defineNextTimer() {
      let currentTimerId = 0;

      if (!this.currentTimer.id) {
        this.finishedPomodorosCount += 1;
        const isLongBreakTurn = this.finishedPomodorosCount
          % this.autoStartingSettings.longBreakInterval;

        isLongBreakTurn
          ? currentTimerId = 2
          : currentTimerId = 1;
      }

      this.setCurrentTimer(this.findTimer(currentTimerId));
    },

    handleTimerFinished() {
      this.notifyUserTimeIsUp();

      if (this.autoStartingSettings.autoStart) {
        this.defineNextTimer();
        this.$nextTick(this.startTimer);
      }
    },

    changeTimerTime(timerId, newTime) {
      const timer = this.findTimer(timerId);
      timer.timeInMinutes = newTime;
    },

    closeSettingsAndSaveTimersUsingApi() {
      this.isSettingsOpened = false;
      saveTimersSettings(this.timers);
    },

    notifyUserTimeIsUp() {
      this.sound.play();
    },
  },
};
</script>
