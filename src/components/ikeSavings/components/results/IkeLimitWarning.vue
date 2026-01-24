<template>
  <q-banner v-if="props.result.exceedsIkeLimit"
            class="bg-warning text-white q-mb-md"
            rounded>
    <template v-slot:avatar>
      <q-icon name="warning" />
    </template>
    Roczna wpłata ({{ pln(props.result.yearlyContribution) }}) przekracza limit IKE na rok 2026 ({{ pln(props.result.ikeLimit) }}).
  </q-banner>
</template>

<script setup lang="ts">
import { Result } from '../../interfaces/Result'
import { pln } from 'src/use/currencyFormat'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
