<template>
  <ModulePageLayout class="c-business">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form @submit="handleSubmit" />
    <Advert />
    <q-tabs
      ref="qtabs"
      v-model="tab"
      inline-label
      class="bg-primary text-white shadow-2"
      :breakpoint="0"
      align="justify">
      <q-tab
        :name="Tabs.AnnualSummary"
        label="Cały rok" />
      <q-tab
        :name="Tabs.EachMonnth"
        label="Poszczególne miesiące" />
    </q-tabs>
  </ModulePageLayout>
</template>

<script setup lang="ts">

import {QTabs} from 'quasar'
import {Ref, ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/selfEmployment/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

enum Tabs {
  AnnualSummary = 1,
  EachMonnth = 2,
}

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Samozatrudnienie (B2B)',
  },
]

const tab = ref(Tabs.AnnualSummary)
const qtabs:Ref<QTabs|null> = ref(null)

const handleSubmit = () => {
  helpers.scrollToElement(qtabs?.value?.$el)
}
</script>
