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
import { userUnregisteredCompany } from 'src/use/userUnregisteredCompany'
import PieChart from 'components/PieChart'

export default {
  setup () {
    const { result } = userUnregisteredCompany()

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
          ],
          backgroundColor: [
            constants.COLORS.CHART1,
            constants.COLORS.CHART2,
          ],
        }],
        labels: [
          'Dochód netto',
          'Zaliczka na podatek dochodowy',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
