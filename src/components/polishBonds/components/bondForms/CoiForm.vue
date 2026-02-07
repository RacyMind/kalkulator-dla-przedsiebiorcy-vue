<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-input
        v-model.number="initialInterestRate"
        type="number"
        min="0"
        max="20"
        step="0.01"
        label="Stopa procentowa w 1. roku (%)"
        suffix="%"
        color="brand"
        :rules="[validationRules.required]"
        lazy-rules="ondemand"
        aria-required="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBondConstants } from 'components/polishBonds/logic/BondConstants'
import { useLocalStorage } from '@vueuse/core'
import helpers from 'src/logic/helpers'
import validationRules from 'src/logic/validationRules'

const constants = useBondConstants()
const initialInterestRate = useLocalStorage('polishBonds/form/coi/initialInterestRate', helpers.round(constants.coi.initialInterestRate * 100, 2), { mergeDefaults: true })

defineExpose({
  initialInterestRate,
})
</script>
