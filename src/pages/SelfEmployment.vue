<template>
  <q-page
    class="q-py-md full-width c-selfEmployment"
    style="max-width:800px;">
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
        :year="year"
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="scrollTo"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!grossAmount"
            outline
            @click="openModal = true"
          />
        </div>
      </SectionHeader>
      <Table :year="year" />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics :year="year" />

      <q-dialog v-model="openModal">
        <WholeYear :year="year" />
      </q-dialog>
    </div>
    <Footer />
  </q-page>
</template>

<script>
import SectionHeader from 'components/partials/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/selfEmployment/Form'
import Table from 'components/selfEmployment/Table'
import Statistics from 'components/selfEmployment/Statistics'
import WholeYear from 'components/selfEmployment/WholeYear'
import Footer from 'components/Footer'
import { mapGetters } from 'vuex'
import helpers from 'src/logic/helpers'
import ChooseYear from 'components/partials/ChooseYear'
export default {
  data () {
    return {
      openModal: false,
      year: null,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Samozatrudnienie')
    this.$store.commit('selfEmployment/resetData')

    this.year = helpers.getDefaultYear()
  },
  computed: {
    ...mapGetters({
      grossAmount: 'selfEmployment/grossAmount',
    }),
  },
  watch: {
    year () {
      this.$store.commit('selfEmployment/resetData')

      if (this.year === 2022) {
        this.$q.notify({
          message: 'Wyliczenia dla 2022 roku są szacunkowe. Nie jest znana podstawa składek ZUS na 2022 r., ani przeciętne wynagrodzenie w 4. kwartale 2021 r.',
        })
      }
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
    ChooseYear,
    Form,
    Table,
    Statistics,
    WholeYear,
    Footer,
  },
}
</script>
