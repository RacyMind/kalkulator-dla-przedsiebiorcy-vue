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
    <FormSection title="Wynagrodzenie">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="isHourlyAmount"
            :disable="hasAmountForEachMonth"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Stawka godzinowa"
          />
        </div>
      </div>
      <div v-if="isHourlyAmount" class="row items-center q-col-gutter-sm">
        <div class="col-12 col-sm">
          <q-input
            v-model.number="hourlyAmount"
            :autofocus="isHourlyAmount"
            :disable="hasAmountForEachMonth"
            type="number"
            min="0"
            step="0.01"
            label="Stawka godzinowa"
            suffix="zł"
            color="brand"
            :rules="[(val) => !!val || '* Wpisz kwotę']"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-12 col-sm">
          <q-input
            v-model.number="hourCount"
            :disable="hasAmountForEachMonth"
            type="number"
            class="full-width"
            min="1"
            step="0.01"
            label="Ilość godzin"
            color="brand"
            :rules="[(val) => !!val || '* Wpisz ilość godzin']"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row items-end q-col-gutter-sm q-mb-sm">
        <div class="col-grow">
          <q-input
            v-model.number="amount"
            :disable="isHourlyAmount || hasAmountForEachMonth"
            type="number"
            min="0"
            step="0.01"
            label="Wynagrodzenie"
            suffix="zł"
            color="brand"
            :rules="[(val) => !!val || '* Wpisz kwotę']"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <AmountTypeSelect v-model="amountType" class="col-shrink" />
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasAmountForEachMonth"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
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
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Ulga podatkowa"
          />
          <Tooltip class="q-ml-sm">
            Brak naliczania podatku dochodowego dla wynagrodzenia do
            {{ pln(incomeTaxConstants.taxReliefLimit) }} brutto.<br />Ulga dla
            osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla
            pracujących seniorów.
          </Tooltip>
        </div>
        <div>
          <q-toggle
            v-model="canLumpSumTaxBe"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            label="Możliwy podatek zryczałtowany"
          />
          <Tooltip class="q-ml-sm">
            Podatek zryczałtowany obowiązuje dla wynagrodzenia do
            {{
              pln(incomeTaxConstants.taxScale.expenses.withoutExpensesUpTo)
            }}
            brutto. Podatek zryczałtowany <b>nie obowiązuje</b> w 2 sytuacjach:
            <ul>
              <li>gdy zleceniobiorca jest pracownikiem firmy,</li>
              <li>
                umowa ze stawką za wykonaną jednostkę - np. stawka za godzinę
                pracy lub na "akord".
              </li>
            </ul>
          </Tooltip>
        </div>
      </div>
      <TaxFreeAmountFields
        v-model:has-tax-free-amount="hasTaxFreeAmount"
        v-model:employer-count="employerCount"
      />
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
            label="Schemat składek ZUS"
          />
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
import { storeToRefs } from 'pinia';
import { AmountTypes, useConstantsStore } from 'stores/constantsStore';
import { EmployeeCalculator } from 'components/contractOfMandate/logic/EmployeeCalculator';
import { InputFields } from 'components/contractOfMandate/interfaces/InputFields';
import { findGrossAmountUsingNetAmount } from 'src/logic/findGrossAmountUsingNetAmount';
import { pln } from 'src/composables/currencyFormat';
import { useFormValidation } from 'src/composables/formValidation';
import { useHourlyAmount } from 'src/composables/hourlyAmount';
import { useLawRuleDate } from 'src/composables/lawRuleDate';
import { useLocalStorage } from '@vueuse/core';
import { useMandateContractStore } from 'components/contractOfMandate/store';
import { useMonthlyAmounts } from 'src/composables/monthlyAmounts';
import { useMonthlyPercentages } from 'src/composables/monthlyPercentages';
import { useTaxFreeAmount } from 'src/composables/taxFreeAmount';
import { watch } from 'vue';
import AmountTypeSelect from 'components/partials/form/AmountTypeSelect.vue';
import AuthorExpenseFields from 'components/partials/form/employee/AuthorExpenseFields.vue';
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue';
import FormSection from 'components/partials/form/FormSection.vue';
import LawRuleDate from 'components/partials/LawRuleDate.vue';
import PpkContributionFields from 'components/partials/form/employee/PpkContributionFields.vue';
import SubmitButton from 'components/partials/form/SubmitButton.vue';
import TaxFreeAmountFields from 'components/partials/form/TaxFreeAmountFields.vue';
import Tooltip from 'components/partials/Tooltip.vue';
import ZusContributionFields from 'components/partials/form/employee/ZusContributionFields.vue';
import helpers from 'src/logic/helpers';
import { matCheck, matClear } from 'src/icons';
import { useReviewPrompt } from 'src/composables/useReviewPrompt';

const emit = defineEmits(['submit']);

const { incrementCalculationCount } = useReviewPrompt();

const store = useMandateContractStore();
const { handleValidationError } = useFormValidation();
const { availableDates } = useLawRuleDate();
const { zusConstants, incomeTaxConstants, wageStats } =
  storeToRefs(useConstantsStore());

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
    label:
      'Pracownik innej firmy z wynagrodzeniem co najmniej w wysokości pensji minimalnej',
    value: ContributionSchemes.ContractorWorksInAnotherCompany,
  },
];

// the salary section
const amount = useLocalStorage(
  'contractOfMandate/form/amount',
  wageStats.value.minimumWage(),
  { mergeDefaults: true },
);
const { hourCount, hourlyAmount, isHourlyAmount } = useHourlyAmount(
  amount,
  'contractOfMandate/form',
);
const amountType = useLocalStorage<AmountTypes>(
  'contractOfMandate/form/amountType',
  AmountTypes.Gross,
  { mergeDefaults: true },
);
const { monthlyAmounts, hasAmountForEachMonth } = useMonthlyAmounts(
  amount,
  'contractOfMandate/form',
);

// the income tax section
const areAuthorExpenses = useLocalStorage(
  'contractOfMandate/form/areAuthorExpenses',
  false,
  { mergeDefaults: true },
);
const partOfWorkWithAuthorExpenses = useLocalStorage(
  'contractOfMandate/form/partOfWorkWithAuthorExpenses',
  100,
  { mergeDefaults: true },
);
const {
  hasPercentageForEachMonth: hasAuthhorExpensesForEachMonth,
  monthlyValues: expensesMonthlyValues,
} = useMonthlyPercentages(
  partOfWorkWithAuthorExpenses,
  'contractOfMandate/form/authorExpenses',
);

const hasTaxRelief = useLocalStorage(
  'contractOfMandate/form/hasTaxRelief',
  false,
  { mergeDefaults: true },
);
const { employerCount, hasTaxFreeAmount } = useTaxFreeAmount(
  'contractOfMandate/form',
);
const canLumpSumTaxBe = useLocalStorage(
  'contractOfMandate/form/canLumpSumTaxBe',
  true,
  { mergeDefaults: true },
);

// the ZUS contribution section
const contributionScheme = useLocalStorage<ContributionSchemes>(
  'contractOfMandate/form/contributionScheme',
  ContributionSchemes.Unemployed,
  { mergeDefaults: true },
);
const isHealthContribution = useLocalStorage(
  'contractOfMandate/form/isHealthContribution',
  true,
  { mergeDefaults: true },
);
const isSickContribution = useLocalStorage(
  'contractOfMandate/form/isSickContribution',
  true,
  { mergeDefaults: true },
);
const isDisabilityContribution = useLocalStorage(
  'contractOfMandate/form/isDisabilityContribution',
  true,
  { mergeDefaults: true },
);
const isPensionContribution = useLocalStorage(
  'contractOfMandate/form/isPensionContribution',
  true,
  { mergeDefaults: true },
);
const isFpContribution = useLocalStorage(
  'contractOfMandate/form/isFpContribution',
  false,
  { mergeDefaults: true },
);
const isFgspContribution = useLocalStorage(
  'contractOfMandate/form/isFgspContribution',
  false,
  { mergeDefaults: true },
);
const isPpkContribution = useLocalStorage(
  'contractOfMandate/form/isPpkContribution',
  false,
  { mergeDefaults: true },
);
const employerPpkContributionRate = useLocalStorage(
  'contractOfMandate/form/employerPpkContributionRate',
  zusConstants.value.employer.rates.ppkContribution.default * 100,
  { mergeDefaults: true },
);
const employeePpkContributionRate = useLocalStorage(
  'contractOfMandate/form/employeePpkContributionRate',
  zusConstants.value.employee.rates.ppkContribution.default * 100,
  { mergeDefaults: true },
);
const accidentContributionRate = useLocalStorage(
  'contractOfMandate/form/accidentContributionRate',
  zusConstants.value.employer.rates.accidentCContribution.default * 100,
  { mergeDefaults: true },
);

watch(isHourlyAmount, () => {
  if (isHourlyAmount.value) {
    canLumpSumTaxBe.value = false;
  } else {
    canLumpSumTaxBe.value = true;
  }
});

watch(
  contributionScheme,
  () => {
    switch (contributionScheme.value) {
      case ContributionSchemes.Unemployed:
        isHealthContribution.value = true;
        isSickContribution.value = false;
        isDisabilityContribution.value = true;
        isPensionContribution.value = true;
        isFpContribution.value = true;
        isFgspContribution.value = true;
        accidentContributionRate.value =
          zusConstants.value.employer.rates.accidentCContribution.default * 100;
        break;
      case ContributionSchemes.ContractWithEmployer:
        isHealthContribution.value = true;
        isSickContribution.value = true;
        isDisabilityContribution.value = true;
        isPensionContribution.value = true;
        isFpContribution.value = true;
        isFgspContribution.value = true;
        accidentContributionRate.value =
          zusConstants.value.employer.rates.accidentCContribution.default * 100;
        break;
      case ContributionSchemes.Student:
        isHealthContribution.value = false;
        isSickContribution.value = false;
        isDisabilityContribution.value = false;
        isPensionContribution.value = false;
        isFpContribution.value = false;
        isFgspContribution.value = false;
        isPpkContribution.value = false;
        accidentContributionRate.value = 0;
        break;
      case ContributionSchemes.Pensioner:
        isHealthContribution.value = true;
        isSickContribution.value = false;
        isDisabilityContribution.value = true;
        isPensionContribution.value = true;
        isFpContribution.value = false;
        isFgspContribution.value = false;
        accidentContributionRate.value =
          zusConstants.value.employer.rates.accidentCContribution.default * 100;
        break;
      case ContributionSchemes.ContractorWorksInAnotherCompany:
        isHealthContribution.value = true;
        isSickContribution.value = false;
        isDisabilityContribution.value = false;
        isPensionContribution.value = false;
        isFpContribution.value = false;
        isFgspContribution.value = false;
        isPpkContribution.value = false;
        accidentContributionRate.value = 0;
        break;
    }
  },
  { immediate: true },
);

const handleFormSubmit = () => {
  if (!amount.value) {
    return;
  }

  const basicInputFields: InputFields = {
    grossAmount: amount.value,
    hasTaxRelief: hasTaxRelief.value,
    partTaxReducingAmount: hasTaxFreeAmount.value
      ? employerCount.value * 12
      : 0,
    canLumpSumTaxBe: true,
    partOfWorkWithAuthorExpenses: areAuthorExpenses.value
      ? helpers.round(partOfWorkWithAuthorExpenses.value / 100, 2)
      : 0,
    isHealthContribution: isHealthContribution.value,
    isDisabilityContribution: isDisabilityContribution.value,
    isPensionContribution: isPensionContribution.value,
    isSickContribution: isSickContribution.value,
    isFpContribution: isFpContribution.value,
    isFgspContribution: isFgspContribution.value,
    accidentContributionRate: helpers.round(
      accidentContributionRate.value / 100,
      4,
    ),
    employeePpkContributionRate: isPpkContribution.value
      ? helpers.round(employeePpkContributionRate.value / 100, 4)
      : 0,
    employerPpkContributionRate: isPpkContribution.value
      ? helpers.round(employerPpkContributionRate.value / 100, 4)
      : 0,
  };

  const monhtlyInputFields: InputFields[] = [];

  let sumUpAmounts = {
    sumUpTaxBasis: 0,
    sumUpContributionBasis: 0,
    sumUpAuthorExpenses: 0,
    sumUpGrossAmount: 0,
  };

  for (let i = 0; i < 12; i++) {
    const inputFields: InputFields = { ...basicInputFields };

    if (areAuthorExpenses.value && hasAuthhorExpensesForEachMonth.value) {
      inputFields.partOfWorkWithAuthorExpenses = helpers.round(
        expensesMonthlyValues.value[i] / 100,
        2,
      );
    }

    if (amountType.value === AmountTypes.Gross && hasAmountForEachMonth.value) {
      inputFields.grossAmount = Number(monthlyAmounts.value[i]);
    }

    if (amountType.value === AmountTypes.Net) {
      let netAmount = amount.value;

      if (hasAmountForEachMonth.value) {
        netAmount = Number(monthlyAmounts.value[i]);
      }

      const calculator = new EmployeeCalculator();
      inputFields.grossAmount = findGrossAmountUsingNetAmount(
        (grossAmount) => {
          inputFields.grossAmount = grossAmount;
          return calculator
            .setSumUpAmounts(sumUpAmounts)
            .setInputData(inputFields)
            .calculate()
            .getResult();
        },
        0.5 * netAmount,
        2 * netAmount,
        netAmount,
      );
      sumUpAmounts = new EmployeeCalculator(true)
        .setSumUpAmounts(sumUpAmounts)
        .setInputData(inputFields)
        .calculate()
        .getSumUpAmounts();
    }

    monhtlyInputFields.push(inputFields);
  }

  store.monthlyInputFields = monhtlyInputFields;

  incrementCalculationCount();
  emit('submit');
};
</script>
