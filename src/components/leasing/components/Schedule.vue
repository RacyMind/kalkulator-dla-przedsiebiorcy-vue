<template>
  <div v-if="props.result">
    <div v-for="row in props.result.schedule" :key="row.month">
      <ListHeader>
        Rata {{ row.month }} — {{ pln(row.installmentNet) }}
      </ListHeader>
      <ListRow>
        <template #name>Część kapitałowa</template>
        <template #value>{{ pln(row.capitalPart) }}</template>
      </ListRow>
      <ListRow>
        <template #name>Część odsetkowa</template>
        <template #value>{{ pln(row.interestPart) }}</template>
      </ListRow>
      <ListRow>
        <template #name>Saldo po racie</template>
        <template #value>{{ pln(row.remainingBalance) }}</template>
      </ListRow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Result } from 'components/leasing/interfaces/Result'
import { pln } from 'src/composables/currencyFormat'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
