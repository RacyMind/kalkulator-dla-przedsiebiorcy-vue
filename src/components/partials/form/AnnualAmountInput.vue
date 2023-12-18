<template>
  <div class="row items-center q-col-gutter-sm">
    <div
      v-for="(month, index) in constants.MONTH_NAMES"
      :key="index"
      class="col-4 col-sm-2">
      <q-input
        v-model.number="monthlyAmounts[index]"
        :disable="disableUntilMonth !== null && index < disableUntilMonth"
        type="number"
        min="0"
        step="0.01"
        :label="month"
        suffix="zł"
        color="brand"
        :rules="[
          val => val >= 0 || '* Wpisz kwotę',
        ]"
        lazy-rules="ondemand"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue'
import constants from 'src/logic/constants'

interface Props {
  modelValue: number[]
  disableUntilMonth: null | number
}
const props = withDefaults(defineProps<Props>(), {
  disableUntilMonth: null,
  },
)
const emit = defineEmits(['update:modelValue'])

const monthlyAmounts = computed({
  get() {
    return props.modelValue
  },
  set(amounts) {
    emit('update:modelValue', amounts.map(amount => Number(amount)))
  },
})

watch(() => props.disableUntilMonth, (disableUntilMonth) => {
  if(disableUntilMonth === null) {
    return
  }

  for(let i = 0; i < disableUntilMonth; i++) {
    monthlyAmounts.value[i] = 0
  }
}, {immediate: true})
</script>
