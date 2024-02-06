<template>
  <div v-if="result">
    <list-row>
      <template #name>
        Podstawa wymiaru składek ZUS
      </template>
      <template #value>
        {{ pln(result.contributionBasis)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Składka chorobowa
      </template>
      <template #value>
        {{ pln(result.sickContribution)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Składka wypadkowa
      </template>
      <template #value>
        {{ pln(result.accidentContribution)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Składka na Fundusz Pracy
      </template>
      <template #value>
        {{ pln(result.fpContribution)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Składka na Fundusz Solidarnościowy
      </template>
      <template #value>
        {{ pln(result.fsContribution)}}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Suma składek ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions)}}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/partialZusContributions/interfaces/Result'
import {computed} from 'vue'
import {pln} from '../../../use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const totalZusContributions = computed(() => {
  return props.result.pensionContribution + props.result.disabilityContribution + props.result.sickContribution + props.result.accidentContribution + props.result.fpContribution + props.result.fsContribution
})
</script>
