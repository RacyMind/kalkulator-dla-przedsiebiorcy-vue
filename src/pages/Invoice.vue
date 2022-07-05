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
        @save="save"
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
import { InvoiceInputFields } from 'src/components/invoice/interfaces/InvoiceInputFields'
import {defineComponent, ref} from 'vue'
import {useAppStore} from 'stores/app-store'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'src/components/invoice/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/invoice/Statistics.vue'
import Summary from 'components/invoice/Summary.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

export default defineComponent({
  components: {
    Advert,
    Footer,
    Form,
    SectionHeader,
    Statistics,
    Summary,
  },
  setup() {
    const appStore = useAppStore()
    appStore.moduleTitle = 'Faktura VAT'

    const invoiceInputFields = ref(<InvoiceInputFields>{
      amount: 0,
      amountType: constants.AMOUNT_TYPES.NET,
      taxRate: 0,
    })

    const scrollTarget = ref(null) as any

    const save = (input:InvoiceInputFields) => {
      invoiceInputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return{
      invoiceInputFields,
      save,
      scrollTarget,
    }
  },
})
</script>
