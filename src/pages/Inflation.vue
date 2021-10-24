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

<script>
import SectionHeader from 'components/SectionHeader'
import Statistics from 'components/inflation/Statistics'
import Advert from 'components/Advert'
import Footer from 'components/Footer'

export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Inflacja')
  },
  components: {
    SectionHeader,
    Statistics,
    Advert,
    Footer,
  },
}
</script>
