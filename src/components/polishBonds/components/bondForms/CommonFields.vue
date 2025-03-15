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
        :rules="[validationRules.required]"
        lazy-rules="ondemand"
      />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <q-toggle
        v-model="belkaTax"
        checked-icon="check"
        unchecked-icon="clear"
        label="Podatek Belki"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBondConstants } from '../../logic/BondConstants'
import { useLocalStorage } from '@vueuse/core'
import helpers from 'src/logic/helpers'
import validationRules from 'src/logic/validationRules'

const constants = useBondConstants()

const boughtBondCount = useLocalStorage('polishBonds/form/boughtBondCount', 10, { mergeDefaults: true })
const yearlyInflationRate = useLocalStorage('polishBonds/form/yearlyInflationRate', helpers.round(constants.yearlyInflationRate * 100, 2), { mergeDefaults: true })
const belkaTax = useLocalStorage('polishBonds/form/belkaTax', true, { mergeDefaults: true })

defineExpose({
  boughtBondCount,
  yearlyInflationRate,
  belkaTax,
})
</script>
