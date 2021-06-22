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
        <q-toggle
          v-model="isCustomBasisForZus"
          :disable="isSmallZus"
          class="q-mt-sm"
          label="Własna podstawa dla składek ZUS"
        />
        <q-input
          v-if="isCustomBasisForZus"
          v-model="customBasisForZus"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Podstawa dla składek ZUS"
          color="brand"
          required
        />
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
import PolskiLadSelfEmployment from 'src/logic/PolskiLadSelfEmployment'

export default {
  data () {
    return {
      polskiLadSelfEmployment: null,
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
      isCustomBasisForZus: false,
      customBasisForZus: null,
    }
  },
  emits: ['scroll'],
  created () {
    this.accidentRate = this.$constants.ACCIDENT_RATE
    this.customBasisForZus = this.$constants.ZUS.OWNER.BIG_AMOUNT
    this.taxType = {
      value: this.$constants.TAX_TYPES.GENERAL,
      label: 'Zasady ogólne',
    }
    this.taxRateForLumpSum = this.$constants.TAX_RATES_FOR_LAMP_SUM[this.$constants.TAX_RATES_FOR_LAMP_SUM.length - 2]

    this.$store.commit('polskiLadSelfEmployment/CLEAR_DATA')
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
        this.isCustomBasisForZus = false
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
      this.polskiLadSelfEmployment = new PolskiLadSelfEmployment()

      this.polskiLadSelfEmployment.gross = Number(this.amount)
      this.polskiLadSelfEmployment.expenses = Number(this.expenses)
      this.polskiLadSelfEmployment.basisForHealth = this.polskiLadSelfEmployment.gross - this.polskiLadSelfEmployment.expenses
      this.polskiLadSelfEmployment.zusAccidentRate = Number(this.accidentRate) / 100
      this.polskiLadSelfEmployment.taxType = this.taxType.value

      if (this.taxType.value === this.$constants.TAX_TYPES.LUMP_SUM) {
        this.polskiLadSelfEmployment.taxRateForLumpSum = Number(this.taxRateForLumpSum.value) / 100
      }

      if (this.isSmallZus) {
        this.polskiLadSelfEmployment.basisForZus = this.$constants.ZUS.OWNER.SMALL_AMOUNT
      } else {
        this.polskiLadSelfEmployment.basisForZus = this.$constants.ZUS.OWNER.BIG_AMOUNT
      }

      if (this.isCustomBasisForZus) {
        this.polskiLadSelfEmployment.basisForZus = Number(this.customBasisForZus)
      }

      this.calculateAmount()

      if (this.polskiLadSelfEmployment.basisForTax > this.$constants.AMOUNT_OF_POLSKI_LAD_TAX_THRESHOLD && this.polskiLadSelfEmployment.taxType !== this.$constants.TAX_TYPES.LINEAR) {
        this.$q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${this.$constants.AMOUNT_OF_POLSKI_LAD_TAX_THRESHOLD} zł). Dla kwoty powyzej progu stawka podatku wynosi ${this.$constants.TAX_RATES.SECOND_RATE}%.`,
        })
      }

      this.$store.commit('polskiLadSelfEmployment/SET_NET', this.polskiLadSelfEmployment.net)
      this.$store.commit('polskiLadSelfEmployment/SET_TAX', this.polskiLadSelfEmployment.taxAmount)
      this.$store.commit('polskiLadSelfEmployment/SET_TAX_TYPE', this.polskiLadSelfEmployment.taxType)
      this.$store.commit('polskiLadSelfEmployment/SET_GROSS', this.polskiLadSelfEmployment.gross)
      this.$store.commit('polskiLadSelfEmployment/SET_BASIS_FOR_TAX', this.polskiLadSelfEmployment.basisForTax)
      this.$store.commit('polskiLadSelfEmployment/SET_EXPENSES', this.polskiLadSelfEmployment.expenses)
      this.$store.commit('polskiLadSelfEmployment/SET_ZUS', this.polskiLadSelfEmployment.zus)
      this.$store.commit('polskiLadSelfEmployment/SET_AID', this.isAid)
      this.$store.commit('polskiLadSelfEmployment/SET_SICK', this.isSick)
      this.$store.commit('polskiLadSelfEmployment/SET_ZUS_ACCIDENT_RATE', this.polskiLadSelfEmployment.zusAccidentRate)
      this.$store.commit('polskiLadSelfEmployment/SET_FREE_AMOUNT', this.polskiLadSelfEmployment.freeAmount)

      this.$emit('scroll')
    },
    calculateAmount () {
      if (!this.isFreeAmount) {
        this.polskiLadSelfEmployment.freeAmount = 0
      }

      if (!this.isFullTimeJob && !this.isAid) {
        this.polskiLadSelfEmployment.calculateZUSAccident()
        this.polskiLadSelfEmployment.calculateZUSPension()
        this.polskiLadSelfEmployment.calculateZUSRent()
      }

      if (this.isSick && !this.isAid) {
        this.polskiLadSelfEmployment.calculateZUSSick()
      }

      if (this.isFp) {
        this.polskiLadSelfEmployment.calculateZUSFP()
      }

      this.polskiLadSelfEmployment.calculateZUSHealth()
      this.polskiLadSelfEmployment.calculateUSHealth()

      this.polskiLadSelfEmployment.calculateBasisForTax()
      this.polskiLadSelfEmployment.calculateTaxAmount()

      this.polskiLadSelfEmployment.calculateNetAmount()
    },
  },
}
</script>
