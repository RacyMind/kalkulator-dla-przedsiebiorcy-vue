<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kapitał
      </div>
      <div>
        {{ amount | pln }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zysk brutto
      </div>
      <div>
        {{ gross | pln }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podatek
      </div>
      <div>
        {{ tax | pln }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zysk netto
      </div>
      <div>
        {{ net | pln }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Suma Kapitału i zysku netto
      </div>
      <div>
        {{ amount + net | pln }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      amount: 'investment/amount',
      net: 'investment/net',
      gross: 'investment/gross',
      tax: 'investment/tax',
    }),
  },
}
</script>
