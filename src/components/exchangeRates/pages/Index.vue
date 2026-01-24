<template>
  <ModulePageLayout class="c-currencies">
    <SectionHeader>
      Kursy walut
    </SectionHeader>
    <Table/>
    <Advert/>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Table from 'components/exchangeRates/Table.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Kursy walut',
  },
]
</script>
