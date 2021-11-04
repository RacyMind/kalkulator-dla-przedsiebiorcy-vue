<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          label="Przychód netto*"
          autofocus
          color="brand"
          suffix="zł"
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
        />
        <q-input
          v-model.number="expenses"
          type="number"
          min="0"
          step="0.01"
          label="Koszty netto*"
          color="brand"
          suffix="zł"
        />
        <q-select
          v-model="taxType"
          :options="taxTypes"
          :disable="isMarriage"
          label="Forma opodatkowania*"
          color="brand"
          required
        />
        <q-select
          v-if="taxType.value === constants.TAX_TYPES.LUMP_SUM"
          v-model="taxRateForLumpSum"
          :options="constants.PARAMS[this.year].TAX_RATES_FOR_LAMP_SUM"
          label="Stawka ryczałtu ewidencjonowanego"
          color="brand"
        />
        <q-toggle
          v-model="isFreeAmount"
          :disable="taxType.value !== constants.TAX_TYPES.GENERAL || isMarriage"
          class="q-mt-sm"
          label="Kwota wolna od podatku"
        />
        <template v-if="year >= 2022">
          <q-toggle
            v-if="!isMarriage"
            v-model="isAidForSenior"
            class="q-mt-sm"
            label="Zerowy PIT dla seniora"
          />
          <q-toggle
            v-if="!isMarriage"
            v-model="isAidForBigFamily"
            class="q-mt-sm"
            label="Zerowy PIT dla rodzin 4+"
          />
          <q-toggle
            v-model="isAidForMiddleClass"
            :disable="taxType.value !== constants.TAX_TYPES.GENERAL"
            class="q-mt-sm"
            label="Ulga dla klasy średniej"
          />
        </template>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="column">
          <q-toggle
            v-model="isFullTimeJob"
            class="q-mt-sm"
            label="Praca na etacie"
          />
          <q-toggle
            v-model="isAidForStart"
            :disable="isFullTimeJob"
            class="q-mt-sm"
            label="Ulga na start"
          />
          <q-toggle
            v-model="isSmallZus"
            :disable="isFullTimeJob || isAidForStart"
            class="q-mt-sm"
            label="Mały ZUS"
          />
          <q-toggle
            v-model="isFpContribution"
            :disable="isSmallZus || isFullTimeJob || isAidForStart"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="isSickContribution"
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
          v-model.number="customBasisForZus"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Podstawa dla składek ZUS"
          color="brand"
          suffix="zł"
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
        />
        <q-input
          v-model.number="accidentContributionRate"
          :disable="isFullTimeJob"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Składka wypadkowa*"
          color="brand"
          suffix="%"
          :rules="[
            val => !!val || '* Wpisz wartość',
          ]"
          lazy-rules
        />
      </div>
    </div>
    <div
      v-if="!isMarriage"
      class="row q-mt-lg">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="brand"
          size="lg"
          label="Zapisz"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import constants from 'src/logic/constants'

export default {
  props: {
    year: Number,
    isMarriage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['submitted'],
  setup () {
    return { constants }
  },
  data () {
    return {
      amount: null,
      expenses: 0,
      taxType: null,
      taxRateForLumpSum: null,
      accidentContributionRate: 0,
      isSmallZus: false,
      isAidForStart: false,
      isFullTimeJob: false,
      isFreeAmount: true,
      isSickContribution: false,
      isFpContribution: true,
      isCustomBasisForZus: false,
      customBasisForZus: null,
      isAidForBigFamily: false,
      isAidForSenior: false,
      isAidForMiddleClass: true,
    }
  },
  created () {
    this.accidentContributionRate = constants.PARAMS[this.year].ACCIDENT_RATE
    this.customBasisForZus = this.constants.PARAMS[this.year].ZUS.OWNER.BIG_AMOUNT
    this.taxType = {
      value: this.constants.TAX_TYPES.GENERAL,
      label: 'Zasady ogólne',
    }
    this.taxRateForLumpSum = this.constants.PARAMS[this.year].TAX_RATES_FOR_LAMP_SUM[this.constants.PARAMS[this.year].TAX_RATES_FOR_LAMP_SUM.length - 2]
  },
  computed: {
    isDisabledButton () {
      if (!this.amount) {
        return true
      }
      if (this.accidentContributionRate.length === 0) {
        return true
      }
      if (this.expenses.length === 0) {
        return true
      }
      if (this.isCustomBasisForZus && this.customBasisForZus.length === 0) {
        return true
      }
      return false
    },
    taxTypes () {
      return [
        {
          value: this.constants.TAX_TYPES.GENERAL,
          label: 'Zasady ogólne',
        },
        {
          label: 'Podatek liniowy',
          value: this.constants.TAX_TYPES.LINEAR,
        },
        {
          label: 'Ryczałt ewidencjonowany',
          value: this.constants.TAX_TYPES.LUMP_SUM,
        },
      ]
    },
  },
  watch: {
    isFullTimeJob: function (val) {
      if (val) {
        this.isAidForStart = false
        this.isSmallZus = false
        this.isFpContribution = false
        this.isSickContribution = false
      }
    },
    isAidForStart: function (val) {
      if (val) {
        this.isFpContribution = false
      }
    },
    isSmallZus: function (val) {
      if (val) {
        this.isFpContribution = false
        this.isCustomBasisForZus = false
      }
    },
    taxType: function (val) {
      if (val.value !== this.constants.TAX_TYPES.GENERAL) {
        this.isFreeAmount = false
        this.isAidForMiddleClass = false
      } else {
        this.isAidForMiddleClass = true
        this.isFreeAmount = true
      }
    },
  },
  methods: {
    save () {
      let customBasisForZus = this.customBasisForZus

      if (!this.isCustomBasisForZus) {
        customBasisForZus = 0
      }

      if (this.isMarriage) {
        const inputData = {
          grossAmount: this.amount,
          accidentContributionRate: Number(this.accidentContributionRate) / 100,
          taxType: this.taxType.value,
          taxRateForLumpSum: this.taxRateForLumpSum.value / 100,
          expenses: this.expenses,
          isSickContribution: this.isSickContribution,
          isFreeAmount: this.isFreeAmount,
          isSmallZus: this.isSmallZus,
          isFpContribution: this.isFpContribution,
          isAidForStart: this.isAidForStart,
          isFullTimeJob: this.isFullTimeJob,
          customBasisForZus: customBasisForZus,
          isAidForBigFamily: this.isAidForBigFamily,
          isAidForSenior: this.isAidForSenior,
          isAidForMiddleClass: this.isAidForMiddleClass,
        }

        this.$emit('submitted', inputData)
        return
      }

      this.$store.commit('selfEmployment/resetData')

      this.$store.commit('selfEmployment/setGrossAmount', this.amount)
      this.$store.commit('selfEmployment/setTaxType', this.taxType.value)
      this.$store.commit('selfEmployment/setTaxRateForLumpSum', this.taxRateForLumpSum.value / 100)
      this.$store.commit('selfEmployment/setAccidentContributionRate', this.accidentContributionRate / 100)
      this.$store.commit('selfEmployment/setExpenses', this.expenses)
      this.$store.commit('selfEmployment/setIsFreeAmount', this.isFreeAmount)
      this.$store.commit('selfEmployment/setIsSickContribution', this.isSickContribution)
      this.$store.commit('selfEmployment/setIsFpContribution', this.isFpContribution)
      this.$store.commit('selfEmployment/setIsSmallZus', this.isSmallZus)
      this.$store.commit('selfEmployment/setIsAidForStart', this.isAidForStart)
      this.$store.commit('selfEmployment/setIsFullTimeJob', this.isFullTimeJob)
      this.$store.commit('selfEmployment/setCustomBasisForZus', customBasisForZus)

      if (this.year >= 2022) {
        this.$store.commit('selfEmployment/setIsAidForBigFamily', this.isAidForBigFamily)
        this.$store.commit('selfEmployment/setIsAidForSenior', this.isAidForSenior)
        this.$store.commit('selfEmployment/setIsAidForMiddleClass', this.isAidForMiddleClass)
      }

      this.$emit('submitted')
    },
  },
}
</script>
