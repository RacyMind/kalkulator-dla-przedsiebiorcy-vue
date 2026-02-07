<template>
  <ModulePageLayout class="c-taxes">
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
          :name="Tabs.Joint"
          label="Wspólnie" />
        <q-tab
          :name="Tabs.Husband"
          label="Mąż" />
        <q-tab
          :name="Tabs.Wife"
          label="Żona" />
      </QTabs>
      <q-tab-panels
        v-model="tab"
        animated
        swipeable>
        <q-tab-panel
          :name="Tabs.Joint"
          class="q-pa-none">
          <JointResultList v-if="store.jointResult" />
          <div
            v-else
            class="q-pa-md">
            Brak danych
          </div>
          <Separator/>
          <Statistics v-if="store.jointResult" />
        </q-tab-panel>
        <q-tab-panel
          :name="Tabs.Husband"
          class="q-pa-none">
          <SpouseResultList
            v-if="store.husbandResult"
            :spouse="Spouse.Husband"
          />
          <div
            v-else
            class="q-pa-md">
            Brak danych
          </div>
        </q-tab-panel>
        <q-tab-panel
          :name="Tabs.Wife"
          class="q-pa-none">
          <SpouseResultList
            v-if="store.wifeResult"
            :spouse="Spouse.Wife"
          />
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
import {QTabs} from 'quasar'
import {ref} from 'vue'
import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {lawRuleDateWatcher} from 'src/composables/lawRuleDate'
import {useAccountingWithSpouseStore} from 'components/accountingWithSpouse/store'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/accountingWithSpouse/components/Form.vue'
import JointResultList from 'components/accountingWithSpouse/components/resultList/JointResultList.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Separator from 'components/partials/Separator.vue'
import SpouseResultList from 'components/accountingWithSpouse/components/resultList/SpouseResultList.vue'
import Statistics from 'components/accountingWithSpouse/components/Statistics.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
const store = useAccountingWithSpouseStore()

breadcrumbStore.items = [
  {
    name: 'Rozliczenie z małżonkiem',
  },
]

enum Tabs {
  Joint = 1,
  Husband = 2,
  Wife = 3,
}

const tab = ref(Tabs.Joint)

lawRuleDateWatcher(store)

const handleSubmit = () => {
  scrollToResults()
}
</script>
