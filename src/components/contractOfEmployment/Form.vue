<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          label="Wynagrodzenie*"
          autofocus
          color="brand"
          suffix="zł"
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
            v-model="workInLivePlace"
            class="q-mt-sm"
            label=" Praca w miejscu zamieszkania"
          />
          <q-toggle
            v-model="isYoung"
            class="q-mt-sm"
            label="Zerowy PIT dla młodych"
          />
          <template v-if="year >= 2022">
            <q-toggle
              v-model="isAidForSenior"
              class="q-mt-sm"
              label="Zerowy PIT dla seniora"
            />
            <q-toggle
              v-model="isAidForBigFamily"
              class="q-mt-sm"
              label="Zerowy PIT dla rodzin 4+"
            />
            <q-toggle
              v-model="isAidForMiddleClass"
              class="q-mt-sm"
              label="Ulga dla klasy średniej"
            />
          </template>
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
            label="Część pracy*"
            color="brand"
            suffix="%"
            :rules="[
              val => !!val || '* Wpisz wartość',
            ]"
            lazy-rules
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
            label="Składka wypadkowa*"
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
                label="Pracodawca"
                color="brand"
                suffix="%"
                :rules="[
                  val => !!val || '* Wpisz wartość',
                ]"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pl-sm">
              <q-input
                v-model.number="employeePpkRate"
                type="number"
                class="full-width"
                :min="constants.PARAMS[year].PPK.EMPLOYER.MINIMUM_RATE"
                :max="constants.PARAMS[year].PPK.EMPLOYER.MAXIMUM_RATE"
                step="0.01"
                label="Pracownik"
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
          :label="isMarriage ? `Zapisz` : `Oblicz`"
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
      isAidForBigFamily: false,
      isAidForSenior: false,
      isAidForMiddleClass: true,
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
    save () {
      let partOfWorkWithAuthorExpenses = 0
      let employeePPkContributionRate = 0
      let employerPpkContributionRate = 0
      let grossAmount = 0

      if (this.isAuthorExpenses) {
        partOfWorkWithAuthorExpenses = Number(this.partOfWorkWithAuthorExpenses) / 100
      }

      if (this.isPpkContribution) {
        employeePPkContributionRate = Number(this.employeePpkRate) / 100
        employerPpkContributionRate = Number(this.employerPpkRate) / 100
      }

      const min = Number(this.amount)

      switch (this.amountType) {
        case constants.AMOUNT_TYPES.NET:
          grossAmount = this.findGrossAmountUsingNetAmount(min, 1.7 * min, 100)
          break
        case constants.AMOUNT_TYPES.GROSS:
          grossAmount = Number(this.amount)
          break
      }

      if (this.isMarriage) {
        const inputData = {
          grossAmount: grossAmount,
          accidentContributionRate: Number(this.accidentContributionRate) / 100,
          employeePPkContributionRate: employeePPkContributionRate,
          employerPpkContributionRate: employerPpkContributionRate,
          partOfWorkWithAuthorExpenses: partOfWorkWithAuthorExpenses,
          workInLivePlace: this.workInLivePlace,
          isFreeAmount: this.isFreeAmount,
          isYoung: this.isYoung,
          isFpContribution: this.isFpContribution,
          isAidForBigFamily: this.isAidForBigFamily,
          isAidForSenior: this.isAidForSenior,
          isAidForMiddleClass: this.isAidForMiddleClass,
        }

        this.$emit('submitted', inputData)
        return
      }

      this.$store.commit('contractOfEmployment/resetData')

      this.$store.commit('contractOfEmployment/setGrossAmount', grossAmount)
      this.$store.commit('contractOfEmployment/setAccidentContributionRate', Number(this.accidentContributionRate) / 100)
      this.$store.commit('contractOfEmployment/setEmployeePPkContributionRate', employeePPkContributionRate)
      this.$store.commit('contractOfEmployment/setEmployerPpkContributionRate', employerPpkContributionRate)
      this.$store.commit('contractOfEmployment/setPartOfWorkWithAuthorExpenses', partOfWorkWithAuthorExpenses)
      this.$store.commit('contractOfEmployment/setIsYoung', this.isYoung)
      this.$store.commit('contractOfEmployment/setWorkInLivePlace', this.workInLivePlace)
      this.$store.commit('contractOfEmployment/setIsFreeAmount', this.isFreeAmount)
      this.$store.commit('contractOfEmployment/setIsFpContribution', this.isFpContribution)

      if (this.year >= 2022) {
        this.$store.commit('contractOfEmployment/setIsAidForBigFamily', this.isAidForBigFamily)
        this.$store.commit('contractOfEmployment/setIsAidForSenior', this.isAidForSenior)
        this.$store.commit('contractOfEmployment/setIsAidForMiddleClass', this.isAidForMiddleClass)
      }

      this.$emit('submitted')
    },

    /**
     * Looks for a gross amount
     *
     * @param {number} min
     * @param {number} max
     * @param {number} scale
     * @returns {number}
     */
    findGrossAmountUsingNetAmount (min, max, scale) {
      let partOfWorkWithAuthorExpenses = 0
      let employeePPkContributionRate = 0

      if (this.isAuthorExpenses) {
        partOfWorkWithAuthorExpenses = Number(this.partOfWorkWithAuthorExpenses) / 100
      }

      if (this.isPpkContribution) {
        employeePPkContributionRate = Number(this.employeePpkRate) / 100
      }

      const netAmount = Number(this.amount)

      for (let iterator = max; iterator >= min; iterator -= scale) {
        const result = ContractOfEmployment.getMonthlyResultOfEmployee(
          iterator,
          employeePPkContributionRate,
          partOfWorkWithAuthorExpenses,
          this.workInLivePlace,
          this.isFreeAmount,
          this.isFpContribution,
          this.isYoung,
          this.isAidForBigFamily,
          this.isAidForSenior,
          this.isAidForMiddleClass,
        )

        if (Math.abs(result.netAmount - netAmount) <= 0.0005) {
          return result.grossAmount
        }
        if (Math.abs(result.netAmount - netAmount) <= scale) {
          return this.findGrossAmountUsingNetAmount(result.netAmount - scale, result.grossAmount + scale, scale / 10)
        }
      }
      return 0
    },
  },
}
</script>
