<template>
  <ModulePageLayout class="c-business">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form @submit="handleSubmit" />
    <Advert />
    <SectionHeader
      ref="summary"
      class="bg-primary">
      Podsumowanie
    </SectionHeader>
    <template
      v-if="store.taxScaleResult && store.flatTaxResult && store.lumpSUmTaxResult">
      <list-header>Skala podatkowa</list-header>
      <ResultList
        :result="store.taxScaleResult.annualResult" />
      <Separator />
      <list-header>Podatek liniowy</list-header>
      <ResultList
        :result="store.flatTaxResult.annualResult" />
      <Separator />
      <list-header>Podatek zryczałtowany</list-header>
      <ResultList
        :result="store.lumpSUmTaxResult.annualResult" />
      <Separator />
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
  </ModulePageLayout>
</template>

<script setup lang="ts">

import {Ref, ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useB2BComparatorStore} from 'components/b2bComparator/store'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/b2bComparator/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/b2bComparator/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Separator from 'components/partials/Separator.vue'
import Statistics from 'components//b2bComparator/components/Statistics.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
const store = useB2BComparatorStore()

breadcrumbStore.items = [
  {
    name: 'Porównywarka B2B',
  },
]

const summary:Ref<InstanceType<typeof SectionHeader>|null> = ref(null)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  helpers.scrollToElement(summary?.value.$el)
}
</script>
