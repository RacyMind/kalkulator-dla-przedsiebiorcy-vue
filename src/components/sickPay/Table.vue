<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podstawa wymiaru świadczenia
      </div>
      <div>
        {{ $filters.currencyPLN(basic) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Liczba dni
      </div>
      <div>
        {{ days }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Zasiłek chorobowy
      </div>
      <div>
        {{ $filters.currencyPLN(amount) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      amount: 'sickPay/amount',
      basic: 'sickPay/basic',
      days: 'sickPay/days',
    }),
  },
}
</script>
