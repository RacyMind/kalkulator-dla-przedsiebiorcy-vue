<template>
  <q-form @submit.prevent="save">
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
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
        />
        <div class="q-mt-sm block">
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
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="q-mt-sm block">
          <div>Koszty uzyskania przychodu*</div>
          <q-radio
            v-model="expenseRate"
            :val="constants.CONTRACT_WORK.EXPENSES_20"
            label="20%"
          />
          <q-radio
            v-model="expenseRate"
            :val="constants.CONTRACT_WORK.EXPENSES_50"
            label="50%"
          />
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

<script>import constants from 'src/logic/constants'

export default {
  emits: ['submitted'],
  setup () {
    return { constants }
  },
  data () {
    return {
      amount: null,
      amountType: null,
      expenseRate: null,
    }
  },
  created () {
    this.amountType = constants.AMOUNT_TYPES.GROSS
    this.expenseRate = constants.CONTRACT_WORK.EXPENSES_20
  },
  computed: {
    isDisabledButton () {
      if (!this.amount || this.expenseRate === null) {
        return true
      }
      return false
    },
  },
  methods: {
    save () {
      this.$store.commit('contractWork/setAmount', +this.amount)
      this.$store.commit('contractWork/setAmountType', this.amountType)
      this.$store.commit('contractWork/setExpenseRate', +this.expenseRate)

      this.$emit('submitted')
    },
  },
}
</script>
