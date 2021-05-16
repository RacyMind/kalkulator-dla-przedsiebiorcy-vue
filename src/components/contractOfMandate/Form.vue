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
        <div class="q-mt-sm block">
          <div class="column">
            <q-toggle
              v-model="isStudent"
              class="q-mt-sm"
              label="Student / uczeń"
            />
            <div class="row">
              <q-toggle
                v-model="isHealth"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka zdrowotna"
              />
              <q-toggle
                v-model="isSick"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka chorobowa"
              />
            </div>
            <div class="row">
              <q-toggle
                v-model="isRent"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka rentowa"
              />
              <q-toggle
                v-model="isPension"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka emerytalna"
              />
              <q-input
                v-model="accident"
                :disable="isStudent"
                type="number"
                class="full-width"
                min="0"
                step="0.01"
                label="Składka wypadkowa (%)*"
                color="brand"
                required
              />
              <q-toggle
                v-model="isPpk"
                class="q-mt-sm"
                label="PPK"
              />
              <div
                v-if="isPpk"
                class="row full-width">
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
import ContractOfMandate from 'src/logic/ContractOfMandate'

export default {
  data () {
    return {
      contractOfMandate: null,
      amount: null,
      amountType: null,
      accident: 0,
      employeePpkRate: 0,
      employerPpkRate: 0,
      isYoung: false,
      isStudent: false,
      isHealth: true,
      isSick: true,
      isRent: true,
      isPension: true,
      isPpk: false,
      isAuthorExpenses: false,
      authorExpenses: 100,
    }
  },
  emits: ['scroll'],
  created () {
    this.amountType = this.$constants.AMOUNT_TYPES.GROSS
    this.accident = this.$constants.ACCIDENT_RATE
    this.employerPpkRate = this.$constants.PPK.EMPLOYER.DEFAULT_RATE
    this.employeePpkRate = this.$constants.PPK.EMPLOYEE.DEFAULT_RATE

    this.$store.commit('contractOfMandate/CLEAR_DATA')
  },
  watch: {
    isStudent: function (val) {
      if (val) {
        this.isHealth = false
        this.isSick = false
        this.isRent = false
        this.isPension = false
        this.accident = 0

        this.$q.notify({
          message: 'Dla studenta / ucznia nie odprowadza się składek ZUS.',
        })
      }
    },
  },
  methods: {
    calculate () {
      this.contractOfMandate = new ContractOfMandate()

      if (this.isAuthorExpenses) {
        this.contractOfMandate.authorExpensePart = Number(this.authorExpenses) / 100
      }

      if (this.accident) {
        this.contractOfMandate.zusAccidentEmployerRate = Number(this.accident) / 100
      }

      if (this.isPpk) {
        this.contractOfMandate.employeePpkRate = Number(this.employeePpkRate) / 100
        this.contractOfMandate.employerPpkRate = Number(this.employerPpkRate) / 100
      }

      if (this.amountType === this.$constants.AMOUNT_TYPES.NET) {
        const min = Number(this.amount)
        this.calculateForNetAmount(min, 1.7 * min, 100)
      }
      if (this.amountType === this.$constants.AMOUNT_TYPES.GROSS) {
        this.calculateForGrossAmount()
      }

      if (this.contractOfMandate.gross <= this.$constants.LUMP_SUM_UP_TO_AMOUNT && this.contractOfMandate.taxAmount > 0) {
        this.$q.notify({
          message: 'Dla wynagrodzenia brutto do 200 zł płaci się podatek zryczałtowany.',
        })
      }

      this.$store.commit('contractOfMandate/SET_NET', this.contractOfMandate.net)
      this.$store.commit('contractOfMandate/SET_TAX', this.contractOfMandate.taxAmount)
      this.$store.commit('contractOfMandate/SET_GROSS', this.contractOfMandate.gross)
      this.$store.commit('contractOfMandate/SET_BASIS_FOR_TAX', this.contractOfMandate.basisForTax)
      this.$store.commit('contractOfMandate/SET_EXPENSES', this.contractOfMandate.expenses)
      this.$store.commit('contractOfMandate/SET_AUTHOR_EXPENSES_PART', this.contractOfMandate.authorExpensePart)
      this.$store.commit('contractOfMandate/SET_EMPLOYEE_ZUS', this.contractOfMandate.employeeZus)
      this.$store.commit('contractOfMandate/SET_EMPLOYER_ZUS', this.contractOfMandate.employerZus)
      this.$store.commit('contractOfMandate/SET_EMPLOYEE_PPK', this.contractOfMandate.employeePpk)
      this.$store.commit('contractOfMandate/SET_EMPLOYER_PPK', this.contractOfMandate.employerPpk)

      this.$emit('scroll')
    },

    calculateForNetAmount (min, max, scale) {
      const net = Number(this.amount)

      for (let iterator = max; iterator >= min; iterator -= scale) {
        this.contractOfMandate.gross = iterator

        this.contractOfMandate.calculateAll(this.accident, this.isPension, this.isRent, this.isSick, this.isHealth, this.isYoung, this.isPpk)

        if (Math.abs(this.contractOfMandate.net - net) <= 0.0005) {
          return
        }
        if (Math.abs(this.contractOfMandate.net - net) <= scale) {
          return this.calculateForNetAmount(this.contractOfMandate.net - scale, this.contractOfMandate.gross + scale, scale / 10)
        }
      }
      return null
    },
    calculateForGrossAmount () {
      this.contractOfMandate.gross = Number(this.amount)

      this.contractOfMandate.calculateAll(this.accident, this.isPension, this.isRent, this.isSick, this.isHealth, this.isYoung, this.isPpk)
    },
  },
}
</script>
