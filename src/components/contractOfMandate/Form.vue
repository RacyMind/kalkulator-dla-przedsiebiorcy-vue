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
                label="Składka wypadkowa (%)*"
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
    this.amountType = this.$constants.AMOUNT_TYPES.GROSS
    this.accident = this.$constants.ACCIDENT_RATE

    this.$store.commit('contractOfMandate/CLEAR_DATA')
  },
  watch: {
    student: function (val) {
      if (val) {
        this.health = false
        this.sick = false
        this.rent = false
        this.pension = false
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

      if (this.accident) {
        this.contractOfMandate.zusAccidentEmployerRate = Number(this.accident) / 100
      }

      if (this.amountType === this.$constants.AMOUNT_TYPES.NET) {
        const min = Number(this.amount)
        this.calculateForNetAmount(min, 1.7 * min, 100)
      }
      if (this.amountType === this.$constants.AMOUNT_TYPES.GROSS) {
        this.calculateForGrossAmount()
      }

      if (this.contractOfMandate.gross <= this.$constants.LUMP_SUM_UP_TO_AMOUNT) {
        this.$q.notify({
          message: 'Dla wynagrodzenia brutto do 200 zł płaci się podatek zryczałtowany.',
        })
      }

      this.$store.commit('contractOfMandate/SET_NET', this.contractOfMandate.net)
      this.$store.commit('contractOfMandate/SET_TAX', this.contractOfMandate.taxAmount)
      this.$store.commit('contractOfMandate/SET_GROSS', this.contractOfMandate.gross)
      this.$store.commit('contractOfMandate/SET_BASIS_FOR_TAX', this.contractOfMandate.basisForTax)
      this.$store.commit('contractOfMandate/SET_EXPENSES', this.contractOfMandate.expenses)
      this.$store.commit('contractOfMandate/SET_EMPLOYEE_ZUS', this.contractOfMandate.employeeZus)
      this.$store.commit('contractOfMandate/SET_EMPLOYER_ZUS', this.contractOfMandate.employerZus)
    },

    calculateForNetAmount (min, max, scale) {
      const net = Number(this.amount)

      for (let iterator = max; iterator >= min; iterator -= scale) {
        this.contractOfMandate.gross = iterator

        this.contractOfMandate.calculateAll(this.accident, this.pension, this.rent, this.sick, this.health, this.young)

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

      this.contractOfMandate.calculateAll(this.accident, this.pension, this.rent, this.sick, this.health, this.young)
    },
  },
}
</script>
