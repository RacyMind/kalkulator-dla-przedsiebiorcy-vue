<template>
  <div>
    <q-select
      v-model.number="year"
      @update:model-value="changeYear"
      :options="years"
      label="Wybierz rok podatkowy*"
      color="brand"
      emit-value
      required
    />
  </div>
</template>

<script lang="ts">
import {ref, toRefs, watch} from 'vue'
import constants from 'src/logic/constants'
export default {
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
  },
  setup(props:any, context:any) {
    const { modelValue } = toRefs(props)
    const year = ref(modelValue.value)
    const years = constants.AVAILABLE_YEARS

    watch(modelValue, () => {
      year.value = modelValue.value
    })

    const changeYear = () => {
      context.emit('update:modelValue', year.value)
    }

    return {
      years,
      year,
      changeYear,
    }
  },
}
</script>
