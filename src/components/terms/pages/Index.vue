<template>
  <ModulePageLayout class="c-info"
                    single-column>
    <template #form>
      <Advert/>
      <ListHeader>Terminy w US</ListHeader>
      <USSummary/>
      <ListHeader>Terminy w ZUS</ListHeader>
      <ZUSSummary/>
      <ListHeader>Terminy w PFRON</ListHeader>
      <PFRONSummary/>
      <p
        class="q-pa-md text-grey text-justify"
        style="font-size:0.8rem;">
        Ostatnia aktualizacja: 02.01.2022 r.
      </p>
    </template>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import PFRONSummary from 'components/terms/PFRONSummary.vue'
import USSummary from 'components/terms/USSummary.vue'
import ZUSSummary from 'components/terms/ZUSSummary.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Terminy w US, ZUS i PFRON',
  },
]
</script>
