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
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
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

import { useInvoice } from 'src/use/useInvoice'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const { result } = useInvoice()

    return {
      pln,
      result,
    }
  },
}
</script>
