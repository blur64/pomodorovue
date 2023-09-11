<template>
  <v-card title="Settings" max-width="300px">
    <v-card-item>
      <div v-for="timerSettings of timersSettings" :key="timerSettings.id">
        <timer-time-input
          :timerSettings="timerSettings"
          @timeChanged="updateNewTime"
        />
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn @click="saveChanges">save and close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TimerTimeInput from './TimerTimeInput.vue';

export default {
  components: {
    TimerTimeInput,
  },

  emits: {
    timerTimeChanged: (timerId, time) => {
      if (typeof timerId === 'number' && typeof time === 'number') {
        return true;
      }

      return false;
    },
    allSettingsConfigured: () => true,
  },

  props: {
    timersSettings: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      newTimes: [],
    };
  },

  methods: {
    updateNewTime(timerId, newTime) {
      const newTimeEntry = this.findNewTimeEntry(timerId);
      newTimeEntry.time = newTime;
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
          this.$emit('timerTimeChanged', timerSettings.id, newTime);
        }
      });

      this.$emit('allSettingsConfigured');
    },
  },

  created() {
    this.newTimes = this.timersSettings.map((timerSettings) => ({
      timerId: timerSettings.id,
      time: timerSettings.timeInMinutes,
    }));
  },
};
</script>

<style>
.time-input {
  width: 68px;
  border: 1px solid black;
  border-radius: 4px;
  padding: 6px;
  margin: 2px;
}
</style>
