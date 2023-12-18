<template>
  <ModulePageLayout class="c-work">
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
        :name="Tabs.Employee"
        label="Pracownik" />
      <q-tab
        :name="Tabs.Employer"
        label="Pracodawca" />
      <q-tab
        :name="Tabs.Summary"
        label="Podsumowanie" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable>
      <q-tab-panel
        :name="Tabs.Employee"
        class="q-pa-none">
        <EmployeeTabPanel
          v-if="store.employeeResult"
          :result="store.employeeResult" />
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Employer"
        class="q-pa-none">
        <EmployerTabPanel
          v-if="store.employerResult"
          :result="store.employerResult"/>
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Summary"
        class="q-pa-none">
        <SummaryTabPanel
          v-if="store.employeeResult && store.employerResult"
          :employee-result="store.employeeResult"
          :employer-result="store.employerResult"
        />
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
import {useEmploymentContractStore} from 'components/contractOfEmployment/store'
import Advert from 'components/partials/Advert.vue'
import EmployeeTabPanel from 'components/partials/tabPanel/EmployeeTabPanel.vue'
import EmployerTabPanel from 'components/partials/tabPanel/EmployerTabPanel.vue'
import Form from 'components/contractOfEmployment/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import SummaryTabPanel from 'components/partials/tabPanel/SummaryTabPanel.vue'
import helpers from 'src/logic/helpers'

enum Tabs {
  Employee = 1,
  Employer = 2,
  Summary = 3,
}

const store = useEmploymentContractStore()
store.monthlyInputFields = undefined

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Umowa o pracę',
  },
]

const tab = ref(Tabs.Employee)
const qtabs:Ref<QTabs|null> = ref(null)

const handleSubmit = () => {
  helpers.scrollToElement(qtabs?.value?.$el)
}
</script>
