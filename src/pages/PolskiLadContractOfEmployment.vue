<template>
  <q-page
    class="q-py-md full-width c-polskiLad"
    style="max-width:800px;"
  >
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
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <TotalTable />
      <SectionHeader>
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie dla pracownika
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!gross"
            outline
            @click="openEmployeeModal = true"
          />
        </div>
      </SectionHeader>
      <EmployeeTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracownika
      </SectionHeader>
      <EmployeeStatistics />
      <Advert />
      <SectionHeader>
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie dla pracodawcy
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!gross"
            outline
            @click="openEmployerModal = true"
          />
        </div>
      </SectionHeader>
      <EmployerTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracodawcy
      </SectionHeader>
      <EmployerStatistics />

      <q-dialog v-model="openEmployeeModal">
        <WholeYearForEmployee />
      </q-dialog>
      <q-dialog v-model="openEmployerModal">
        <WholeYearForEmployer />
      </q-dialog>
    </div>
    <Footer />
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/polskiLadContractOfEmployment/Form'
import TotalTable from 'components/polskiLadContractOfEmployment/TotalTable'
import EmployeeTable from 'components/polskiLadContractOfEmployment/EmployeeTable'
import EmployeeStatistics from 'components/polskiLadContractOfEmployment/EmployeeStatistics'
import EmployerTable from 'components/polskiLadContractOfEmployment/EmployerTable'
import EmployerStatistics from 'components/polskiLadContractOfEmployment/EmployerStatistics'
import WholeYearForEmployee from 'components/polskiLadContractOfEmployment/WholeYearForEmployee'
import WholeYearForEmployer from 'components/polskiLadContractOfEmployment/WholeYearForEmployer'
import Footer from 'components/Footer'
import { mapGetters } from 'vuex'
import helpers from 'src/logic/helpers'
export default {
  data () {
    return {
      openEmployeeModal: false,
      openEmployerModal: false,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa o pracę - Polski Ład')
  },
  computed: {
    ...mapGetters({
      gross: 'polskiLadContractOfEmployment/gross',
    }),
  },
  methods: {
    scrollTo () {
      helpers.scrollToElement(this.$refs.scrollTarget.$el)
    },
  },
  components: {
    WholeYearForEmployee,
    WholeYearForEmployer,
    SectionHeader,
    Advert,
    Form,
    TotalTable,
    EmployeeTable,
    EmployeeStatistics,
    EmployerTable,
    EmployerStatistics,
    Footer,
  },
}
</script>
