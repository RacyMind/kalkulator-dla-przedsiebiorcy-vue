<template>
  <q-page
    class="q-py-md full-width c-contractOfMandate"
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
        :year="year"
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

<script lang="ts">
import {ref, watch} from 'vue'
import {mapGetters, useStore} from 'vuex'
import SectionHeader from 'components/partials/SectionHeader'
import Advert from 'components/partials/Advert'
import ChooseYear from 'components/partials/ChooseYear'
import Form from 'components/contractOfMandate/Form'
import SummarySalaryTable from 'components/contractOfMandate/SummarySalaryTable'
import EmployeeTable from 'components/contractOfMandate/EmployeeTable'
import EmployeeStatistics from 'components/contractOfMandate/EmployeeStatistics'
import EmployerTable from 'components/contractOfMandate/EmployerTable'
import EmployerStatistics from 'components/contractOfMandate/EmployerStatistics'
import WholeYearForEmployer from 'components/contractOfMandate/WholeYearForEmployer'
import WholeYearForEmployee from 'components/contractOfMandate/WholeYearForEmployee'
import Footer from 'components/Footer'
import helpers from 'src/logic/helpers'
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
export default {
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Umowa zlecenie')

    const year = ref(helpers.getDefaultYear())

    const inputFields = ref(<ContractOfMandateInputFields>{
      year: helpers.getDefaultYear(),
      grossAmount: 0,
      isReliefForYoung: false,
      accidentContributionRate: 0,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      isHealthContribution: true,
      isPensionContribution: true,
      isRentContribution: true,
      isSickContribution: true,
      isStudent: false,
      partOfWorkWithAuthorExpenses: 0,
    })

    const scrollTarget = ref(null) as any

    watch(year, () => {
      inputFields.value.grossAmount = 0
    })

    const save = (input: ContractOfMandateInputFields) => {
      inputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return {
      year,
      inputFields,
      scrollTarget,
      save,
    }
  },
  setup () {
    const year = ref(helpers.getDefaultYear())
    return {
      year,
    }
  },
  data () {
    return {
      openEmployeeModal: false,
      openEmployerModal: false,
    }
  },
  created () {
    this.$store.commit('app/setModuleTitle', 'Umowa zlecenie')
    this.$store.commit('contractOfMandate/resetData')
  },
  computed: {
    ...mapGetters({
      grossAmount: 'contractOfMandate/grossAmount',
    }),
  },
  watch: {
    year () {
      this.$store.commit('contractOfMandate/resetData')
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
    SummarySalaryTable,
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
