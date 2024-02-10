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
        :name="Tabs.Summary"
        label="Podsumowanie" />
      <q-tab
        :name="Tabs.Employee"
        label="Pracownik" />
      <q-tab
        :name="Tabs.Employer"
        label="Pracodawca" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable>
      <q-tab-panel
        :name="Tabs.Summary"
        class="q-pa-none">
        <SummaryTabPanel
          v-if="employeeResult && employerResult"
          :employee-result="employeeResult"
          :employer-result="employerResult"
        />
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Employee"
        class="q-pa-none">
        <EmployeeTabPanel
          v-if="employeeResult"
          :result="employeeResult" />
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
          v-if="employerResult"
          :result="employerResult"/>
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
import {Ref, computed, ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useMandateContractStore} from 'components/contractOfMandate/store'
import Advert from 'components/partials/Advert.vue'
import EmployeeTabPanel from 'components/partials/tabPanel/EmployeeTabPanel.vue'
import EmployerTabPanel from 'components/partials/tabPanel/EmployerTabPanel.vue'
import Form from 'components/contractOfMandate/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import SummaryTabPanel from 'components/partials/tabPanel/SummaryTabPanel.vue'
import helpers from 'src/logic/helpers'

enum Tabs {
  Employee = 1,
  Employer = 2,
  Summary = 3,
}

const store = useMandateContractStore()
store.monthlyInputFields = undefined

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Umowa zlecenie',
  },
]
const tab = ref(Tabs.Summary)
const qtabs:Ref<QTabs|null> = ref(null)

const employeeResult = computed(() => store.employeeResult)
const employerResult = computed(() => store.employerResult)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  helpers.scrollToElement(qtabs?.value?.$el)
}
</script>
