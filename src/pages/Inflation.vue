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
      <InflationStatistics />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useStore} from 'vuex'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/Footer.vue'
import InflationStatistics from 'components/inflation/InflationStatistics.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

export default defineComponent({
  components: {
    Advert,
    Footer,
    InflationStatistics,
    SectionHeader,
  },
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Inflacja')
  },
})
</script>
