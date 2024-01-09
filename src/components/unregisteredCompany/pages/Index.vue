<template>
  <ModulePageLayout class="c-business">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form @submit="handleSubmit" />
    <Advert />
    <SectionHeader
      ref="summary"
      class="bg-primary">
      Podsumowanie
    </SectionHeader>
    <template
      v-if="store.result">
      <div class="q-px-md q-py-sm">
        <q-toggle
          v-model="showAnnualResult"
          checked-icon="check"
          unchecked-icon="clear"
          label="Pokaż cały rok"
        />
      </div>
      <template v-if="showAnnualResult">
        <ListHeader>
          {{ fullYear }}
        </ListHeader>
        <ResultList
          :result="store.result.annualResult" />
        <Separator />
        <div
          v-for="(monthlyResult, index) in store.result.monthlyResults"
          :key="index">
          <ListHeader>
            {{ monthNames[index] }}
          </ListHeader>
          <ResultList
            :result="monthlyResult" />
          <Separator v-if="index < 11" />
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
        <Separator />
        <Statistics
          :result="store.result.monthlyResults[0]" />
      </template>
    </template>
    <div
      v-else
      class="q-pa-md">
      Brak danych
    </div>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useMonths} from 'src/composables/months'
import {useUnregisteredCompanyStore} from 'components/unregisteredCompany/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/unregisteredCompany/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/unregisteredCompany/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Separator from 'components/partials/Separator.vue'
import Statistics from 'components/unregisteredCompany/components/Statistics.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
const store = useUnregisteredCompanyStore()
const {monthNames, fullYear} = useMonths()

breadcrumbStore.items = [
  {
    name: 'Działalność niezarejestrowana',
  },
]

const summary:Ref<InstanceType<typeof SectionHeader>|null> = ref(null)
const showAnnualResult = ref(false)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  helpers.scrollToElement(summary?.value.$el)
}
</script>
