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
import { useInvoice } from 'src/use/useInvoice'
import PieChart from 'components/PieChart'
import constants from 'src/logic/constants'

export default {
  setup () {
    const { result } = useInvoice()

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
          'Kwota netto',
          'Kwota podatku',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
