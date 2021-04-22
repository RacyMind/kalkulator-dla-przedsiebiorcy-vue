<template>
  <q-page
    class="q-pa-md full-width c-invoice"
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
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Form from 'components/invoice/Form'
import Table from 'components/invoice/Table'
import Statistics from 'components/invoice/Statistics'
import Advert from 'components/Advert'

export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Faktura VAT')
  },
  components: {
    SectionHeader,
    Form,
    Table,
    Statistics,
    Advert,
  },
}
</script>
