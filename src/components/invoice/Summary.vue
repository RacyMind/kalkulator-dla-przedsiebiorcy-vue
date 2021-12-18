<template>
  <div>
    <ListRow
      name="Kwota netto"
      :value="pln(result.netAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Kwota podatku"
      :value="pln(result.taxAmount)"
    />
    <ListRow
      class="bg-primary text-white"
      name="Kwota brutto"
      :value="pln(result.grossAmount)"
    />
  </div>
</template>

<script lang="ts">
import {PropType, toRefs, computed, Ref} from 'vue'
import { pln } from 'src/use/currencyFormat'
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import invoice from './invoice'
import ListRow from 'components/partials/ListRow.vue'
import {InvoiceResult} from 'components/invoice/interfaces/InvoiceResult'

export default {
  props: {
    input: {
      type: Object as PropType<InvoiceInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const { input } = toRefs(props)

    const result:Readonly<Ref<Readonly<InvoiceResult>>> = computed(() => {
      return invoice.getResult(input.value)
    })

    return {
      pln,
      result,
    }
  },
  components: {
    ListRow,
  },
}
</script>
