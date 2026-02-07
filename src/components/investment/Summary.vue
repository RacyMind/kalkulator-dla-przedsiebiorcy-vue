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

<script setup lang="ts">
import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {computed} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import investment from 'components/investment/investment'

interface Props {
  input: InvestmentInputFields
}

const props = defineProps<Props>()

const result = computed(() => {
  return investment.getResult(props.input)
})
</script>
