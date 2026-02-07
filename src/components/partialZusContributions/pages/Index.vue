<template>
  <ModulePageLayout class="c-company">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form @submit="handleSubmit" />
    <Advert />
    <SectionHeader
      ref="scrollTarget">
      Podsumowanie
    </SectionHeader>
    <ResultList
      v-if="store.result"
      :result="store.result" />
    <div
      v-else
      class="q-pa-md">
      Brak danych
    </div>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {usePartialZusContributionStore} from 'components/partialZusContributions/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/partialZusContributions/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/partialZusContributions/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
const store = usePartialZusContributionStore()

breadcrumbStore.items = [
  {
    name: 'Składki ZUS za część miesiąca',
  },
]


lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()
}
</script>
