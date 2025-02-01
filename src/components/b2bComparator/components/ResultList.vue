<template>
  <div v-if="result">
    <list-row>
      <template #name>
        Przychód
      </template>
      <template #value>
        {{ pln(result.revenue)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Koszty
      </template>
      <template #value>
        {{ pln(result.expenses)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        <div class="row items-center">
          Zaliczka na podatek dochodowy
        </div>
      </template>
      <template #value>
        {{ pln(result.taxAmount)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Składka zdrowotna
      </template>
      <template #value>
        {{ pln(result.healthContribution)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Pozostałe składki ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions) }}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Dochód
      </template>
      <template #value>
        {{ pln(result.income)}}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {AnnualResult} from 'src/logic/interfaces/AnnualEntrepreneurResult'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: AnnualResult
}
const props = defineProps<Props>()

const totalZusContributions = computed(() => {
  return props.result.pensionContribution + props.result.disabilityContribution + props.result.sickContribution + props.result.accidentContribution + props.result.fpAndFsContribution
})
</script>
