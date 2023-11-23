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
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {Ref, ref, watch} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import ChooseYear from 'components/partials/ChooseYear.vue'
import EmployeeStatistics from 'components/contractOfMandate/EmployeeStatistics.vue'
import EmployeeSummary from 'components/contractOfMandate/EmployeeSummary.vue'
import EmployerStatistics from 'components/contractOfMandate/EmployerStatistics.vue'
import EmployerSummary from 'components/contractOfMandate/EmployerSummary.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/contractOfMandate/Form.vue'
import SalarySummary from 'components/contractOfMandate/SalarySummary.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import YearlyEmployeeSummary from 'components/contractOfMandate/YearlyEmployeeSummary.vue'
import YearlyEmployerSummary from 'components/contractOfMandate/YearlyEmployerSummary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Umowa zlecenie',
  },
]

const year = ref(helpers.getDefaultYear())
const openEmployeeModal = ref(false)
const openEmployerModal = ref(false)
const scrollTarget = ref(null) as any

const inputFields: Ref<ContractOfMandateInputFields> = ref({
  accidentContributionRate: 0,
  employeePpkContributionRate: 0,
  employerPpkContributionRate: 0,
  grossAmount: 0,
  isDisabilityContribution: true,
  isFpContribution: false,
  isFreeAmount: false,
  isHealthContribution: true,
  isPensionContribution: true,
  hasTaxRelief: false,
  isSickContribution: true,
  partOfWorkWithAuthorExpenses: 0,
  year: helpers.getDefaultYear(),
})

watch(year, () => {
  inputFields.value.grossAmount = 0
})

const save = (input: ContractOfMandateInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
