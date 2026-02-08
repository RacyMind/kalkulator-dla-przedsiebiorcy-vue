<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>Przewidywany kapitał</template>
      <template #value>{{ pln(props.result.finalCapital) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Zysk z inwestycji</template>
      <template #value>{{ pln(props.result.investmentGain) }}</template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import { Result } from '../../interfaces/Result'
import { pln } from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
