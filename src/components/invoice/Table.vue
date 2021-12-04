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

<script lang="ts">
import { PropType, toRefs, computed } from 'vue'
import { pln } from 'src/use/currencyFormat'
import {InvoiceInputFields} from "components/invoice/interfaces/InvoiceInputFields"
import invoice from './invoice'

export default {
  props: {
    input: {
      type: Object as PropType<InvoiceInputFields>,
      required: true,
    }
  },
  setup(props: any) {
    const {input} = toRefs(props)

    const result = computed(() => {
      return invoice.getResult(input.value)
    })

    return {
      pln,
      result,
    }
  },
}
</script>
