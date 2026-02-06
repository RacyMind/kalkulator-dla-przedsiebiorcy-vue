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
        Liczba dni
      </template>
      <template #value>
        {{ props.result.dayCount }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Zasiłek chorobowy
      </template>
      <template #value>
        {{ pln(props.result.sickPayAmount)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/sickPay/interfaces/Result'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
