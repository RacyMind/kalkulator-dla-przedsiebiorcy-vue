<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Wynagrodzenie brutto
      </template>
      <template #value>
        {{ pln(result.grossAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Koszty przychodu
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
          <div class="flex">Zaliczka na podatek dochodowy</div>
          <Tooltip
            v-if="result.ppkIncomeFromEmployer"
            class="q-ml-xs">
            Składka na PPK wpłacona przez pracodawcę ({{ pln(result.ppkIncomeFromEmployer ) }}) traktowana jest jako dochód od którego potrącany jset podatek.
          </Tooltip>
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
    <ListRow>
      <template #name>
        Składka na PPK
      </template>
      <template #value>
        {{ pln(result.ppkContribution)}}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Wynagrodzenie netto
      </template>
      <template #value>
        {{ pln(result.netAmount)}}
      </template>
    </ListRow>
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
