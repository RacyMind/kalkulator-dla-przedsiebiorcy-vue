<template>
  <q-page
    class="q-py-md full-width c-business"
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
        :input="unregisteredCompanyInputFields"
      />
      <SectionHeader>
        <q-icon name="o_pie_chart"/>
        Wykres
      </SectionHeader>
      <Statistics
        :input="unregisteredCompanyInputFields"
      />
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/unregisteredCompany/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/unregisteredCompany/Statistics.vue'
import Summary from 'components/unregisteredCompany/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Działalność niezarejestrowana',
  },
]

const unregisteredCompanyInputFields = ref(<InputFields>{
  expenses: 0,
  incomeAmount: 0,
})

const scrollTarget = ref(null) as any

const save = (input: InputFields) => {
  unregisteredCompanyInputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
