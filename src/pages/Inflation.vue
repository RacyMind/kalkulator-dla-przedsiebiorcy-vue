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
      <Statistics />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useStore} from 'vuex'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/inflation/Statistics.vue'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/Footer.vue'

export default defineComponent({
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Inflacja')
  },
  components: {
    SectionHeader,
    Statistics,
    Advert,
    Footer,
  },
})
</script>
