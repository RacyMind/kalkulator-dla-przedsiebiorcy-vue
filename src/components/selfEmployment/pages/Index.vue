<template>
  <ModulePageLayout class="c-company">
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
          :name="Tabs.AnnualSummary"
          label="Cały rok" />
        <q-tab
          :name="Tabs.EachMonth"
          label="Poszczególne miesiące" />
      </QTabs>
      <q-tab-panels
        v-model="tab"
        animated
        swipeable>
        <q-tab-panel
          :name="Tabs.AnnualSummary"
          class="q-pa-none">
          <template v-if="store.result">
            <AnnualResultList :result="store.result.annualResult" />
            <Separator />
            <Statistics :result="store.result.annualResult" />
          </template>
          <div
            v-else
            class="q-pa-md">
            Brak danych
          </div>
        </q-tab-panel>
        <q-tab-panel
          :name="Tabs.EachMonth"
          class="q-pa-none">
          <template v-if="store.result">
            <div
              v-for="(monthlyResult, index) in store.result.monthlyResults"
              :key="index">
              <ListHeader>
                {{ monthNames[index] }}
              </ListHeader>
              <MonthlyResultList
                :result="monthlyResult"
                :month="index" />
              <Separator v-if="index < 11" />
            </div>
          </template>
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

import {EntrepreneurTaxSystem} from 'stores/constantsStore'
import {checkTaxThresholdCrossing} from 'src/composables/useTaxThresholdNotification'
import {QTabs} from 'quasar'
import {ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useMonths} from 'src/composables/months'
import {useSelfEmploymentStore} from 'components/selfEmployment/store'
import Advert from 'components/partials/Advert.vue'
import AnnualResultList from 'components/selfEmployment/components/AnnualResultList.vue'
import Form from 'components/selfEmployment/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import MonthlyResultList from 'components/selfEmployment/components/MonthlyResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Separator from 'components/partials/Separator.vue'
import Statistics from 'components/selfEmployment/components/Statistics.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

enum Tabs {
  AnnualSummary = 1,
  EachMonth = 2,
}

const {monthNames} = useMonths()
const store = useSelfEmploymentStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Samozatrudnienie (B2B)',
  },
]

const tab = ref(Tabs.AnnualSummary)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()

  if(store?.monthlyInputFields?.length &&  store.monthlyInputFields[0].taxSystem !== EntrepreneurTaxSystem.TaxScale) {
    return
  }

  checkTaxThresholdCrossing(store.result?.monthlyResults)
}
</script>
