<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>
        Podstawa wymiaru świadczenia
      </template>
      <template #value>
        {{ pln(props.result.basicAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Współczynnik urlopowy
      </template>
      <template #value>
        {{ props.result.holidayRate }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Współczynnik proporcjonalny
      </template>
      <template #value>
        {{ props.result.proportionalRate }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Ekwiwalent
      </template>
      <template #value>
        {{ pln(props.result.equivalent)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/salaryForUnusedHolidays/interfaces/Result'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
