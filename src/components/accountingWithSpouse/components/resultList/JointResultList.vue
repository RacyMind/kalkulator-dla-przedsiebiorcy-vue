<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Łączny przychód
      </template>
      <template #value>
        {{ pln(result.revenue)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podstawa opodatkowania
      </template>
      <template #value>
        {{ pln(result.taxBasis)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        <div class="row items-center">
          Podatek dochodowy
        </div>
      </template>
      <template #value>
        {{ pln(result.taxAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Łączne składki ZUS i PPK
      </template>
      <template #value>
        {{ pln(result.totalContributions) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Łączny dochód
      </template>
      <template #value>
        {{ pln(result.income)}}
      </template>
    </ListRow>
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
