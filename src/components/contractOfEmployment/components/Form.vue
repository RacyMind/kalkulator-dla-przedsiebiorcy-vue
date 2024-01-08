<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
      <LawRuleDate />
    </FormSection>
    <FormSection title="Wynagrodzenie">
      <div class="row items-end q-col-gutter-sm q-mb-sm">
        <div class="col-grow">
          <q-input
            v-model.number="amount"
            :disable="hasAmountForEachMonth"
            type="number"
            min="0"
            step="0.01"
            label="Wynagrodzenie*"
            suffix="zł"
            autofocus
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <AmountTypeSelect
          v-model="amountType"
          class="col-shrink" />
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasAmountForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne wynagrodzenie w poszczególnych miesiącach"
          />
        </div>
      </div>
      <AnnualAmountFields
        v-if="hasAmountForEachMonth"
        v-model="monthlyAmounts"
      />
    </FormSection>
    <FormSection title="Podatek dochodowy">
      <div class="row q-col-gutter-x-md">
        <div>
          <q-toggle
            v-model="hasTaxRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga podatkowa"
          />
          <Tooltip class="q-ml-sm">
            Brak naliczania podatku dochodowego dla wynagrrodzenia do {{ pln(incomeTaxConstants.taxReliefLimit) }} brutto.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
        <div>
          <q-toggle
            v-model="workInLivePlace"
            checked-icon="check"
            unchecked-icon="clear"
            label="Praca w miejscu zamieszkania"
          />
        </div>
      </div>
      <TaxFreeAmountFields
        v-model:has-tax-free-amount="hasTaxFreeAmount"
        v-model:employer-count="employerCount" />
      <AuthorExpenseFields
        v-model:are-author-expenses="areAuthorExpenses"
        v-model:part-of-work-with-author-expenses="partOfWorkWithAuthorExpenses" />
    </FormSection>
    <FormSection title="Składki ZUS">
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="accidentContributionRate"
            type="number"
            min="0"
            step="0.01"
            label="Składka wypadkowa*"
            color="brand"
            suffix="%"
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div>
          <q-toggle
            v-model="isFpContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka na Fundusz Pracy"
          />
        </div>
        <div>
          <q-toggle
            v-model="isPpkContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka na Pracownicze Plany Kapitałowe"
          />
        </div>
      </div>
      <div
        v-if="isPpkContribution"
        class="row q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model.number="employerPpkContributionRate"
            type="number"
            class="full-width"
            :min="zusConstants.employer.rates.ppkContribution.min * 100"
            :max="zusConstants.employer.rates.ppkContribution.max * 100"
            step="0.01"
            label="Pracodawca"
            color="brand"
            suffix="%"
            :rules="[
              val => !!val || '* Wpisz wartość',
            ]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="employeePpkContributionRate"
            type="number"
            class="full-width"
            :min="zusConstants.employee.rates.ppkContribution.min * 100"
            :max="zusConstants.employee.rates.ppkContribution.max * 100"
            step="0.01"
            label="Pracownik"
            color="brand"
            suffix="%"
            :rules="[
              val => !!val || '* Wpisz wartość',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {AmountTypes, useConstants} from 'src/composables/constants'
import {EmployeeCalculator} from 'components/contractOfEmployment/logic/EmployeeCalculator'
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
import {findGrossAmountUsingNetAmount} from 'components/contractOfEmployment/logic/findGrossAmountUsingNetAmount'
import {pln} from 'src/use/currencyFormat'
import {useEmploymentContractStore} from 'components/contractOfEmployment/store'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useLocalStorage} from '@vueuse/core'
import {useMonthlyAmounts} from 'src/composables/monthlyAmounts'
import {useTaxFreeAmount} from 'src/composables/taxFreeAmount'
import AmountTypeSelect from 'components/partials/form/AmountTypeSelect.vue'
import AnnualAmountFields from 'components/partials/form/AnnualAmountFields.vue'
import AuthorExpenseFields from 'components/partials/form/AuthorExpenseFields.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import TaxFreeAmountFields from 'components/partials/form/TaxFreeAmountFields.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import helpers from 'src/logic/helpers'

const emit = defineEmits(['submit'])

const store = useEmploymentContractStore()
const { availableDates } = useLawRuleDate()
const {handleValidationError} = useFormValidation()
const { zusConstants, incomeTaxConstants, wageStats } = useConstants()

// the salary section
const amount = useLocalStorage('contractOfEmployment/form/amount', wageStats.value.minimumWage(), { mergeDefaults: true })
const amountType =  useLocalStorage<AmountTypes>('contractOfEmployment/form/amountType', AmountTypes.Gross, { mergeDefaults: true })
const { monthlyAmounts, hasAmountForEachMonth } = useMonthlyAmounts(amount, 'contractOfEmployment/form')

// the income tax section
const workInLivePlace = useLocalStorage('contractOfEmployment/form/workInLivePlace', true, { mergeDefaults: true })
const areAuthorExpenses = useLocalStorage('contractOfEmployment/form/areAuthorExpenses', false, { mergeDefaults: true })
const partOfWorkWithAuthorExpenses = useLocalStorage('contractOfEmployment/form/partOfWorkWithAuthorExpenses', 100, { mergeDefaults: true })
const hasTaxRelief = useLocalStorage('contractOfEmployment/form/hasTaxRelief', false, { mergeDefaults: true })
const { employerCount, hasTaxFreeAmount } = useTaxFreeAmount('contractOfEmployment/form')

// the ZUS contribution section
const isFpContribution =  useLocalStorage('contractOfEmployment/form/isFpContribution', true, { mergeDefaults: true })
const isPpkContribution =  useLocalStorage('contractOfEmployment/form/isPpkContribution', false, { mergeDefaults: true })
const employerPpkContributionRate = useLocalStorage('contractOfEmployment/form/employerPpkContributionRate', zusConstants.value.employer.rates.ppkContribution.default * 100, { mergeDefaults: true })
const employeePpkContributionRate = useLocalStorage('contractOfEmployment/form/employeePpkContributionRate', zusConstants.value.employee.rates.ppkContribution.default * 100, { mergeDefaults: true })
const accidentContributionRate = useLocalStorage('contractOfEmployment/form/accidentContributionRate', zusConstants.value.employer.rates.accidentCContribution.default * 100, { mergeDefaults: true })

const handleFormSubmit = () => {
  if (!amount.value) {
    return
  }

  const basicInputFields: InputFields = {
    grossAmount: amount.value,
    hasTaxRelief: hasTaxRelief.value,
    partTaxReducingAmount: hasTaxFreeAmount.value ? employerCount.value * 12 : 0,
    partOfWorkWithAuthorExpenses: areAuthorExpenses.value ? helpers.round(partOfWorkWithAuthorExpenses.value / 100, 2) : 0,
    workInLivePlace: workInLivePlace.value,
    isFpContribution: isFpContribution.value,
    accidentContributionRate: helpers.round(accidentContributionRate.value / 100, 4),
    employeePpkContributionRate: isPpkContribution.value ? helpers.round(employeePpkContributionRate.value / 100, 4) : 0,
    employerPpkContributionRate: isPpkContribution.value ? helpers.round(employerPpkContributionRate.value / 100, 4) : 0,
  }

  const monhtlyInputFields: InputFields[] = []

  let sumUpAmounts = {
    sumUpTaxBasis: 0,
    sumUpContributionBasis: 0,
    sumUpAuthorExpenses: 0,
    sumUpGrossAmount: 0,
  }

  for (let i = 0; i < 12; i++) {
    const inputFields:InputFields = {...basicInputFields}

    if(amountType.value === AmountTypes.Gross && hasAmountForEachMonth.value) {
      inputFields.grossAmount = Number(monthlyAmounts.value[i])
    }

    if(amountType.value === AmountTypes.Net) {
      let netAmount = amount.value

      if(hasAmountForEachMonth.value) {
        netAmount = Number(monthlyAmounts.value[i])
      }

      inputFields.grossAmount = findGrossAmountUsingNetAmount(new EmployeeCalculator(), 0.5 * netAmount, 2 * netAmount, netAmount, basicInputFields, sumUpAmounts)
      sumUpAmounts = new EmployeeCalculator(true).setSumUpAmounts(sumUpAmounts).setInputData(inputFields).calculate().getSumUpAmounts()
    }

    monhtlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monhtlyInputFields

  emit('submit')
}

</script>
