<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-input
        v-model.number="boughtBondCount"
        type="number"
        min="1"
        step="1"
        label="Liczba obligacji"
        color="brand"
        :rules="[
          (val) => !!val || 'Uzupełnij pole',
          (val) => val >= 1 || 'Minimalna wartość to 1'
        ]"
        lazy-rules="ondemand"
      />
    </div>
    <div class="col-12 col-md-6">
      <q-input
        v-model.number="yearlyInflationRate"
        type="number"
        min="-10"
        max="20"
        step="0.1"
        label="Roczna stopa inflacji (%)"
        suffix="%"
        color="brand"
        :rules="[(val) => !!val || 'Uzupełnij pole']"
        lazy-rules="ondemand"
      />
    </div>
  </div>

  <div class="row q-mt-md">
    <div class="col">
      <q-toggle
        v-model="belkaTax"
        checked-icon="check"
        unchecked-icon="clear"
        label="Uwzględnij podatek Belki (19%)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const boughtBondCount = useLocalStorage('polishBonds/form/boughtBondCount', 1, { mergeDefaults: true })
const yearlyInflationRate = useLocalStorage('polishBonds/form/yearlyInflationRate', 2.5, { mergeDefaults: true })
const belkaTax = useLocalStorage('polishBonds/form/belkaTax', true, { mergeDefaults: true })

defineExpose({
  boughtBondCount,
  yearlyInflationRate,
  belkaTax,
})
</script>
