<template>
  <q-card style="width: auto; max-width: 90vw;">
    <q-table
      title=" Podsumowanie dla pracownika"
      :data="data"
      :columns="columns"
      row-key="name"
      hide-bottom
      :pagination="{rowsPerPage: 13}">
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :class="(props.row.month=='Cały rok')?'bg-primary text-white':'bg-white text-black'"
        >
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
/**
 * TO DO
 * Przy uldze dla mlodych wchodzi podatek dla 2. progu https://poradnikprzedsiebiorcy.pl/-przekroczenie-progu-podatkowego-przez-osobe-objeta-ulga-pit-dla-mlodych
 */
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
          name: 'health',
          label: 'Skł. zdrowotna',
          required: true,
          align: 'left',
          field: row => row.health,
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
      const total = {
        month: 'Cały rok',
        gross: 0,
        pension: 0,
        sick: 0,
        rent: 0,
        health: 0,
        taxAmount: 0,
        net: 0,
      }

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

        total.gross += result.gross
        total.pension += result.pension
        total.sick += result.sick
        total.rent += result.rent
        total.health += result.health
        total.taxAmount += result.taxAmount
        total.net += result.net
      }

      this.data.push(total)
    },
    getResultForOneMonth () {
      const model = new ContractOfEmployment()
      const currentBasisForTax = this.totalBasisForTax
      const currentBasicAmountForRentAndPension = this.totalBasicAmountForRentAndPension

      model.gross = this.gross
      model.expenses = this.expenses
      model.basicAmountForRentAndPension = model.gross

      const newBasicAmountForRentAndPension = model.gross + this.totalBasicAmountForRentAndPension

      if (currentBasicAmountForRentAndPension > this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
        model.basicAmountForRentAndPension = 0
      } else {
        if (newBasicAmountForRentAndPension > this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
          model.basicAmountForRentAndPension = this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS - currentBasicAmountForRentAndPension
        }
      }

      this.totalBasicAmountForRentAndPension += model.gross

      model.calculateZUSEmployeePension()
      model.calculateZUSEmployeeRent()
      model.calculateZUSEmployeeSick()
      model.calculateZUSEmployeeHealth()
      model.calculateUSEmployeeHealth()

      model.calculateBasisForTax()

      const newTotalBasisForTax = currentBasisForTax + model.basisForTax

      this.totalBasisForTax += model.basisForTax

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

      if (model.taxAmount < 0) {
        model.taxAmount = 0
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
