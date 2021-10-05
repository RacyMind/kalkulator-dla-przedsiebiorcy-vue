<template>
  <q-page
    class="q-pa-md full-width c-contractOfMandate"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-my-lg q-px-md"
        @submitted="scrollTo"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <!--      <TotalTable />-->
      <SectionHeader>
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie dla pracownika
          </div>
          <!--          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!gross"
            outline
            @click="openEmployeeModal = true"
          />-->
        </div>
      </SectionHeader>
      <EmployeeTable />
      <!--      <SectionHeader>
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
      </q-dialog>-->
    </div>
    <Footer />
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/contractOfMandate/Form'
import TotalTable from 'components/contractOfMandate/TotalTable'
import EmployeeTable from 'components/contractOfMandate/EmployeeTable'
import EmployeeStatistics from 'components/contractOfMandate/EmployeeStatistics'
import EmployerTable from 'components/contractOfMandate/EmployerTable'
import EmployerStatistics from 'components/contractOfMandate/EmployerStatistics'
import WholeYearForEmployer from 'components/contractOfMandate/WholeYearForEmployer'
import WholeYearForEmployee from 'components/contractOfMandate/WholeYearForEmployee'
import Footer from 'components/Footer'
import helpers from 'src/logic/helpers'
export default {
  data () {
    return {
      openEmployeeModal: false,
      openEmployerModal: false,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa zlecenie')
    this.$store.commit('contractOfMandate/clearData')
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
    TotalTable,
    EmployeeTable,
    EmployeeStatistics,
    EmployerTable,
    EmployerStatistics,
    WholeYearForEmployer,
    WholeYearForEmployee,
    Footer,
  },
}
</script>
