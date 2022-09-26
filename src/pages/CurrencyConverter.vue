<template>
  <q-page
    class="q-py-md full-width c-currencyConverter"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description"/>
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @scroll="scrollTo"
      />
      <Advert/>
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card"/>
        Podsumowanie
      </SectionHeader>
      <Summary/>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/currencyConverter/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/currencyConverter/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Przelicznik walut',
  },
]

const scrollTarget = ref(null) as any

const scrollTo = () => {
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
