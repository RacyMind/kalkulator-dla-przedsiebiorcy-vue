<template>
  <ModulePageLayout class="c-savings">
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
        v-if="store.result">
        <ResultList :result="store.result" />
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
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useIkzeTaxReliefStore} from 'components/ikzeTaxRelief/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/ikzeTaxRelief/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/ikzeTaxRelief/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const store = useIkzeTaxReliefStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Ulga podatkowa IKZE',
  },
]


lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()
}
</script>
