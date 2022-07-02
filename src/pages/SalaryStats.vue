<template>
  <q-page
    class="q-py-md full-width c-informator"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Dane statystyczne
      </SectionHeader>
      <Summary />
      <Advert />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useStore} from 'vuex'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/Footer.vue'
import Summary from 'components/salaryStats/Summary.vue'

export default defineComponent({
  components: {
    Advert,
    Footer,
    SectionHeader,
    Summary,
  },
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Informacje o wynagrodzeniu')
  },
})
</script>
