<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>Miesięczna wypłata na emeryturze</template>
      <template #value>{{ pln(props.result.monthlyPension) }}</template>
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
