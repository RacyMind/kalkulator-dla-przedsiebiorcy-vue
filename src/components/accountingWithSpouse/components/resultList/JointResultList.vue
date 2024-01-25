<template>
  <div v-if="result">
    <list-row>
      <template #name>
        Łączny przychód
      </template>
      <template #value>
        {{ pln(result.revenue)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Podstawa opodatkowania
      </template>
      <template #value>
        {{ pln(result.taxBasis)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        <div class="row items-center">
          Podatek dochodowy
        </div>
      </template>
      <template #value>
        {{ pln(result.taxAmount)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Łączne składki ZUS i PPK
      </template>
      <template #value>
        {{ pln(result.totalContributions) }}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Łączny dochód
      </template>
      <template #value>
        {{ pln(result.income)}}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {pln} from '../../../../use/currencyFormat'
import {useAccountingWithSpouseStore} from 'components/accountingWithSpouse/store'
import ListRow from 'components/partials/resultList/ListRow.vue'

const store = useAccountingWithSpouseStore()

const result = computed(() => {
  return store.jointResult
})
</script>
