<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Przychód netto*"
          autofocus
          color="brand"
          required
        />
        <q-input
          v-model="expenses"
          type="number"
          min="0"
          step="0.01"
          label="Koszty netto*"
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
        <q-select
          v-if="taxType.value === $constants.TAX_TYPES.LUMP_SUM"
          v-model="taxRateForLumpSum"
          :options="$constants.TAX_RATES_FOR_LAMP_SUM"
          label="Stawka ryczałtu ewidencjonowanego"
          color="brand"
        />
        <q-toggle
          v-model="isFreeAmount"
          :disable="taxType.value !== $constants.TAX_TYPES.GENERAL"
          class="q-mt-sm"
          label="Kwota wolna od podatku"
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="column">
          <q-toggle
            v-model="isFullTimeJob"
            class="q-mt-sm"
            label="Praca na etacie"
          />
          <q-toggle
            v-model="isAid"
            :disable="isFullTimeJob"
            class="q-mt-sm"
            label="Ulga na start"
          />
          <q-toggle
            v-model="isSmallZus"
            :disable="isFullTimeJob || isAid"
            class="q-mt-sm"
            label="Mały ZUS"
          />
          <q-toggle
            v-model="isFp"
            :disable="isSmallZus || isFullTimeJob || isAid"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="isSick"
            :disable="isFullTimeJob"
            class="q-mt-sm"
            label="Składka chorobowa"
          />
        </div>
        <q-input
          v-model="accidentRate"
          :disable="isFullTimeJob"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Składka wypadkowa (%)*"
          color="brand"
          required
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
      taxRateForLumpSum: null,
      accidentRate: 0,
      isSmallZus: false,
      isAid: false,
      isFullTimeJob: false,
      isFreeAmount: true,
      isSick: false,
      isFp: true,
    }
  },
  created () {
    this.accidentRate = this.$constants.ACCIDENT_RATE
    this.taxType = {
      value: this.$constants.TAX_TYPES.GENERAL,
      label: 'Zasady ogólne',
    }
    this.taxRateForLumpSum = this.$constants.TAX_RATES_FOR_LAMP_SUM[this.$constants.TAX_RATES_FOR_LAMP_SUM.length - 2]

    this.$store.commit('selfEmployment/CLEAR_DATA')
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
    isFullTimeJob: function (val) {
      if (val) {
        this.isAid = false
        this.isSmallZus = false
        this.isFp = false
        this.isSick = false
      }
    },
    isAid: function (val) {
      if (val) {
        this.isFp = false
      }
    },
    isSmallZus: function (val) {
      if (val) {
        this.isFp = false
      }
    },
    taxType: function (val) {
      if (val.value !== this.$constants.TAX_TYPES.GENERAL) {
        this.isFreeAmount = false
      }
    },
  },
  methods: {
    calculate () {
      this.selfEmployment = new SelfEmployment()

      this.selfEmployment.gross = Number(this.amount)
      this.selfEmployment.expenses = Number(this.expenses)
      this.selfEmployment.zusAccidentRate = Number(this.accidentRate) / 100
      this.selfEmployment.taxType = this.taxType.value

      if (this.taxType.value === this.$constants.TAX_TYPES.LUMP_SUM) {
        this.selfEmployment.taxRateForLumpSum = Number(this.taxRateForLumpSum.value) / 100
      }

      if (this.isSmallZus) {
        this.selfEmployment.basisForZus = this.$constants.ZUS.OWNER.SMALL_AMOUNT
      } else {
        this.selfEmployment.basisForZus = this.$constants.ZUS.OWNER.BIG_AMOUNT
      }

      this.calculateAmount()

      if (this.selfEmployment.basisForTax > this.$constants.AMOUNT_OF_TAX_THRESHOLD && this.selfEmployment.taxType !== this.$constants.TAX_TYPES.LINEAR) {
        this.$q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${this.$constants.AMOUNT_OF_TAX_THRESHOLD} zł). Dla kwoty powyzej progu stawka podatku wynosi ${this.$constants.TAX_RATES.SECOND_RATE}%.`,
        })
      }

      this.$store.commit('selfEmployment/SET_NET', this.selfEmployment.net)
      this.$store.commit('selfEmployment/SET_TAX', this.selfEmployment.taxAmount)
      this.$store.commit('selfEmployment/SET_TAX_TYPE', this.selfEmployment.taxType)
      this.$store.commit('selfEmployment/SET_GROSS', this.selfEmployment.gross)
      this.$store.commit('selfEmployment/SET_BASIS_FOR_TAX', this.selfEmployment.basisForTax)
      this.$store.commit('selfEmployment/SET_EXPENSES', this.selfEmployment.expenses)
      this.$store.commit('selfEmployment/SET_ZUS', this.selfEmployment.zus)
      this.$store.commit('selfEmployment/SET_AID', this.isAid)
      this.$store.commit('selfEmployment/SET_SICK', this.isSick)
      this.$store.commit('selfEmployment/SET_ZUS_ACCIDENT_RATE', this.selfEmployment.zusAccidentRate)
      this.$store.commit('selfEmployment/SET_FREE_AMOUNT', this.selfEmployment.freeAmount)
    },
    calculateAmount () {
      if (!this.isFreeAmount) {
        this.selfEmployment.freeAmount = 0
      }

      if (!this.isFullTimeJob && !this.isAid) {
        this.selfEmployment.calculateZUSAccident()
        this.selfEmployment.calculateZUSPension()
        this.selfEmployment.calculateZUSRent()
      }

      if (this.isSick && !this.isAid) {
        this.selfEmployment.calculateZUSSick()
      }

      if (this.isFp) {
        this.selfEmployment.calculateZUSFP()
      }

      this.selfEmployment.calculateZUSHealth()
      this.selfEmployment.calculateUSHealth()

      this.selfEmployment.calculateBasisForTax()
      this.selfEmployment.calculateTaxAmount()

      this.selfEmployment.calculateNetAmount()
    },
  },
}
</script>
