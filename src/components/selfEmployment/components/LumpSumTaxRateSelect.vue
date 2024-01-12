<template>
  <q-select
    v-model.number="lumpSumTaxRate"
    :options="lumpSumTaxRateOptions"
    label="Stawka ryczałtu ewidencjonowanego"
    color="brand"
    required
    emit-value
    map-options
  />
</template>

<script setup lang="ts">

import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'
import {computed} from 'vue'

interface Props {
  modelValue: number
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const lumpSumTaxRateOptions:{label: string, value: LumpSumTaxRate}[] = [
  {
    label: '2%',
    value: 0.02,
  },
  {
    label: '3%',
    value: 0.03,
  },
  {
    label: '5,5%',
    value: 0.055,
  },
  {
    label: '8,5%',
    value: 0.085,
  },
  {
    label: '10%',
    value: 0.1,
  },
  {
    label: '12%',
    value: 0.12,
  },
  {
    label: '12,5%',
    value: 0.125,
  },
  {
    label: '14%',
    value: 0.14,
  },
  {
    label: '15%',
    value: 0.15,
  },
  {
    label: '17%',
    value: 0.17,
  },
]

const lumpSumTaxRate = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

</script>
