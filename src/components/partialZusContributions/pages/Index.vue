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
import {Ref, ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {usePartialZusContributionStore} from 'components/partialZusContributions/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/partialZusContributions/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/partialZusContributions/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
const store = usePartialZusContributionStore()

breadcrumbStore.items = [
  {
    name: 'Składki ZUS za część miesiąca',
  },
]

const summary:Ref<InstanceType<typeof SectionHeader>|null> = ref(null)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  helpers.scrollToElement(summary?.value.$el)
}
</script>
