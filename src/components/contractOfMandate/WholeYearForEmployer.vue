<template>
  <WholeYearTable
    title="Podsumowanie dla pracodawcy"
    :columns="columns"
    :rows="results.rows"
    @grossAmountUpdated="updateGrossAmounts"
  />
</template>

<script>
import constants from 'src/logic/constants'
import { useYearlyEmployerResult } from 'src/use/contractOfMandate/useYearlyEmployerResult'
import { pln } from 'src/use/currencyFormat'
import WholeYearTable from 'src/components/WholeYearTable'

export default {
  setup () {
    const { results, monthlyInputs } = useYearlyEmployerResult()
    return {
      pln,
      constants,
      results,
      monthlyInputs,
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
          name: 'accident',
          label: 'Skł. wypadkowa',
          required: true,
          align: 'left',
          field: row => row.accidentContribution,
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
          name: 'ppk',
          label: 'PPK',
          required: true,
          align: 'left',
          field: row => row.ppkContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'totalAmount',
          label: 'Suma kosztów pracodawcy',
          required: true,
          align: 'left',
          field: row => row.totalAmount,
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
    },
  },
  components: {
    WholeYearTable,
  },
}
</script>
