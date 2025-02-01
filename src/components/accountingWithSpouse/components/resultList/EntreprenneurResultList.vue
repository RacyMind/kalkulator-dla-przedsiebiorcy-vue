<template>
  <div v-if="result">
    <list-row>
      <template #name>
        Przychód
      </template>
      <template #value>
        {{ pln(result.revenue)}}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Koszty
      </template>
      <template #value>
        {{ pln(result.expenses)}}
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
        Składki ZUS
      </template>
      <template #value>
        {{ pln(result.totalContributions) }}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka zdrowotna
      </template>
      <template #value>
        {{ pln(result.healthContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka chorobowa
      </template>
      <template #value>
        {{ pln(result.sickContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka wypadkowa
      </template>
      <template #value>
        {{ pln(result.accidentContribution)}}
      </template>
    </list-row>
    <list-row nested>
      <template #name>
        Składka na Fundusz Pracy i Fundusz Solidarnościowy
      </template>
      <template #value>
        {{ pln(result.fpAndFsContribution)}}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Dochód
      </template>
      <template #value>
        {{ pln(result.income)}}
      </template>
    </list-row>
  </div>
</template>

<script setup lang="ts">
import {EntrepreneurResult} from 'components/accountingWithSpouse/interfaces/EntrepreneurResult'
import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {computed} from 'vue'
import {pln} from '../../../../use/currencyFormat'
import {useAccountingWithSpouseStore} from 'components/accountingWithSpouse/store'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  spouse: Spouse
}
const props = defineProps<Props>()

const store = useAccountingWithSpouseStore()

const result = computed(() => {
  if(props.spouse === Spouse.Husband) {
    return store.husbandResult as EntrepreneurResult
  }
  return store.wifeResult as EntrepreneurResult
})
</script>
