<template>
  <q-page
    class="q-pa-md full-width c-exchangeRates"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-my-lg q-px-md"
        @scroll="scrollTo"
      />
      <Advert />
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
import SectionHeader from 'components/SectionHeader'
import Form from 'components/exchangeRates/Form'
import Table from 'components/interest/Table'
import Statistics from 'components/interest/Statistics'
import Advert from 'components/Advert'
import Footer from 'components/Footer'
import helpers from 'src/logic/helpers'

export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Waluta')
  },
  methods: {
    scrollTo () {
      helpers.scrollToElement(this.$refs.scrollTarget.$el)
    },
  },
  components: {
    SectionHeader,
    Form,
    Table,
    Statistics,
    Advert,
    Footer,
  },
}
</script>
