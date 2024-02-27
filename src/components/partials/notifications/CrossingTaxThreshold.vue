<template>
  <tooltip
    color="orange"
    icon="warning">
    Przekroczono próg podatkowy, który wynosi {{pln(incomeTaxConstants.taxScale.taxThreshold)}}. Dla kwoty powyżej progu odprowadzany jest {{ incomeTaxConstants.taxScale.taxRates.second * 100}}% podatek.
  </tooltip>
</template>

<script setup lang="ts">
import {pln} from 'src/use/currencyFormat'
import {useConstants} from 'src/composables/constants'
import Tooltip from 'components/partials/Tooltip.vue'

const {incomeTaxConstants} = useConstants()
</script>
