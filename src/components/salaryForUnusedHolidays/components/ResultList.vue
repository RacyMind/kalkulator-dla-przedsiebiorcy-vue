<template>
  <div v-if="props.result">
    <list-row>
      <template #name>
        Podstawa wymiaru świadczenia
      </template>
      <template #value>
        {{ pln(props.result.basicAmount)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Współczynnik urlopowy
      </template>
      <template #value>
        {{ props.result.holidayRate }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Współczynnik proporcjonalny
      </template>
      <template #value>
        {{ props.result.proportionalRate }}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Ekwiwalent
      </template>
      <template #value>
        {{ pln(props.result.equivalent)}}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/salaryForUnusedHolidays/interfaces/Result'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
