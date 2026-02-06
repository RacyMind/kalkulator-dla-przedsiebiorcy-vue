<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>
        Roczny przychód brutto
      </template>
      <template #value>
        {{ pln(props.result.grossRevenue) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Przychód do opodatkowania
      </template>
      <template #value>
        {{ pln(props.result.taxableRevenue) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podatek ryczałtowy
      </template>
      <template #value>
        {{ pln(props.result.tax) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Roczne koszty utrzymania
      </template>
      <template #value>
        {{ pln(props.result.annualExpenses) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Zysk netto
      </template>
      <template #value>
        {{ pln(props.result.netProfit) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Efektywna stawka podatku
      </template>
      <template #value>
        {{ props.result.effectiveTaxRate }}%
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Miesięczny zysk netto
      </template>
      <template #value>
        {{ pln(monthlyNetProfit) }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {YearResult} from 'components/rentalProfit/interfaces/Result'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: YearResult
}
const props = defineProps<Props>()

const monthlyNetProfit = computed(() => {
  if (!props.result) return 0
  return Math.round(props.result.netProfit / 12 * 100) / 100
})
</script>
