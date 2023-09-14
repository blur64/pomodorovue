<template>
  <v-text-field v-model="inputValue" v-bind="$attrs" />
</template>

<script>
export default {
  emits: {
    valueChanged: null,
  },

  props: {
    initialValue: {
      type: Number,
    },
    itemId: {
      type: Number,
    },
  },

  data() {
    return {
      inputValue: "",
    };
  },

  watch: {
    inputValue(newInputValue) {
      this.$emit("valueChanged", this.itemId, newInputValue);
    },
  },

  created() {
    this.inputValue = this.initialValue;
  },
};
</script>