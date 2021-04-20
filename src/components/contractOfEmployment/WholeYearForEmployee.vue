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

      model.gross = this.gross

      model.calculateZUSEmployeePension()

      model.calculateZUSEmployeeRent()

      model.calculateZUSEmployeeSick()

      model.calculateZUSEmployeeHealth()
      model.calculateUSEmployeeHealth()

      model.calculateBasisForTax()
      model.calculateTaxAmount()

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
