<template>
  <div v-if="props.result">
    <list-row>
      <template #name>Przewidywany kapitał</template>
      <template #value>{{ pln(props.result.finalCapital) }}</template>
    </list-row>
    <list-row>
      <template #name>Zysk z inwestycji</template>
      <template #value>{{ pln(props.result.investmentGain) }}</template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import { Result } from '../../interfaces/Result'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
