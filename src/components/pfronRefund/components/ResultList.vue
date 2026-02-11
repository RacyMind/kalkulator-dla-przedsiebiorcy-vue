<template>
  <div v-if="props.result">
    <ListRow>
      <template #name> Składka emerytalna </template>
      <template #value>
        {{ pln(props.result.pensionContribution) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Składka rentowa </template>
      <template #value>
        {{ pln(props.result.disabilityContribution) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Suma składek społecznych </template>
      <template #value>
        {{ pln(props.result.socialContributionsAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Poziom refundacji </template>
      <template #value>
        {{ refundRateLabel }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name> Kwota refundacji PFRON </template>
      <template #value>
        {{ pln(props.result.refundAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Koszt po refundacji </template>
      <template #value>
        {{ pln(props.result.entrepreneurCostAfterRefund) }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import { Result } from 'components/pfronRefund/interfaces/Result'
import { computed } from 'vue'
import { pln } from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const refundRateLabel = computed(() => {
  return `${Math.round(props.result.refundRate * 100)}%`
})
</script>
