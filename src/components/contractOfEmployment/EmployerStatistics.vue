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
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
import {PropType, computed, defineComponent} from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'
import employerContractOfEmployment from 'components/contractOfEmployment/employerContractOfEmployment'

export default defineComponent({
  components: {
    PieChart,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<InputFields>,
    },
  },
  setup(props) {
    const labels =  [
      'Wynagrodzenie brutto',
      'Składka wypadkowa',
      'Składka rentowa',
      'Składka emerytalna',
      'Składka PPK',
      'Składka na Fundusz Pracy',
      'Składka na FGŚP',
    ]

    const result = computed(() => {
      return employerContractOfEmployment.getMonthlyResult(props.input)
    })

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.grossAmount,
          result.value.accidentContribution,
          result.value.disabilityContribution,
          result.value.pensionContribution,
          result.value.ppkContribution,
          result.value.fpContribution,
          result.value.fgspContribution,
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
