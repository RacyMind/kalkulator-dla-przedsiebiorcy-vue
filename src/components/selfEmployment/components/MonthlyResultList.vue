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
        Podstawa opodatkowania
        <CrossingTaxThreshold v-if="showCrossingTaxThresholdWarning" />
      </template>
      <template #value>
        {{ pln(result.taxBasis)}}
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
        Składki ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions) }}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka zdrowotna
      </template>
      <template #value>
        {{ pln(result.healthContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka chorobowa
      </template>
      <template #value>
        {{ pln(result.sickContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka wypadkowa
      </template>
      <template #value>
        {{ pln(result.accidentContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka na Fundusz Pracy
      </template>
      <template #value>
        {{ pln(result.fpContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka na Fundusz Solidarnościowy
        <tooltip>
          Do składek na Fundusz Solidarnościowy stosuje się zasady dotyczące obowiązkowych składek na Fundusz Pracy. Do 21 grudnia 2019 r. fundusz ten nosił nazwę Solidarnościowy Fundusz Wsparcia Osób Niepełnosprawnych.
        </tooltip>
      </template>
      <template #value>
        {{ pln(result.fsContribution)}}
      </template>
    </list-row>
    <list-row v-if="result.deductibleExpenses > 0">
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
import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'
import {EventType, useEventStore} from 'stores/eventStore'
import {computed} from 'vue'
import {pln} from '../../../use/currencyFormat'
import CrossingTaxThreshold from 'components/partials/notifications/CrossingTaxThreshold.vue'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: EntrepreneurResult
  month: number
}
const props = defineProps<Props>()
const eventStore = useEventStore()

const totalZusContributions = computed(() => {
  return props.result.healthContribution + props.result.pensionContribution + props.result.disabilityContribution + props.result.sickContribution + props.result.accidentContribution + props.result.fpContribution + props.result.fsContribution
})

const showCrossingTaxThresholdWarning = computed(() => {
  return eventStore.events.some(event => event.type === EventType.CrossingTaxThreshold  && event.sinceMonth && props.month >= event.sinceMonth)
})
</script>
