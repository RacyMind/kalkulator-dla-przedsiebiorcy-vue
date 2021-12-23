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
import {computed, PropType, Ref, toRefs} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import investment from 'components/investment/investment'
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import {InvestmentResult} from 'components/investment/interfaces/InvestmentResult'

export default {
  props: {
    input: {
      type: Object as PropType<InvoiceInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const { input } = toRefs(props)

    const result:Readonly<Ref<Readonly<InvestmentResult>>> = computed(() => {
      return investment.getResult(input.value)
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
