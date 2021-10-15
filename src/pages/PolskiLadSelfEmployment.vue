<template>
  <q-page
    class="q-py-md full-width c-polskiLad"
    style="max-width:800px;">
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-my-lg q-px-md"
        @scroll="scrollTo"
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
            :disable="!gross"
            outline
            @click="openModal = true"
          />
        </div>
      </SectionHeader>
      <Table />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics />

      <q-dialog v-model="openModal">
        <WholeYear />
      </q-dialog>
    </div>
    <Footer />
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/polskiLadSelfEmployment/Form'
import Table from 'components/polskiLadSelfEmployment/Table'
import Statistics from 'components/polskiLadSelfEmployment/Statistics'
import WholeYear from 'components/polskiLadSelfEmployment/WholeYear'
import Footer from 'components/Footer'
import { mapGetters } from 'vuex'
import helpers from 'src/logic/helpers'
export default {
  data () {
    return {
      openModal: false,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Samozatrudnienie - Polski Ład')
  },
  computed: {
    ...mapGetters({
      gross: 'polskiLadSelfEmployment/gross',
    }),
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
    WholeYear,
    Footer,
  },
}
</script>
