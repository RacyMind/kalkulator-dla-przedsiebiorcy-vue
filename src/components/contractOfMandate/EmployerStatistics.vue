<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.grossAmount"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getMonthlyResultOfEmployer } from 'src/logic/contractOfMandate'
import PieChart from 'components/PieChart'

export default {
  setup () {
    const store = useStore()
    const grossAmount = computed(() => store.getters['contractOfMandate/grossAmount'])
    const employerPpkContributionRate = computed(() => store.getters['contractOfMandate/employerPpkContributionRate'])
    const accidentContributionRate = computed(() => store.getters['contractOfMandate/accidentContributionRate'])
    const isPensionContribution = computed(() => store.getters['contractOfMandate/isPensionContribution'])
    const isRentContribution = computed(() => store.getters['contractOfMandate/isRentContribution'])

    return {
      grossAmount,
      employerPpkContributionRate,
      accidentContributionRate,
      isPensionContribution,
      isRentContribution,
    }
  },
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    result () {
      return getMonthlyResultOfEmployer(
        this.grossAmount,
        this.accidentContributionRate,
        this.employerPpkContributionRate,
        this.isPensionContribution,
        this.isRentContribution,
      )
    },
    chartData () {
      return {
        datasets: [{
          data: [
            this.result.grossAmount,
            this.result.accidentContribution,
            this.result.rentContribution,
            this.result.pensionContribution,
            this.result.ppkContribution,
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
    result (prevState, newState) {
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
