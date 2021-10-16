<template>
  <WholeYearTable
    title="Podsumowanie dla pracownika"
    :columns="columns"
    :rows="results.rows"
    @grossAmountUpdated="updateGrossAmounts"
  />
</template>

<script>
import constants from 'src/logic/constants'
import { useYearlyEmployeeResult } from 'src/use/useContractOfMandate'
import { pln } from 'src/use/currencyFormat'
import WholeYearTable from 'src/components/WholeYearTable'

export default {
  props: {
    year: Number,
  },
    setup (props) {
      const { results, monthlyInputs, isYoung, employerPpkContributionRate } = useYearlyEmployeeResult(props)
      return {
        pln,
        constants,
        results,
        monthlyInputs,
        isYoung,
        employerPpkContributionRate,
      }
    },
  data () {
    return {
      columns: [
        {
          name: 'month',
          required: true,
          align: 'left',
          field: row => constants.LOCALE_DATE.months[row.month],
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
  watch: {
    results: {
      handler: function () {
        this.showNotifications()
      },
      immediate: true,
    },
  },
  methods: {
    updateGrossAmounts (grossAmounts) {
      grossAmounts.forEach((grossAmount, index) => {
        this.monthlyInputs[index].grossAmount = grossAmount
      })
    },
    showNotifications () {
      if (this.results.totalBasisForRentAndPensionContributions > constants.PARAMS[this.year].LIMIT_BASIC_AMOUNT_FOR_ZUS) {
        this.$q.notify({
          message: `Przekroczono limit 30-krotności składek ZUS (${pln(constants.PARAMS[this.year].LIMIT_BASIC_AMOUNT_FOR_ZUS)}). Powyżej limitu nie ma obowiązku opłacania składki emerytalnej i rentowej.`,
        })
      }
      if (this.isYoung && this.results.totalGrossAmount > constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Przekroczono próg podatkowy (${pln(constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD)}). Od nadwyżki oblicza się ${constants.TAX_RATES.FIRST_RATE}% podatku.`,
        })
      }
      if (this.employerPpkContributionRate) {
        this.$q.notify({
          message: 'Od lutego do podstawy opodatkowania doliczana jest składka PPK wpłacana przez pracodawcę.',
        })
      }
    },
  },
  components: {
    WholeYearTable,
  },
}
</script>
