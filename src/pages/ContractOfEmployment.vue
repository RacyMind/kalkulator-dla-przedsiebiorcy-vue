<template>
  <q-page
    class="q-py-md full-width c-contractOfEmployment"
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
        :year="year"
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="scrollTo"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <SummarySalaryTable :year="year" />
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
            :disable="!grossAmount"
            outline
            @click="openEmployeeModal = true"
          />
        </div>
      </SectionHeader>
      <EmployeeTable :year="year" />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracownika
      </SectionHeader>
      <EmployeeStatistics :year="year" />
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
            :disable="!grossAmount"
            outline
            @click="openEmployerModal = true"
          />
        </div>
      </SectionHeader>
      <EmployerTable :year="year" />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracodawcy
      </SectionHeader>
      <EmployerStatistics :year="year" />

      <q-dialog v-model="openEmployeeModal">
        <WholeYearForEmployee :year="year" />
      </q-dialog>
      <q-dialog v-model="openEmployerModal">
        <WholeYearForEmployer :year="year" />
      </q-dialog>
    </div>
    <Footer />
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from 'src/logic/helpers'
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import ChooseYear from 'components/partials/ChooseYear'
import Form from 'components/contractOfEmployment/Form'
import SummarySalaryTable from 'components/contractOfEmployment/SummarySalaryTable'
import EmployeeTable from 'components/contractOfEmployment/EmployeeTable'
import EmployeeStatistics from 'components/contractOfEmployment/EmployeeStatistics'
import EmployerTable from 'components/contractOfEmployment/EmployerTable'
import EmployerStatistics from 'components/contractOfEmployment/EmployerStatistics'
import WholeYearForEmployee from 'components/contractOfEmployment/WholeYearForEmployee'
import WholeYearForEmployer from 'components/contractOfEmployment/WholeYearForEmployer'
import Footer from 'components/Footer'
export default {
  data () {
    return {
      openEmployeeModal: false,
      openEmployerModal: false,
      year: null,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa o pracę')
    this.$store.commit('contractOfEmployment/resetData')

    this.year = helpers.getDefaultYear()
  },
  computed: {
    ...mapGetters({
      grossAmount: 'contractOfEmployment/grossAmount',
    }),
  },
  watch: {
    year () {
      this.$store.commit('contractOfEmployment/resetData')
    },
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
    ChooseYear,
    Form,
    SummarySalaryTable,
    EmployeeTable,
    EmployeeStatistics,
    EmployerTable,
    EmployerStatistics,
    Footer,
  },
}
</script>
