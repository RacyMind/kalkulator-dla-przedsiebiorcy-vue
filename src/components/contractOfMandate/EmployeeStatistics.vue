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
import {computed, defineComponent, PropType} from 'vue'
import PieChart from 'components/PieChart.vue'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {usePieChart} from 'src/use/usePieChart'
import employeeContractOfMandate from 'components/contractOfMandate/employeeContractOfMandate'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfMandateInputFields>,
      required: true,
    },
  },
  setup(props) {
    const labels =  [
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
      result,
      chartData,
    }
  },
  components: {
    PieChart,
  },
})
</script>
