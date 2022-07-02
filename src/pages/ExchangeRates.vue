<template>
  <q-page
    class="q-py-md full-width c-exchangeRates"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_euro" />
        Kursy walut
      </SectionHeader>
      <Table />
      <Advert />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import Advert from 'components/partials/Advert'
import Footer from 'components/partials/Footer'
import SectionHeader from 'components/partials/SectionHeader'
import Table from 'components/exchangeRates/Table'

export default {
  components: {
    Advert,
    Footer,
    SectionHeader,
    Table,
  },
  created () {
    this.$store.commit('app/setModuleTitle', 'Kursy walut')
  },
}
</script>
