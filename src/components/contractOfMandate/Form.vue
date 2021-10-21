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
        <div class="q-mt-sm block">
          <div class="column">
            <q-toggle
              v-model="isStudent"
              class="q-mt-sm"
              label="Student / uczeń"
            />
            <div class="row">
              <q-toggle
                v-model="isHealthContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka zdrowotna"
              />
              <q-toggle
                v-model="isSickContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka chorobowa"
              />
            </div>
            <div class="row">
              <q-toggle
                v-model="isRentContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka rentowa"
              />
              <q-toggle
                v-model="isPensionContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka emerytalna"
              />
              <q-input
                v-model.number="accidentContributionRate"
                :disable="isStudent"
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
                v-model="isPpkContribution"
                class="q-mt-sm"
                label="PPK"
              />
              <div
                v-if="isPpkContribution"
                class="row full-width">
                <div class="col-6">
                  <q-input
                    v-model.number="employerPpkRate"
                    type="number"
                    class="full-width"
                    :min="constants.PPK.EMPLOYER.MINIMUM_RATE"
                    :max="constants.PPK.EMPLOYER.MAXIMUM_RATE"
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
                <div class="col-6 q-pl-md-sm">
                  <q-input
                    v-model.number="employeePpkRate"
                    type="number"
                    class="full-width"
                    :min="constants.PPK.EMPLOYER.MINIMUM_RATE"
                    :max="constants.PPK.EMPLOYER.MAXIMUM_RATE"
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
import contractOfMandate from 'src/logic/contractOfMandate'

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
      accidentContributionRate: 0,
      employeePpkRate: 0,
      employerPpkRate: 0,
      isYoung: false,
      isStudent: false,
      isHealthContribution: true,
      isSickContribution: true,
      isRentContribution: true,
      isPensionContribution: true,
      isPpkContribution: false,
      isAuthorExpenses: false,
      partOfWorkWithAuthorExpenses: 100,
    }
  },
  created () {
    this.amountType = constants.AMOUNT_TYPES.GROSS
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
  watch: {
    isStudent: function (val) {
      if (val) {
        this.isHealthContribution = false
        this.isSickContribution = false
        this.isRentContribution = false
        this.isPensionContribution = false
        this.accidentContributionRate = 0

        this.$q.notify({
          message: 'Dla studenta / ucznia nie odprowadza się składek ZUS.',
        })
      }
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

      this.$store.commit('contractOfMandate/resetData')

      this.$store.commit('contractOfMandate/setGrossAmount', grossAmount)
      this.$store.commit('contractOfMandate/setAccidentContributionRate', Number(this.accidentContributionRate) / 100)
      this.$store.commit('contractOfMandate/setemployeePPkContributionRate', employeePPkContributionRate)
      this.$store.commit('contractOfMandate/setemployerPpkContributionRate', employerPpkContributionRate)
      this.$store.commit('contractOfMandate/setPartOfWorkWithAuthorExpenses', partOfWorkWithAuthorExpenses)
      this.$store.commit('contractOfMandate/setIsPensionContribution', this.isPensionContribution)
      this.$store.commit('contractOfMandate/setIsRentContribution', this.isRentContribution)
      this.$store.commit('contractOfMandate/setIsSickContribution', this.isSickContribution)
      this.$store.commit('contractOfMandate/setIsHealthContribution', this.isHealthContribution)
      this.$store.commit('contractOfMandate/setIsYoung', this.isYoung)

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
        const result = contractOfMandate.getMonthlyResultOfEmployee(
          iterator,
          employeePPkContributionRate,
          partOfWorkWithAuthorExpenses,
          this.isPensionContribution,
          this.isRentContribution,
          this.isSickContribution,
          this.isHealthContribution,
          this.isYoung,
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
