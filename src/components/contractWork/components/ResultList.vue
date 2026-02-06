<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>
        Wynagrodzenie brutto
      </template>
      <template #value>
        {{ pln(props.result.grossAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Koszty uzyskania przychodu
      </template>
      <template #value>
        {{ pln(props.result.expenses)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podstawa opodatkowania
      </template>
      <template #value>
        {{ pln(props.result.taxBasis)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Zaliczka na podatek dochodowy
      </template>
      <template #value>
        {{ pln(props.result.taxAmount)}}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Wynagrodzenie netto
      </template>
      <template #value>
        {{ pln(props.result.netAmount)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/contractWork/interfaces/Result'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
