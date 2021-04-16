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
import ContractOfEmployment from 'src/logic/ContractOfEmployment'

export default {
  data () {
    return {
      contractOfEmployment: null,
      amount: null,
      amountType: null,
      workInLivePlace: false,
      young: false,
      fp: true,
      accident: 0,
    }
  },
  created () {
    this.amountType = this.$constants.AMOUNT_TYPES.NET
    this.accident = this.$constants.ACCIDENT_RATE

    this.$store.commit('contractOfEmployment/SET_NET', null)
    this.$store.commit('contractOfEmployment/SET_TAX', null)
    this.$store.commit('contractOfEmployment/SET_GROSS', null)
    this.$store.commit('contractOfEmployment/SET_BASIS_FOR_TAX', null)
    this.$store.commit('contractOfEmployment/SET_EXPENSES', null)
    this.$store.commit('contractOfEmployment/SET_EMPLOYEE_ZUS', {
      health: null,
      sick: null,
      rent: null,
      pension: null,
    })
    this.$store.commit('contractOfEmployment/SET_EMPLOYER_ZUS', {
      accident: null,
      rent: null,
      pension: null,
      fp: null,
      fgsp: null,
    })
  },
  methods: {
    calculate () {
      this.contractOfEmployment = new ContractOfEmployment()

      if (this.workInLivePlace) {
        this.contractOfEmployment.expenses = this.$constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE
      } else {
        this.contractOfEmployment.expenses = this.$constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE
      }

      this.contractOfEmployment.zusAccidentEmployerRate = Number(this.accident) / 100

      if (this.amountType === this.$constants.AMOUNT_TYPES.NET) {
        const min = Number(this.amount)
        this.calculateForNetAmount(min, 2 * min, 100)
      }
      if (this.amountType === this.$constants.AMOUNT_TYPES.GROSS) {
        this.calculateForGrossAmount()
      }

      if (this.contractOfEmployment.basisForTax > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${this.$constants.AMOUNT_OF_TAX_THRESHOLD} zł). Dla kwoty powyzej progu stawka podatku wynosi ${this.$constants.TAX_RATES.SECOND_RATE}%.`,
        })
      }

      this.$store.commit('contractOfEmployment/SET_NET', this.contractOfEmployment.net)
      this.$store.commit('contractOfEmployment/SET_TAX', this.contractOfEmployment.taxAmount)
      this.$store.commit('contractOfEmployment/SET_GROSS', this.contractOfEmployment.gross)
      this.$store.commit('contractOfEmployment/SET_BASIS_FOR_TAX', this.contractOfEmployment.basisForTax)
      this.$store.commit('contractOfEmployment/SET_EXPENSES', this.contractOfEmployment.expenses)
      this.$store.commit('contractOfEmployment/SET_EMPLOYEE_ZUS', this.contractOfEmployment.employeeZus)
      this.$store.commit('contractOfEmployment/SET_EMPLOYER_ZUS', this.contractOfEmployment.employerZus)
    },

    calculateForNetAmount (min, max, scale) {
      const net = Number(this.amount)

      for (let iterator = max; iterator >= min; iterator -= scale) {
        this.contractOfEmployment.gross = iterator

        this.contractOfEmployment.calculateZUSEmployerAccident()

        this.contractOfEmployment.calculateZUSEmployeePension()
        this.contractOfEmployment.calculateZUSEmployerPension()

        this.contractOfEmployment.calculateZUSEmployeeRent()
        this.contractOfEmployment.calculateZUSEmployerRent()

        this.contractOfEmployment.calculateZUSEmployeeSick()

        this.contractOfEmployment.calculateZUSEmployeeHealth()
        this.contractOfEmployment.calculateUSEmployeeHealth()

        this.contractOfEmployment.calculateBasisForTax()
        this.contractOfEmployment.calculateTaxAmount()

        if (this.young) {
          this.contractOfEmployment.taxAmount = 0
          this.contractOfEmployment.basisForTax = 0
          this.contractOfEmployment.expenses = 0
        }

        this.contractOfEmployment.calculateNetAmount()

        if (this.fp) {
          this.contractOfEmployment.calculateZUSEmployerFGSP()
          this.contractOfEmployment.calculateZUSEmployerFP()
        }

        if (Math.abs(this.contractOfEmployment.net - net) <= 0.0005) {
          return
        }
        if (Math.abs(this.contractOfEmployment.net - net) <= scale) {
          return this.calculateForNetAmount(this.contractOfEmployment.net - scale, this.contractOfEmployment.gross + scale, scale / 10)
        }
      }
      return null
    },
    calculateForGrossAmount () {
      this.contractOfEmployment.gross = Number(this.amount)

      this.contractOfEmployment.calculateZUSEmployerAccident()

      this.contractOfEmployment.calculateZUSEmployeePension()
      this.contractOfEmployment.calculateZUSEmployerPension()

      this.contractOfEmployment.calculateZUSEmployeeRent()
      this.contractOfEmployment.calculateZUSEmployerRent()

      this.contractOfEmployment.calculateZUSEmployeeSick()

      this.contractOfEmployment.calculateZUSEmployeeHealth()
      this.contractOfEmployment.calculateUSEmployeeHealth()

      this.contractOfEmployment.calculateBasisForTax()
      this.contractOfEmployment.calculateTaxAmount()

      if (this.young) {
        this.contractOfEmployment.taxAmount = 0
        this.contractOfEmployment.basisForTax = 0
        this.contractOfEmployment.expenses = 0
      }

      this.contractOfEmployment.calculateNetAmount()

      if (this.fp) {
        this.contractOfEmployment.calculateZUSEmployerFGSP()
        this.contractOfEmployment.calculateZUSEmployerFP()
      }
    },
  },
}
</script>
