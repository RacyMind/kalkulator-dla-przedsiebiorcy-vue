<template>
  <div v-if="props.result">
    <div v-for="yearResult in props.result.yearResults" :key="yearResult.year">
      <ListHeader> Rok {{ yearResult.year }} </ListHeader>
      <ListRow>
        <template #name> Przychód brutto </template>
        <template #value>
          {{ pln(yearResult.grossRevenue) }}
        </template>
      </ListRow>
      <ListRow>
        <template #name> Podatek </template>
        <template #value>
          {{ pln(yearResult.tax) }}
        </template>
      </ListRow>
      <ListRow>
        <template #name> Koszty </template>
        <template #value>
          {{ pln(yearResult.annualExpenses) }}
        </template>
      </ListRow>
      <ListRow>
        <template #name> Zysk netto </template>
        <template #value>
          {{ pln(yearResult.netProfit) }}
        </template>
      </ListRow>
      <ListRow highlight>
        <template #name> Skumulowany zysk </template>
        <template #value>
          {{ pln(yearResult.cumulativeProfit) }}
        </template>
      </ListRow>
    </div>
    <ListHeader> Podsumowanie </ListHeader>
    <ListRow>
      <template #name> Łączny przychód brutto </template>
      <template #value>
        {{ pln(props.result.summary.totalGrossRevenue) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Łączny podatek </template>
      <template #value>
        {{ pln(props.result.summary.totalTax) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Łączne koszty </template>
      <template #value>
        {{ pln(props.result.summary.totalExpenses) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name> Łączny zysk netto </template>
      <template #value>
        {{ pln(props.result.summary.totalNetProfit) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Średni miesięczny zysk netto </template>
      <template #value>
        {{ pln(props.result.summary.averageMonthlyProfit) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Efektywna stawka podatku </template>
      <template #value> {{ props.result.summary.effectiveTaxRate }}% </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import { Result } from 'components/rentalProfit/interfaces/Result';
import { pln } from 'src/composables/currencyFormat';
import ListHeader from 'components/partials/resultList/ListHeader.vue';
import ListRow from 'components/partials/resultList/ListRow.vue';

interface Props {
  result: Result;
}
const props = defineProps<Props>();
</script>
