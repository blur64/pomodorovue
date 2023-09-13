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
                @timerTimeChanged="changeTimerTime"
                @allSettingsConfigured="closeSettingsAndSaveTimersUsingApi"
              />
            </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="6" offset-sm="3">
            <the-timer-navbar
              v-model="currentTimerId"
              :timersData="timersIdsAndNames"
            />
            <the-timer
              @finished="handleTimerFinished"
              :startTimeInMinutes="currentTimer.timeInMinutes"
              :currentTimerId="currentTimerId"
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
      timersIdsAndNames: [],
      currentTimerId: 0,

      sound: {},

      autoStart: false,
      longBreakInterval: 0,
      finishedPomodorosCount: 0,
    };
  },

  computed: {
    currentTimer() {
      return this.timers.find((timer) => timer.id === this.currentTimerId);
    },
  },

  methods: {
    handleTimerFinished(startTimerCallback) {
      this.notifyUserTimeIsUp();

      if (this.autoStart) {
        if (this.currentTimerId === 0) {
          this.finishedPomodorosCount += 1;

          if (this.finishedPomodorosCount % 2 === 0) {
            this.currentTimerId = 2;
          } else {
            this.currentTimerId = 1;
          }
        } else {
          this.currentTimerId = 0;
        }

        this.$nextTick(startTimerCallback);
      }
    },

    changeTimerTime(timerId, newTime) {
      const timer = this.findTimer(timerId);
      timer.timeInMinutes = newTime;
    },

    findTimer(timerId) {
      return this.timers.find((timer) => timer.id === timerId);
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
    this.timersIdsAndNames = this.timers.map((timer) => ({
      id: timer.id,
      name: timer.name,
    }));

    const soundSettings = getSoundSettings();
    this.sound = new Audio(soundSettings.path);
    this.sound.volume = soundSettings.volume;

    const autoStartingSettings = getAutoStartingSettings();
    this.longBreakInterval = autoStartingSettings.longBreakInterval;
    this.autoStart = autoStartingSettings.autoStart;
  },
};
</script>
