<template>
  <q-page
    class="q-pa-md full-width c-exchangeRates"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_euro" />
        Kursy walut
      </SectionHeader>
      <Advert />
      <Table />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Table from 'components/exchangeRates/Table'
import Advert from 'components/Advert'
import Footer from 'components/Footer'

export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Kursy walut')
  },
  components: {
    SectionHeader,
    Table,
    Advert,
    Footer,
  },
}
</script>
