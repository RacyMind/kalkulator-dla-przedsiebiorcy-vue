<template>
  <ModulePageLayout class="c-taxes">
    <template #form>
      <SectionHeader :level="2">
        Wypełnij formularz
      </SectionHeader>
      <Form
        @save="save"
      />
      <Advert/>
    </template>
    <template #results>
      <SectionHeader :level="2"
                     ref="scrollTarget">
        Podsumowanie
      </SectionHeader>
      <Summary
        :input="invoiceInputFields"
      />
      <SectionHeader :level="3">
        Wykres
      </SectionHeader>
      <Statistics
        :input="invoiceInputFields"
      />
    </template>
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
import {useConstantsStore} from 'stores/constantsStore'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const constants = useConstantsStore()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Faktura VAT',
  },
]

const invoiceInputFields = ref(<InvoiceInputFields>{
  amount: 0,
  amountType: constants.amountTypes.net,
  taxRate: 0,
})


const save = (input: InvoiceInputFields) => {
  invoiceInputFields.value = input
  scrollToResults()
}
</script>
