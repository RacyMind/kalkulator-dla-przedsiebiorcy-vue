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
      <template
        v-if="store.result">
        <q-list>
          <ResultList :result="store.result" />
        </q-list>
        <Separator />
        <Statistics :result="store.result" />
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
import {useContractWorkStore} from 'components/contractWork/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/contractWork/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/contractWork/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Separator from 'components/partials/Separator.vue'
import Statistics from 'components/contractWork/components/Statistics.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const store = useContractWorkStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Umowa o dzieło',
  },
]


lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()
}
</script>
