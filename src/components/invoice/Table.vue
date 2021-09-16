<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kwota netto
      </div>
      <div>
        {{ pln(result.netAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Kwota podatku
      </div>
      <div>
        {{ pln(result.taxAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Kwota brutto
      </div>
      <div>
        {{ pln(result.grossAmount) }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getResult } from 'src/logic/Invoice'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const store = useStore()
    const amount = computed(() => store.getters['invoice/amount'])
    const amountType = computed(() => store.getters['invoice/amountType'])
    const taxRate = computed(() => store.getters['invoice/taxRate'])

    return {
      pln,
      amount,
      amountType,
      taxRate,
    }
  },
  computed: {
    result () {
      return getResult(this.amount, this.amountType, this.taxRate)
    },
  },
}
</script>
