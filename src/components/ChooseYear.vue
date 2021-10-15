<template>
  <div>
    <q-select
      v-model="year"
      @update:model-value="changed"
      :options="years"
      label="Rok podatkowy*"
      color="brand"
      emit-value
      required
    />
  </div>
</template>

<script>
export default {
  props: ['modelValue'],
  data () {
    return {
      year: null,
      years: [2021, 2022],
    }
  },
  watch: {
    modelValue: {
      handler: function () {
        if (this.modelValue > 2022) {
          this.year = 2022
        } else {
          this.year = this.modelValue
        }
      },
      immediate: true,
    },
  },
  methods: {
    changed () {
      this.$emit('update:modelValue', this.year)
    },
  },
}
</script>
