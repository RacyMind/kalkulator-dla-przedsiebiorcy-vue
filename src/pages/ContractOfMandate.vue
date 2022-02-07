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
        @save="save"
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
            :disable="!inputFields.grossAmount"
            outline
            @click="openEmployeeModal = true"
          />
        </div>
      </SectionHeader>
      <EmployeeSummary :input="inputFields" />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracownika
      </SectionHeader>
      <EmployeeStatistics :input="inputFields" />
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
      <!--     <EmployerTable :year="year" />
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
     </q-dialog>-->
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'
import {useStore} from 'vuex'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Advert from 'components/partials/Advert.vue'
import ChooseYear from 'components/partials/ChooseYear.vue'
import Form from 'components/contractOfMandate/Form.vue'
import SummarySalaryTable from 'components/contractOfMandate/SummarySalaryTable.vue'
import EmployeeSummary from 'components/contractOfMandate/EmployeeSummary.vue'
import EmployeeStatistics from 'components/contractOfMandate/EmployeeStatistics.vue'
import EmployerTable from 'components/contractOfMandate/EmployerTable.vue'
import EmployerStatistics from 'components/contractOfMandate/EmployerStatistics.vue'
import WholeYearForEmployer from 'components/contractOfMandate/WholeYearForEmployer.vue'
import WholeYearForEmployee from 'components/contractOfMandate/WholeYearForEmployee.vue'
import Footer from 'components/Footer.vue'
import helpers from 'src/logic/helpers'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
export default defineComponent({
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Umowa zlecenie')

    const year = ref(helpers.getDefaultYear())
    const openEmployeeModal = ref(false)
    const openEmployerModal = ref(false)
    const scrollTarget = ref(null) as any

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
      openEmployeeModal,
      openEmployerModal,
      scrollTarget,
      save,
    }
  },
  components: {
    SectionHeader,
    Advert,
    ChooseYear,
    Form,
    SummarySalaryTable,
    EmployeeSummary,
    EmployeeStatistics,
    EmployerTable,
    EmployerStatistics,
    WholeYearForEmployer,
    WholeYearForEmployee,
    Footer,
  },
})
</script>
