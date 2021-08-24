<template>
  <q-card style="width: auto; max-width: 90vw;">
    <q-table
      title=" Podsumowanie"
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
import { pln } from 'src/use/currencyFormat'
import SelfEmployment from 'src/logic/SelfEmployment'

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
          label: 'Przychód netto',
          required: true,
          align: 'left',
          field: row => row.gross,
          format: val => `${pln(val)}`,
        },
        {
          name: 'sick',
          label: 'Skł. chorobowa',
          required: true,
          align: 'left',
          field: row => row.sick,
          format: val => `${pln(val)}`,
        },
        {
          name: 'rent',
          label: 'Skł. rentowa',
          required: true,
          align: 'left',
          field: row => row.rent,
          format: val => `${pln(val)}`,
        },
        {
          name: 'pension',
          label: 'Skł. emerytalna',
          required: true,
          align: 'left',
          field: row => row.pension,
          format: val => `${pln(val)}`,
        },
        {
          name: 'health',
          label: 'Skł. zdrowotna',
          required: true,
          align: 'left',
          field: row => row.health,
          format: val => `${pln(val)}`,
        },
        {
          name: 'accident',
          label: 'Skł. wypadkowa',
          required: true,
          align: 'left',
          field: row => row.accident,
          format: val => `${pln(val)}`,
        },
        {
          name: 'fp',
          label: 'Skł. na Fundusz Pracy',
          required: true,
          align: 'left',
          field: row => row.fp,
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
          label: 'Koszty przycchodu',
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
          field: row => row.net,
          format: val => `${pln(val)}`,
        },
      ],
      data: [],
    }
  },
  created () {
    this.setData()

    if (this.taxType === this.$constants.TAX_TYPES.GENERAL && this.totalBasisForTax > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
      this.$q.notify({
        message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${this.$constants.AMOUNT_OF_TAX_THRESHOLD} zł). Dla kwoty powyzej progu stawka podatku wynosi ${this.$constants.TAX_RATES.SECOND_RATE}%.`,
      })
    }
  },
  computed: {
    ...mapGetters({
      gross: 'selfEmployment/gross',
      expenses: 'selfEmployment/expenses',
      zus: 'selfEmployment/zus',
      taxType: 'selfEmployment/taxType',
      tax: 'selfEmployment/tax',
      aid: 'selfEmployment/aid',
      sick: 'selfEmployment/sick',
      zusAccidentRate: 'selfEmployment/zusAccidentRate',
      freeAmount: 'selfEmployment/freeAmount',
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
        accident: 0,
        fp: 0,
        taxAmount: 0,
        net: 0,
        expenses: 0,
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
          accident: result.accident,
          fp: result.fp,
          taxAmount: result.taxAmount,
          net: result.net,
          expenses: result.expenses,
        }

        total.gross += result.gross
        total.pension += result.pension
        total.sick += result.sick
        total.rent += result.rent
        total.health += result.health
        total.accident += result.accident
        total.fp += result.fp
        total.taxAmount += result.taxAmount
        total.net += result.net
        total.expenses += result.expenses
      }

      this.data.push(total)
    },
    getResultForOneMonth (month) {
      const model = new SelfEmployment()
      const currentBasisForTax = this.totalBasisForTax
      model.gross = this.gross
      model.expenses = this.expenses
      model.taxType = this.taxType
      model.freeAmount = this.freeAmount

      if (this.zus.accident) {
        model.zus.accident = this.zus.accident
      }
      if (this.zus.pension) {
        model.zus.pension = this.zus.pension
      }
      if (this.zus.rent) {
        model.zus.rent = this.zus.rent
      }
      if (this.zus.sick) {
        model.zus.sick = this.zus.sick
      }
      if (this.zus.fp) {
        model.zus.fp = this.zus.fp
      }
      if (month > 5 && this.aid) {
        model.basisForZus = this.$constants.ZUS.OWNER.SMALL_AMOUNT
        model.zusAccidentRate = Number(this.zusAccidentRate)

        model.calculateZUSAccident()
        model.calculateZUSPension()
        model.calculateZUSRent()
        model.calculateZUSAccident()

        if (this.sick) {
          model.calculateZUSSick()
        }
      }

      model.zus.health = this.zus.health
      model.calculateUSHealth()

      model.calculateBasisForTax()

      const newTotalBasisForTax = currentBasisForTax + model.basisForTax

      this.totalBasisForTax += model.basisForTax

      if (this.taxType === this.$constants.TAX_TYPES.GENERAL) {
        if (currentBasisForTax > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
          model.calculateTaxBySecondTaxRate()

          model.taxAmount = model.taxAmount - model.USHealth
        } else {
          if (newTotalBasisForTax <= this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
            model.calculateTaxByFirstTaxRate()

            model.taxAmount = model.taxAmount - model.USHealth - model.freeAmount
          } else {
            const basisForFirstRateTax = this.$constants.AMOUNT_OF_TAX_THRESHOLD - currentBasisForTax
            const basisForTax = model.basisForTax
            model.basisForTax = basisForFirstRateTax
            model.calculateTaxByFirstTaxRate()
            const firstRateTaxAmount = model.taxAmount

            model.basisForTax = Math.abs(basisForTax - basisForFirstRateTax)
            model.calculateTaxBySecondTaxRate()

            model.taxAmount = firstRateTaxAmount + model.taxAmount - model.USHealth - model.freeAmount
          }
        }
      }
      if (this.taxType === this.$constants.TAX_TYPES.LINEAR) {
        model.calculateTaxByLinearTaxRate()

        model.taxAmount = this.tax
      }
      if (this.taxType === this.$constants.TAX_TYPES.LUMP_SUM) {
        model.taxAmount = this.tax
      }

      if (model.taxAmount < 0) {
        model.taxAmount = 0
      }

      model.taxAmount = Math.round(model.taxAmount)

      model.calculateNetAmount()

      return {
        rent: model.zus.rent,
        pension: model.zus.pension,
        sick: model.zus.sick,
        health: model.zus.health,
        accident: model.zus.accident,
        fp: model.zus.fp,
        taxAmount: model.taxAmount,
        expenses: model.expenses,
        net: model.net,
        gross: model.gross,
      }
    },
  },
}
</script>
