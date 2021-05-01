<template>
  <q-page
    class="q-pa-md full-width c-investment"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <Table />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Form from 'components/investment/Form'
import Table from 'components/investment/Table'
import Advert from 'components/Advert'
import Footer from 'components/Footer'

export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Lokata')
  },
  components: {
    SectionHeader,
    Form,
    Table,
    Advert,
    Footer,
  },
}
</script>
