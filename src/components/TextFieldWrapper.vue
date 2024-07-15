<template>
  <v-text-field
    v-model="inputValue"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: "TextFieldWrapper",

  props: {
    initialValue: {
      type: Number,
      required: true,
    },

    itemId: {
      type: Number,
      required: true,
    },
  },

  emits: {
    valueChanged: null,
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
