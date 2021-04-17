<template>
  <div class="q-pa-md">
    <PieChart
      v-if="net"
      class="pieChart"
      :chart-data="data"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import PieChart from 'components/PieChart'
import { mapGetters } from 'vuex'
import { colors } from 'quasar'

export default {
  computed: {
    ...mapGetters({
      net: 'selfEmployment/net',
      tax: 'selfEmployment/tax',
      zus: 'selfEmployment/zus',
    }),
    data () {
      return {
        datasets: [{
          data: [
            this.net.toFixed(2),
            this.tax.toFixed(2),
            this.zus.health.toFixed(2),
            this.zus.sick.toFixed(2),
            this.zus.rent.toFixed(2),
            this.zus.pension.toFixed(2),
            this.zus.fp.toFixed(2),
          ],
          backgroundColor: [
            colors.lighten(this.$constants.COLORS.SELF_EMPLOYMENT, -30),
            colors.lighten(this.$constants.COLORS.SELF_EMPLOYMENT, -20),
            colors.lighten(this.$constants.COLORS.SELF_EMPLOYMENT, -10),
            colors.lighten(this.$constants.COLORS.SELF_EMPLOYMENT, 0),
            colors.lighten(this.$constants.COLORS.SELF_EMPLOYMENT, 10),
            colors.lighten(this.$constants.COLORS.SELF_EMPLOYMENT, 20),
            colors.lighten(this.$constants.COLORS.SELF_EMPLOYMENT, 30),
          ],
        }],
        labels: [
          'Wynagrodzenie netto',
          'Zaliczka na podatek dochodowy',
          'Składka zdrowotna',
          'Składka chorobowa',
          'Składka rentowa',
          'Składka emerytalna',
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
