<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12">
        <q-input
          v-model="basic"
          type="number"
          min="0"
          step="0.01"
          label="Podstawa wymiaru świadczenia*"
          autofocus
          color="brand"
          required
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-select
          v-model="rate"
          :options="$constants.SICK_PAY_RATES"
          label="Stawka zasiłku chorobowego*"
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="days"
          type="number"
          min="1"
          step="1"
          label="Liczba dni na zwolnieniu*"
          color="brand"
          required
        />
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
          :disable="!basic || !rate || !days"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import SickPay from 'src/logic/SickPay'

export default {
  data () {
    return {
      basic: null,
      rate: null,
      days: null,
    }
  },
  emits: ['scroll'],
  created () {
    this.rate = this.$constants.SICK_PAY_RATES[0]

    this.$store.commit('sickPay/CLEAR_DATA')
  },
  methods: {
    calculate () {
      const sickPay = new SickPay()
      sickPay.basic = Number(this.basic)
      sickPay.rate = Number(this.rate.value) / 100
      sickPay.days = Number(this.days)

      sickPay.calculate()

      this.$store.commit('sickPay/SET_AMOUNT', sickPay.amount)
      this.$store.commit('sickPay/SET_BASIC', sickPay.basic)
      this.$store.commit('sickPay/SET_DAYS', sickPay.days)

      this.$emit('scroll')
    },
  },
}
</script>
