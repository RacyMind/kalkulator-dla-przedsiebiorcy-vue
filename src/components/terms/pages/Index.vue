<template>
  <ModulePageLayout class="c-info" single-column>
    <template #form>
      <Advert />

      <section class="q-mb-md">
        <ListHeader>Terminy w US</ListHeader>
        <USSummary />
      </section>

      <q-separator class="module-separator" />

      <section class="q-mb-md">
        <ListHeader>Terminy w ZUS</ListHeader>
        <ZUSSummary />
      </section>

      <q-separator class="module-separator" />

      <section class="q-mb-md">
        <ListHeader>Terminy w PFRON</ListHeader>
        <PFRONSummary />
      </section>

      <p class="q-pa-md footer-text text-justify" style="font-size: 0.8rem">
        Ostatnia aktualizacja: 02.01.2022 r.
      </p>
    </template>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
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
