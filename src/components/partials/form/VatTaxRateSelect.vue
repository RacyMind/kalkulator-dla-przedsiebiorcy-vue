<template>
  <q-select
    v-model.number="vatTaxRate"
    :options="vatTaxRateOptions"
    label="Stawka podatku VAT*"
    color="brand"
    required
    emit-value
    map-options
  />
</template>

<script setup lang="ts">
import {AvailableVatRate} from 'src/logic/taxes/interfaces/AvailableVatRate'

const vatTaxRate = defineModel<number>()

const vatTaxRateOptions:{label: string, value: AvailableVatRate}[] = [
  {
    label: '0%',
    value: 0,
  },
  {
    label: '5%',
    value: 0.05,
  },
  {
    label: '8%',
    value: 0.08,
  },
  {
    label: '23%',
    value: 0.23,
  },
]

</script>
