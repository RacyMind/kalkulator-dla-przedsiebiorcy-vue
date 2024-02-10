<template>
  <div class="q-pa-md">
    <PieChart
      v-if="props.employeeResult?.netAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts" setup>
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import { computed } from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'

interface Props {
  employeeResult: EmployeeResult
  employerResult: EmployerResult
}
const props = defineProps<Props>()

const totalEmployeeZusContributions = computed(() => {
  return props.employeeResult.healthContribution + props.employeeResult.pensionContribution + props.employeeResult.disabilityContribution + props.employeeResult.sickContribution
})

const totalEmployerZusContributions = computed(() => {
  return props.employerResult.fpContribution + props.employerResult.fgspContribution + props.employerResult.fsContribution + props.employerResult.pensionContribution + props.employerResult.disabilityContribution + props.employerResult.accidentContribution
})

const totalZusContributions = computed(() => totalEmployerZusContributions.value + totalEmployeeZusContributions.value)
const totalPpkContributions = computed(() => props.employeeResult.ppkContribution + props.employerResult.ppkContribution)

const labels = [
  'Wynagrodzenie netto',
  'Zaliczka na podatek dochodowy',
  'Składki ZUS',
  'Składki na PPK',
]

const chartData = computed(() => usePieChart(
    labels,
    [
      props.employeeResult.netAmount,
      props.employeeResult.taxAmount,
      totalZusContributions.value,
      totalPpkContributions.value,
    ],
  ),
)
</script>
