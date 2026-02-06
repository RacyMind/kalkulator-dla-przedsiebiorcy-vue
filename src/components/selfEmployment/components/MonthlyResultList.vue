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
        Podstawa opodatkowania
        <CrossingTaxThreshold v-if="showCrossingTaxThresholdWarning" />
      </template>
      <template #value>
        {{ pln(result.taxBasis)}}
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
        Składki ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions) }}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka zdrowotna
      </template>
      <template #value>
        {{ pln(result.healthContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka chorobowa
      </template>
      <template #value>
        {{ pln(result.sickContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka wypadkowa
      </template>
      <template #value>
        {{ pln(result.accidentContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka na Fundusz Pracy i Fundusz Solidarnościowy
      </template>
      <template #value>
        {{ pln(result.fpAndFsContribution)}}
      </template>
    </ListRow>
    <ListRow v-if="result.deductibleExpenses > 0">
      <template #name>
        <template v-if="month < 11">
          Strata do odliczenia w kolejnym miesiącu
        </template>
        <template v-else>
          Strata do odliczenia w kolejnych latach
        </template>
      </template>
      <template #value>
        {{ pln(result.deductibleExpenses)}}
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
import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'
import {EventType, useEventStore} from 'stores/eventStore'
import {computed} from 'vue'
import {pln} from '../../../use/currencyFormat'
import CrossingTaxThreshold from 'components/partials/notifications/CrossingTaxThreshold.vue'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: EntrepreneurResult
  month: number
}
const props = defineProps<Props>()
const eventStore = useEventStore()

const totalZusContributions = computed(() => {
  return props.result.healthContribution + props.result.pensionContribution + props.result.disabilityContribution + props.result.sickContribution + props.result.accidentContribution + props.result.fpAndFsContribution
})

const showCrossingTaxThresholdWarning = computed(() => {
  return eventStore.events.some(event => event.type === EventType.CrossingTaxThreshold  && event.sinceMonth && props.month >= event.sinceMonth)
})
</script>
