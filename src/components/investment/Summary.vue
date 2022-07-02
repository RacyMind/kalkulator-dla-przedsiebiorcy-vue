<template>
  <div>
    <ListRow
      name="Kapitał"
      :value="pln(result.capital)"
    />
    <ListRow
      class="bg-teal-1"
      name="Zysk brutto"
      :value="pln(result.grossAmount)"
    />
    <ListRow
      name="Podatek"
      :value="pln(result.taxAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Zysk netto"
      :value="pln(result.netAmount)"
    />
    <ListRow
      class="bg-primary text-white"
      name="Suma kapitału i zysku netto"
      :value="pln(result.capital + result.netAmount)"
    />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import investment from 'components/investment/investment'
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'

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
      return investment.getResult(props.input)
    })

    return {
      pln,
      result,
    }
  },
})
</script>
