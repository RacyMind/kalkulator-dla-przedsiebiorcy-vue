<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.grossAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import employerContractOfMandate from 'components/contractOfMandate/employerContractOfMandate'
import PieChart from 'components/PieChart.vue'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {usePieChart} from 'src/use/usePieChart'

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
    const labels =  [
      'Wynagrodzenie brutto',
      'Składka wypadkowa',
      'Składka rentowa',
      'Składka emerytalna',
      'Składka PPK',
    ]

    const result = computed(() => {
      return employerContractOfMandate.getMonthlyResult(props.input)
    })

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.grossAmount,
          result.value.accidentContribution,
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
