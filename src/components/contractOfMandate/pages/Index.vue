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
    >
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
        :name="Tabs.Employee"
        :class="{'q-pa-none': employeeMonthlyResult}">
        <template v-if="employeeMonthlyResult">
          <div class="q-px-md q-py-sm">
            <q-toggle
              v-model="showEmployeeAnnualResult"
              checked-icon="check"
              unchecked-icon="clear"
              label="Pokaż cały rok"
            />
          </div>
          <EmployeeAnnualResultList
            v-if="showEmployeeAnnualResult"
            :result="employeeAnnuaResult" />
          <template v-else>
            <ListHeader title="Umowa jednorazowa" />
            <EmployeeResultList
              :result="employeeMonthlyResult" />
          </template>
        </template>
        <template v-else>Brak danych</template>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Employer"
        :class="{'q-pa-none': employerMonthlyResult}">
        <EmployerResultList v-if="employerMonthlyResult"
                            :result="employerMonthlyResult" />
        <template v-else>Brak danych.</template>
      </q-tab-panel>
    </q-tab-panels>
  </ModulePageLayout>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useMandateContractStore} from 'components/contractOfMandate/store'
import Advert from 'components/partials/Advert.vue'
import EmployeeAnnualResultList from 'components/contractOfMandate/components/EmployeeAnnualResultList.vue'
import EmployeeResultList from 'components/contractOfMandate/components/EmployeeResultList.vue'
import EmployerResultList from 'components/contractOfMandate/components/EmployerResultList.vue'
import Form from 'components/contractOfMandate/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const store = useMandateContractStore()

enum Tabs {
  Employee = 1,
  Employer = 2,
}

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Umowa zlecenie',
  },
]
const tab = ref(Tabs.Employee)
const showEmployeeAnnualResult = ref(false)

const employeeAnnuaResult = computed(() => store.annualEmployeeResult)
const employeeMonthlyResult = computed(() => employeeAnnuaResult.value?.monthlyResults[0] ?? null)
const employerMonthlyResult = computed(() => store.annualEmployerResult?.monthlyResults[0] ?? null)
</script>
