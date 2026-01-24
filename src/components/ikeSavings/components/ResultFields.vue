<template>
  <div v-if="props.result">
    <q-banner v-if="props.result.exceedsIkeLimit"
              class="bg-warning text-white q-mb-md"
              rounded>
      <template v-slot:avatar>
        <q-icon name="warning" />
      </template>
      Roczna wpłata ({{ pln(props.result.yearlyContribution) }}) przekracza limit IKE na rok 2026 ({{ pln(props.result.ikeLimit) }}).
    </q-banner>

    <div class="text-h6 q-mb-sm">Okres oszczędzania</div>
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

    <q-separator class="q-my-md" />

    <div class="text-h6 q-mb-sm">Przewidywany kapitał</div>
    <list-row highlight>
      <template #name>Przewidywany kapitał</template>
      <template #value>{{ pln(props.result.finalCapital) }}</template>
    </list-row>
    <list-row>
      <template #name>Zysk z inwestycji</template>
      <template #value>{{ pln(props.result.investmentGain) }}</template>
    </list-row>

    <q-separator class="q-my-md" />

    <div class="text-h6 q-mb-sm">Oszczędność podatkowa</div>
    <list-row highlight>
      <template #name>Oszczędność podatkowa IKE (podatek Belki 19%)</template>
      <template #value>{{ pln(props.result.taxSaving) }}</template>
    </list-row>

    <q-separator class="q-my-md" />

    <div class="text-h6 q-mb-sm">Emerytura</div>
    <list-row highlight>
      <template #name>Średnia miesięczna emerytura</template>
      <template #value>{{ pln(props.result.monthlyPension) }}</template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import { Result } from '../interfaces/Result'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result | undefined
}
const props = defineProps<Props>()
</script>
