<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Przychód
      </template>
      <template #value>
        {{ pln(result.revenue)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Koszty
      </template>
      <template #value>
        {{ pln(result.expenses)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        <div class="row items-center">
          Zaliczka na podatek dochodowy
        </div>
      </template>
      <template #value>
        {{ pln(result.taxAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składka zdrowotna
      </template>
      <template #value>
        {{ pln(result.healthContribution)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Pozostałe składki ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Dochód
      </template>
      <template #value>
        {{ pln(result.income)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {AnnualResult} from 'src/logic/interfaces/AnnualEntrepreneurResult'
import {computed} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: AnnualResult
}
const props = defineProps<Props>()

const totalZusContributions = computed(() => {
  return props.result.pensionContribution + props.result.disabilityContribution + props.result.sickContribution + props.result.accidentContribution + props.result.fpAndFsContribution
})
</script>
