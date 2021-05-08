<template>
  <q-card style="width: auto; max-width: 90vw;">
    <q-table
      title=" Podsumowanie dla pracownika"
      :grid="$q.screen.xs || $q.screen.sm"
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
import ContractOfMandate from 'src/logic/ContractOfMandate'

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
    }
  },
  created () {
    this.setData()

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
      gross: 'contractOfMandate/gross',
      authorExpensePart: 'contractOfMandate/authorExpensePart',
      basisForTax: 'contractOfMandate/basisForTax',
      employeeZus: 'contractOfMandate/employeeZus',
      employeePpk: 'contractOfMandate/employeePpk',
      employerPpk: 'contractOfMandate/employerPpk',
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
      const model = new ContractOfMandate()
      const currentBasicAmountForRentAndPension = this.totalBasicAmountForRentAndPension
      const currentTotalExpenses = this.totalExpenses

      model.gross = this.gross
      model.employeePpk = this.employeePpk
      model.basicAmountForRentAndPension = model.gross

      if (model.gross > this.$constants.LUMP_SUM_UP_TO_AMOUNT) {
        model.expensesRate = this.$constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
      }

      const newBasicAmountForRentAndPension = model.gross + this.totalBasicAmountForRentAndPension

      if (currentBasicAmountForRentAndPension > this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
        model.basicAmountForRentAndPension = 0
      } else {
        if (newBasicAmountForRentAndPension > this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
          model.basicAmountForRentAndPension = this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS - currentBasicAmountForRentAndPension
        }
      }

      this.totalBasicAmountForRentAndPension += model.gross

      if (this.employeeZus.pension) {
        model.calculateZUSEmployeePension()
      }
      if (this.employeeZus.rent) {
        model.calculateZUSEmployeeRent()
      }
      if (this.employeeZus.sick) {
        model.calculateZUSEmployeeSick()
      }

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

      if (this.employeeZus.health) {
        model.calculateZUSEmployeeHealth()
        model.calculateUSEmployeeHealth()
      }

      model.calculateBasisForTax()

      if (month > 0) {
        model.basisForTax += this.employerPpk
      }

      model.calculateTaxAmount()

      if (!this.basisForTax) {
        model.taxAmount = 0
        model.basisForTax = 0
        model.expenses = 0
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
