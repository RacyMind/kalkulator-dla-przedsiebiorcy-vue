<template>
  <q-card
    class="relative-position"
    style="width: auto; max-width: 90vw;">
    <q-btn
      icon="close"
      class="absolute-top-right z-top"
      flat
      round
      dense
      v-close-popup />
    <q-table
      title=" Podsumowanie dla pracownika"
      :grid="$q.screen.xs || $q.screen.sm"
      :rows="results.rows"
      :columns="columns"
      row-key="name"
      hide-bottom
      :pagination="{rowsPerPage: 13}">
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :class="(props.row.month === constants.LABELS.WHOLE_YEAR) ? 'bg-primary text-white' : 'bg-white text-black'"
        >
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import constants from 'src/logic/constants'
import { getYearlyResultOfEmployee } from 'src/logic/contractOfMandate'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const store = useStore()
    const grossAmount = computed(() => store.getters['contractOfMandate/grossAmount'])
    const employeePPkContributionRate = computed(() => store.getters['contractOfMandate/employeePPkContributionRate'])
    const employerPpkContributionRate = computed(() => store.getters['contractOfMandate/employerPpkContributionRate'])
    const partOfWorkWithAuthorExpenses = computed(() => store.getters['contractOfMandate/partOfWorkWithAuthorExpenses'])
    const isPensionContribution = computed(() => store.getters['contractOfMandate/isPensionContribution'])
    const isRentContribution = computed(() => store.getters['contractOfMandate/isRentContribution'])
    const isSickContribution = computed(() => store.getters['contractOfMandate/isSickContribution'])
    const isHealthContribution = computed(() => store.getters['contractOfMandate/isHealthContribution'])
    const isYoung = computed(() => store.getters['contractOfMandate/isYoung'])

    return {
      pln,
      constants,
      grossAmount,
      employeePPkContributionRate,
      employerPpkContributionRate,
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
      monthlyInputs: [],
      results: [],
      columns: [
        {
          name: 'month',
          required: true,
          align: 'left',
          field: row => row.month,
          format: val => `${val}`,
        },
        {
          name: 'gross',
          label: 'Brutto',
          required: true,
          align: 'left',
          field: row => row.grossAmount,
          format: val => `${pln(val)}`,
        },
        {
          name: 'sick',
          label: 'Skł. chorobowa',
          required: true,
          align: 'left',
          field: row => row.sickContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'rent',
          label: 'Skł. rentowa',
          required: true,
          align: 'left',
          field: row => row.rentContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'pension',
          label: 'Skł. emerytalna',
          required: true,
          align: 'left',
          field: row => row.pensionContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'health',
          label: 'Skł. zdrowotna',
          required: true,
          align: 'left',
          field: row => row.healthContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'taxAmount',
          label: 'Podatek',
          required: true,
          align: 'left',
          field: row => row.taxAmount,
          format: val => `${pln(val)}`,
        },
        {
          name: 'ppk',
          label: 'PPK',
          required: true,
          align: 'left',
          field: row => row.ppkContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'net',
          label: 'Netto',
          required: true,
          align: 'left',
          field: row => row.netAmount,
          format: val => `${pln(val)}`,
        },
      ],
    }
  },
  created () {
    this.updateMonthlyInputs()
    this.results = getYearlyResultOfEmployee(this.monthlyInputs)
  },
  watch: {
    results () {
      this.showNotifications()
    },
  },
  methods: {
    updateMonthlyInputs () {
      for (let i = 0; i < 12; i++) {
        this.monthlyInputs[i] = {
          grossAmount: this.grossAmount,
          employeePPkContributionRate: this.employeePPkContributionRate,
          partOfWorkWithAuthorExpenses: this.partOfWorkWithAuthorExpenses,
          isPensionContribution: this.isPensionContribution,
          isRentContribution: this.isRentContribution,
          isSickContribution: this.isSickContribution,
          isHealthContribution: this.isHealthContribution,
          isYoung: this.isYoung,
          employerPpkContributionRate: this.employerPpkContributionRate,
        }
      }
    },
    showNotifications () {
      if (this.results.totalBasisForRentAndPensionContributions > constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
        this.$q.notify({
          message: `Przekroczono limit 30-krotności składek ZUS (${constants.LIMIT_BASIC_AMOUNT_FOR_ZUS} zł). Powyżej limitu nie ma obowiązku opłacania składki emerytalnej i rentowej.`,
        })
      }
      if (this.isYoung && this.results.totalGrossAmount > constants.AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Przekroczono próg podatkowy (${constants.AMOUNT_OF_TAX_THRESHOLD} zł). Od nadwyżki oblicza się ${constants.TAX_RATES.FIRST_RATE}% podatku.`,
        })
      }
      if (this.employerPpkContributionRate) {
        this.$q.notify({
          message: 'Od lutego do podstawy opodatkowania doliczana jest składka PPK wpłacana przez pracodawcę.',
        })
      }
    },
  },
}
</script>
