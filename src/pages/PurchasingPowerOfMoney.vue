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
import {useStore} from 'vuex'
import SectionHeader from 'components/partials/SectionHeader.vue'
import PurchasingPowerOfMoneyStatistics from 'components/inflation/PurchasingPowerOfMoneyStatistics.vue'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/Footer.vue'

export default defineComponent({
  components: {
    Advert,
    Footer,
    PurchasingPowerOfMoneyStatistics,
    SectionHeader,
  },
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Siła nabywcza pieniądza')
  },
})
</script>
