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
      <InvoiceForm
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <InvoiceTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <InvoiceStatistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import InvoiceForm from 'components/invoice/InvoiceForm'
import InvoiceTable from 'components/invoice/InvoiceTable'
import InvoiceStatistics from 'components/invoice/InvoiceStatistics'
import Advert from 'components/Advert'

export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Faktura VAT')
  },
  components: {
    SectionHeader,
    InvoiceForm,
    InvoiceTable,
    InvoiceStatistics,
    Advert,
  },
}
</script>
