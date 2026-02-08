<template>
  <ModulePageLayout class="c-info"
                    single-column>
    <template #form>
      <SectionHeader :level="2">
        Wykres
      </SectionHeader>
      <Advert/>
      <InflationStatistics/>
    </template>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import InflationStatistics from 'components/inflation/InflationStatistics.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Inflacja',
  },
]
</script>
