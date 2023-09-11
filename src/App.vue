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
              @finished="playSound"
              :startTimeInMinutes="currentTimer.timeInMinutes"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-list lines="one">
            <v-list-item
              v-for="n in 3"
              :key="n"
              :title="'Item ' + n"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
            ></v-list-item>
          </v-list>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TheTimerNavbar from "./components/TheTimerNavbar.vue";
import TheTimer from "./components/TheTimer.vue";
import TheSettings from "./components/TheSettings.vue";

import { getTimersSettings, saveTimersSettings } from "./api.js";

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
      currentTimerId: 0,
      timers: [],
      timersIdsAndNames: [],
    };
  },

  computed: {
    currentTimer() {
      return this.timers.find((timer) => timer.id === this.currentTimerId);
    },
  },

  methods: {
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

    playSound() {
      const sound = new Audio(require("./assets/clockAlarm.mp3"));
      sound.volume = 0.5;
      sound.play();
    },
  },

  created() {
    this.timers = getTimersSettings();

    this.timersIdsAndNames = this.timers.map((timer) => ({
      id: timer.id,
      name: timer.name,
    }));
  },
};
</script>
