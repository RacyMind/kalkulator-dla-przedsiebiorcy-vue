<script>
import 'moment/locale/pl'
import { Line } from 'vue3-chart-v2'
import Moment from 'moment'

export default {
  created () {
    Moment.locale('pl')
  },
  extends: Line,
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  },
  props: {
    chartData: {
      required: true,
      type: Object,
    },
    chartOptions: {
      required: false,
      type: Object,
    },
  },
  watch: {
    chartData () {
      this.renderChart(this.chartData, this.chartOptions)
    },
  },
}
</script>
