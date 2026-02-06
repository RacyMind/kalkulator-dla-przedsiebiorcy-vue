<template>
  <ModulePageLayout class="c-savings">
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
        label="Podsumowanie roczne" />
      <q-tab
        :name="Tabs.MultiYearProjection"
        label="Projekcja wieloletnia" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable>
      <q-tab-panel
        :name="Tabs.AnnualSummary"
        class="q-pa-none">
        <template v-if="store.result">
          <AnnualResultList :result="store.result.yearResults[0]" />
        </template>
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.MultiYearProjection"
        class="q-pa-none">
        <template v-if="store.result">
          <ProjectionTable :result="store.result" />
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
import {useRentalProfitStore} from 'components/rentalProfit/store'
import Advert from 'components/partials/Advert.vue'
import AnnualResultList from 'components/rentalProfit/components/AnnualResultList.vue'
import Form from 'components/rentalProfit/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ProjectionTable from 'components/rentalProfit/components/ProjectionTable.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

enum Tabs {
  AnnualSummary = 1,
  MultiYearProjection = 2,
}

const store = useRentalProfitStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Zysk z najmu',
  },
]

const tab = ref(Tabs.AnnualSummary)
const qtabs: Ref<QTabs | null> = ref(null)

const handleSubmit = () => {
  helpers.scrollToElement(qtabs?.value?.$el)
}
</script>
