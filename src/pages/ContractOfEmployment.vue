<template>
  <q-page
    class="q-py-md full-width c-work"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_date_range"/>
        Rok podatkowy
      </SectionHeader>
      <ChooseYear
        v-model="year"
        class="q-mt-md q-mb-lg q-px-md"/>
      <SectionHeader>
        <q-icon name="o_description"/>
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        :year="year"
        @save="save"
      />
      <Advert/>
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card"/>
        Podsumowanie
      </SectionHeader>
      <SalarySummary :input="inputFields"/>
      <SectionHeader>
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card"/>
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
      <EmployeeSummary :input="inputFields"/>
      <SectionHeader>
        <q-icon name="o_pie_chart"/>
        Wykres dla pracownika
      </SectionHeader>
      <EmployeeStatistics :input="inputFields"/>
      <Advert/>
      <SectionHeader>
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card"/>
            Podsumowanie dla pracodawcy
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!inputFields.grossAmount"
            outline
            @click="openEmployerModal = true"
          />
        </div>
      </SectionHeader>
      <EmployerSummary :input="inputFields"/>
      <SectionHeader>
        <q-icon name="o_pie_chart"/>
        Wykres dla pracodawcy
      </SectionHeader>
      <EmployerStatistics :input="inputFields"/>

      <q-dialog v-model="openEmployeeModal">
        <YearlyEmployeeSummary :input="inputFields"/>
      </q-dialog>
      <q-dialog v-model="openEmployerModal">
        <YearlyEmployerSummary :input="inputFields"/>
      </q-dialog>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import {ref, watch} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import ChooseYear from 'components/partials/ChooseYear.vue'
import EmployeeStatistics from 'components/contractOfEmployment/EmployeeStatistics.vue'
import EmployeeSummary from 'components/contractOfEmployment/EmployeeSummary.vue'
import EmployerStatistics from 'components/contractOfEmployment/EmployerStatistics.vue'
import EmployerSummary from 'components/contractOfEmployment/EmployerSummary.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/contractOfEmployment/Form.vue'
import SalarySummary from 'components/contractOfEmployment/SalarySummary.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import YearlyEmployeeSummary from 'components/contractOfEmployment/YearlyEmployeeSummary.vue'
import YearlyEmployerSummary from 'components/contractOfEmployment/YearlyEmployerSummary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Umowa o pracę',
  },
]

const year = ref(helpers.getDefaultYear())
const openEmployeeModal = ref(false)
const openEmployerModal = ref(false)
const scrollTarget = ref(null) as any

const inputFields = ref(<ContractOfEmploymentInputFields>{
  accidentContributionRate: 0,
  employeePpkContributionRate: 0,
  employerPpkContributionRate: 0,
  grossAmount: 0,
  isFpContribution: false,
  isFreeAmount: true,
  isReliefForBigFamily: false,
  isReliefForSenior: false,
  isReliefForYoung: false,
  partOfWorkWithAuthorExpenses: 0,
  workInLivePlace: true,
  year: helpers.getDefaultYear(),
})

watch(year, () => {
  inputFields.value.grossAmount = 0
})

const save = (input: ContractOfEmploymentInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
