<template>
  <div v-if="props.result">
    <list-row>
      <template #name>
        Cena
      </template>
      <template #value>
        {{ pln(props.result.price)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Kwota podatku VAT
      </template>
      <template #value>
        {{ pln(props.result.vatTaxAmount)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Kwota podatku VAT do odliczenia
      </template>
      <template #value>
        {{ pln(props.result.deductedVatTaxAmount)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Kwota podatku dochodowego do odliczenia
      </template>
      <template #value>
        {{ pln(props.result.deductedIncomeTaxAmount)}}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Zaoszczędzona kwota
      </template>
      <template #value>
        {{ pln(props.result.savedAmount)}}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/realBoughtCosts/interfaces/Result'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
