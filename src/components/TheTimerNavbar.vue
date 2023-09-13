<template>
  <div>
    <v-card>
      <v-tabs grow v-model="tabValue">
        <v-tab
          v-for="timerData of timersData"
          :key="timerData.id"
          :value="timerData.id"
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

  data() {
    return {
      tabValue: 0,
    };
  },

  created() {
    this.tabValue = this.modelValue;
  },

  watch: {
    tabValue(newValue) {
      this.$emit("update:modelValue", newValue);
    },

    modelValue() {
      this.tabValue = this.modelValue;
    },
  },
};
</script>
