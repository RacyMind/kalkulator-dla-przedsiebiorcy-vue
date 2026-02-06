<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Przychód
      </template>
      <template #value>
        {{ pln(result.revenue)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Koszty
      </template>
      <template #value>
        {{ pln(result.expenses)}}
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
        Składki ZUS
      </template>
      <template #value>
        {{ pln(result.totalContributions) }}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka zdrowotna
      </template>
      <template #value>
        {{ pln(result.healthContributions)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Pozostałe składki ZUS
      </template>
      <template #value>
        {{ pln(result.socialContributions)}}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Dochód
      </template>
      <template #value>
        {{ pln(result.income)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {CustomResult} from 'components/accountingWithSpouse/interfaces/CustomResult'
import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import {useAccountingWithSpouseStore} from 'components/accountingWithSpouse/store'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  spouse: Spouse
}
const props = defineProps<Props>()

const store = useAccountingWithSpouseStore()

const result = computed(() => {
  if(props.spouse === Spouse.Husband) {
    return store.husbandResult as CustomResult
  }
  return store.wifeResult as CustomResult
})
</script>
