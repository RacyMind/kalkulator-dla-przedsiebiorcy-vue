<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-input
        v-model.number="initialInterestRate"
        type="number"
        min="0"
        max="20"
        step="0.01"
        label="Stopa procentowa w 1. miesiącu (%)"
        suffix="%"
        color="brand"
        :rules="[validationRules.required]"
        lazy-rules="ondemand"
      />
    </div>

    <div class="col-12 col-md-6">
      <q-input
        v-model.number="nbpReferenceRate"
        type="number"
        min="0"
        max="20"
        step="0.01"
        label="Stopa referencyjna NBP (%)"
        suffix="%"
        color="brand"
        :rules="[validationRules.required]"
        lazy-rules="ondemand"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBondConstants } from 'components/polishBonds/logic/BondConstants'
import { useLocalStorage } from '@vueuse/core'
import { watch } from 'vue'
import helpers from 'src/logic/helpers'
import validationRules from 'src/logic/validationRules'

const constants = useBondConstants()
const initialInterestRate = useLocalStorage('polishBonds/form/dor/initialInterestRate', helpers.round(constants.dor.initialInterestRate * 100, 2), { mergeDefaults: true })
const nbpReferenceRate = useLocalStorage('polishBonds/form/dor/nbpReferenceRate', helpers.round(constants.dor.nbpReferenceRate * 100, 2), { mergeDefaults: true })

const nbpReferenceRates = useLocalStorage('polishBonds/form/dor/nbpReferenceRates', Array(24).fill(nbpReferenceRate.value), { mergeDefaults: true })

watch(nbpReferenceRate, (newValue) => {
  for (let i = 0; i < nbpReferenceRates.value.length; i++) {
    nbpReferenceRates.value[i] = newValue
  }
})

defineExpose({
  initialInterestRate,
  nbpReferenceRate,
  nbpReferenceRates,
})
</script>
