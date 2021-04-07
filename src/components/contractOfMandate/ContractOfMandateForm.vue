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
import ContractWork from 'src/logic/ContractWork'
export default {
  data () {
    return {
      amount: null,
      amountType: null,
      expenses: null,
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

    this.$store.commit('contractWork/SET_NET', null)
    this.$store.commit('contractWork/SET_TAX', null)
    this.$store.commit('contractWork/SET_GROSS', null)
    this.$store.commit('contractWork/SET_BASIS_FOR_TAX', null)
    this.$store.commit('contractWork/SET_EXPENSES', null)
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
      const contractWork = new ContractWork()
      contractWork.rateExpenses = Number(this.expenses)
      if (this.amountType === this.$constants.AMOUNT_TYPES.NET) {
        contractWork.net = Number(this.amount)
        contractWork.calculateGross()

        if (contractWork.gross <= this.$constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
          contractWork.rateExpenses = 0
        }

        contractWork.calculateExpenses()
        contractWork.calculateGross()
        contractWork.calculateBasisForTax()
        contractWork.calculateTaxAmount()
        contractWork.gross = contractWork.net + contractWork.taxAmount
      }
      if (this.amountType === this.$constants.AMOUNT_TYPES.GROSS) {
        contractWork.gross = Number(this.amount)

        if (contractWork.gross <= this.$constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
          contractWork.rateExpenses = 0
        }

        contractWork.calculateExpenses()
        contractWork.calculateBasisForTax()
        contractWork.calculateTaxAmount()
        contractWork.calculateNet()
      }

      if (contractWork.gross <= 200) {
        this.$q.notify({
          message: 'Dla wynagrodzenia brutto do 200 zł płaci się podatek zryczałtowany.',
        })
      }
      if (contractWork.rateExpenses === 0.5 && contractWork.expenses >= contractWork.maxExpenses) {
        this.$q.notify({
          message: `Przy 50% uzyskania kosztów przychodu obowiązuje limit kosztów w kwocie ${contractWork.maxExpenses} zł`,
        })
      }

      this.$store.commit('contractWork/SET_NET', contractWork.net)
      this.$store.commit('contractWork/SET_TAX', contractWork.taxAmount)
      this.$store.commit('contractWork/SET_GROSS', contractWork.gross)
      this.$store.commit('contractWork/SET_BASIS_FOR_TAX', contractWork.basisForTax)
      this.$store.commit('contractWork/SET_EXPENSES', contractWork.expenses)
    },
  },
}
</script>
