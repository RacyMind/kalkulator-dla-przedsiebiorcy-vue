<template>
  <ModulePageLayout class="c-savings">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <FormFields @submit="handleSubmit" />
    <Advert />
    <div v-if="store.result"
         ref="summary">
      <IkeLimitWarning :result="store.result" />
      <ListHeader>Okres oszczędzania</ListHeader>
      <SavingsPeriodSection :result="store.result" />
      <Separator />
      <ListHeader>Przewidywany kapitał</ListHeader>
      <CapitalSection :result="store.result" />
      <Separator />
      <ListHeader>Oszczędność podatkowa</ListHeader>
      <TaxSavingSection :result="store.result" />
      <Separator />
      <ListHeader>Emerytura</ListHeader>
      <PensionSection :result="store.result" />
    </div>
    <div v-else
         class="q-pa-md">
      Brak danych
    </div>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import { Ref, nextTick, ref } from 'vue'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import { useIkeSavingsStore } from '../store'
import Advert from 'components/partials/Advert.vue'
import CapitalSection from '../components/results/CapitalSection.vue'
import FormFields from '../components/FormFields.vue'
import IkeLimitWarning from '../components/results/IkeLimitWarning.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import PensionSection from '../components/results/PensionSection.vue'
import SavingsPeriodSection from '../components/results/SavingsPeriodSection.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Separator from 'components/partials/Separator.vue'
import TaxSavingSection from '../components/results/TaxSavingSection.vue'
import helpers from 'src/logic/helpers'

const store = useIkeSavingsStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Kalkulator IKE',
  },
]

const summary: Ref<HTMLElement | null> = ref(null)

const handleSubmit = async () => {
  await nextTick()
  if (!summary.value) {
    return
  }

  helpers.scrollToElement(summary.value)
}
</script>
