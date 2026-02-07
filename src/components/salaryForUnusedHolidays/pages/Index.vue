<template>
  <ModulePageLayout class="c-work">
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
      <ResultList
        v-if="store.result"
        :result="store.result" />
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
import {useSalaryForUnusedHolidayStore} from 'components/salaryForUnusedHolidays/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/salaryForUnusedHolidays/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/salaryForUnusedHolidays/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const store = useSalaryForUnusedHolidayStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Ekwiwalent za niewykorzystany urlop',
  },
]


lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()
}
</script>
