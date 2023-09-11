<template>
  <div class="d-flex align-center justify-space-between">
    <label :for="timerSettings.id">{{ timerSettings.name }}</label>
    <input
      :value="timerSettings.timeInMinutes"
      @input="
        $emit('timeChanged', timerSettings.id, $event.target.valueAsNumber)
      "
      step="5"
      type="number"
      class="time-input"
      min="0"
    />
  </div>
</template>

<script>
export default {
  emits: {
    timeChanged: null,
  },

  props: {
    timerSettings: {
      type: Object,
      required: true,
    },
  },
};
</script>
