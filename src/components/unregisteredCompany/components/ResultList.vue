<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Przychód
      </template>
      <template #value>
        {{ pln(props.result.revenue)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Koszty
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
        <div class="row items-center">
          Podatek dochodowy
        </div>
      </template>
      <template #value>
        {{ pln(props.result.taxAmount)}}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Dochód
      </template>
      <template #value>
        {{ pln(props.result.income)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/unregisteredCompany/interfaces/Result'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
