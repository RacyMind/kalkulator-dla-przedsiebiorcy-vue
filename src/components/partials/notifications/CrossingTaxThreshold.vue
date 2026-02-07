<template>
  <Tooltip
    color="orange"
    icon="warning">
    Przekroczono próg podatkowy, który wynosi {{pln(incomeTaxConstants.taxScale.taxThreshold)}}. Dla kwoty powyżej progu odprowadzany jest {{ incomeTaxConstants.taxScale.taxRates.second * 100}}% podatek.
  </Tooltip>
</template>

<script setup lang="ts">
import {pln} from 'src/composables/currencyFormat'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import Tooltip from 'components/partials/Tooltip.vue'

const {incomeTaxConstants} = storeToRefs(useConstantsStore())
</script>
