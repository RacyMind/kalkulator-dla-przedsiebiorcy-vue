<template>
  <div v-if="employeeResult && employerResult">
    <list-row>
      <template #name>
        Wynagrodzenie brutto
      </template>
      <template #value>
        {{ pln(employeeResult.grossAmount) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Zaliczka na podatek dochodowy
      </template>
      <template #value>
        {{ pln(employeeResult.taxAmount) }}
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
    <list-row highlight>
      <template #name>
        Suma kosztów pracodawcy
      </template>
      <template #value>
        {{ pln(employerResult.totalAmount) }}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {EmployeeResult} from '../../../logic/interfaces/EmployeeResult'
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import {computed} from 'vue'
import {pln} from '../../../use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  employeeResult: EmployeeResult
  employerResult: EmployerResult
}
const props = defineProps<Props>()

const totalEmployeeZusContributions = computed(() => {
  return props.employeeResult.healthContribution + props.employeeResult.pensionContribution + props.employeeResult.disabilityContribution + props.employeeResult.sickContribution + props.employeeResult.ppkContribution
})

const totalEmployerZusContributions = computed(() => {
  return props.employerResult.fpContribution + props.employerResult.fgspContribution + props.employerResult.fsContribution + props.employerResult.pensionContribution + props.employerResult.disabilityContribution + props.employerResult.accidentContribution + props.employerResult.ppkContribution
})

const totalZusContributions = computed(() => totalEmployerZusContributions.value + totalEmployeeZusContributions.value)
</script>
