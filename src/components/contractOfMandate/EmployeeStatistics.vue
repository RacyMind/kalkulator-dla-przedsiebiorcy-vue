<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {PropType, computed, defineComponent} from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/partials/PieChart.vue'
import employeeContractOfMandate from 'components/contractOfMandate/logic/EmployeeContractOfMandate'

export default defineComponent({
  components: {
    PieChart,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<ContractOfMandateInputFields>,
    },
  },
  setup(props) {
    const labels = [
      'Wynagrodzenie netto',
      'Zaliczka na podatek dochodowy',
      'Składka zdrowotna',
      'Składka chorobowa',
      'Składka rentowa',
      'Składka emerytalna',
      'Składka PPK',
    ]

    const result = computed(() => {
        return employeeContractOfMandate.getMonthlyResult(props.input)
    })

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.netAmount,
          result.value.taxAmount,
          result.value.healthContribution,
          result.value.sickContribution,
          result.value.disabilityContribution,
          result.value.pensionContribution,
          result.value.ppkContribution,
        ],
      ),
    )

    return {
      chartData,
      result,
    }
  },
})
</script>
