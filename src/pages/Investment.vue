<template>
  <q-page
    class="q-py-md full-width c-investment"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
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
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/investment/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/investment/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Lokata',
  },
]

const inputFields = ref(<InvestmentInputFields>{
  amount: 0,
  monthCount: 0,
  rate: 0,
})

const scrollTarget = ref(null) as any

const save = (input: InvestmentInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
