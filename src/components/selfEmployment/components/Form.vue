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
    <FormSection title="Przychód">
      <div class="row q-mb-md">
        <div class="col">
          <q-select
            v-model="incomeMode"
            :options="incomeModeOptions"
            emit-value
            map-options
            color="brand"
            label="Tryb przychodu"
          />
        </div>
      </div>
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
            :rules="[(val) => validationRules.requiredAmount(val) || true]"
            lazy-rules="ondemand"
            v-if="!isHourlyMode"
          />
          <q-input
            v-else
            :model-value="hourlyRevenue"
            label="Przychód (wyliczony)"
            suffix="zł"
            color="brand"
            readonly
          />
        </div>
      </div>
      <div
        v-if="isHourlyMode"
        class="row q-col-gutter-md q-mt-md">
        <div class="col">
          <q-input
            v-model.number="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            label="Stawka godzinowa"
            suffix="zł"
            color="brand"
            :rules="[
              (val) => validationRules.requiredAmount(val) || true,
              (val) => validationRules.minValue(0)(val) || true,
            ]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="plannedHours"
            type="number"
            min="0"
            step="0.01"
            label="Planowana liczba godzin"
            suffix="h"
            color="brand"
            :rules="[
              (val) => validationRules.requiredAmount(val) || true,
              (val) => validationRules.minValue(0)(val) || true,
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div
        v-if="isHourlyMode"
        class="row q-mt-md">
        <div class="col">
          <q-toggle
            v-model="deductLeave"
            checked-icon="check"
            unchecked-icon="clear"
            label="Odlicz urlop / zwolnienie"
          />
        </div>
      </div>
      <div
        v-if="isHourlyMode && deductLeave"
        class="row q-mt-md">
        <div class="col">
          <q-input
            v-model.number="leaveHours"
            type="number"
            min="0"
            step="0.01"
            label="Godziny urlopu / zwolnienia"
            suffix="h"
            color="brand"
            :rules="[
              (val) => validationRules.requiredAmount(val) || true,
              (val) => validationRules.minValue(0)(val) || true,
              (val) => validationRules.lessThan(plannedHours || 0)(val) || true,
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
            v-if="!isHourlyMode"
          />
        </div>
      </div>
      <EachMonthAmountFields
        v-if="hasRevenueForEachMonth && !isHourlyMode"
        v-model="monthlyRevenues"
        :disable-until-month="businessHasStartedBeforeThisYear ? null : businessStartedInMonth"
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
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne koszty w poszczególnych miesiącach"
          />
        </div>
      </div>
      <EachMonthAmountFields
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
            label="Forma opodatkowania"
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
          <LumpSumTaxRateSelect v-model.number="lumpSumTaxRate"/>
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
            Brak naliczania podatku dochodowego dla przychodu do {{ pln(incomeTaxConstants.taxReliefLimit) }}.<br>Ulga dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
      </div>
      <div
        v-if="incomeTaxType === EntrepreneurTaxSystem.TaxScale"
        class="row q-col-gutter-md">
        <div class="col">
          <q-toggle
            v-model="hasTaxFreeAmount"
            label="Kwota wolna od podatku"
            checked-icon="check"
            unchecked-icon="clear"
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Składki ZUS">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasEmploymentContract"
            checked-icon="check"
            unchecked-icon="clear"
            label="Zatrudniony na umowę o pracę"
          />
          <Tooltip class="q-ml-sm">
            Zatrudniony na umowę o pracę, zarabiający co najmniej równowartość minimalnego wynagrodzenia, płaci tylko składkę zdrowotną.
          </Tooltip>
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col">
          <ZusContributionBasisSelect
            v-model="chosenContributionBasis"
            :disabled="hasEmploymentContract" />
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
            label="Podstawa składek ZUS"
            suffix="zł"
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
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka chorobowa"
          />
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
            :disable="hasEmploymentContract"
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
import {ContributionBasises, useContributionBasis} from 'src/composables/contributionBasises'
import {storeToRefs} from 'pinia'
import {EntrepreneurTaxSystem, useConstantsStore} from 'stores/constantsStore'
import {IncomeMode, InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'
import {computed, watch} from 'vue'
import {getHourlyRevenue} from 'components/selfEmployment/logic/helpers'
import {pln} from 'src/composables/currencyFormat'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useLocalStorage} from '@vueuse/core'
import {useMonthlyAmounts} from 'src/composables/monthlyAmounts'
import {useMonths} from 'src/composables/months'
import {useSelfEmploymentStore} from 'components/selfEmployment/store'
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import LumpSumTaxRateSelect from 'components/selfEmployment/components/LumpSumTaxRateSelect.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import ZusContributionBasisSelect from 'components/selfEmployment/components/ZusContributionBasisSelect.vue'
import helpers from 'src/logic/helpers'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()
const { availableDates } = useLawRuleDate()
const { monthOptions } = useMonths()
const { zusConstants, incomeTaxConstants } = storeToRefs(useConstantsStore())
const store = useSelfEmploymentStore()

const incomeTaxTypes = [
  {
    label: 'Skala podatkowa (12% i 32%)',
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

const incomeModeOptions = [
  {
    label: 'Miesięczny przychód',
    value: IncomeMode.MonthlyRevenue,
  },
  {
    label: 'Stawka godzinowa',
    value: IncomeMode.HourlyRate,
  },
]

// the business run period section
const businessHasStartedBeforeThisYear = useLocalStorage('selfEmployment/form/businessHasStartedBeforeThisYear', true, { mergeDefaults: true })
const businessStartedInMonth = useLocalStorage('selfEmployment/form/businessStartedInMonth', new Date().getMonth(), { mergeDefaults: true })

// the income tax type section
const incomeTaxType = useLocalStorage('selfEmployment/form/incomeTaxType', EntrepreneurTaxSystem.TaxScale, { mergeDefaults: true })
const lumpSumTaxRate = useLocalStorage<LumpSumTaxRate>('selfEmployment/form/lumpSumTaxRate', 0.17, { mergeDefaults: true })

// the revenue and expenses section
const revenue = useLocalStorage('selfEmployment/form/revenue', 10000, { mergeDefaults: true })
const { monthlyAmounts: monthlyRevenues, hasAmountForEachMonth: hasRevenueForEachMonth } = useMonthlyAmounts(revenue, 'selfEmployment/form/revenue')
const expenses = useLocalStorage('selfEmployment/form/expenses', 0, { mergeDefaults: true })
const { monthlyAmounts: monthlyExpenses, hasAmountForEachMonth: hasExpensesForEachMonth } = useMonthlyAmounts(expenses, 'selfEmployment/form/expenses')
const incomeMode = useLocalStorage<IncomeMode>('selfEmployment/form/incomeMode', IncomeMode.MonthlyRevenue, { mergeDefaults: true })
const hourlyRate = useLocalStorage('selfEmployment/form/hourlyRate', 120, { mergeDefaults: true })
const plannedHours = useLocalStorage('selfEmployment/form/plannedHours', 160, { mergeDefaults: true })
const deductLeave = useLocalStorage('selfEmployment/form/deductLeave', false, { mergeDefaults: true })
const leaveHours = useLocalStorage('selfEmployment/form/leaveHours', 0, { mergeDefaults: true })

// the income tax section
const hasTaxRelief = useLocalStorage('selfEmployment/form/hasTaxRelief', false, { mergeDefaults: true })
const hasTaxFreeAmount = useLocalStorage('selfEmployment/form/hasTaxFreeAmount', true, { mergeDefaults: true })

// the ZUS contribution section
const { chosenContributionBasis } = useContributionBasis('selfEmployment/form')
const customContributionBasis = useLocalStorage('selfEmployment/form/customContributionBasis', zusConstants.value.entrepreneur.basises.big, { mergeDefaults: true })
const accidentContributionRate = useLocalStorage('selfEmployment/form/accidentContributionRate', zusConstants.value.employer.rates.accidentCContribution.default * 100, { mergeDefaults: true })
const isFpContribution =  useLocalStorage('selfEmployment/form/isFpContribution', true, { mergeDefaults: true })
const isSickContribution = useLocalStorage('selfEmployment/form/isSickContribution', false, { mergeDefaults: true })
const hasEmploymentContract = useLocalStorage('selfEmployment/form/hasEmploymentContract', false, { mergeDefaults: true })
const fpContributionIsDisabled = computed(() => chosenContributionBasis.value === ContributionBasises.Small || hasEmploymentContract.value)
const zusRelief = useLocalStorage('selfEmployment/form/zusRelief', false, { mergeDefaults: true })
const zusReliefUntil = useLocalStorage('selfEmployment/form/zusReliefUntil', 5, { mergeDefaults: true })
const previousMonthHealthContributionBasis = useLocalStorage('selfEmployment/form/previousMonthHealthContributionBasis', 0, { mergeDefaults: true })
const isHourlyMode = computed(() => incomeMode.value === IncomeMode.HourlyRate)
const hourlyRevenue = computed(() => {
  const effectiveLeaveHours = deductLeave.value ? leaveHours.value ?? 0 : 0
  return helpers.round(getHourlyRevenue(hourlyRate.value ?? 0, plannedHours.value ?? 0, effectiveLeaveHours), 2)
})

watch(chosenContributionBasis, () => {
  if(chosenContributionBasis.value === ContributionBasises.Small) {
    isFpContribution.value = false
  }
})
watch(hasEmploymentContract, () => {
  if(hasEmploymentContract.value) {
    isFpContribution.value = false
    isSickContribution.value = false
    zusRelief.value = false
  }
})
watch(businessStartedInMonth, () => {
  zusReliefUntil.value = Math.min(11, businessStartedInMonth.value + 5)
})
watch(incomeMode, () => {
  if (isHourlyMode.value) {
    hasRevenueForEachMonth.value = false
    monthlyRevenues.value = []
  }
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
  if (!isHourlyMode.value && !revenue.value) {
    return
  }

  const effectiveLeaveHours = deductLeave.value ? leaveHours.value ?? 0 : 0
  const calculatedRevenue = isHourlyMode.value
    ? helpers.round(getHourlyRevenue(hourlyRate.value ?? 0, plannedHours.value ?? 0, effectiveLeaveHours), 2)
    : revenue.value

  const basicInputFields: InputFields = {
    revenue: calculatedRevenue,
    incomeMode: incomeMode.value,
    hourlyRate: hourlyRate.value ?? 0,
    plannedHours: plannedHours.value ?? 0,
    deductLeave: deductLeave.value,
    leaveHours: effectiveLeaveHours,
    expenses: expenses.value ? expenses.value : 0,
    lossFromPreviousMonth: 0,
    taxSystem: incomeTaxType.value,
    lumpSumTaxRate: lumpSumTaxRate.value,
    hasTaxRelief: hasTaxRelief.value,
    hasTaxFreeAmount: hasTaxFreeAmount.value,
    hasEmploymentContract: hasEmploymentContract.value,
    isFpContribution: isFpContribution.value,
    isSickContribution: isSickContribution.value,
    accidentContributionRate: helpers.round(accidentContributionRate.value / 100, 4),
    contributionBasis: 0,
    yearlyIncome: 0,
    previousMonthHealthContributionBasis: businessHasStartedBeforeThisYear.value && previousMonthHealthContributionBasis.value ? previousMonthHealthContributionBasis.value : 0,
    businessIsRunning: true,
    monthIndex: 0,
  }

  const monthlyInputFields: InputFields[] = []

  for (let i = 0; i < 12; i++) {
    const inputFields: InputFields = {
      ...basicInputFields,
      contributionBasis: getContributionBasis(i),
      monthIndex: i,
    }

    if(hasRevenueForEachMonth.value && !isHourlyMode.value) {
      inputFields.revenue = monthlyRevenues.value[i]
    }
    if(hasExpensesForEachMonth.value) {
      inputFields.expenses = monthlyExpenses.value[i]
    }

    if(!businessHasStartedBeforeThisYear.value && i < businessStartedInMonth.value) {
      inputFields.revenue = 0
      inputFields.expenses = 0
      inputFields.contributionBasis = 0
      inputFields.businessIsRunning = false
    }

    monthlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monthlyInputFields

  emit('submit')
}
</script>
