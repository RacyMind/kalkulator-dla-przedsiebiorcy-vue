<template>
  <div class="q-pa-md">
    <PieChart
      v-if="gross"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import PieChart from 'components/PieChart'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    ...mapGetters({
      gross: 'contractOfMandate/gross',
      employerZus: 'contractOfMandate/employerZus',
      employerPpk: 'contractOfMandate/employerPpk',
    }),
    chartData () {
      return {
        datasets: [{
          data: [
            this.gross.toFixed(2),
            this.employerZus.accident.toFixed(2),
            this.employerZus.rent.toFixed(2),
            this.employerZus.pension.toFixed(2),
            this.employerPpk.toFixed(2),
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
  watch: {
    gross (prevState, newState) {
      if (prevState !== newState) {
        this.forceRerender()
      }
    },
    employerZus (prevState, newState) {
      if (prevState !== newState) {
        this.forceRerender()
      }
    },
    employerPpk (prevState, newState) {
      if (prevState !== newState) {
        this.forceRerender()
      }
    },
  },
  methods: {
    forceRerender () {
      this.componentKey += 1
    },
  },
  components: {
    PieChart,
  },
}
</script>
