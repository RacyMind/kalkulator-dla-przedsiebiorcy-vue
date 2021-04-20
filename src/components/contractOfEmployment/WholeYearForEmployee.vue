<template>
  <q-card style="width: 1600px; max-width: 80vw;">
    <q-table
      title=" Podsumowanie dla pracownika"
      :data="data"
      :columns="columns"
      row-key="name"
      hide-bottom
      :pagination="{rowsPerPage: 13}"
    />
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from 'src/logic/helpers'
import ContractOfEmployment from 'src/logic/ContractOfEmployment'

export default {
  data () {
    return {
      totalBasisForTax: 0,
      totalBasicAmountForRentAndPension: 0,
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
          field: row => row.gross,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'health',
          label: 'Skł. zdrowotna',
          required: true,
          align: 'left',
          field: row => row.health,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'sick',
          label: 'Skł. chorobowa',
          required: true,
          align: 'left',
          field: row => row.sick,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'rent',
          label: 'Skł. rentowa',
          required: true,
          align: 'left',
          field: row => row.rent,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'pension',
          label: 'Skł. emerytalna',
          required: true,
          align: 'left',
          field: row => row.pension,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'taxAmount',
          label: 'Podatek',
          required: true,
          align: 'left',
          field: row => row.taxAmount,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'net',
          label: 'Netto',
          required: true,
          align: 'left',
          field: row => row.net,
          format: val => `${helpers.formatCurrency(val)}`,
        },
      ],
      data: [],
    }
  },
  created () {
    this.setData()
  },
  computed: {
    ...mapGetters({
      gross: 'contractOfEmployment/gross',
      basisForTax: 'contractOfEmployment/basisForTax',
      expenses: 'contractOfEmployment/expenses',
    }),
  },
  methods: {
    setData () {
      for (let i = 0; i < 12; i++) {
        const result = this.getResultForOneMonth()
        this.data[i] = {
          month: this.$constants.LOCALE_DATE.months[i],
          gross: result.gross,
          pension: result.pension,
          sick: result.sick,
          rent: result.rent,
          health: result.health,
          taxAmount: result.taxAmount,
          net: result.net,
        }
      }
    },
    getResultForOneMonth () {
      const model = new ContractOfEmployment()
      const currentBasisForTax = this.totalBasisForTax

      model.gross = this.gross
      model.expenses = this.expenses

      model.calculateZUSEmployeePension()

      model.calculateZUSEmployeeRent()

      model.calculateZUSEmployeeSick()

      model.calculateZUSEmployeeHealth()
      model.calculateUSEmployeeHealth()

      model.calculateBasisForTax()

      const newTotalBasisForTax = currentBasisForTax + model.basisForTax

      this.totalBasisForTax += model.basisForTax
      this.totalBasicAmountForRentAndPension += model.gross

      if (currentBasisForTax > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
        model.calculateTaxBySecondTaxRate()

        model.taxAmount = model.taxAmount - model.USHealthEmployee
      } else {
        if (newTotalBasisForTax <= this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
          model.calculateTaxByFirstTaxRate()

          model.taxAmount = model.taxAmount - model.USHealthEmployee - model.freeAmount
        } else {
          const basisForFirstRateTax = this.$constants.AMOUNT_OF_TAX_THRESHOLD - currentBasisForTax
          const basisForTax = model.basisForTax
          model.basisForTax = basisForFirstRateTax
          model.calculateTaxByFirstTaxRate()
          const firstRateTaxAmount = model.taxAmount

          model.basisForTax = Math.abs(basisForTax - basisForFirstRateTax)
          model.calculateTaxBySecondTaxRate()

          model.taxAmount = firstRateTaxAmount + model.taxAmount - model.USHealthEmployee - model.freeAmount
        }
      }

      model.taxAmount = Math.round(model.taxAmount)

      if (!this.basisForTax) {
        model.taxAmount = 0
        model.basisForTax = 0
        model.expenses = 0
      }

      model.calculateNetAmount()

      return {
        rent: model.employeeZus.rent,
        pension: model.employeeZus.pension,
        sick: model.employeeZus.sick,
        health: model.employeeZus.health,
        taxAmount: model.taxAmount,
        net: model.net,
        gross: model.gross,
      }
    },
  },
}
</script>
