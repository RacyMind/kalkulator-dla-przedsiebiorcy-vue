<template>
  <q-page
    class="q-py-md full-width c-informator"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        Terminy w US
      </SectionHeader>
      <USSummary/>
      <SectionHeader>
        Terminy w ZUS
      </SectionHeader>
      <ZUSSummary/>
      <Advert/>
      <SectionHeader>
        Terminy w PFRON
      </SectionHeader>
      <PFRONSummary/>
      <p
        class="q-pa-md text-grey text-justify"
        style="font-size:0.8rem;">
        Ostatnia aktualizacja: 02.01.2022 r.
      </p>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
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
