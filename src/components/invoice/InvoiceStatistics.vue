<template>
  <div>
    <PieChart
      v-if="net && tax"
      clss="pieChart"
      :chart-data="data"/>
    <p v-else>Brak danych</p>
  </div>
</template>

<script>
import PieChart from 'components/PieChart'
import { mapGetters } from 'vuex'
import { colors } from 'quasar'

export default {
  computed: {
    ...mapGetters({
      net: 'invoice/net',
      tax: 'invoice/tax',
    }),
    data () {
      return {
        datasets: [{
          data: [this.net.toFixed(2), this.tax.toFixed(2)],
          backgroundColor: [colors.lighten(this.$constants.COLORS.INVOICE, -20), colors.lighten(this.$constants.COLORS.INVOICE, 20)],
        }],
        labels: [
          'Wynagrodzenie netto',
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

<style scoped>

</style>
