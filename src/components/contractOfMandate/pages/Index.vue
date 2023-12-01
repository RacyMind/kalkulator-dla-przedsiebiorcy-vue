<template>
  <ModulePageLayout class="c-work">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form />
    <Advert />
    <q-tabs
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
        <EmployeeTabPanel />
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Employer"
        class="q-pa-none">
        <EmployerTabPanel/>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Summary"
        class="q-pa-none">
        <SummaryTabPanel/>
      </q-tab-panel>
    </q-tab-panels>
  </ModulePageLayout>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useMandateContractStore} from 'components/contractOfMandate/store'
import Advert from 'components/partials/Advert.vue'
import EmployeeAnnualResultList from 'components/partials/resultList/EmployeeAnnualResultList.vue'
import EmployeeResultList from 'components/partials/resultList/EmployeeResultList.vue'
import EmployeeTabPanel from 'components/contractOfMandate/components/EmployeeTabPanel.vue'
import EmployerAnnualResultList from 'components/partials/resultList/EmployerAnnualResultList.vue'
import EmployerResultList from 'components/partials/resultList/EmployerResultList.vue'
import EmployerTabPanel from 'components/contractOfMandate/components/EmployerTabPanel.vue'
import Form from 'components/contractOfMandate/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import SummaryTabPanel from 'components/contractOfMandate/components/SummaryTabPanel.vue'

enum Tabs {
  Employee = 1,
  Employer = 2,
  Summary = 3,
}

const store = useMandateContractStore()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Umowa zlecenie',
  },
]
const tab = ref(Tabs.Employee)
const showEmployeeAnnualResult = ref(false)
const showEmployerAnnualResult = ref(false)

const employeeAnnuaResult = computed(() => store.annualEmployeeResult)
const employeeMonthlyResult = computed(() => employeeAnnuaResult.value?.monthlyResults[0] ?? null)
const employerAnnuaResult = computed(() => store.annualEmployerResult)
const employerMonthlyResult = computed(() => employerAnnuaResult.value?.monthlyResults[0] ?? null)
</script>
