<template>
  <div v-if="props.result">
    <div
      v-for="(monthlyResult, index) in props.result.monthlyResults"
      :key="index"
      v-show="hasPayout(monthlyResult)">
      <ListHeader>
        Miesiąc {{ index + 1 }}
      </ListHeader>
      <list-row>
        <template #name>
          Wypłata
        </template>
        <template #value>
          {{ pln(monthlyResult.payout) }}
        </template>
      </list-row>
      <list-row>
        <template #name>
          Skumulowane odsetki
        </template>
        <template #value>
          {{ pln(monthlyResult.accumulatedInterest) }}
        </template>
      </list-row>
      <list-row>
        <template #name>
          Skumulowany podatek Belki
        </template>
        <template #value>
          {{ pln(monthlyResult.accumulatedTaxAmount) }}
        </template>
      </list-row>
      <list-row>
        <template #name>
          Skumulowany zysk
        </template>
        <template #value>
          {{ pln(monthlyResult.accumulatedProfit) }}
        </template>
      </list-row>
      <list-row>
        <template #name>
          Skumulowany zysk realny
          <Tooltip class="q-ml-sm">
            Skumulowany zysk realny jest to zysk pomniejszony o inflację
          </Tooltip>
        </template>
        <template #value>
          {{ pln(monthlyResult.accumulatedRealProfit) }}
        </template>
      </list-row>
      <Separator v-if="index < props.result.monthlyResults.length - 1 && hasPayout(props.result.monthlyResults[index + 1])" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MonthlyResult } from 'components/polishBonds/interfaces/MonthlyResult'
import { Result } from 'components/polishBonds/interfaces/Result'
import { pln } from 'src/use/currencyFormat'

import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Separator from 'components/partials/Separator.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const hasPayout = (monthlyResult: MonthlyResult): boolean => {
  // Show months with payouts or the last month
  return monthlyResult.payout > 0 || 
         props.result.monthlyResults.indexOf(monthlyResult) === props.result.monthlyResults.length - 1
}
</script>
