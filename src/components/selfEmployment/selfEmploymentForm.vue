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
        <q-input
          v-model="expenses"
          type="number"
          min="0"
          step="0.01"
          label="Koszty przychodu do podatku dochodowego*"
          color="brand"
          required
        />
        <q-select
          v-model="taxType"
          :options="taxTypes"
          label="Forma opodatkowania*"
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
          v-model="fullTimeJob"
          class="q-mt-sm"
          label=" Praca na etacie"
        />
        <q-toggle
          v-model="aid"
          :disable="fullTimeJob"
          class="q-mt-sm"
          label="Ulga przy składkach ZUS"
        />
        <q-toggle
          v-model="fp"
          :disable="aid || fullTimeJob"
          class="q-mt-sm"
          label="Składka na Fundusz Pracy"
        />
        <q-toggle
          v-model="sick"
          :disable="fullTimeJob"
          class="q-mt-sm"
          label="Składka chorobowa"
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
      expenses: 0,
      taxType: null,
      sick: false,
      fp: true,
      accident: 0,
      aid: false,
      fullTimeJob: false,
    }
  },
  created () {
    this.accident = this.$constants.ACCIDENT_RATE
    this.taxType = {
      value: this.$constants.TAX_TYPES.GENERAL,
      label: 'Zasady ogólne',
    }

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
  computed: {
    taxTypes () {
      return [
        {
          value: this.$constants.TAX_TYPES.GENERAL,
          label: 'Zasady ogólne',
        },
        {
          label: 'Podatek liniowy',
          value: this.$constants.TAX_TYPES.LINEAR,
        },
        {
          label: 'Ryczałt ewidencjonowany',
          value: this.$constants.TAX_TYPES.LUMP_SUM,
        },
      ]
    },
  },
  watch: {
    fullTimeJob: function (val) {
      if (val) {
        this.aid = false
        this.fp = false
        this.sick = false
      }
    },
    aid: function (val) {
      if (val) {
        this.fp = false
      }
    },
  },
  methods: {
    calculate () {
      this.selfEmployment = new SelfEmployment()

      this.selfEmployment.gross = Number(this.amount)
      this.selfEmployment.expenses = Number(this.expenses)
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
      if (!this.fullTimeJob) {
        this.selfEmployment.calculateZUSAccident()
        this.selfEmployment.calculateZUSPension()
        this.selfEmployment.calculateZUSRent()

        this.selfEmployment.calculateZUSHealth()
        this.selfEmployment.calculateUSHealth()
      }

      if (this.sick) {
        this.selfEmployment.calculateZUSSick()
      }

      if (this.fp) {
        this.selfEmployment.calculateZUSFGSP()
        this.selfEmployment.calculateZUSFP()
      }

      this.selfEmployment.calculateBasisForTax()
      this.selfEmployment.calculateTaxAmount()

      this.selfEmployment.calculateNetAmount()
    },
  },
}
</script>
