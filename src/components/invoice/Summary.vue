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

<script setup lang="ts">
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import {computed} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import invoice from './invoice'

interface Props {
  input: InvoiceInputFields
}

const props = defineProps<Props>()

const result = computed(() => {
  return invoice.getResult(props.input)
})
</script>

