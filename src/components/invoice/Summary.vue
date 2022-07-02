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
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import {PropType, computed, defineComponent} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import invoice from './invoice'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<InvoiceInputFields>,
    },
  },
  setup(props: any) {
    const result = computed(() => {
      return invoice.getResult(props.input)
    })

    return {
      pln,
      result,
    }
  },
})
</script>

