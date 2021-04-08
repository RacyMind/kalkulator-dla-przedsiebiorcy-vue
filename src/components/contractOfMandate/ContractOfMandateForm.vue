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
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="q-mt-sm block">
          <div class="column">
            <q-toggle
              v-model="student"
              class="q-mt-sm"
              label="Student / uczeń"
            />
            <div class="row">
              <q-toggle
                v-model="health"
                :disable="student"
                class="q-mt-sm col-6"
                label="Składka zdrowotna"
              />
              <q-toggle
                v-model="sick"
                :disable="student"
                class="q-mt-sm col-6"
                label="Składka chorobowa"
              />
            </div>
            <div class="row">
              <q-toggle
                v-model="rent"
                :disable="student"
                class="q-mt-sm col-6"
                label="Składka rentowa"
              />
              <q-toggle
                v-model="pension"
                :disable="student"
                class="q-mt-sm col-6"
                label="Składka emerytalna"
              />
              <q-input
                v-model="accident"
                :disable="student"
                type="number"
                class="full-width"
                min="0"
                step="0.01"
                label="Składka wypadkowa (w %)*"
                autofocus
                color="brand"
                required
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
      young: false,
      student: false,
      health: true,
      sick: true,
      rent: true,
      pension: true,
      accident: 0,
    }
  },
  created () {
    this.amountType = this.$constants.AMOUNT_TYPES.NET
    this.accident = this.$constants.CONTRACT_OF_MANDATE.ACCIDENT_RATE

    this.$store.commit('contractOfMandate/SET_NET', null)
    this.$store.commit('contractOfMandate/SET_TAX', null)
    this.$store.commit('contractOfMandate/SET_GROSS', null)
    this.$store.commit('contractOfMandate/SET_BASIS_FOR_TAX', null)
    this.$store.commit('contractOfMandate/SET_EXPENSES', null)
  },
  watch: {
    student: function (val) {
      this.health = false
      this.sick = false
      this.rent = false
      this.pension = false
      this.accident = 0

      if (val) {
        this.$q.notify({
          message: 'Dla studenta / ucznia nie odprowadza się składek ZUS.',
        })
      }
    },
  },
  methods: {
    calculate () {
      this.contractOfMandate = new ContractOfMandate()
      if (this.amountType === this.$constants.AMOUNT_TYPES.NET) {
        this.contractOfMandate.net = Number(this.amount)
        this.calculateForNetAmount()
      }
      if (this.amountType === this.$constants.AMOUNT_TYPES.GROSS) {
        this.calculateForGrossAmount()
      }

      if (this.contractOfMandate.gross <= this.$constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
        this.$q.notify({
          message: 'Dla wynagrodzenia brutto do 200 zł płaci się podatek zryczałtowany.',
        })
      }

      this.$store.commit('contractOfMandate/SET_NET', this.contractOfMandate.net)
      this.$store.commit('contractOfMandate/SET_TAX', this.contractOfMandate.taxAmount)
      this.$store.commit('contractOfMandate/SET_GROSS', this.contractOfMandate.gross)
      this.$store.commit('contractOfMandate/SET_BASIS_FOR_TAX', this.contractOfMandate.basisForTax)
      this.$store.commit('contractOfMandate/SET_EXPENSES', this.contractOfMandate.expenses)
    },

    calculateForNetAmount () {
      // TO DO
    },
    calculateForGrossAmount () {
      this.contractOfMandate.gross = Number(this.amount)

      if (this.contractOfMandate.gross > this.$constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
        this.contractOfMandate.rateExpenses = this.$constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
      }

      if (this.accident) {
        this.contractOfMandate.rateZUSAccidentEmployer = Number(this.accident) / 100
        this.contractOfMandate.calculateZUSEmployerAccident()
      }

      if (this.pension) {
        this.contractOfMandate.calculateZUSEmployeePension()
        this.contractOfMandate.calculateZUSEmployerPension()
      }

      if (this.rent) {
        this.contractOfMandate.calculateZUSEmployeeRent()
        this.contractOfMandate.calculateZUSEmployerRent()
      }

      if (this.sick) {
        this.contractOfMandate.calculateZUSEmployeeSick()
      }

      this.contractOfMandate.calculateExpenses()

      if (this.health) {
        this.contractOfMandate.calculateZUSEmployeeHealth()
        this.contractOfMandate.calculateUSEmployeeHealth()
      }

      this.contractOfMandate.calculateBasisForTax()
      this.contractOfMandate.calculateTaxAmount()

      if (this.young) {
        this.contractOfMandate.taxAmount = 0
        this.contractOfMandate.basisForTax = 0
        this.contractOfMandate.expenses = 0
      }

      this.contractOfMandate.calculateNetAmount()
    },
  },
}
</script>
