<script>
import { Line } from 'vue3-chart-v2'
import Moment from 'moment'
import 'moment/locale/pl'

export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: false,
    },
  },
  created () {
    Moment.locale('pl')
  },
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
    chartData () {
      this.renderChart(this.chartData, this.chartOptions)
    },
  },
}
</script>
