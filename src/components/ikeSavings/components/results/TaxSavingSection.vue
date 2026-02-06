<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>Zaoszczędzona kwota przez brak podatku</template>
      <template #value>{{ pln(props.result.taxSaving) }}</template>
    </ListRow>
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
