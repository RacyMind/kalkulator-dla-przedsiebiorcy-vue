<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
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
      <AnnualAmountFields
        v-if="hasRevenueForEachMonth"
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
      <AnnualAmountFields
        v-if="hasExpensesForEachMonth"
        v-model="monthlyExpenses"
        :disable-until-month="businessHasStartedBeforeThisYear ? null : businessStartedInMonth"
      />
    </FormSection>
    <FormSection title="Podatek dochodowy">
      <TaxFreeAmountFields
        v-model:has-tax-free-amount="hasTaxFreeAmount"
        v-model:employer-count="employerCount" />
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">

import FormSection from "components/partials/form/FormSection.vue";
import LawRuleDate from "components/partials/LawRuleDate.vue";
import AnnualAmountFields from "components/partials/form/AnnualAmountFields.vue";
import TaxFreeAmountFields from "components/partials/form/TaxFreeAmountFields.vue";
import SubmitButton from "components/partials/form/SubmitButton.vue";
import {useFormValidation} from "src/composables/formValidation";
import {useLocalStorage} from "@vueuse/core";
import {useMonthlyAmounts} from "src/composables/monthlyAmounts";
import {useTaxFreeAmount} from "src/composables/taxFreeAmount";
import {InputFields} from "components/unregisteredCompany/interfaces/InputFields";
import helpers from "src/logic/helpers";

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()

const revenue = useLocalStorage('unregisteredCompany/form/revenue', 10000, { mergeDefaults: true })
const { monthlyAmounts: monthlyRevenues, hasAmountForEachMonth: hasRevenueForEachMonth } = useMonthlyAmounts(revenue, 'unregisteredCompany/form/revenue')
const expenses = useLocalStorage('unregisteredCompany/form/expenses', 0, { mergeDefaults: true })
const { monthlyAmounts: monthlyExpenses, hasAmountForEachMonth: hasExpensesForEachMonth } = useMonthlyAmounts(expenses, 'unregisteredCompany/form/expenses')
const { employerCount, hasTaxFreeAmount } = useTaxFreeAmount('unregisteredCompany/form')

const handleFormSubmit = () => {
  if (!revenue.value) {
    return
  }

  const basicInputFields: InputFields = {
    revenue: revenue.value,
    expenses: expenses.value ?? 0,
    partTaxReducingAmount: hasTaxFreeAmount.value ? employerCount.value * 12 : 0,
  }

  const monhtlyInputFields: InputFields[] = []

  for (let i = 0; i < 12; i++) {
    monhtlyInputFields.push(basicInputFields)
  }
}
</script>
