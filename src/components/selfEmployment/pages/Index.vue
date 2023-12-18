<template>
  <ModulePageLayout class="c-business">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form />
  </ModulePageLayout>
</template>

<script setup lang="ts">

import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Form from 'components/selfEmployment/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Samozatrudnienie (B2B)',
  },
]
</script>
