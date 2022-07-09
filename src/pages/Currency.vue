<template>
  <q-page
    class="q-py-md full-width c-exchangeRates"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @scroll="scrollTo"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_insights" />
        Wykres
      </SectionHeader>
      <CurrencyStatistics />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useAppStore} from 'stores/app-store'
import {useCurrencyRateStore} from 'stores/currency-rate-store'
import Advert from 'components/partials/Advert.vue'
import CurrencyStatistics from 'components/exchangeRates/CurrencyStatistics.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/exchangeRates/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

export default defineComponent({
  components: {
    Advert,
    CurrencyStatistics,
    Footer,
    Form,
    SectionHeader,
  },
  created () {
    const appStore = useAppStore()
    const currencyRateStore = useCurrencyRateStore()

    appStore.moduleTitle = this.$route.params.currency.toUpperCase()
    currencyRateStore.currencyRate = null
  },
  methods: {
    scrollTo () {
      helpers.scrollToElement(this.$refs.scrollTarget.$el)
    },
  },
})
</script>
