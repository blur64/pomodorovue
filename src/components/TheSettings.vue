<template>
  <v-card subtitle="Settings" max-width="300px">
    <v-card-item title="Times">
      <div
        v-for="timerSettings of timersSettings"
        :key="timerSettings.id"
        class="d-flex align-center justify-space-between pb-2"
      >
        <label>{{ timerSettings.name }}</label>
        <v-responsive max-width="92">
          <text-field-wrapper
            @valueChanged="updateNewTime"
            :initialValue="timerSettings.timeInMinutes"
            :itemId="timerSettings.id"
            hide-details
            type="number"
            min="0"
            step="5"
          />
        </v-responsive>
      </div>
    </v-card-item>

    <v-card-item title="Auto starting">
      <div class="d-flex align-center justify-space-between">
        <label>Auto start</label>
        <v-responsive max-width="92">
          <v-switch v-model="newAutoStartFlag" hide-details />
        </v-responsive>
      </div>
      <div class="d-flex align-center justify-space-between">
        <label>Long break interval</label>
        <v-responsive max-width="92">
          <v-text-field
            v-model.number="newLongBreakInterval"
            type="number"
            min="2"
            hide-details
          />
        </v-responsive>
      </div>
    </v-card-item>

    <v-card-actions class="d-flex align-center justify-center px-2">
      <v-btn @click="saveChanges" variant="tonal" block>save and close</v-btn>
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
