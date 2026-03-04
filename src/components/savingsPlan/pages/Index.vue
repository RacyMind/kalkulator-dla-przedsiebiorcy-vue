<template>
  <ModulePageLayout class="c-savings">
    <template #form>
      <SectionHeader :level="2">Wypełnij formularz</SectionHeader>
      <Form @submit="handleSubmit" />
      <Advert />
    </template>
    <template #results>
      <template v-if="store.result">
        <div class="column q-gutter-md">
          <q-card bordered flat class="overflow-hidden">
            <QTabs
              ref="scrollTarget"
              v-model="tab"
              inline-label
              class="bg-primary text-white shadow-1"
              align="justify"
            >
              <q-tab
                v-for="tool in toolTabs"
                :key="tool.value"
                :name="tool.value"
                :label="tool.label"
              />
            </QTabs>
            <q-tab-panels
              :key="tabPanelsKey"
              v-model="tab"
              animated
              :swipeable="isMobileTabMode"
            >
              <q-tab-panel
                v-for="tool in toolTabs"
                :key="tool.value"
                :name="tool.value"
                class="q-pa-none"
              >
                <q-list>
                  <ResultList :result="store.result" />
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>

          <q-card bordered flat>
            <ListHeader>Prognoza wartości portfela w czasie</ListHeader>
            <q-separator />
            <Statistics :result="store.result" />
          </q-card>

          <q-card bordered flat>
            <ListHeader>Porównanie form oszczędzania</ListHeader>
            <q-separator />
            <ScenarioComparison :result="store.result" />
          </q-card>
        </div>
      </template>
      <div v-else class="q-pa-md">Brak danych</div>
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import { QTabs } from 'quasar'
import { computed, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { lawRuleDateWatcher } from 'src/composables/lawRuleDate'
import { useResponsiveTabPanels } from 'src/composables/useResponsiveTabPanels'
import { useScrollToResults } from 'src/composables/useScrollToResults'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import { useSavingsPlanStore } from 'components/savingsPlan/store'
import {
  getSavingsPlanToolLabel,
  savingsPlanToolOrder,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/savingsPlan/components/Form.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import ResultList from 'components/savingsPlan/components/ResultList.vue'
import ScenarioComparison from 'components/savingsPlan/components/ScenarioComparison.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/savingsPlan/components/Statistics.vue'

const { scrollTarget, scrollToResults } = useScrollToResults()
const { isMobileTabMode, tabPanelsKey } = useResponsiveTabPanels()
const store = useSavingsPlanStore()
const breadcrumbStore = useBreadcrumbStore()

const activeToolStorage = useLocalStorage<SavingsPlanTool>(
  'savingsPlan/form/activeTool',
  SavingsPlanTool.Ike,
  {
    mergeDefaults: true,
  },
)

const tab = ref<SavingsPlanTool>(activeToolStorage.value)

const toolTabs = computed(() =>
  savingsPlanToolOrder.map((tool) => ({
    label: getSavingsPlanToolLabel(tool),
    value: tool,
  })),
)

breadcrumbStore.items = [
  {
    name: 'Plan oszczędzania',
  },
]

lawRuleDateWatcher(store)

watch(tab, (nextTool) => {
  activeToolStorage.value = nextTool
  store.setActiveTool(nextTool)
})

watch(
  () => store.inputFields?.activeTool,
  (activeTool) => {
    if (activeTool && activeTool !== tab.value) {
      tab.value = activeTool
    }
  },
)

const handleSubmit = () => {
  if (store.inputFields !== undefined) {
    tab.value = store.inputFields.activeTool
  }

  scrollToResults()
}
</script>
