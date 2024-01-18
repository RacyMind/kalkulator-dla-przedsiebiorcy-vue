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
      <EachMonthAmountFields
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
            Brak naliczania podatku dochodowego dla wynagrodzenia do {{ pln(incomeTaxConstants.taxReliefLimit) }} brutto.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
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
        v-model:part-of-work-with-author-expenses="partOfWorkWithAuthorExpenses"
        v-model:has-percentage-for-each-month="hasAuthhorExpensesForEachMonth"
        v-model:monthly-values="expensesMonthlyValues"
      />
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
      <ZusContributionFields
        v-model:accident-contribution-rate="accidentContributionRate"
        v-model:is-pension-contribution="isPensionContribution"
        v-model:is-health-contribution="isHealthContribution"
        v-model:is-sick-contribution="isSickContribution"
        v-model:is-disability-contribution="isDisabilityContribution"
        v-model:is-fp-contribution="isFpContribution"
        v-model:is-fgsp-contribution="isFgspContribution"
      />
      <PpkContributionFields
        v-model:employee-ppk-contribution-rate="employeePpkContributionRate"
        v-model:employer-ppk-contribution-rate="employerPpkContributionRate"
        v-model:is-ppk-contribution="isPpkContribution"
      />
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
import {useMonthlyPercentages} from 'src/composables/monthlyPercentages'
import {useTaxFreeAmount} from 'src/composables/taxFreeAmount'
import {watch} from 'vue'
import AmountTypeSelect from 'components/partials/form/AmountTypeSelect.vue'
import AuthorExpenseFields from 'components/partials/form/employee/AuthorExpenseFields.vue'
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import PpkContributionFields from 'components/partials/form/employee/PpkContributionFields.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import TaxFreeAmountFields from 'components/partials/form/TaxFreeAmountFields.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import ZusContributionFields from 'components/partials/form/employee/ZusContributionFields.vue'
import helpers from 'src/logic/helpers'

const emit = defineEmits(['submit'])

const store = useEmploymentContractStore()
const { availableDates } = useLawRuleDate()
const {handleValidationError} = useFormValidation()
const { zusConstants, incomeTaxConstants, wageStats } = useConstants()

enum ContributionSchemes {
  All = 1,
  WithoutFpAndFgsp = 2,
  OnlyHealthContribution = 3,
  Without = 4,
}

const contributionSchemeOptions = [
  {
    label: 'Wszystkie składki ZUS',
    value: ContributionSchemes.All,
  },
  {
    label: 'Oprócz składek na FP, FS i FGŚP',
    value: ContributionSchemes.WithoutFpAndFgsp,
  },
  {
    label: 'Tylko składka zdrowotna',
    value: ContributionSchemes.OnlyHealthContribution,
  },
  {
    label: 'Bez składek ZUS',
    value: ContributionSchemes.Without,
  },
]

// the salary section
const amount = useLocalStorage('contractOfEmployment/form/amount', wageStats.value.minimumWage(), { mergeDefaults: true })
const amountType =  useLocalStorage<AmountTypes>('contractOfEmployment/form/amountType', AmountTypes.Gross, { mergeDefaults: true })
const { monthlyAmounts, hasAmountForEachMonth } = useMonthlyAmounts(amount, 'contractOfEmployment/form')

// the income tax section
const workInLivePlace = useLocalStorage('contractOfEmployment/form/workInLivePlace', true, { mergeDefaults: true })
const areAuthorExpenses = useLocalStorage('contractOfEmployment/form/areAuthorExpenses', false, { mergeDefaults: true })
const partOfWorkWithAuthorExpenses = useLocalStorage('contractOfEmployment/form/partOfWorkWithAuthorExpenses', 100, { mergeDefaults: true })
const { hasPercentageForEachMonth: hasAuthhorExpensesForEachMonth, monthlyValues: expensesMonthlyValues } = useMonthlyPercentages(partOfWorkWithAuthorExpenses, 'contractOfEmployment/form/authorExpenses')

const hasTaxRelief = useLocalStorage('contractOfEmployment/form/hasTaxRelief', false, { mergeDefaults: true })
const { employerCount, hasTaxFreeAmount } = useTaxFreeAmount('contractOfEmployment/form')

// the ZUS contribution section
const contributionScheme = useLocalStorage<ContributionSchemes>('contractOfEmployment/form/contributionScheme', ContributionSchemes.All, { mergeDefaults: true })
const isHealthContribution = useLocalStorage('contractOfEmployment/form/isHealthContribution', true, { mergeDefaults: true })
const isSickContribution = useLocalStorage('contractOfEmployment/form/isSickContribution', true, { mergeDefaults: true })
const isDisabilityContribution = useLocalStorage('contractOfEmployment/form/isDisabilityContribution', true, { mergeDefaults: true })
const isPensionContribution = useLocalStorage('contractOfEmployment/form/isPensionContribution', true, { mergeDefaults: true })
const isFpContribution =  useLocalStorage('contractOfEmployment/form/isFpContribution', true, { mergeDefaults: true })
const isFgspContribution =  useLocalStorage('contractOfEmployment/form/isFgspContribution', true, { mergeDefaults: true })
const isPpkContribution =  useLocalStorage('contractOfEmployment/form/isPpkContribution', false, { mergeDefaults: true })
const employerPpkContributionRate = useLocalStorage('contractOfEmployment/form/employerPpkContributionRate', zusConstants.value.employer.rates.ppkContribution.default * 100, { mergeDefaults: true })
const employeePpkContributionRate = useLocalStorage('contractOfEmployment/form/employeePpkContributionRate', zusConstants.value.employee.rates.ppkContribution.default * 100, { mergeDefaults: true })
const accidentContributionRate = useLocalStorage('contractOfEmployment/form/accidentContributionRate', zusConstants.value.employer.rates.accidentCContribution.default * 100, { mergeDefaults: true })

watch(contributionScheme, () => {
  switch (contributionScheme.value) {
    case ContributionSchemes.All:
      isHealthContribution.value = true
      isSickContribution.value = true
      isDisabilityContribution.value = true
      isPensionContribution.value = true
      isFpContribution.value = true
      isFgspContribution.value = true
      accidentContributionRate.value = zusConstants.value.employer.rates.accidentCContribution.default * 100
      break
    case ContributionSchemes.WithoutFpAndFgsp:
      isHealthContribution.value = true
      isSickContribution.value = true
      isDisabilityContribution.value = true
      isPensionContribution.value = true
      isFpContribution.value = false
      isFgspContribution.value = false
      accidentContributionRate.value = zusConstants.value.employer.rates.accidentCContribution.default * 100
      break
    case ContributionSchemes.OnlyHealthContribution:
      isHealthContribution.value = true
      isSickContribution.value = false
      isDisabilityContribution.value = false
      isPensionContribution.value = false
      isFpContribution.value = false
      isFgspContribution.value = false
      isPpkContribution.value = false
      accidentContributionRate.value = 0
      break
    case ContributionSchemes.Without:
      isHealthContribution.value = false
      isSickContribution.value = false
      isDisabilityContribution.value = false
      isPensionContribution.value = false
      isFpContribution.value = false
      isFgspContribution.value = false
      isPpkContribution.value = false
      accidentContributionRate.value = 0
      break
  }
})

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
    isHealthContribution: isHealthContribution.value,
    isDisabilityContribution: isDisabilityContribution.value,
    isPensionContribution: isPensionContribution.value,
    isSickContribution: isSickContribution.value,
    isFpContribution: isFpContribution.value,
    isFgspContribution: isFgspContribution.value,
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

    if(areAuthorExpenses.value && hasAuthhorExpensesForEachMonth.value) {
      inputFields.partOfWorkWithAuthorExpenses = helpers.round(expensesMonthlyValues.value[i] / 100, 2)
    }

    if(amountType.value === AmountTypes.Gross && hasAmountForEachMonth.value) {
      inputFields.grossAmount = Number(monthlyAmounts.value[i])
    }

    if(amountType.value === AmountTypes.Net) {
      let netAmount = amount.value

      if(hasAmountForEachMonth.value) {
        netAmount = Number(monthlyAmounts.value[i])
      }

      inputFields.grossAmount = findGrossAmountUsingNetAmount(new EmployeeCalculator(), 0.5 * netAmount, 2 * netAmount, netAmount, inputFields, sumUpAmounts)
      sumUpAmounts = new EmployeeCalculator(true).setSumUpAmounts(sumUpAmounts).setInputData(inputFields).calculate().getSumUpAmounts()
    }

    monhtlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monhtlyInputFields

  emit('submit')
}

</script>
