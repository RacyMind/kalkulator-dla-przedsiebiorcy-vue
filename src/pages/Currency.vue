<template>
  <ModulePageLayout class="c-currencies">
    <SectionHeader>
      <q-icon name="o_description"/>
      Wypełnij formularz
    </SectionHeader>
    <Form
      class="q-mt-md q-mb-lg q-px-md"
      @scroll="scrollTo"
    />
    <Advert/>
    <SectionHeader>
      <q-icon name="o_insights"/>
      Wykres
    </SectionHeader>
    <CurrencyStatistics/>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useCurrencyRateStore} from 'stores/currency-rate-store'
import {useRoute} from 'vue-router'
import Advert from 'components/partials/Advert.vue'
import CurrencyStatistics from 'components/exchangeRates/CurrencyStatistics.vue'
import Form from 'components/exchangeRates/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

const currencyRateStore = useCurrencyRateStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()

breadcrumbStore.items = [
  {
    name: 'Kursy walut',
    to: '/kursy-walut',
  },
  {
    name: route.params.currency.toString().toUpperCase(),
  },
]

currencyRateStore.currencyRate = null

const scrollTarget = ref(null) as any

const scrollTo = () => {
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
