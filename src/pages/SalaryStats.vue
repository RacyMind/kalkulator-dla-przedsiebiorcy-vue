<template>
  <q-page
    class="q-py-md full-width c-informator"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_credit_card"/>
        Dane statystyczne
      </SectionHeader>
      <Summary/>
      <Advert/>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/salaryStats/Summary.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Informacje o wynagrodzeniu',
  },
]
</script>
