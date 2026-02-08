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
      <SectionHeader
        :level="2"
        ref="scrollTarget">
        Podsumowanie
      </SectionHeader>
      <template
        v-if="store.result">
        <div class="q-px-md q-py-sm">
          <q-toggle
            v-model="showAnnualResult"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Pokaż cały rok"
          />
        </div>
        <template v-if="showAnnualResult">
          <ListHeader>
            {{ fullYear }}
          </ListHeader>
          <ResultList
            :result="store.result.annualResult" />
          <div
            v-for="(monthlyResult, index) in store.result.monthlyResults"
            :key="index">
            <ListHeader>
              {{ monthNames[index] }}
            </ListHeader>
            <ResultList
              :result="monthlyResult" />
          </div>
        </template>
        <template v-else>
          <ListHeader>
            Jeden miesiąc
            <Tooltip color="white">
              Do obliczeń brana jest pod uwagę kwota z 1. miesiąca
            </Tooltip>
          </ListHeader>
          <ResultList
            :result="store.result.monthlyResults[0]" />
          <Statistics
            :result="store.result.monthlyResults[0]" />
        </template>
      </template>
      <div
        v-else
        class="q-pa-md">
        Brak danych
      </div>
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useMonths} from 'src/composables/months'
import {useUnregisteredCompanyStore} from 'components/unregisteredCompany/store'
import {matCheck, matClear} from 'src/icons'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/unregisteredCompany/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/unregisteredCompany/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/unregisteredCompany/components/Statistics.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
const store = useUnregisteredCompanyStore()
const {monthNames, fullYear} = useMonths()

breadcrumbStore.items = [
  {
    name: 'Działalność niezarejestrowana',
  },
]

const showAnnualResult = ref(false)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()
}
</script>
