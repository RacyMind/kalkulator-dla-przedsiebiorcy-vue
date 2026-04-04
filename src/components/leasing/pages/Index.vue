<template>
  <ModulePageLayout class="c-business">
    <template #form>
      <SectionHeader :level="2"> Wypełnij formularz </SectionHeader>
      <Form @submit="handleSubmit" />
      <Advert />
    </template>
    <template #results>
      <template v-if="store.result">
        <div class="column q-gutter-md">
          <QTabs
            ref="scrollTarget"
            v-model="tab"
            inline-label
            class="bg-primary text-white shadow-1"
            align="justify"
          >
            <q-tab name="summary" label="Podsumowanie" />
            <q-tab name="schedule" label="Harmonogram rat" />
          </QTabs>
          <q-tab-panels
            :key="tabPanelsKey"
            v-model="tab"
            animated
            :swipeable="isMobileTabMode"
          >
            <q-tab-panel name="summary" class="q-pa-none">
              <ResultList :result="store.result" :is-car="isCar" />
              <Statistics :result="store.result" />
            </q-tab-panel>
            <q-tab-panel name="schedule" class="q-pa-none">
              <Schedule :result="store.result" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </template>
      <div v-else class="q-pa-md">Brak danych</div>
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import { QTabs } from 'quasar'
import { computed, ref } from 'vue'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import { useLeasingStore } from 'components/leasing/store'
import { useResponsiveTabPanels } from 'src/composables/useResponsiveTabPanels'
import { useScrollToResults } from 'src/composables/useScrollToResults'
import { AssetType } from 'components/leasing/types/LeasingTypes'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/leasing/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/leasing/components/ResultList.vue'
import Schedule from 'components/leasing/components/Schedule.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/leasing/components/Statistics.vue'

const { scrollTarget, scrollToResults } = useScrollToResults()
const { isMobileTabMode, tabPanelsKey } = useResponsiveTabPanels()
const store = useLeasingStore()
const breadcrumbStore = useBreadcrumbStore()

const tab = ref('summary')

breadcrumbStore.items = [
  {
    name: 'Leasing operacyjny',
  },
]

const isCar = computed(() => store.inputFields?.assetType === AssetType.Car)

const handleSubmit = () => {
  tab.value = 'summary'
  scrollToResults()
}
</script>
