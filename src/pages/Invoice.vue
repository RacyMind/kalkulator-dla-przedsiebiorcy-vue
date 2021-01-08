<template>
  <q-page
    class="q-pa-md full-width"
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
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import InvoiceForm from 'components/invoice/InvoiceForm'
import InvoiceTable from 'components/invoice/InvoiceTable'
import Advert from 'components/Advert'

export default {
  components: {
    SectionHeader,
    InvoiceForm,
    InvoiceTable,
    Advert
  }
}
</script>
<style>
.text-brand {
  color: #ed6d13;
}
.bg-brand {
  background: #ed6d13;
}
</style>
