<template>
  <div>
    <v-card>
      <v-tabs
        :model-value="selectedTimer"
        grow
        @update:model-value="$emit('update:selected-timer', $event)"
      >
        <v-tab
          v-for="timer of timers"
          :key="timer.id"
          :value="timer"
          elevation="0"
        >
          {{ timer.name }}
        </v-tab>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TheTimerNavbar",

  props: {
    timers: {
      type: Array,
      required: true,
    },

    selectedTimer: {
      type: Object,
      required: true,
    },
  },

  emits: ["update:selected-timer"],
};
</script>
