<template>
  <div v-if="props.result">
    <list-row>
      <template #name>Okres oszczędzania</template>
      <template #value>{{ props.result.savingsPeriodYears }} lat</template>
    </list-row>
    <list-row>
      <template #name>Roczna wpłata</template>
      <template #value>{{ pln(props.result.yearlyContribution) }}</template>
    </list-row>
    <list-row>
      <template #name>Suma wpłat</template>
      <template #value>{{ pln(props.result.totalContributions) }}</template>
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
