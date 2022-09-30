<template>
  <q-page
    class="q-py-md full-width c-percentage"
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
      <SectionHeader>
        <q-icon name="o_pie_chart"/>
        Wykres
      </SectionHeader>
      <Statistics
        :input="inputFields"
      />
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/interest/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/interest/Statistics.vue'
import Summary from 'components/interest/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Odsetki',
  },
]

const inputFields = ref(<InterestInputFields>{
  amount: 0,
  dayCount: 0,
  rate: 0,
})

const scrollTarget = ref(null) as any

const save = (input: InterestInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
