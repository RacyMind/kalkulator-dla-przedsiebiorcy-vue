<template>
  <div v-if="result">
    <list-row>
      <template #name>
        Wynagrodzenie brutto
      </template>
      <template #value>
        {{ pln(result.grossAmount)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Koszty przychodu
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
          <div class="flex">Zaliczka na podatek dochodowy</div>
          <tooltip
            v-if="result.ppkIncomeFromEmployer"
            class="q-ml-xs">
            Składka na PPK wpłacona przez pracodawcę ({{ pln(result.ppkIncomeFromEmployer ) }}) traktowana jest jako dochód od którego potrącany jset podatek.
          </tooltip>
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
    <list-row>
      <template #name>
        Składka na PPK
      </template>
      <template #value>
        {{ pln(result.ppkContribution)}}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Wynagrodzenie netto
      </template>
      <template #value>
        {{ pln(result.netAmount)}}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {EventType, useEventStore} from 'stores/eventStore'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import CrossingTaxThreshold from 'components/partials/notifications/CrossingTaxThreshold.vue'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: EmployeeResult
  monthIndex?: number
}
const props = defineProps<Props>()
const eventStore = useEventStore()

const totalZusContributions = computed(() => {
  return props.result.healthContribution + props.result.pensionContribution + props.result.disabilityContribution + props.result.sickContribution
})

const showCrossingTaxThresholdWarning = computed(() => {
  if(typeof props.monthIndex === 'undefined') {
    return eventStore.events.some(event => event.type === EventType.CrossingTaxThreshold)
  }
  return eventStore.events.some(event => event.type === EventType.CrossingTaxThreshold  && event.sinceMonth && props.monthIndex >= event.sinceMonth)
})
</script>
