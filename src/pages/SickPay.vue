<template>
  <q-page
    class="q-py-md full-width c-sickPay"
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
import SectionHeader from 'components/partials/SectionHeader'
import Form from 'components/sickPay/Form'
import Table from 'components/sickPay/Table'
import Advert from 'components/Advert'
import Footer from 'components/Footer'
import helpers from 'src/logic/helpers'

export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Zasiłek chorobowy')
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
    Advert,
    Footer,
  },
}
</script>
