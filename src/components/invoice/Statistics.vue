<template>
  <div class="q-pa-md">
    <PieChart
      v-if="net && tax"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import PieChart from 'components/PieChart'
import { mapGetters } from 'vuex'
import { colors } from 'quasar'

export default {
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    ...mapGetters({
      net: 'invoice/net',
      tax: 'invoice/tax',
    }),
    chartData () {
      return {
        datasets: [{
          data: [this.net.toFixed(2), this.tax.toFixed(2)],
          backgroundColor: [colors.lighten(this.$constants.COLORS.INVOICE, -20), colors.lighten(this.$constants.COLORS.INVOICE, 20)],
        }],
        labels: [
          'Kwota netto',
          'Kwota podatku',
        ],
      }
    },
  },
  watch: {
    net (prevState, newState) {
      if (prevState !== newState) {
        this.forceRerender()
      }
    },
    tax (prevState, newState) {
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
