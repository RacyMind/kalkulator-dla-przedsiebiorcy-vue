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
        Liczba dni
      </template>
      <template #value>
        {{ props.result.dayCount }}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Zasiłek chorobowy
      </template>
      <template #value>
        {{ pln(props.result.sickPayAmount)}}
      </template>
    </list-row>
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
