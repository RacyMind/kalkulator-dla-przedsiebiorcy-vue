<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          label="Wynagrodzenie*"
          suffix="zł"
          autofocus
          color="brand"
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
        />
        <div class="q-mt-sm block">
          <div class="row">
            <q-radio
              v-model="amountType"
              :val="constants.AMOUNT_TYPES.NET"
              label="netto"
            />
            <q-radio
              v-model="amountType"
              :val="constants.AMOUNT_TYPES.GROSS"
              label="brutto"
            />
          </div>
          <q-toggle
            v-model="isYoung"
            class="q-mt-sm"
            label="Zerowy PIT dla młodych"
          />
          <q-toggle
            v-model="workInLivePlace"
            class="q-mt-sm"
            label=" Praca w miejscu zamieszkania"
          />
          <q-toggle
            v-model="isFreeAmount"
            class="q-mt-sm"
            label="Kwota wolna od podatku"
          />
          <q-toggle
            v-model="isAuthorExpenses"
            class="q-mt-sm col-6"
            label="Autorskie koszty uzyskania przychodu (50%)"
          />
          <q-input
            v-if="isAuthorExpenses"
            v-model.number="partOfWorkWithAuthorExpenses"
            type="number"
            min="0"
            max="100"
            step="1"
            label="Część pracy (%)*"
            color="brand"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="column">
          <q-input
            v-model.number="accidentContributionRate"
            type="number"
            class="full-width"
            min="0"
            step="0.01"
            label="Składka wypadkowa (%)*"
            color="brand"
            suffix="%"
            :rules="[
              val => !!val || '* Wpisz wartość',
            ]"
            lazy-rules
          />
          <q-toggle
            v-model="isFpContribution"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="isPpkContribution"
            class="q-mt-sm"
            label="PPK"
          />
          <div
            v-if="isPpkContribution"
            class="row">
            <div class="col-6">
              <q-input
                v-model.number="employerPpkRate"
                type="number"
                class="full-width"
                :min="constants.PARAMS[year].PPK.EMPLOYER.MINIMUM_RATE"
                :max="constants.PARAMS[year].PPK.EMPLOYER.MAXIMUM_RATE"
                step="0.01"
                label="Pracodawca (%)"
                color="brand"
                suffix="%"
                :rules="[
                  val => !!val || '* Wpisz wartość',
                ]"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pl-md-sm">
              <q-input
                v-model.number="employeePpkRate"
                type="number"
                class="full-width"
                :min="constants.PARAMS[year].PPK.EMPLOYER.MINIMUM_RATE"
                :max="constants.PARAMS[year].PPK.EMPLOYER.MAXIMUM_RATE"
                step="0.01"
                label="Pracownik (%)"
                color="brand"
                suffix="%"
                :rules="[
                  val => !!val || '* Wpisz wartość',
                ]"
                lazy-rules
              />
            </div>
          </div>
        </div>
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
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import constants from 'src/logic/constants'
import ContractOfEmployment from 'src/logic/ContractOfEmployment'

export default {
  props: {
    year: Number,
  },
  emits: ['submitted'],
  setup () {
    return { constants }
  },
  data () {
    return {
      amount: null,
      amountType: null,
      workInLivePlace: true,
      isYoung: false,
      isFpContribution: true,
      accidentContributionRate: 0,
      isPpkContribution: false,
      employeePpkRate: 0,
      employerPpkRate: 0,
      isAuthorExpenses: false,
      partOfWorkWithAuthorExpenses: 100,
      isFreeAmount: true,
    }
  },
  created () {
    this.amountType = this.constants.AMOUNT_TYPES.GROSS
    this.accidentContributionRate = constants.PARAMS[this.year].ACCIDENT_RATE
    this.employerPpkRate = constants.PARAMS[this.year].PPK.EMPLOYER.DEFAULT_RATE
    this.employeePpkRate = constants.PARAMS[this.year].PPK.EMPLOYEE.DEFAULT_RATE
  },
  computed: {
    isDisabledButton () {
      if (!this.amount) {
        return true
      }
      if (this.accidentContributionRate.length === 0) {
        return true
      }
      if (this.isAuthorExpenses && this.partOfWorkWithAuthorExpenses.length === 0) {
        return true
      }
      if (this.isPpkContribution && (this.employeePpkRate.length === 0 || this.employerPpkRate.length === 0)) {
        return true
      }
      return false
    },
  },
  methods: {
    calculate () {
      let expenses
      this.contractOfEmployment = new ContractOfEmployment()

      if (!this.isFreeAmount) {
        this.contractOfEmployment.freeAmount = 0
      }

      if (this.isAuthorExpenses) {
        this.contractOfEmployment.authorExpensePart = Number(this.partOfWorkWithAuthorExpenses) / 100
      }

      if (this.workInLivePlace) {
        expenses = this.constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE
      } else {
        expenses = this.constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE
      }

      this.contractOfEmployment.expenses = expenses

      this.contractOfEmployment.zusAccidentEmployerRate = Number(this.accidentContributionRate) / 100

      if (this.isPpkContribution) {
        this.contractOfEmployment.employeePpkRate = Number(this.employeePpkRate) / 100
        this.contractOfEmployment.employerPpkRate = Number(this.employerPpkRate) / 100
      }

      if (this.amountType === this.constants.AMOUNT_TYPES.NET) {
        const min = Number(this.amount)

        this.calculateForNetAmount(min, 2 * min, 100)
      }
      if (this.amountType === this.constants.AMOUNT_TYPES.GROSS) {
        this.calculateForGrossAmount()
      }

      if (this.contractOfEmployment.basisForTax > this.constants.AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${this.constants.AMOUNT_OF_TAX_THRESHOLD} zł). Dla kwoty powyzej progu stawka podatku wynosi ${this.constants.TAX_RATES.SECOND_RATE}%.`,
        })
      }

      this.$store.commit('contractOfEmployment/setGrossAmount', grossAmount)
      this.$store.commit('contractOfEmployment/setAccidentContributionRate', Number(this.accidentContributionRate) / 100)
      this.$store.commit('contractOfEmployment/setEmployeePPkContributionRate', employeePPkContributionRate)
      this.$store.commit('contractOfEmployment/setEmployerPpkContributionRate', employerPpkContributionRate)
      this.$store.commit('contractOfEmployment/setPartOfWorkWithAuthorExpenses', partOfWorkWithAuthorExpenses)
      this.$store.commit('contractOfEmployment/setIsYoung', this.isYoung)
      this.$store.commit('contractOfEmployment/setWorkInLivePlace', this.workInLivePlace)
      this.$store.commit('contractOfEmployment/setIsFreeAmount', this.isFreeAmount)
      this.$store.commit('contractOfEmployment/setIsFpContribution', this.isFpContribution)

      this.$emit('submitted')
    },

    calculateForNetAmount (min, max, scale) {
      const net = Number(this.amount)

      for (let iterator = max; iterator >= min; iterator -= scale) {
        this.contractOfEmployment.gross = iterator

        this.contractOfEmployment.calculateAll(this.isYoung, this.isFpContribution, this.isPpkContribution)

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

      this.contractOfEmployment.calculateAll(this.isYoung, this.isFpContribution, this.isPpkContribution)
    },
  },
}
</script>
