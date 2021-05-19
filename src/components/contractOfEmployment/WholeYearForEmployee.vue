<template>
  <q-card style="width: auto; max-width: 90vw;">
    <q-table
      title=" Podsumowanie dla pracownika"
      :grid="$q.screen.xs || $q.screen.sm"
      :rows="data"
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
      totalExpenses: 0,
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
          name: 'ppk',
          label: 'PPK',
          required: true,
          align: 'left',
          field: row => row.ppk,
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
      totalGross: 0,
    }
  },
  created () {
    this.setData()

    if (this.totalBasisForTax > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
      this.$q.notify({
        message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${this.$constants.AMOUNT_OF_TAX_THRESHOLD} zł). Dla kwoty powyzej progu stawka podatku wynosi ${this.$constants.TAX_RATES.SECOND_RATE}%.`,
      })
    }

    if (this.totalBasicAmountForRentAndPension > this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
      this.$q.notify({
        message: `Przekroczono limit 30-krotności składek ZUS (${this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS} zł). Powyżej limitu nie ma obowiązku opłacania składki emerytalnej i rentowej.`,
      })
    }

    if (this.employerPpk) {
      this.$q.notify({
        message: 'Od lutego do podsrawy opodatkowania doliczana jest składka PPK wpłacana przez pracodawcę.',
      })
    }
  },
  computed: {
    ...mapGetters({
      gross: 'contractOfEmployment/gross',
      authorExpensePart: 'contractOfEmployment/authorExpensePart',
      basisForTax: 'contractOfEmployment/basisForTax',
      expenses: 'contractOfEmployment/expenses',
      employeePpk: 'contractOfEmployment/employeePpk',
      employerPpk: 'contractOfEmployment/employerPpk',
      freeAmount: 'contractOfEmployment/freeAmount',
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
        ppk: 0,
        net: 0,
      }

      for (let i = 0; i < 12; i++) {
        const result = this.getResultForOneMonth(i)

        this.data[i] = {
          month: this.$constants.LOCALE_DATE.months[i],
          gross: result.gross,
          pension: result.pension,
          sick: result.sick,
          rent: result.rent,
          health: result.health,
          taxAmount: result.taxAmount,
          ppk: result.ppk,
          net: result.net,
        }

        total.gross += result.gross
        total.pension += result.pension
        total.sick += result.sick
        total.rent += result.rent
        total.health += result.health
        total.taxAmount += result.taxAmount
        total.ppk += result.ppk
        total.net += result.net
      }

      this.data.push(total)
    },
    getResultForOneMonth (month) {
      const model = new ContractOfEmployment()
      this.totalGross += this.gross

      // Warunek dla 2. progu PITu dla mlodych
      if (!this.basisForTax && this.totalGross > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
        this.totalBasisForTax = 0
      }

      const currentBasisForTax = this.totalBasisForTax
      const currentBasicAmountForRentAndPension = this.totalBasicAmountForRentAndPension
      const currentTotalExpenses = this.totalExpenses

      model.gross = this.gross
      model.freeAmount = this.freeAmount
      model.expenses = this.expenses
      model.employeePpk = this.employeePpk
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

      model.authorExpensePart = this.authorExpensePart

      model.calculateExpenses()

      const newTotalExpenses = model.expenses + this.totalExpenses

      if (currentTotalExpenses > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
        model.expenses = 0
      } else {
        if (newTotalExpenses > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
          model.expenses = this.$constants.AMOUNT_OF_TAX_THRESHOLD - currentTotalExpenses
        }
      }

      model.calculateBasisForTax()

      if (month > 0) {
        model.basisForTax += this.employerPpk
      }

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

      if (!this.basisForTax && this.totalGross <= this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
        model.taxAmount = 0
        model.basisForTax = 0
        model.expenses = 0
      }

      if (model.taxAmount < 0) {
        model.taxAmount = 0
      }

      model.calculateNetAmount()

      this.totalExpenses += model.expenses

      return {
        rent: model.employeeZus.rent,
        pension: model.employeeZus.pension,
        sick: model.employeeZus.sick,
        health: model.employeeZus.health,
        taxAmount: model.taxAmount,
        ppk: model.employeePpk,
        net: model.net,
        gross: model.gross,
      }
    },
  },
}
</script>
