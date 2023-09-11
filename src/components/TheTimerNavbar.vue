<template>
  <div>
    <v-card>
      <v-tabs grow>
        <v-tab
          v-for="timerData of timersData"
          :key="timerData.id"
          @click="$emit('update:modelValue', timerData.id)"
          >{{ timerData.name }}</v-tab
        >
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
export default {
  emits: {
    "update:modelValue": null,
  },

  props: {
    timersData: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Number,
      required: false,
    },
  },
};
</script>
