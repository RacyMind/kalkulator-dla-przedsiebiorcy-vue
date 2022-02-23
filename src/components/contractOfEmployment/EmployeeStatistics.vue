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
import {usePieChart} from 'src/use/usePieChart'
import employeeContractOfEmployment from 'components/contractOfEmployment/employeeContractOfEmployment'
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfEmploymentInputFields>,
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
      return employeeContractOfEmployment.getMonthlyResult(props.input)
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
