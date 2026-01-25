<template>
  <ModulePageLayout class="c-app">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form />
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Form from 'components/contact/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Formularz kontaktowy',
  },
]
</script>
