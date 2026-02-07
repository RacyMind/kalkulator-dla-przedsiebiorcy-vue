<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>Okres oszczędzania</template>
      <template #value>{{ props.result.savingsPeriodYears }} lat</template>
    </ListRow>
    <ListRow>
      <template #name>Roczna wpłata</template>
      <template #value>{{ pln(props.result.yearlyContribution) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Suma wpłat</template>
      <template #value>{{ pln(props.result.totalContributions) }}</template>
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
