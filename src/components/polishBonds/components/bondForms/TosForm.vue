<template>
  <div class="row q-col-gutter-md q-mt-md">
    <div class="col-12 col-md-6">
      <q-input
        v-model.number="interestRate"
        type="number"
        min="0"
        max="20"
        step="0.01"
        label="Stopa procentowa (%)"
        suffix="%"
        color="brand"
        :rules="[
          (val) => !!val || 'Uzupełnij pole',
          (val) => val >= 0 || 'Minimalna wartość to 0'
        ]"
        lazy-rules="ondemand"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const interestRate = useLocalStorage('polishBonds/form/interestRate', 3.0, { mergeDefaults: true })

defineExpose({
  interestRate,
})
</script>
