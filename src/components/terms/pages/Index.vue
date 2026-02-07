<template>
  <ModulePageLayout class="c-info"
                    single-column>
    <template #form>
      <SectionHeader :level="2">
        Terminy w US
      </SectionHeader>
      <USSummary/>
      <SectionHeader :level="2">
        Terminy w ZUS
      </SectionHeader>
      <ZUSSummary/>
      <Advert/>
      <SectionHeader :level="2">
        Terminy w PFRON
      </SectionHeader>
      <PFRONSummary/>
      <p
        class="q-pa-md text-grey text-justify"
        style="font-size:0.8rem;">
        Ostatnia aktualizacja: 02.01.2022 r.
      </p>
    </template>
    <template #results>
    </template>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import PFRONSummary from 'components/terms/PFRONSummary.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import USSummary from 'components/terms/USSummary.vue'
import ZUSSummary from 'components/terms/ZUSSummary.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Terminy w US, ZUS i PFRON',
  },
]
</script>
