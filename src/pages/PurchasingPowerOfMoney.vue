<template>
  <q-page
    class="q-py-md full-width c-informator"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_insights" />
        Wykres
      </SectionHeader>
      <Advert />
      <PurchasingPowerOfMoneyStatistics />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useAppStore} from 'stores/app-store'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import PurchasingPowerOfMoneyStatistics from 'components/inflation/PurchasingPowerOfMoneyStatistics.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

export default defineComponent({
  components: {
    Advert,
    Footer,
    PurchasingPowerOfMoneyStatistics,
    SectionHeader,
  },
  setup() {
    const appStore = useAppStore()
    appStore.moduleTitle = 'Siła nabywcza pieniądza'
  },
})
</script>
