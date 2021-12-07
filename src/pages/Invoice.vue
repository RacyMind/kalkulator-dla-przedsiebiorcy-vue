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
        @submit="submit"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <Summary
        :input="invoiceInputFields"
      />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics
        :input="invoiceInputFields"
      />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import SectionHeader from 'components/SectionHeader.vue'
import Form from 'src/components/invoice/Form.vue'
import Summary from 'components/invoice/Summary.vue'
import Statistics from 'components/invoice/Statistics.vue'
import Advert from 'components/Advert.vue'
import Footer from 'components/Footer.vue'
import helpers from 'src/logic/helpers'
import { InvoiceInputFields } from 'src/components/invoice/interfaces/InvoiceInputFields'
import constants from 'src/logic/constants'

export default {
  setup() {
    const store = useStore()
    store.commit('app/SET_MODULE_TITLE', 'Faktura VAT')
    let net = 'net'

    const invoiceInputFields = ref(<InvoiceInputFields>{
      amount: 0,
      amountType: constants.AMOUNT_TYPES.NET,
      taxRate: 0,
    })

    const scrollTarget = ref(null) as any

    const submit = (input:InvoiceInputFields) => {
      invoiceInputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return{
      invoiceInputFields,
      scrollTarget,
      submit,
    }
  },
  components: {
    SectionHeader,
    Form,
    Summary,
    Statistics,
    Advert,
    Footer,
  },
}
</script>
