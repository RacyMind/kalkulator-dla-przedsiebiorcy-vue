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
            v-model="authorExpenses"
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
            v-model="accident"
            type="number"
            class="full-width"
            min="0"
            step="0.01"
            label="Składka wypadkowa (%)*"
            color="brand"
            required
          />
          <q-toggle
            v-model="fp"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="ppk"
            class="q-mt-sm"
            label="PPK"
          />
          <div
            v-if="ppk"
            class="row">
            <div class="col-6">
              <q-input
                v-model="employerPpkRate"
                type="number"
                class="full-width"
                :min="$constants.PPK.EMPLOYER.MINIMUM_RATE"
                :max="$constants.PPK.EMPLOYER.MAXIMUM_RATE"
                step="0.01"
                label="Pracodawca (%)"
                color="brand"
              />
            </div>
            <div class="col-6 q-pl-md-sm">
              <q-input
                v-model="employeePpkRate"
                type="number"
                class="full-width"
                :min="$constants.PPK.EMPLOYER.MINIMUM_RATE"
                :max="$constants.PPK.EMPLOYER.MAXIMUM_RATE"
                step="0.01"
                label="Pracownik (%)"
                color="brand"
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
import ContractOfEmployment from 'src/logic/ContractOfEmployment'

export default {
  data () {
    return {
      contractOfEmployment: null,
      amount: null,
      amountType: null,
      workInLivePlace: true,
      young: false,
      fp: true,
      accident: 0,
      ppk: false,
      employeePpkRate: 0,
      employerPpkRate: 0,
      isAuthorExpenses: false,
      authorExpenses: 100,
      isFreeAmount: true,
    }
  },
  emits: ['scroll'],
  created () {
    this.amountType = this.$constants.AMOUNT_TYPES.GROSS
    this.accident = this.$constants.ACCIDENT_RATE
    this.employerPpkRate = this.$constants.PPK.EMPLOYER.DEFAULT_RATE
    this.employeePpkRate = this.$constants.PPK.EMPLOYEE.DEFAULT_RATE

    this.$store.commit('contractOfEmployment/CLEAR_DATA')
  },
  computed: {
    isDisabledButton () {
      if (!this.amount) {
        return true
      }
      if (this.accident.length === 0) {
        return true
      }
      if (this.isAuthorExpenses && this.authorExpenses.length === 0) {
        return true
      }
      if (this.ppk && (this.employeePpkRate.length === 0 || this.employerPpkRate.length === 0)) {
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
        this.contractOfEmployment.authorExpensePart = Number(this.authorExpenses) / 100
      }

      if (this.workInLivePlace) {
        expenses = this.$constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE
      } else {
        expenses = this.$constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE
      }

      this.contractOfEmployment.expenses = expenses

      this.contractOfEmployment.zusAccidentEmployerRate = Number(this.accident) / 100

      if (this.ppk) {
        this.contractOfEmployment.employeePpkRate = Number(this.employeePpkRate) / 100
        this.contractOfEmployment.employerPpkRate = Number(this.employerPpkRate) / 100
      }

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
      this.$store.commit('contractOfEmployment/SET_EXPENSES', expenses)
      this.$store.commit('contractOfEmployment/SET_AUTHOR_EXPENSES_PART', this.contractOfEmployment.authorExpensePart)
      this.$store.commit('contractOfEmployment/SET_EMPLOYEE_ZUS', this.contractOfEmployment.employeeZus)
      this.$store.commit('contractOfEmployment/SET_EMPLOYER_ZUS', this.contractOfEmployment.employerZus)
      this.$store.commit('contractOfEmployment/SET_EMPLOYEE_PPK', this.contractOfEmployment.employeePpk)
      this.$store.commit('contractOfEmployment/SET_EMPLOYER_PPK', this.contractOfEmployment.employerPpk)
      this.$store.commit('contractOfEmployment/SET_FREE_AMOUNT', this.contractOfEmployment.freeAmount)

      this.$emit('scroll')
    },

    calculateForNetAmount (min, max, scale) {
      const net = Number(this.amount)

      for (let iterator = max; iterator >= min; iterator -= scale) {
        this.contractOfEmployment.gross = iterator

        this.contractOfEmployment.calculateAll(this.young, this.fp, this.ppk)

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

      this.contractOfEmployment.calculateAll(this.young, this.fp, this.ppk)
    },
  },
}
</script>
