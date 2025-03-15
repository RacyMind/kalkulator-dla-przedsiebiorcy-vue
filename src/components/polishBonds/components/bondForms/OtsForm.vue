<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-input
        v-model.number="interestRate"
        type="number"
        min="0"
        max="20"
        step="0.01"
        label="Oprocentowanie (%)"
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
import helpers from 'src/logic/helpers'
import validationRules from 'src/logic/validationRules'

const constants = useBondConstants()
const interestRate = useLocalStorage('polishBonds/form/ots/interestRate', helpers.round(constants.ots.interestRate * 100, 2), { mergeDefaults: true })

defineExpose({
  interestRate,
})
</script>
