<template>
  <q-page
    class="q-py-md full-width c-unregisteredCompany"
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
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import SectionHeader from 'components/partials/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/unregisteredCompany/Form'
import Table from 'components/unregisteredCompany/Table'
import Statistics from 'components/unregisteredCompany/Statistics'
import Footer from 'components/Footer'
import helpers from 'src/logic/helpers'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Działalność niezarejestrowana')
    this.$store.commit('unregisteredCompany/clearAllData')
  },
  methods: {
    scrollTo () {
      helpers.scrollToElement(this.$refs.scrollTarget.$el)
    },
  },
  components: {
    SectionHeader,
    Advert,
    Form,
    Table,
    Statistics,
    Footer,
  },
}
</script>
