<template>
  <div class="q-pa-md">
    <PieChart
      v-if="gross"
      class="pieChart"
      :chart-data="data"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import PieChart from 'components/PieChart'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      gross: 'contractOfMandate/gross',
      employerZus: 'contractOfMandate/employerZus',
      employerPpk: 'contractOfMandate/employerPpk',
    }),
    data () {
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
  components: {
    PieChart,
  },
}
</script>
