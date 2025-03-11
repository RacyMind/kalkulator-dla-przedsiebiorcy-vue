<template>
  <ModulePageLayout class="polish-bonds">
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
      v-if="store.result">
      <ResultList :result="store.result" />
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
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {usePolishBondsStore} from 'components/polishBonds/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/polishBonds/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/polishBonds/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

const store = usePolishBondsStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Obligacje Skarbowe',
  },
]

const summary:Ref<InstanceType<typeof SectionHeader>|null> = ref(null)

const handleSubmit = () => {
  helpers.scrollToElement(summary?.value?.$el)
}
</script>
