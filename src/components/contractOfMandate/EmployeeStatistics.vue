<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netAmount"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import PieChart from 'components/PieChart'
import { getMonthlyResultOfEmployee } from 'src/logic/contractOfMandate'

export default {
  setup () {
    const store = useStore()
    const grossAmount = computed(() => store.getters['contractOfMandate/grossAmount'])
    const ppkEmployeeContributionRate = computed(() => store.getters['contractOfMandate/ppkEmployeeContributionRate'])
    const partOfWorkWithAuthorExpenses = computed(() => store.getters['contractOfMandate/partOfWorkWithAuthorExpenses'])
    const isPensionContribution = computed(() => store.getters['contractOfMandate/isPensionContribution'])
    const isRentContribution = computed(() => store.getters['contractOfMandate/isRentContribution'])
    const isSickContribution = computed(() => store.getters['contractOfMandate/isSickContribution'])
    const isHealthContribution = computed(() => store.getters['contractOfMandate/isHealthContribution'])
    const isYoung = computed(() => store.getters['contractOfMandate/isYoung'])

    return {
      grossAmount,
      ppkEmployeeContributionRate,
      partOfWorkWithAuthorExpenses,
      isPensionContribution,
      isRentContribution,
      isSickContribution,
      isHealthContribution,
      isYoung,
    }
  },
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    result () {
      return getMonthlyResultOfEmployee(
        this.grossAmount,
        this.ppkEmployeeContributionRate,
        this.partOfWorkWithAuthorExpenses,
        this.isPensionContribution,
        this.isRentContribution,
        this.isSickContribution,
        this.isHealthContribution,
        this.isYoung,
      )
    },
    chartData () {
      return {
        datasets: [{
          data: [
            this.result.netAmount,
            this.result.taxAmount,
            this.result.healthContribution,
            this.result.sickContribution,
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
            this.$constants.COLORS.CHART6,
            this.$constants.COLORS.CHART7,
          ],
        }],
        labels: [
          'Wynagrodzenie netto',
          'Zaliczka na podatek dochodowy',
          'Składka zdrowotna',
          'Składka chorobowa',
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
