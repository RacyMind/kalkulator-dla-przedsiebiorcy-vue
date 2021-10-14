<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.grossAmount"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import constants from 'src/logic/constants'
import { useMonthlyEmployerResult } from 'src/use/contractOfMandate/useMonthlyEmployerResult'
import PieChart from 'components/PieChart'

export default {
  setup () {
    const { result } = useMonthlyEmployerResult()

    return {
      result,
    }
  },
  computed: {
    chartData () {
      return {
        datasets: [{
          data: [
            this.result.grossAmount,
            this.result.accidentContribution,
            this.result.rentContribution,
            this.result.pensionContribution,
            this.result.ppkContribution,
          ],
          backgroundColor: [
            constants.COLORS.CHART1,
            constants.COLORS.CHART2,
            constants.COLORS.CHART3,
            constants.COLORS.CHART4,
            constants.COLORS.CHART5,
          ],
        }],
        labels: [
          'Wynagrodzenie brutto',
          'Składka wypadkowa',
          'Składka rentowa',
          'Składka emerytalna',
          'PPK',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
