<template>
  <div>
    <q-select
      v-model="year"
      @update:model-value="changed"
      :options="years"
      label="Wybierz rok podatkowy*"
      color="brand"
      emit-value
      required
    />
  </div>
</template>

<script>
import constants from 'src/logic/constants'
export default {
  props: ['modelValue'],
  data () {
    return {
      year: null,
      years: constants.AVAILABLE_YEARS,
    }
  },
  watch: {
    modelValue: {
      handler: function () {
        this.year = this.modelValue
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
