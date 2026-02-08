<template>
  <div v-if="props.result">
    <q-markup-table
      flat
      bordered
      separator="cell"
      class="q-mt-sm">
      <thead>
        <tr>
          <th class="text-left">Rok</th>
          <th class="text-right">Przychód</th>
          <th class="text-right">Podatek</th>
          <th class="text-right">Koszty</th>
          <th class="text-right">Zysk netto</th>
          <th class="text-right">Skumulowany zysk</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="yearResult in props.result.yearResults"
          :key="yearResult.year">
          <td class="text-left">{{ yearResult.year }}</td>
          <td class="text-right">{{ pln(yearResult.grossRevenue) }}</td>
          <td class="text-right">{{ pln(yearResult.tax) }}</td>
          <td class="text-right">{{ pln(yearResult.annualExpenses) }}</td>
          <td class="text-right">{{ pln(yearResult.netProfit) }}</td>
          <td class="text-right text-bold">{{ pln(yearResult.cumulativeProfit) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="text-bold bg-surface-elevated">
          <td class="text-left">Razem</td>
          <td class="text-right">{{ pln(props.result.summary.totalGrossRevenue) }}</td>
          <td class="text-right">{{ pln(props.result.summary.totalTax) }}</td>
          <td class="text-right">{{ pln(props.result.summary.totalExpenses) }}</td>
          <td class="text-right">{{ pln(props.result.summary.totalNetProfit) }}</td>
          <td class="text-right">—</td>
        </tr>
      </tfoot>
    </q-markup-table>
    <div class="q-pa-md text-caption text-grey-7">
      Średni miesięczny zysk netto: {{ pln(props.result.summary.averageMonthlyProfit) }} |
      Efektywna stawka podatku: {{ props.result.summary.effectiveTaxRate }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/rentalProfit/interfaces/Result'
import {pln} from 'src/composables/currencyFormat'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
