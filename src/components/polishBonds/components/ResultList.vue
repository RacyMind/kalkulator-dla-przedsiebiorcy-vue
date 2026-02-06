<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>
        Rodzaj obligacji
      </template>
      <template #value>
        {{ bondTypeLabel }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Liczba zakupionych obligacji
      </template>
      <template #value>
        {{ bondCount }} szt.
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Wartość zakupionych obligacji
      </template>
      <template #value>
        {{ pln(investmentAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Odsetki
      </template>
      <template #value>
        {{ pln(totalInterest) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podatek Belki
      </template>
      <template #value>
        {{ pln(totalTaxAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Zysk
      </template>
      <template #value>
        {{ pln(totalProfit) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Zysk realny
        <Tooltip class="q-ml-sm"
                 color="white">
          Zysk realny jest to zysk pomniejszony o inflację
        </Tooltip>
      </template>
      <template #value>
        {{ pln(totalRealProfit) }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/polishBonds/interfaces/Result'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import {usePolishBondsStore} from 'components/polishBonds/store'

import { useBondConstants } from 'components/polishBonds/logic/BondConstants'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const store = usePolishBondsStore()
const constants = useBondConstants()

const bondTypeMap = {
  'EDO': 'EDO - Obligacje 10-letnie',
  'COI': 'COI - Obligacje 4-letnie',
  'TOS': 'TOS - Obligacje 3-letnie',
  'OTS': 'OTS - Obligacje 3-miesięczne',
  'ROR': 'ROR - Obligacje roczne',
  'DOR': 'DOR - Obligacje 2-letnie',
}

const bondTypeLabel = computed(() => {
  return store.selectedBondType ? bondTypeMap[store.selectedBondType] || store.selectedBondType : ''
})

const lastMonthResult = computed(() => {
  const results = props.result.monthlyResults
  return results.length > 0 ? results[results.length - 1] : null
})

const bondCount = computed(() => {
  return store.commonInputFields?.boughtBondCount || 0
})

const investmentAmount = computed(() => {
  return bondCount.value * constants.bondCost
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
