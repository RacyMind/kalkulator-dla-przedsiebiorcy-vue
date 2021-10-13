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
            this.$constants.COLORS.CHART1,
            this.$constants.COLORS.CHART2,
            this.$constants.COLORS.CHART3,
            this.$constants.COLORS.CHART4,
            this.$constants.COLORS.CHART5,
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
