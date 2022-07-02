<template>
  <q-page
    class="q-py-md full-width c-currencyConverter"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @scroll="scrollTo"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <Table />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import Advert from 'components/partials/Advert'
import Footer from 'components/partials/Footer'
import Form from 'components/currencyConverter/Form'
import SectionHeader from 'components/partials/SectionHeader'
import Table from 'components/currencyConverter/Table'
import helpers from 'src/logic/helpers'

export default {
  components: {
    Advert,
    Footer,
    Form,
    SectionHeader,
    Table,
  },
  created () {
    this.$store.commit('app/setModuleTitle', 'Przelicznik walut')
  },
  methods: {
    scrollTo () {
      helpers.scrollToElement(this.$refs.scrollTarget.$el)
    },
  },
}
</script>
