<template>
  <ModulePageLayout class="c-company">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form @submit="handleSubmit" />
    <Advert />
    <SectionHeader
      ref="summary">
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
import {useRealBoughtCostStore} from 'components/realBoughtCosts/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/realBoughtCosts/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/realBoughtCosts/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
const store = useRealBoughtCostStore()

breadcrumbStore.items = [
  {
    name: 'Rzeczywisty koszt zakupu',
  },
]

const summary:Ref<InstanceType<typeof SectionHeader>|null> = ref(null)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  helpers.scrollToElement(summary?.value.$el)
}
</script>
