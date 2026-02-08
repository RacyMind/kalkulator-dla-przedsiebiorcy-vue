<template>
  <ModulePageLayout class="c-work">
    <template #form>
      <SectionHeader :level="2">
        Wypełnij formularz
      </SectionHeader>
      <Form @submit="handleSubmit" />
      <Advert />
    </template>
    <template #results>
      <QTabs
        ref="scrollTarget"
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
      </QTabs>
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
    </template>
  </ModulePageLayout>
</template>
<script setup lang="ts">
import {checkTaxThresholdCrossing} from 'src/composables/useTaxThresholdNotification'
import {QTabs} from 'quasar'
import {computed, ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useEmploymentContractStore} from 'components/contractOfEmployment/store'
import Advert from 'components/partials/Advert.vue'
import EmployeeTabPanel from 'components/partials/tabPanel/EmployeeTabPanel.vue'
import EmployerTabPanel from 'components/partials/tabPanel/EmployerTabPanel.vue'
import Form from 'components/contractOfEmployment/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import SummaryTabPanel from 'components/partials/tabPanel/SummaryTabPanel.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

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

const tab = ref(Tabs.Summary)

const employeeResult = computed(() => store.employeeResult)
const employerResult = computed(() => store.employerResult)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()

  checkTaxThresholdCrossing(employeeResult.value?.monthlyResults)
}
</script>
