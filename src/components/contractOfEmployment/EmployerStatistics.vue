<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.grossAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import constants from 'src/logic/constants'
import { useMonthlyEmployerResult } from 'src/use/useContractOfEmployment'
import PieChart from 'components/PieChart'

export default {
  props: {
    year: Number,
  },
  setup (props) {
    const { result } = useMonthlyEmployerResult(props)

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
            this.result.fpContribution,
            this.result.fgspContribution,
          ],
          backgroundColor: [
            constants.COLORS.CHART1,
            constants.COLORS.CHART2,
            constants.COLORS.CHART3,
            constants.COLORS.CHART4,
            constants.COLORS.CHART5,
            constants.COLORS.CHART6,
            constants.COLORS.CHART7,
          ],
        }],
        labels: [
          'Wynagrodzenie brutto',
          'Składka wypadkowa',
          'Składka rentowa',
          'Składka emerytalna',
          'Składka PPK',
          'Składka na Fundusz Pracy',
          'Składka na FGŚP',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
