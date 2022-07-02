<script>
import { Pie } from 'vue3-chart-v2'

export default {
  extends: Pie,
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
