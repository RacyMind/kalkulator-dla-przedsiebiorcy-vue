<template>
  <div v-if="employeeResult && employerResult">
    <ListRow>
      <template #name>
        Wynagrodzenie netto
      </template>
      <template #value>
        {{ pln(employeeResult.netAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Zaliczka na podatek dochodowy
        <CrossingTaxThreshold v-if="showCrossingTaxThresholdWarning" />
      </template>
      <template #value>
        {{ pln(employeeResult.taxAmount) }}
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
    <ListRow>
      <template #name>
        Składki na PPK
      </template>
      <template #value>
        {{ pln(totalPpkContributions) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Suma kosztów pracodawcy
      </template>
      <template #value>
        {{ pln(employerResult.totalAmount) }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import {EventType, useEventStore} from 'stores/eventStore'
import {computed} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import CrossingTaxThreshold from 'components/partials/notifications/CrossingTaxThreshold.vue'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  employeeResult: EmployeeResult
  employerResult: EmployerResult
  monthIndex?: number
}
const props = defineProps<Props>()
const eventStore = useEventStore()

const totalEmployeeZusContributions = computed(() => {
  return props.employeeResult.healthContribution + props.employeeResult.pensionContribution + props.employeeResult.disabilityContribution + props.employeeResult.sickContribution
})

const totalEmployerZusContributions = computed(() => {
  return props.employerResult.fpContribution + props.employerResult.fgspContribution + props.employerResult.fsContribution + props.employerResult.pensionContribution + props.employerResult.disabilityContribution + props.employerResult.accidentContribution
})

const totalZusContributions = computed(() => totalEmployerZusContributions.value + totalEmployeeZusContributions.value)
const totalPpkContributions = computed(() => props.employeeResult.ppkContribution + props.employerResult.ppkContribution)

const showCrossingTaxThresholdWarning = computed(() => {
  if(typeof props.monthIndex === 'undefined') {
    return eventStore.events.some(event => event.type === EventType.CrossingTaxThreshold)
  }
  return eventStore.events.some(event => event.type === EventType.CrossingTaxThreshold  && event.sinceMonth && props.monthIndex >= event.sinceMonth)
})
</script>
