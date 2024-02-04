<template>
  <ModulePageLayout class="c-informator">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów"
      hide-separator
    >
      <LawRuleDate />
    </FormSection>
    <Advert/>
    <MinimumWageSummary />
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

const { availableDates } = useLawRuleDate()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Informacje o wynagrodzeniu',
  },
]
</script>
