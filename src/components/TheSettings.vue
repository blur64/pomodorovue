<template>
  <v-card title="Settings" max-width="300px">
    <v-card-item>
      <div
        v-for="timerSettings of timersSettings"
        :key="timerSettings.id"
        class="d-flex align-center justify-space-between"
      >
        <label>{{ timerSettings.name }}</label>
        <text-field-wrapper
          @valueChanged="updateNewTime"
          :initialValue="timerSettings.timeInMinutes"
          :itemId="timerSettings.id"
          type="number"
          min="0"
          step="5"
        />
      </div>
    </v-card-item>

    <v-card-item>
      <div class="d-flex justify-space-between">
        <label>Auto start</label>
        <v-switch v-model="newAutoStartFlag" hide-details />
      </div>
      <div class="d-flex align-center justify-space-between">
        <label>Long break interval</label>
        <v-text-field
          v-model.number="newLongBreakInterval"
          type="number"
          min="2"
        />
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn @click="saveChanges">save and close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TextFieldWrapper from "./TextFieldWrapper.vue";

export default {
  components: {
    TextFieldWrapper,
  },

  emits: {
    timerTimeChanged: (timerId, time) => {
      if (typeof timerId === "number" && typeof time === "number") {
        return true;
      }

      return false;
    },
    allSettingsConfigured: () => true,
    autoStartingSettingsChanged: null,
  },

  props: {
    timersSettings: {
      type: Array,
      required: false,
      default: () => [],
    },
    autoStartingSettings: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      newTimes: [],
      newAutoStartFlag: false,
      newLongBreakInterval: 0,
    };
  },

  methods: {
    updateNewTime(timerId, newTime) {
      const newTimeEntry = this.findNewTimeEntry(timerId);
      newTimeEntry.time = +newTime;
    },

    validateTime(time) {
      // 0 or NaN
      if (!time) {
        return false;
      }

      // Negative numbers
      if (time < 0) {
        return false;
      }

      // Not integers
      if (time % 1 !== 0) {
        return false;
      }

      return true;
    },

    findNewTimeEntry(timerId) {
      return this.newTimes.find((timeEntry) => timeEntry.timerId === timerId);
    },

    saveChanges() {
      this.timersSettings.forEach((timerSettings) => {
        const newTime = this.findNewTimeEntry(timerSettings.id).time;
        const initialTime = timerSettings.timeInMinutes;

        if (!this.validateTime(newTime)) {
          return;
        }

        if (newTime !== initialTime) {
          this.$emit("timerTimeChanged", timerSettings.id, newTime);
        }
      });

      this.$emit("autoStartingSettingsChanged", {
        autoStart: this.newAutoStartFlag,
        longBreakInterval: this.newLongBreakInterval,
      });

      this.$emit("allSettingsConfigured");
    },
  },

  created() {
    this.newTimes = this.timersSettings.map((timerSettings) => ({
      timerId: timerSettings.id,
      time: timerSettings.timeInMinutes,
    }));

    this.newAutoStartFlag = this.autoStartingSettings.autoStart;
    this.newLongBreakInterval = this.autoStartingSettings.longBreakInterval;
  },
};
</script>
