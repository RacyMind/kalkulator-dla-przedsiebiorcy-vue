<template>
  <WholeYearTable
    title="Podsumowanie"
    :columns="columns"
    :rows="results.rows"
    @grossAmountUpdated="updateGrossAmounts"
  />
</template>

<script>
import constants from 'src/logic/constants'
import { useYearlyResult, inputData } from 'src/use/useSelfEmployment'
import { pln } from 'src/use/currencyFormat'
import WholeYearTable from 'src/components/WholeYearTable'

export default {
  props: {
    year: Number,
  },
  setup (props) {
    const { results, monthlyInputs } = useYearlyResult(props)
    const { taxType } = inputData()

    return {
      pln,
      constants,
      results,
      monthlyInputs,
      taxType,
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
          name: 'accident',
          label: 'Skł. wypadkowa',
          required: true,
          align: 'left',
          field: row => row.accidentContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'fp',
          label: 'Skł. na Fundusz Pracy',
          required: true,
          align: 'left',
          field: row => row.fpContribution,
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
          name: 'expenses',
          label: 'Koszty przychodu',
          required: true,
          align: 'left',
          field: row => row.expenses,
          format: val => `${pln(val)}`,
        },
        {
          name: 'net',
          label: 'Dochód netto',
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
      if (this.taxType === constants.TAX_TYPES.GENERAL && this.results.totalBasisForTax > constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${pln(constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD)}). Dla kwoty powyżej progu stawka podatku wynosi ${this.$constants.TAX_RATES.SECOND_RATE}%.`,
        })
      }
    },
  },
  components: {
    WholeYearTable,
  },
}
</script>
