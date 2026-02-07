<template>
  <ModulePageLayout class="c-info"
                    single-column>
    <template #form>
      <SectionHeader :level="2">
        Wypełnij formularz
      </SectionHeader>
      <FormSection
        v-if="availableDates.length > 1"
        title="Data obowiązywania przepisów"
        hide-separator
      >
        <LawRuleDate />
      </FormSection>
      <Advert/>
    </template>
    <template #results>
      <MinimumWageSummary />
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">

import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import Advert from 'components/partials/Advert.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import MinimumWageSummary from 'components/salaryStats/components/MinimumWageSummary.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const { availableDates } = useLawRuleDate()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Informacje o wynagrodzeniu',
  },
]
</script>
