<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit"
  >
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów"
    >
      <LawRuleDate />
    </FormSection>
    <FormSection title="Przychód">
      <div class="row">
        <div class="col">
          <q-input
            v-model.number="revenue"
            type="number"
            min="0"
            step="0.01"
            label="Przychód (bez VAT)"
            suffix="zł"
            color="brand"
            :rules="[(val) => !!val || '* Wpisz kwotę']"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasRevenueForEachMonth"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Różne przychody w poszczególnych miesiącach"
          />
        </div>
      </div>
      <EachMonthAmountFields
        v-if="hasRevenueForEachMonth"
        v-model="monthlyRevenues"
      />
    </FormSection>
    <FormSection title="Koszty">
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
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Różne koszty w poszczególnych miesiącach"
          />
        </div>
      </div>
      <EachMonthAmountFields
        v-if="hasExpensesForEachMonth"
        v-model="monthlyExpenses"
      />
    </FormSection>
    <FormSection title="Podatek dochodowy">
      <div class="row q-mb-md">
        <div class="col">
          <LumpSumTaxRateSelect v-model.number="lumpSumTaxRate" />
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div>
          <q-toggle
            v-model="hasTaxRelief"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Ulga podatkowa"
          />
          <Tooltip class="q-ml-sm">
            Brak naliczania podatku dochodowego dla przychodu do
            {{ pln(incomeTaxConstants.taxReliefLimit) }}.<br />Ulga dla rodzin
            4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col">
          <q-toggle
            v-model="hasTaxFreeAmount"
            label="Kwota wolna od podatku"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Składki ZUS">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasEmploymentContract"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Zatrudniony na umowę o pracę"
          />
          <Tooltip class="q-ml-sm">
            Zatrudniony na umowę o pracę, zarabiający co najmniej równowartość
            minimalnego wynagrodzenia, płaci tylko składkę zdrowotną.
          </Tooltip>
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col">
          <ZusContributionBasisSelect
            v-model="chosenContributionBasis"
            :disabled="hasEmploymentContract"
          />
        </div>
      </div>
      <div
        v-if="chosenContributionBasis === ContributionBasises.Custom"
        class="row"
      >
        <div class="col">
          <q-input
            v-model.number="customContributionBasis"
            type="number"
            min="0"
            step="0.01"
            label="Podstawa składek ZUS"
            suffix="zł"
            color="brand"
            :rules="[(val) => !!val || '* Wpisz kwotę']"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="previousMonthHealthContributionBasis"
            type="number"
            min="0"
            step="0.01"
            label="Dochód z grudnia poprzedniego roku"
            suffix="zł"
            color="brand"
            hint="Przychód minus koszty i składki społeczne. Potrzebny do obliczenia składki zdrowotnej w styczniu. Kwota będzie zignorowana dla ryczałtu."
          />
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="accidentContributionRate"
            :disable="hasEmploymentContract"
            type="number"
            min="0"
            step="0.01"
            label="Składka wypadkowa"
            color="brand"
            suffix="%"
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div>
          <q-toggle
            v-model="isSickContribution"
            :disable="hasEmploymentContract"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Składka chorobowa"
          />
        </div>
        <div>
          <q-toggle
            v-model="isFpContribution"
            :disable="fpContributionIsDisabled"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Składka na Fundusz Pracy"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {
  ContributionBasises,
  useContributionBasis,
} from 'src/composables/contributionBasises'
import { InputFields } from 'components/b2bComparator/interfaces/InputFields'
import { LumpSumTaxRate } from 'src/logic/taxes/LumpSumTax'
import { computed, watch } from 'vue'
import { pln } from 'src/composables/currencyFormat'
import { useB2BComparatorStore } from 'components/b2bComparator/store'
import { storeToRefs } from 'pinia'
import { useConstantsStore } from 'stores/constantsStore'
import { useFormValidation } from 'src/composables/formValidation'
import { useLawRuleDate } from 'src/composables/lawRuleDate'
import { useLocalStorage } from '@vueuse/core'
import { useMonthlyAmounts } from 'src/composables/monthlyAmounts'
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import LumpSumTaxRateSelect from 'components/selfEmployment/components/LumpSumTaxRateSelect.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import ZusContributionBasisSelect from 'components/selfEmployment/components/ZusContributionBasisSelect.vue'
import helpers from 'src/logic/helpers'
import { matCheck, matClear } from 'src/icons'
import { useReviewPrompt } from 'src/composables/useReviewPrompt'

const emit = defineEmits(['submit'])

const { incrementCalculationCount } = useReviewPrompt()

const { handleValidationError } = useFormValidation()
const { availableDates } = useLawRuleDate()
const { zusConstants, incomeTaxConstants } = storeToRefs(useConstantsStore())
const store = useB2BComparatorStore()

// the revenue and expenses section
const revenue = useLocalStorage('b2bComparator/form/revenue', 10000, {
  mergeDefaults: true,
})
const {
  monthlyAmounts: monthlyRevenues,
  hasAmountForEachMonth: hasRevenueForEachMonth,
} = useMonthlyAmounts(revenue, 'b2bComparator/form/revenue')
const expenses = useLocalStorage('b2bComparator/form/expenses', 0, {
  mergeDefaults: true,
})
const {
  monthlyAmounts: monthlyExpenses,
  hasAmountForEachMonth: hasExpensesForEachMonth,
} = useMonthlyAmounts(expenses, 'b2bComparator/form/expenses')

// the income tax section
const lumpSumTaxRate = useLocalStorage<LumpSumTaxRate>(
  'b2bComparator/form/lumpSumTaxRate',
  0.17,
  { mergeDefaults: true },
)
const hasTaxRelief = useLocalStorage('b2bComparator/form/hasTaxRelief', false, {
  mergeDefaults: true,
})
const hasTaxFreeAmount = useLocalStorage(
  'b2bComparator/form/hasTaxFreeAmount',
  true,
  { mergeDefaults: true },
)

// the ZUS contribution section
const { chosenContributionBasis } = useContributionBasis('b2bComparator/form')
const customContributionBasis = useLocalStorage(
  'b2bComparator/form/customContributionBasis',
  zusConstants.value.entrepreneur.basises.big,
  { mergeDefaults: true },
)
const accidentContributionRate = useLocalStorage(
  'b2bComparator/form/accidentContributionRate',
  zusConstants.value.employer.rates.accidentCContribution.default * 100,
  { mergeDefaults: true },
)
const isFpContribution = useLocalStorage(
  'b2bComparator/form/isFpContribution',
  true,
  { mergeDefaults: true },
)
const isSickContribution = useLocalStorage(
  'b2bComparator/form/isSickContribution',
  false,
  { mergeDefaults: true },
)
const hasEmploymentContract = useLocalStorage(
  'b2bComparator/form/hasEmploymentContract',
  false,
  { mergeDefaults: true },
)
const fpContributionIsDisabled = computed(
  () =>
    chosenContributionBasis.value === ContributionBasises.Small ||
    hasEmploymentContract.value,
)
const previousMonthHealthContributionBasis = useLocalStorage(
  'b2bComparator/form/previousMonthHealthContributionBasis',
  0,
  { mergeDefaults: true },
)

watch(chosenContributionBasis, () => {
  if (chosenContributionBasis.value === ContributionBasises.Small) {
    isFpContribution.value = false
  }
})
watch(hasEmploymentContract, () => {
  if (hasEmploymentContract.value) {
    isFpContribution.value = false
    isSickContribution.value = false
  }
})

const getContributionBasis = (currentMonth: number): number => {
  if (chosenContributionBasis.value === ContributionBasises.Custom) {
    return customContributionBasis.value ?? 0
  }
  if (chosenContributionBasis.value === ContributionBasises.Small) {
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
    expenses: expenses.value ? expenses.value : 0,
    lumpSumTaxRate: lumpSumTaxRate.value,
    hasTaxRelief: hasTaxRelief.value,
    hasTaxFreeAmount: hasTaxFreeAmount.value,
    hasEmploymentContract: hasEmploymentContract.value,
    isFpContribution: isFpContribution.value,
    isSickContribution: isSickContribution.value,
    accidentContributionRate: helpers.round(
      accidentContributionRate.value / 100,
      4,
    ),
    contributionBasis: 0,
    previousMonthHealthContributionBasis:
      previousMonthHealthContributionBasis.value
        ? previousMonthHealthContributionBasis.value
        : 0,
  }

  const monthlyInputFields: InputFields[] = []

  for (let i = 0; i < 12; i++) {
    const inputFields: InputFields = {
      ...basicInputFields,
      contributionBasis: getContributionBasis(i),
    }

    if (hasRevenueForEachMonth.value) {
      inputFields.revenue = monthlyRevenues.value[i]
    }
    if (hasExpensesForEachMonth.value) {
      inputFields.expenses = monthlyExpenses.value[i]
    }

    monthlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monthlyInputFields

  incrementCalculationCount()
  emit('submit')
}
</script>
