<template>
  <ModulePageLayout class="c-currencies">
    <template #form>
      <SectionHeader :level="2">
        Wypełnij formularz
      </SectionHeader>
      <Form
        @scroll="scrollTo"
      />
      <Advert/>
    </template>
    <template #results>
      <SectionHeader :level="2">
        Wykres
      </SectionHeader>
      <CurrencyStatistics/>
    </template>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import {useCurrencyRateStore} from 'stores/currency-rate-store'
import {useRoute} from 'vue-router'
import Advert from 'components/partials/Advert.vue'
import CurrencyStatistics from 'components/exchangeRates/CurrencyStatistics.vue'
import Form from 'components/exchangeRates/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollToResults } = useScrollToResults()

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


const scrollTo = () => {
  scrollToResults()
}
</script>
