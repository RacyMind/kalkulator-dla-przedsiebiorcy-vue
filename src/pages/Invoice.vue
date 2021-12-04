<template>
  <q-page
    class="q-py-md full-width c-invoice"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="submitted"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <Table
        :input="invoiceInputFields"
      />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import { ref } from "vue"
import { useStore } from 'vuex'
import SectionHeader from 'components/SectionHeader.vue'
import Form from 'src/components/invoice/Form.vue'
import Table from 'components/invoice/Table.vue'
import Statistics from 'components/invoice/Statistics.vue'
import Advert from 'components/Advert.vue'
import Footer from 'components/Footer.vue'
import helpers from 'src/logic/helpers'
import { InvoiceInputFields } from "src/components/invoice/interfaces/InvoiceInputFields"

export default {
  setup(props:any, context:any) {
    const store = useStore()
    store.commit('app/SET_MODULE_TITLE', 'Faktura VAT')

    const invoiceInputFields = ref({
      amount: 0,
      amountType: 'net',
      taxRate: 0,
    } as InvoiceInputFields)
    const scrollTarget = ref(null)

    const submitted = (input:InvoiceInputFields) => {
      console.log('context.refs', context.refs)
      invoiceInputFields.value = input
      // helpers.scrollToElement(context.refs.scrollTarget.$el)
    }

    return{
      invoiceInputFields,
      submitted,
    }
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
