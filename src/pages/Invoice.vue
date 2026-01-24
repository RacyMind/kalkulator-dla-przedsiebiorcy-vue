<template>
  <ModulePageLayout class="c-business">
    <SectionHeader>
      <q-icon name="o_description"/>
      Wypełnij formularz
    </SectionHeader>
    <Form
      class="q-mt-md q-mb-lg q-px-md"
      @save="save"
    />
    <Advert/>
    <SectionHeader ref="scrollTarget">
      <q-icon name="o_credit_card"/>
      Podsumowanie
    </SectionHeader>
    <Summary
      :input="invoiceInputFields"
    />
    <SectionHeader>
      <q-icon name="o_pie_chart"/>
      Wykres
    </SectionHeader>
    <Statistics
      :input="invoiceInputFields"
    />
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {InvoiceInputFields} from 'src/components/invoice/interfaces/InvoiceInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'src/components/invoice/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/invoice/Statistics.vue'
import Summary from 'components/invoice/Summary.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Faktura VAT',
  },
]

const invoiceInputFields = ref(<InvoiceInputFields>{
  amount: 0,
  amountType: constants.AMOUNT_TYPES.NET,
  taxRate: 0,
})

const scrollTarget = ref(null) as any

const save = (input: InvoiceInputFields) => {
  invoiceInputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
