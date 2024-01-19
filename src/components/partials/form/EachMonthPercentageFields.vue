<template>
  <div class="row items-center q-col-gutter-sm">
    <div
      v-for="(month, index) in monthNames"
      :key="index"
      class="col-4 col-sm-2">
      <q-input
        v-model.number="monthlyValues[index]"
        :disable="disableUntilMonth !== null && index < disableUntilMonth"
        :label="month"
        type="number"
        min="0"
        max="100"
        step="1"
        color="brand"
        suffix="%"
        lazy-rules="ondemand"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue'
import {useMonths} from 'src/composables/months'

interface Props {
  modelValue: number[]
  disableUntilMonth: null | number
}
const props = withDefaults(defineProps<Props>(), {
  disableUntilMonth: null,
  },
)
const emit = defineEmits(['update:modelValue'])

const { monthNames } = useMonths()

const monthlyValues = computed({
  get() {
    return props.modelValue
  },
  set(values) {
    emit('update:modelValue', values)
  },
})

watch(() => props.disableUntilMonth, (disableUntilMonth) => {
  if(disableUntilMonth === null) {
    return
  }

  for(let i = 0; i < disableUntilMonth; i++) {
    monthlyValues.value[i] = 0
  }
}, {immediate: true})
</script>
