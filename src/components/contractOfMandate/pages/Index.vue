<template>
  <ModulePageLayout class="c-work">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form />
  </ModulePageLayout>
</template>
<script setup lang="ts">
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Form from 'components/contractOfMandate/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Umowa zlecenie',
  },
]
</script>
