<template>
  <q-page
    class="q-py-md full-width c-contractWork"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_date_range" />
        Rok podatkowy
      </SectionHeader>
      <ChooseYear
        v-model="year"
        class="q-mt-md q-mb-lg q-px-md"/>
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="scrollTo"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <Table :year="year" />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics :year="year" />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import { ref } from 'vue'
import ChooseYear from 'src/components/ChooseYear'
import SectionHeader from 'components/partials/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/contractWork/Form'
import Table from 'components/contractWork/Table'
import Statistics from 'components/contractWork/Statistics'
import Footer from 'components/Footer'
import helpers from 'src/logic/helpers'
export default {
  setup () {
    const year = ref(helpers.getDefaultYear())
    return {
      year,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa o dzieło')
    this.$store.commit('contractWork/setAmount', null)
  },
  watch: {
    year () {
      this.$store.commit('contractWork/setAmount', null)
    },
  },
  methods: {
    scrollTo () {
      helpers.scrollToElement(this.$refs.scrollTarget.$el)
    },
  },
  components: {
    SectionHeader,
    Advert,
    Form,
    Table,
    Statistics,
    Footer,
    ChooseYear,
  },
}
</script>
