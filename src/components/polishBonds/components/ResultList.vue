<template>
  <div v-if="props.result">
    <list-row>
      <template #name>
        Rodzaj obligacji
      </template>
      <template #value>
        {{ bondTypeLabel }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Liczba zakupionych obligacji
      </template>
      <template #value>
        {{ bondCount }} szt.
      </template>
    </list-row>
    <list-row>
      <template #name>
        Wartość zakupionych obligacji
      </template>
      <template #value>
        {{ pln(investmentAmount) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Całkowite odsetki
      </template>
      <template #value>
        {{ pln(totalInterest) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Całkowity podatek Belka
      </template>
      <template #value>
        {{ pln(totalTaxAmount) }}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Całkowity zysk
      </template>
      <template #value>
        {{ pln(totalProfit) }}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Całkowity zysk realny
      </template>
      <template #value>
        {{ pln(totalRealProfit) }}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/polishBonds/interfaces/Result'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import {usePolishBondsStore} from 'components/polishBonds/store'

import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const store = usePolishBondsStore()

const bondTypeMap = {
  'EDO': 'EDO - Emerytalne Dziesięcioletnie Oszczędnościowe',
  'COI': 'COI - Czteroletnie Obligacje Indeksowane',
  'TOS': 'TOS - Trzymiesięczne Oszczędnościowe',
  'ROR': 'ROR - Rodzinne Obligacje Skarbowe',
  'DOR': 'DOR - Dwuletnie Obligacje Skarbowe',
}

const BOND_FACE_VALUE = 100

const bondTypeLabel = computed(() => {
  return bondTypeMap[store.selectedBondType] || store.selectedBondType
})

const lastMonthResult = computed(() => {
  const results = props.result.monthlyResults
  return results.length > 0 ? results[results.length - 1] : null
})

const bondCount = computed(() => {
  return store.bondCount
})

const investmentAmount = computed(() => {
  return bondCount.value * BOND_FACE_VALUE
})

const totalInterest = computed(() => {
  return lastMonthResult.value?.accumulatedInterest || 0
})

const totalTaxAmount = computed(() => {
  return lastMonthResult.value?.accumulatedTaxAmount || 0
})

const totalProfit = computed(() => {
  return lastMonthResult.value?.accumulatedProfit || 0
})

const totalRealProfit = computed(() => {
  return lastMonthResult.value?.accumulatedRealProfit || 0
})
</script>
