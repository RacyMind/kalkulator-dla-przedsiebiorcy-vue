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
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="isHourlyAmount"
            :disable="hasAmountForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Stawka godzinowa"
          />
        </div>
      </div>
      <div
        v-if="isHourlyAmount"
        class="row items-center q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model.number="hourlyAmount"
            :autofocus="isHourlyAmount"
            :disable="hasAmountForEachMonth"
            type="number"
            min="0"
            step="0.01"
            label="Stawka godzinowa*"
            suffix="zł"
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="hourCount"
            :disable="hasAmountForEachMonth"
            type="number"
            class="full-width"
            min="1"
            step="1"
            label="Ilość godzin*"
            color="brand"
            :rules="[
              val => !!val || '* Wpisz ilość godzin',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row items-center q-col-gutter-sm q-mb-sm">
        <div class="col-grow">
          <q-input
            v-model.number="amount"
            :disable="isHourlyAmount || hasAmountForEachMonth"
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
            Brak naliczania podatku dochodowego dla wynagrrodzenia do {{ pln(incomeTaxConstnts.taxReliefLimit) }} brutto.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
        <div>
          <q-toggle
            v-model="canLumpSumTaxBe"
            checked-icon="check"
            unchecked-icon="clear"
            label="Możliwy podatek zryczałtowany"
          />
          <Tooltip class="q-ml-sm">
            Podatek zryczałtowany obowiązuje dla wynagrrodzenia do {{ pln(incomeTaxConstnts.taxScale.expenses.withoutExpensesUpTo) }} brutto. Podatek zryczałtowany <b>nie obowiązuje</b> w 2 sytuacjach:
            <ul>
              <li>gdy zleceniobiorca jest pracownikiem firmy,</li>
              <li>umowa ze stawką za wykonaną jednostkę - np. stawka za godzinę pracy lub na "akord".</li>
            </ul>
          </Tooltip>
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
          <q-select
            v-model="contributionScheme"
            :options="contributionSchemeOptions"
            emit-value
            map-options
            label="Schemat składek ZUS" />
        </div>
      </div>
      <div class="row items-center q-col-gutter-sm">
        <div class="col-6 col-sm-3">
          <q-toggle
            v-model="isHealthContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka zdrowotna"
          />
        </div>
        <div class="col-6 col-sm-3">
          <q-toggle
            v-model="isDisabilityContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka rentowa"
          />
        </div>
        <div class="col-6 col-sm-3">
          <q-toggle
            v-model="isPensionContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka emerytalna"
          />
        </div>
        <div class="col-6 col-sm-3">
          <q-toggle
            v-model="isSickContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka chorobowa"
          />
        </div>
      </div>
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
import {EmployeeCalculator} from 'components/contractOfMandate/logic/EmployeeCalculator'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import {Ref, ref, watch} from 'vue'
import {findGrossAmountUsingNetAmount} from 'src/logic/findGrossAmountUsingNetAmount'
import {pln} from '../../../use/currencyFormat'
import {useAmmmountType} from 'src/composables/amountType'
import {useFormValidation} from 'src/composables/formValidation'
import {useHourlyAmount} from 'src/composables/hourlyAmount'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useMandateContractStore} from 'components/contractOfMandate/store'
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

const store = useMandateContractStore()
const {handleValidationError} = useFormValidation()
const { availableDates } = useLawRuleDate()
const { zusConstants, incomeTaxConstnts } = useConstants()

enum ContributionSchemes {
  Unemployed = 1,
  ContractWithEmployer = 2,
  Student = 3,
  Pensioner = 4,
  ContractorWorksInAnotherCompany = 5,
}

const contributionSchemeOptions = [
  {
    label: 'Osoba bez innego zatrudnienia',
    value: ContributionSchemes.Unemployed,
  },
  {
    label: 'Dodatkowa umowa z obecnym pracodawcą',
    value: ContributionSchemes.ContractWithEmployer,
  },
  {
    label: 'Uczeń lub student do 26. roku życia',
    value: ContributionSchemes.Student,
  },
  {
    label: 'Emeryt lub rencista',
    value: ContributionSchemes.Pensioner,
  },
  {
    label: 'Pracownik innej firmy z wynagrodzeniem co najmniej w wysokości pensji minimalnej',
    value: ContributionSchemes.ContractorWorksInAnotherCompany,
  },
]

// the salary section
const amount:Ref<number|null> = ref(null)
const {hourCount, hourlyAmount, isHourlyAmount} = useHourlyAmount(amount)
const amountType = useAmmmountType()
const { monthlyAmounts, hasAmountForEachMonth } = useMonthlyAmounts(amount)

// the income tax section
const areAuthorExpenses = ref(false)
const partOfWorkWithAuthorExpenses = ref(100)
const hasTaxRelief = ref(false)
const { employerCount, hasTaxFreeAmount } = useTaxFreeAmount()
const canLumpSumTaxBe = ref(true)

// the ZUS contribution section
const contributionScheme:Ref<ContributionSchemes> = ref(ContributionSchemes.Unemployed)
const isHealthContribution = ref(true)
const isSickContribution = ref(true)
const isDisabilityContribution = ref(true)
const isPensionContribution = ref(true)
const isFpContribution = ref(false)
const isPpkContribution = ref(false)
const employerPpkContributionRate = ref(zusConstants.value.employer.rates.ppkContribution.default * 100)
const employeePpkContributionRate = ref(zusConstants.value.employee.rates.ppkContribution.default * 100)
const accidentContributionRate = ref(zusConstants.value.employer.rates.accidentCContribution.default * 100)

watch(isHourlyAmount, () => {
  if (isHourlyAmount.value) {
    canLumpSumTaxBe.value = false
  } else {
    canLumpSumTaxBe.value = true
  }
})

watch(contributionScheme, () => {
  switch (contributionScheme.value) {
    case ContributionSchemes.Unemployed:
      isHealthContribution.value = true
      isSickContribution.value = false
      isDisabilityContribution.value = true
      isPensionContribution.value = true
      isFpContribution.value = true
      accidentContributionRate.value = zusConstants.value.employer.rates.accidentCContribution.default * 100
      break
    case ContributionSchemes.ContractWithEmployer:
      isHealthContribution.value = true
      isSickContribution.value = true
      isDisabilityContribution.value = true
      isPensionContribution.value = true
      isFpContribution.value = true
      accidentContributionRate.value = zusConstants.value.employer.rates.accidentCContribution.default * 100
      break
    case ContributionSchemes.Student:
      isHealthContribution.value = false
      isSickContribution.value = false
      isDisabilityContribution.value = false
      isPensionContribution.value = false
      isFpContribution.value = false
      isPpkContribution.value = false
      accidentContributionRate.value = 0
      break
    case ContributionSchemes.Pensioner:
      isHealthContribution.value = true
      isSickContribution.value = false
      isDisabilityContribution.value = true
      isPensionContribution.value = true
      isFpContribution.value = false
      accidentContributionRate.value = zusConstants.value.employer.rates.accidentCContribution.default * 100
      break
    case ContributionSchemes.ContractorWorksInAnotherCompany:
      isHealthContribution.value = true
      isSickContribution.value = false
      isDisabilityContribution.value = false
      isPensionContribution.value = false
      isFpContribution.value = false
      isPpkContribution.value = false
      accidentContributionRate.value = 0
      break
  }
}, {immediate: true})

const handleFormSubmit = () => {
  if(!amount.value) {
    return
  }

  const basicInputFields: InputFields = {
    grossAmount: amount.value ,
    hasTaxRelief: hasTaxRelief.value,
    partTaxReducingAmount: hasTaxFreeAmount.value ? employerCount.value * 12 : 0,
    canLumpSumTaxBe: true,
    partOfWorkWithAuthorExpenses: areAuthorExpenses.value ? helpers.round(partOfWorkWithAuthorExpenses.value / 100, 2) : 0,
    isHealthContribution: isHealthContribution.value,
    isDisabilityContribution: isDisabilityContribution.value,
    isPensionContribution: isPensionContribution.value,
    isSickContribution: isSickContribution.value,
    isFpContribution: isFpContribution.value,
    accidentContributionRate: helpers.round(accidentContributionRate.value / 100, 4),
    employeePpkContributionRate: isPpkContribution.value ? helpers.round(employeePpkContributionRate.value / 100, 4) : 0,
    employerPpkContributionRate: isPpkContribution.value ? helpers.round(employerPpkContributionRate.value / 100, 4) : 0,
  }

  if(amountType.value === AmountTypes.Net) {
    basicInputFields.grossAmount = findGrossAmountUsingNetAmount<InputFields>(new EmployeeCalculator(), 0.5 * amount.value, 2 * amount.value, amount.value, basicInputFields)
  }

  const monhtlyInputFields: InputFields[] = []

  for (let i = 0; i < 12; i++) {
    const inputFields:InputFields = {...basicInputFields}

    if(hasAmountForEachMonth.value) {
      const monthlyAmount = Number(monthlyAmounts.value[i])

      if(amountType.value === AmountTypes.Net) {
        inputFields.grossAmount = findGrossAmountUsingNetAmount<InputFields>(new EmployeeCalculator(), 0.5 * monthlyAmount, 2 * monthlyAmount, monthlyAmount, basicInputFields)
      } else {
        inputFields.grossAmount = monthlyAmount
      }
    }

    monhtlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monhtlyInputFields

  emit('submit')
}
</script>
