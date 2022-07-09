<template>
  <q-select
    v-model.number="year"
    @update:model-value="changeYear"
    :options="years"
    label="Wybierz rok podatkowy*"
    color="brand"
    emit-value
    required
  />
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'
import constants from 'src/logic/constants'
export default defineComponent({
  props: {
    modelValue: {
      required: true,
      type: Number,
    },
  },
  setup(props, context) {
    const year = ref(props.modelValue)
    const years = constants.AVAILABLE_YEARS

    watch(() => props.modelValue, () => {
      year.value = props.modelValue
    })

    const changeYear = () => {
      context.emit('update:modelValue', year.value)
    }

    return {
      changeYear,
      year,
      years,
    }
  },
})
</script>
