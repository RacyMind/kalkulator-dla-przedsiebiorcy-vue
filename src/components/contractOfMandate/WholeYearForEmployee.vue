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
import { useYearlyEmployeeResult } from 'src/use/contractOfMandate/useYearlyEmployeeResult'
import { pln } from 'src/use/currencyFormat'
import WholeYearTable from 'src/components/WholeYearTable'

export default {
    setup () {
      const { results, monthlyInputs, isYoung, employerPpkContributionRate } = useYearlyEmployeeResult()
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
    results () {
      this.showNotifications()
    },
  },
  methods: {
    updateGrossAmounts (grossAmounts) {
      grossAmounts.forEach((grossAmount, index) => {
        this.monthlyInputs[index].grossAmount = grossAmount
      })
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
  components: {
    WholeYearTable,
  },
}
</script>
