<template>
  <q-page
    class="q-py-md full-width c-info"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_insights"/>
        Wykres
      </SectionHeader>
      <Advert/>
      <PurchasingPowerOfMoneyStatistics/>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import PurchasingPowerOfMoneyStatistics from 'components/inflation/PurchasingPowerOfMoneyStatistics.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Siła nabywcza pieniądza',
  },
]
</script>
