<template>
  <q-page
    class="q-py-md full-width c-contractWork"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-my-lg q-px-md"
        @submitted="scrollTo"
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
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/contractWork/Form'
import Table from 'components/contractWork/Table'
import Statistics from 'components/contractWork/Statistics'
import Footer from 'components/Footer'
import helpers from 'src/logic/helpers'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa o dzieło')
    this.$store.commit('contractWork/setAmount', null)
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
