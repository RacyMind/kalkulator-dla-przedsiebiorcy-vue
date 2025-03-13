<template>
  <ModulePageLayout class="c-percentage">
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
        :name="Tabs.Summary"
        label="Podsumowanie" />
      <q-tab
        :name="Tabs.Details"
        label="Wypłaty" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable>
      <q-tab-panel
        :name="Tabs.Summary"
        class="q-pa-none">
        <template v-if="store.result">
          <ResultList :result="store.result" />
        </template>
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Details"
        class="q-pa-none">
        <template v-if="store.result">
          <MonthlyDetailsList :result="store.result" />
        </template>
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import {QTabs} from 'quasar'
import {Ref, ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {usePolishBondsStore} from 'components/polishBonds/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/polishBonds/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import MonthlyDetailsList from 'components/polishBonds/components/MonthlyDetailsList.vue'
import ResultList from 'components/polishBonds/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

enum Tabs {
  Summary = 1,
  Details = 2,
}

const store = usePolishBondsStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Obligacje Skarbowe',
  },
]

const summary:Ref<InstanceType<typeof SectionHeader>|null> = ref(null)
const tab = ref(Tabs.Summary)
const qtabs:Ref<QTabs|null> = ref(null)

const handleSubmit = () => {
  helpers.scrollToElement(summary?.value?.$el)
}
</script>
