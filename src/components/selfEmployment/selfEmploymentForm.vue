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
import SelfEmployment from 'src/logic/SelfEmployment'

export default {
  data () {
    return {
      selfEmployment: null,
      amount: null,
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
    this.accident = this.$constants.ACCIDENT_RATE

    this.$store.commit('selfEmployment/SET_NET', null)
    this.$store.commit('selfEmployment/SET_TAX', null)
    this.$store.commit('selfEmployment/SET_GROSS', null)
    this.$store.commit('selfEmployment/SET_BASIS_FOR_TAX', null)
    this.$store.commit('selfEmployment/SET_EXPENSES', null)
    this.$store.commit('selfEmployment/SET_ZUS', {
      accident: null,
      health: null,
      sick: null,
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

        this.calculateAmount()

      if (this.selfEmployment.basisForTax > this.$constants.AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${this.$constants.AMOUNT_OF_TAX_THRESHOLD} zł). Dla kwoty powyzej progu stawka podatku wynosi ${this.$constants.TAX_RATES.SECOND_RATE}%.`,
        })
      }

      this.$store.commit('selfEmployment/SET_NET', this.selfEmployment.net)
      this.$store.commit('selfEmployment/SET_TAX', this.selfEmployment.taxAmount)
      this.$store.commit('selfEmployment/SET_GROSS', this.selfEmployment.gross)
      this.$store.commit('selfEmployment/SET_BASIS_FOR_TAX', this.selfEmployment.basisForTax)
      this.$store.commit('selfEmployment/SET_EXPENSES', this.selfEmployment.expenses)
      this.$store.commit('selfEmployment/SET_ZUS', this.selfEmployment.zus)
    },
    calculateAmount () {
      this.selfEmployment.gross = Number(this.amount)

      this.selfEmployment.calculateZUSAccident()
      this.selfEmployment.calculateZUSPension()
      this.selfEmployment.calculateZUSRent()
      this.selfEmployment.calculateZUSSick()
      this.selfEmployment.calculateZUSHealth()
      this.selfEmployment.calculateUSHealth()
      this.selfEmployment.calculateBasisForTax()
      this.selfEmployment.calculateTaxAmount()

      if (this.fp) {
        this.selfEmployment.calculateZUSFGSP()
        this.selfEmployment.calculateZUSFP()
      }

      this.selfEmployment.calculateNetAmount()
    },
  },
}
</script>
