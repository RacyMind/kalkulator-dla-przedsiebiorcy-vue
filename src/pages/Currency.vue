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

<script>
import Advert from 'components/partials/Advert'
import CurrencyStatistics from 'components/exchangeRates/CurrencyStatistics'
import Footer from 'components/Footer'
import Form from 'components/exchangeRates/Form'
import SectionHeader from 'components/partials/SectionHeader'
import helpers from 'src/logic/helpers'

export default {
  components: {
    Advert,
    CurrencyStatistics,
    Footer,
    Form,
    SectionHeader,
  },
  created () {
    this.$store.commit('exchangeRates/setCurrency', null)
    this.$store.commit('app/setModuleTitle', this.$route.params.currency.toUpperCase())
  },
  methods: {
    scrollTo () {
      helpers.scrollToElement(this.$refs.scrollTarget.$el)
    },
  },
}
</script>
