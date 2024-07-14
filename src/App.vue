<template>
  <v-app>
    <v-main class="mt-1">
      <v-container>
        <v-row>
          <v-col sm="6" offset-sm="3">
            <v-dialog v-model="isSettingsOpened" max-width="300px">
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props"> Settings </v-btn>
              </template>

              <the-settings
                :timersSettings="timers"
                :autoStartingSettings="autoStartingSettings"
                @timerTimeChanged="changeTimerTime"
                @autoStartingSettingsChanged="changeAutoStartingSettings"
                @allSettingsConfigured="closeSettingsAndSaveTimersUsingApi"
              />
            </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="6" offset-sm="3">
            <the-timer-navbar
              @update:selected-timer="setCurrentTimer"
              :selected-timer="currentTimer"
              :timers="timers"
            />
            <the-timer
              @finished="handleTimerFinished"
              @registerTimerResetter="resetTimer = $event"
              @registerTimerStarter="startTimer = $event"
              :startTimeInMinutes="currentTimer.timeInMinutes"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TheTimerNavbar from "./components/TheTimerNavbar.vue";
import TheTimer from "./components/TheTimer.vue";
import TheSettings from "./components/TheSettings.vue";

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

  created() {
    this.timers = getTimersSettings();
    this.setCurrentTimer(this.findTimer(0));

    const soundSettings = getSoundSettings();
    this.sound = new Audio(soundSettings.path);
    this.sound.volume = soundSettings.volume;

    this.autoStartingSettings = getAutoStartingSettings();
  },
};
</script>
