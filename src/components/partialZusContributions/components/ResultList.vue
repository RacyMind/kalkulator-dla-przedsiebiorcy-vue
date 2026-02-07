<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Podstawa wymiaru składek ZUS
      </template>
      <template #value>
        {{ pln(result.contributionBasis)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składka chorobowa
      </template>
      <template #value>
        {{ pln(result.sickContribution)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składka wypadkowa
      </template>
      <template #value>
        {{ pln(result.accidentContribution)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składka na Fundusz Pracy i Fundusz Solidarnościowy
      </template>
      <template #value>
        {{ pln(result.fpAndFsContribution)}}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Suma składek ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/partialZusContributions/interfaces/Result'
import {computed} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const totalZusContributions = computed(() => {
  return props.result.pensionContribution + props.result.disabilityContribution + props.result.sickContribution + props.result.accidentContribution + props.result.fpAndFsContribution
})
</script>
