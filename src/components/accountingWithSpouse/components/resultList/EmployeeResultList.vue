<template>
  <div v-if="result">
    <ListRow>
      <template #name>
        Wynagrodzenie brutto
      </template>
      <template #value>
        {{ pln(result.grossAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Koszty przychodu
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
          <div class="flex">Podatek dochodowy</div>
          <Tooltip
            v-if="result.ppkIncomeFromEmployer"
            class="q-ml-xs">
            Składka na PPK wpłacona przez pracodawcę ({{ pln(result.ppkIncomeFromEmployer ) }}) traktowana jest jako dochód od którego potrącany jset podatek.
          </Tooltip>
        </div>
      </template>
      <template #value>
        {{ pln(result.taxAmount)}}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Składki ZUS i PPK
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
        {{ pln(result.healthContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka emerytalna
      </template>
      <template #value>
        {{ pln(result.pensionContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka rentowa
      </template>
      <template #value>
        {{ pln(result.disabilityContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka chorobowa
      </template>
      <template #value>
        {{ pln(result.sickContribution)}}
      </template>
    </ListRow>
    <ListRow nested>
      <template #name>
        Składka na PPK
      </template>
      <template #value>
        {{ pln(result.ppkContribution)}}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Wynagrodzenie netto
      </template>
      <template #value>
        {{ pln(result.netAmount)}}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {EmployeeResult} from 'components/accountingWithSpouse/interfaces/EmployeeResult'
import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
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
    return store.husbandResult as EmployeeResult
  }
  return store.wifeResult as EmployeeResult
})
</script>
