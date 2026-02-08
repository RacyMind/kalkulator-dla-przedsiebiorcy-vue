<template>
  <ModulePageLayout class="c-company">
    <template #form>
      <SectionHeader :level="2">
        Wypełnij formularz
      </SectionHeader>
      <Form @submit="handleSubmit" />
      <Advert />
    </template>
    <template #results>
      <SectionHeader
        :level="2"
        ref="scrollTarget">
        Podsumowanie
      </SectionHeader>
      <template
        v-if="store.taxScaleResult && store.flatTaxResult && store.lumpSUmTaxResult">
        <ListHeader>Skala podatkowa</ListHeader>
        <ResultList
          :result="store.taxScaleResult.annualResult" />
        <ListHeader>Podatek liniowy</ListHeader>
        <ResultList
          :result="store.flatTaxResult.annualResult" />
        <ListHeader>Podatek zryczałtowany</ListHeader>
        <ResultList
          :result="store.lumpSUmTaxResult.annualResult" />
        <Statistics
          :tax-scale="store.taxScaleResult.annualResult.income"
          :flat-tax="store.flatTaxResult.annualResult.income"
          :lump-sum-tax="store.lumpSUmTaxResult.annualResult.income"
        />
      </template>
      <div
        v-else
        class="q-pa-md">
        Brak danych
      </div>
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">

import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useB2BComparatorStore} from 'components/b2bComparator/store'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/b2bComparator/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/b2bComparator/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components//b2bComparator/components/Statistics.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
const store = useB2BComparatorStore()

breadcrumbStore.items = [
  {
    name: 'Porównywarka B2B',
  },
]


lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()
}
</script>
