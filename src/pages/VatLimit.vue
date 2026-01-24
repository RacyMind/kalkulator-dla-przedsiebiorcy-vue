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
      :input="inputFields"
    />
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/vatLimit/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/vatLimit/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Limit sprzedaży dla zwolnienia z VAT',
  },
]

const inputFields = ref(<VatLimitInputFields>{
  startDate: null,
})

const scrollTarget = ref(null) as any

const save = (input: VatLimitInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
