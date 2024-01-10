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
  </ModulePageLayout>
</template>

<script setup lang="ts">

import {Ref, ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useB2BComparatorStore} from 'components/b2bComparator/store'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/b2bComparator/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
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
