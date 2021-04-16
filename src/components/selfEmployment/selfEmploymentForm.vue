<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Wynagrodzenie*"
          autofocus
          color="brand"
          required
        />
        <div class="q-mt-sm block">
          <div class="row">
            <q-radio
              v-model="amountType"
              :val="$constants.AMOUNT_TYPES.NET"
              label="netto"
            />
            <q-radio
              v-model="amountType"
              :val="$constants.AMOUNT_TYPES.GROSS"
              label="brutto"
            />
          </div>
          <q-toggle
            v-model="young"
            class="q-mt-sm"
            label="Zerowy PIT dla młodych"
          />
          <q-toggle
            v-model="workInLivePlace"
            class="q-mt-sm"
            label=" Praca w miejscu zamieszkania"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="accident"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Składka wypadkowa (w %)*"
          color="brand"
          required
        />
        <q-toggle
          v-model="fp"
          class="q-mt-sm"
          label="Składka na Fundusz Pracy"
        />
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        {{ accident.length }}
        <q-btn
          type="submit"
          class="full-width"
          color="brand"
          size="lg"
          label="Oblicz"
          :disable="!amount"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import SelfEmployment from 'src/logic/SelfEmployment'

export default {
  data () {
    return {
      selfEmployment: null,
      amount: null,
      amountType: null,
      workInLivePlace: false,
      student: false,
      health: true,
      sick: true,
      rent: true,
      pension: true,
      young: false,
      fp: true,
      accident: 0,
    }
  },
  created () {
    this.amountType = this.$constants.AMOUNT_TYPES.NET
    this.accident = this.$constants.ACCIDENT_RATE

    this.$store.commit('selfEmployment/SET_NET', null)
    this.$store.commit('selfEmployment/SET_TAX', null)
    this.$store.commit('selfEmployment/SET_GROSS', null)
    this.$store.commit('selfEmployment/SET_BASIS_FOR_TAX', null)
    this.$store.commit('selfEmployment/SET_EXPENSES', null)
    this.$store.commit('selfEmployment/SET_EMPLOYEE_ZUS', {
      health: null,
      sick: null,
      rent: null,
      pension: null,
    })
    this.$store.commit('selfEmployment/SET_EMPLOYER_ZUS', {
      accident: null,
      rent: null,
      pension: null,
      fp: null,
      fgsp: null,
    })
  },
  methods: {
    calculate () {
      this.selfEmployment = new SelfEmployment()

      if (this.workInLivePlace) {
        this.selfEmployment.expenses = this.$constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE
      } else {
        this.selfEmployment.expenses = this.$constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE
      }

      this.selfEmployment.zusAccidentEmployerRate = Number(this.accident) / 100

      if (this.amountType === this.$constants.AMOUNT_TYPES.NET) {
        const min = Number(this.amount)
        this.calculateForNetAmount(min, 2 * min, 100)
      }
      if (this.amountType === this.$constants.AMOUNT_TYPES.GROSS) {
        this.calculateForGrossAmount()
      }

      if (this.selfEmployment.gross <= this.$constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
        this.$q.notify({
          message: 'Dla wynagrodzenia brutto do 200 zł płaci się podatek zryczałtowany.',
        })
      }

      this.$store.commit('selfEmployment/SET_NET', this.selfEmployment.net)
      this.$store.commit('selfEmployment/SET_TAX', this.selfEmployment.taxAmount)
      this.$store.commit('selfEmployment/SET_GROSS', this.selfEmployment.gross)
      this.$store.commit('selfEmployment/SET_BASIS_FOR_TAX', this.selfEmployment.basisForTax)
      this.$store.commit('selfEmployment/SET_EXPENSES', this.selfEmployment.expenses)
      this.$store.commit('selfEmployment/SET_EMPLOYEE_ZUS', this.selfEmployment.employeeZus)
      this.$store.commit('selfEmployment/SET_EMPLOYER_ZUS', this.selfEmployment.employerZus)
    },

    calculateForNetAmount (min, max, scale) {
      const net = Number(this.amount)

      for (let iterator = max; iterator >= min; iterator -= scale) {
        this.selfEmployment.gross = iterator

        this.selfEmployment.calculateZUSEmployerAccident()

        this.selfEmployment.calculateZUSEmployeePension()
        this.selfEmployment.calculateZUSEmployerPension()

        this.selfEmployment.calculateZUSEmployeeRent()
        this.selfEmployment.calculateZUSEmployerRent()

        this.selfEmployment.calculateZUSEmployeeSick()

        this.selfEmployment.calculateZUSEmployeeHealth()
        this.selfEmployment.calculateUSEmployeeHealth()

        this.selfEmployment.calculateBasisForTax()
        this.selfEmployment.calculateTaxAmount()

        if (this.young) {
          this.selfEmployment.taxAmount = 0
          this.selfEmployment.basisForTax = 0
          this.selfEmployment.expenses = 0
        }

        this.selfEmployment.calculateNetAmount()

        if (this.fp) {
          this.selfEmployment.calculateZUSEmployerFGSP()
          this.selfEmployment.calculateZUSEmployerFP()
        }

        if (Math.abs(this.selfEmployment.net - net) <= 0.0005) {
          return
        }
        if (Math.abs(this.selfEmployment.net - net) <= scale) {
          return this.calculateForNetAmount(this.selfEmployment.net - scale, this.selfEmployment.gross + scale, scale / 10)
        }
      }
      return null
    },
    calculateForGrossAmount () {
      this.selfEmployment.gross = Number(this.amount)

      this.selfEmployment.calculateZUSEmployerAccident()

      this.selfEmployment.calculateZUSEmployeePension()
      this.selfEmployment.calculateZUSEmployerPension()

      this.selfEmployment.calculateZUSEmployeeRent()
      this.selfEmployment.calculateZUSEmployerRent()

      this.selfEmployment.calculateZUSEmployeeSick()

      this.selfEmployment.calculateZUSEmployeeHealth()
      this.selfEmployment.calculateUSEmployeeHealth()

      this.selfEmployment.calculateBasisForTax()
      this.selfEmployment.calculateTaxAmount()

      if (this.young) {
        this.selfEmployment.taxAmount = 0
        this.selfEmployment.basisForTax = 0
        this.selfEmployment.expenses = 0
      }

      this.selfEmployment.calculateNetAmount()

      if (this.fp) {
        this.selfEmployment.calculateZUSEmployerFGSP()
        this.selfEmployment.calculateZUSEmployerFP()
      }
    },
  },
}
</script>
