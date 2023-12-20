<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
      <LawRuleDate />
    </FormSection>
    <FormSection title="Okres prowadzenia działalności">
      <div class="row">
        <div class="col">
          <q-checkbox
            v-model="businessHasStartedBeforeThisYear"
            label="Działalność rozpoczęta w poprzednich latach"
          />
        </div>
      </div>
      <div
        v-if="!businessHasStartedBeforeThisYear"
        class="row">
        <div class="col">
          <q-select
            v-model.number="businessStartedInMonth"
            :options="monthOptions"
            emit-value
            map-options
            color="brand"
            label="Miesiąc rozpoczęcia działalności" />
        </div>
      </div>
    </FormSection>
    <FormSection title="Przychód i koszty">
      <div class="row">
        <div class="col">
          <q-input
            v-model.number="revenue"
            type="number"
            min="0"
            step="0.01"
            label="Przychód (bez VAT)*"
            suffix="zł"
            autofocus
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasRevenueForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne przychody w poszczególnych miesiącach"
          />
        </div>
      </div>
      <AnnualAmountInput
        v-if="hasRevenueForEachMonth"
        v-model="monthlyRevenues"
        :disable-until-month="businessHasStartedBeforeThisYear ? null : businessStartedInMonth"
      />
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="expenses"
            type="number"
            min="0"
            step="0.01"
            label="Koszty (bez VAT)"
            suffix="zł"
            color="brand"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasExpensesForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne koszty w poszczególnych miesiącach"
          />
        </div>
      </div>
      <AnnualAmountInput
        v-if="hasExpensesForEachMonth"
        v-model="monthlyExpenses"
        :disable-until-month="businessHasStartedBeforeThisYear ? null : businessStartedInMonth"
      />
    </FormSection>
    <FormSection title="Podatek dochodowy">
      <div class="row q-mb-md">
        <div class="col">
          <q-select
            v-model.number="incomeTaxType"
            :options="incomeTaxTypes"
            label="Forma opodatkowania*"
            color="brand"
            required
            emit-value
            map-options
          />
        </div>
      </div>
      <div
        v-if="incomeTaxType === EntrepreneurTaxSystem.LumpSumTax"
        class="row q-mb-md">
        <div class="col">
          <q-select
            v-model.number="lumpSumTaxRate"
            :options="lumpSumTaxRateOptions"
            label="Stawka ryczałtu ewidencjonowanego"
            color="brand"
            required
            emit-value
            map-options
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div>
          <q-toggle
            v-model="hasTaxRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga podatkowa"
          />
          <Tooltip class="q-ml-sm">
            Brak naliczania podatku dochodowego dla przychodu do {{ pln(incomeTaxConstnts.taxReliefLimit) }}.<br>Ulga dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
        <div>
          <templarte v-if="incomeTaxType === EntrepreneurTaxSystem.TaxScale">
            <q-toggle
              v-model="hasTaxFreeAmount"
              label="Kwota wolna od podatku"
              checked-icon="check"
              unchecked-icon="clear"
            />
            <Tooltip class="q-ml-sm">
              Kwota wolna jest odliczana od podatku równomiernie w każdym miesiącu roku.
            </Tooltip>
          </templarte>
        </div>
      </div>
      <div
        v-if="hasTaxFreeAmount && incomeTaxType === EntrepreneurTaxSystem.TaxScale"
        class="row q-col-gutter-md q-mb-md">
        <div class="col">
          <q-select
            v-model="employerCount"
            :options="employerCountOptions"
            emit-value
            map-options
            label="Kwota odliczana u" />
        </div>
      </div>
    </FormSection>
    <FormSection title="Składki ZUS">
      <div class="row q-mb-md">
        <div class="col">
          <q-select
            v-model.number="chosenContributionBasis"
            :options="contributionBasisOptions"
            label="Podstawa składek ZUS"
            color="brand"
            required
            emit-value
            map-options
          />
        </div>
      </div>
      <div
        v-if="chosenContributionBasis === ContributionBasises.Custom"
        class="row">
        <div class="col">
          <q-input
            v-model.number="customContributionBasis"
            type="number"
            min="0"
            step="0.01"
            label="Podstawa składek ZUS*"
            suffix="zł"
            autofocus
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div
        v-if="businessHasStartedBeforeThisYear && incomeTaxType !== EntrepreneurTaxSystem.LumpSumTax"
        class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="previousMonthHealthContributionBasis"
            type="number"
            min="0"
            step="0.01"
            label="Dochód z grudnia poprzedniego roku"
            suffix="zł"
            color="brand"
            hint="Przychód minus koszty i składki społeczne. Potrzebny do obliczenia składki zdrowotnej w styczniu."
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
            v-model="isSickContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka chorobowa"
          />
        </div>
        <div>
          <q-toggle
            v-model="hasEmploymentContract"
            checked-icon="check"
            unchecked-icon="clear"
            label="Zatrudniony na umowę o pracę"
          />
          <Tooltip class="q-ml-sm">
            Zatrudniony na umowę o pracę płaci tylko składkę zdrowotną.
          </Tooltip>
        </div>
        <div>
          <q-toggle
            v-model="isFpContribution"
            :disable="fpContributionIsDisabled"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka na Fundusz Pracy"
          />
        </div>
        <div>
          <q-toggle
            v-model="zusRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga na start"
          />
          <Tooltip class="q-ml-sm">
            Ulga zwalnia z płacenia składek ZUS (z wyjątkiem składki zdrowotnej) przez pierwsze 6 miesięcy działalności.
          </Tooltip>
        </div>
      </div>
      <div
        v-if="zusRelief"
        class="row">
        <div class="col">
          <q-select
            v-model.number="zusReliefUntil"
            :options="monthOptions"
            emit-value
            map-options
            color="brand"
            label="Ulga obowiązuje do" />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {EntrepreneurTaxSystem, useConstants} from 'src/composables/constants'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'
import {Ref, computed, ref, watch} from 'vue'
import {pln} from 'src/use/currencyFormat'
import {useContributionBasis} from 'src/composables/contributionBasises'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useMonthlyAmounts} from 'src/composables/monthlyAmounts'
import {useMonths} from 'src/composables/months'
import {useSelfemploymentStore} from 'components/selfEmployment/store'
import {useTaxFreeAmount} from 'src/composables/taxFreeAmount'
import AnnualAmountInput from 'components/partials/form/AnnualAmountInput.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import helpers from 'src/logic/helpers'

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()
const { availableDates } = useLawRuleDate()
const { monthOptions } = useMonths()
const { zusConstants, incomeTaxConstnts } = useConstants()
const store = useSelfemploymentStore()

enum ContributionBasises {
  Big = 1,
  Small = 2,
  Custom = 3,
}

const incomeTaxTypes = [
  {
    label: 'Skala podatkowa (17% i 32%)',
    value: EntrepreneurTaxSystem.TaxScale,
  },
  {
    label: 'Podatek liniowy (19%)',
    value: EntrepreneurTaxSystem.FlatTax,
  },
  {
    label: 'Ryczałt ewidencjonowany',
    value: EntrepreneurTaxSystem.LumpSumTax,
  },
]

const lumpSumTaxRateOptions:{label: string, value: LumpSumTaxRate}[] = [
    {
      label: '2%',
      value: 0.02,
    },
    {
      label: '3%',
      value: 0.03,
    },
    {
      label: '5,5%',
      value: 0.055,
    },
    {
      label: '8,5%',
      value: 0.085,
    },
    {
      label: '10%',
      value: 0.1,
    },
    {
      label: '12%',
      value: 0.12,
    },
    {
      label: '12,5%',
      value: 0.125,
    },
    {
      label: '14%',
      value: 0.14,
    },
    {
      label: '15%',
      value: 0.15,
    },
    {
      label: '17%',
      value: 0.17,
    },
  ]

// the business run period section
const businessHasStartedBeforeThisYear = ref(true)
const businessStartedInMonth = ref(new Date().getMonth())

// the income tax type section
const incomeTaxType = ref(EntrepreneurTaxSystem.TaxScale)
const lumpSumTaxRate:Ref<LumpSumTaxRate> = ref(0.17)

// the revenue and expenses section
const revenue:Ref<number|null> = ref(null)
const { monthlyAmounts: monthlyRevenues, hasAmountForEachMonth: hasRevenueForEachMonth } = useMonthlyAmounts(revenue)
const expenses:Ref<number|null> = ref(null)
const { monthlyAmounts: monthlyExpenses, hasAmountForEachMonth: hasExpensesForEachMonth } = useMonthlyAmounts(expenses)

// the income tax section
const hasTaxRelief = ref(false)
const { employerCountOptions, employerCount, hasTaxFreeAmount } = useTaxFreeAmount()

// the ZUS contribution section
const { contributionBasisOptions, chosenContributionBasis } = useContributionBasis()
const customContributionBasis:Ref<number|null> = ref(zusConstants.value.entrepreneur.basises.big)
const accidentContributionRate = ref(zusConstants.value.employer.rates.accidentCContribution.default * 100)
const isFpContribution = ref(true)
const isSickContribution = ref(false)
const hasEmploymentContract = ref(false)
const fpContributionIsDisabled = computed(() => chosenContributionBasis.value === ContributionBasises.Small || hasEmploymentContract.value)
const zusRelief = ref(false)
const zusReliefUntil = ref(5)
const previousMonthHealthContributionBasis = ref(0)

watch(chosenContributionBasis, () => {
  if(chosenContributionBasis.value === ContributionBasises.Small) {
    isFpContribution.value = false
  }
})
watch(hasEmploymentContract, () => {
  if(hasEmploymentContract.value) {
    isFpContribution.value = false
  }
})
watch(businessStartedInMonth, () => {
  zusReliefUntil.value = Math.min(11, businessStartedInMonth.value + 5)
})

const getContributionBasis = (currentMonth: number): number => {
  if(!businessHasStartedBeforeThisYear.value && currentMonth < businessStartedInMonth.value) {
    return 0
  }
  if(zusRelief.value && currentMonth <= zusReliefUntil.value) {
    return 0
  }
  if(chosenContributionBasis.value === ContributionBasises.Custom) {
    return customContributionBasis.value ?? 0
  }
  if(chosenContributionBasis.value === ContributionBasises.Small) {
    return zusConstants.value.entrepreneur.basises.small(currentMonth)
  }

  return zusConstants.value.entrepreneur.basises.big
}

const handleFormSubmit = () => {
  if (!revenue.value) {
    return
  }

  const basicInputFields: InputFields = {
    revenue: revenue.value,
    expenses: expenses.value ?? 0,
    taxSystem: incomeTaxType.value,
    lumpSumTaxRate: lumpSumTaxRate.value,
    hasTaxRelief: hasTaxRelief.value,
    partTaxReducingAmount: hasTaxFreeAmount.value && incomeTaxType.value === EntrepreneurTaxSystem.TaxScale ? employerCount.value * 12 : 0,
    hasEmploymentContract: hasEmploymentContract.value,
    isFpContribution: isFpContribution.value,
    isSickContribution: isSickContribution.value,
    accidentContributionRate: helpers.round(accidentContributionRate.value / 100, 4),
    contributionBasis: 0,
    yearlyIncome: 0,
    previousMonthHealthContributionBasis: businessHasStartedBeforeThisYear.value ? previousMonthHealthContributionBasis.value : 0,
    businessIsRuning: true,
    monthIndex: 0,
  }

  const monhtlyInputFields: InputFields[] = []

  for (let i = 0; i < 12; i++) {
    const inputFields: InputFields = {
      ...basicInputFields,
      contributionBasis: getContributionBasis(i),
      monthIndex: i,
    }

    if(hasRevenueForEachMonth.value) {
      inputFields.revenue = monthlyRevenues.value[i]
    }
    if(hasExpensesForEachMonth.value) {
      inputFields.expenses = monthlyExpenses.value[i]
    }

    if(!businessHasStartedBeforeThisYear.value && i < businessStartedInMonth.value) {
      inputFields.revenue = 0
      inputFields.expenses = 0
      inputFields.contributionBasis = 0
      inputFields.businessIsRuning = false
    }

    monhtlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monhtlyInputFields

  emit('submit')
}
</script>
