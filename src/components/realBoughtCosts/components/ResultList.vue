<template>
  <div v-if="props.result">
    <ListRow>
      <template #name> Cena </template>
      <template #value>
        {{ pln(props.result.price) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Podatek VAT </template>
      <template #value>
        {{ pln(props.result.vatTaxAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Podatek VAT do odliczenia </template>
      <template #value>
        {{ pln(props.result.deductedVatTaxAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Podatek dochodowy do odliczenia </template>
      <template #value>
        {{ pln(props.result.deductedIncomeTaxAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Składka zdrowotna </template>
      <template #value>
        {{ pln(props.result.healthContribution) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Zaoszczędzona kwota </template>
      <template #value>
        {{ pln(props.result.savedAmount) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name> Rzeczywisty koszt zakupu </template>
      <template #value>
        {{ pln(props.result.realCost) }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import { Result } from 'components/realBoughtCosts/interfaces/Result'
import { pln } from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
