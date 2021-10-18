<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import constants from 'src/logic/constants'
import PieChart from 'components/PieChart'
import { useMonthlyResult } from 'src/use/useSelfEmployment'

export default {
  props: {
    year: Number,
  },
  setup (props) {
    const { result } = useMonthlyResult(props)
    return {
      result,
    }
  },
  computed: {
    chartData () {
      return {
        datasets: [{
          data: [
            this.result.netAmount,
            this.result.taxAmount,
            this.result.healthContribution,
            this.result.sickContribution,
            this.result.rentContribution,
            this.result.pensionContribution,
            this.result.accidentContribution,
            this.result.fpContribution,
          ],
          backgroundColor: [
            constants.COLORS.CHART1,
            constants.COLORS.CHART2,
            constants.COLORS.CHART3,
            constants.COLORS.CHART4,
            constants.COLORS.CHART5,
            constants.COLORS.CHART6,
            constants.COLORS.CHART7,
            constants.COLORS.CHART8,
          ],
        }],
        labels: [
          'Dochód netto',
          'Zaliczka na podatek dochodowy',
          'Składka zdrowotna',
          'Składka chorobowa',
          'Składka rentowa',
          'Składka emerytalna',
          'Składka wypadkowa',
          'Składka na Fundusz Pracy',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
