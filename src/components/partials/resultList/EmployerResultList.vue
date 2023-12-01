<template>
  <div v-if="result">
    <list-row>
      <template #name>
        Wynagrodzenie brutto
      </template>
      <template #value>
        {{ pln(result.grossAmount)}}
      </template>
    </list-row>
    <list-row class="text-bold">
      <template #name>
        Składki ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions) }}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka wypadkowa
      </template>
      <template #value>
        {{ pln(result.accidentContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka na Fundusz Pracy
      </template>
      <template #value>
        {{ pln(result.fpContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka na FGŚP
      </template>
      <template #value>
        {{ pln(result.fgspContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka na Fundusz Solidarnościowy
      </template>
      <template #value>
        {{ pln(result.fsContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka na PPK
      </template>
      <template #value>
        {{ pln(result.ppkContribution)}}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Suma kosztów pracodawcy
      </template>
      <template #value>
        {{ pln(result.totalAmount) }}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import {computed} from 'vue'
import {pln} from '../../../use/currencyFormat'
import {useMandateContractStore} from 'components/contractOfMandate/store'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: EmployerResult
}
const props = defineProps<Props>()

const totalZusContributions = computed(() => {
  return props.result.fpContribution + props.result.fgspContribution + props.result.fsContribution + props.result.pensionContribution + props.result.disabilityContribution + props.result.accidentContribution + props.result.ppkContribution
})
</script>
