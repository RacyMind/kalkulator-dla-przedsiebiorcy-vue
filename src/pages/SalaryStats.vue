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
import {useAppStore} from 'stores/app-store'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/salaryStats/Summary.vue'

export default defineComponent({
  components: {
    Advert,
    Footer,
    SectionHeader,
    Summary,
  },
  setup() {
    const appStore = useAppStore()
    appStore.moduleTitle = 'Informacje o wynagrodzeniu'
  },
})
</script>
