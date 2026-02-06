<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Wynagrodzenie brutto
      </template>
      <template #value>
        {{ pln(result.grossAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składki ZUS
      </template>
      <template #value>
        {{ pln(totalZusContributions) }}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka wypadkowa
      </template>
      <template #value>
        {{ pln(result.accidentContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka na Fundusz Pracy
      </template>
      <template #value>
        {{ pln(result.fpContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka na FGŚP
      </template>
      <template #value>
        {{ pln(result.fgspContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka na Fundusz Solidarnościowy
        <Tooltip>
          Do składek na Fundusz Solidarnościowy stosuje się zasady dotyczące obowiązkowych składek na Fundusz Pracy. Do 21 grudnia 2019 r. fundusz ten nosił nazwę Solidarnościowy Fundusz Wsparcia Osób Niepełnosprawnych.
        </Tooltip>
      </template>
      <template #value>
        {{ pln(result.fsContribution)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składka na PPK
      </template>
      <template #value>
        {{ pln(result.ppkContribution)}}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Suma kosztów pracodawcy
      </template>
      <template #value>
        {{ pln(result.totalAmount) }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import {computed} from 'vue'
import {pln} from '../../../use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: EmployerResult
}
const props = defineProps<Props>()

const totalZusContributions = computed(() => {
  return props.result.fpContribution + props.result.fgspContribution + props.result.fsContribution + props.result.pensionContribution + props.result.disabilityContribution + props.result.accidentContribution
})
</script>
