<template>
  <div>
    <v-card>
      <v-tabs
        @update:model-value="$emit('update:selected-timer', $event)"
        :model-value="selectedTimer"
        grow
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
  emits: [ 'update:selected-timer' ],

  props: {
    timers: {
      type: Array,
      required: true,
    },

    selectedTimer: {
      type: Object,
      required: false,
    },
  },
};
</script>
