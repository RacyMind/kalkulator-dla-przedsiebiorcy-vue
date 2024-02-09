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
            label="Przychód (bez VAT)"
            suffix="zł"
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
      <EachMonthAmountFields
        v-if="hasRevenueForEachMonth"
        v-model="monthlyRevenues"
      />
      <div class="row text-grey">
        <div class="col">
          <template v-if="settingStore.dateOfLawRules.getFullYear() <= 2023">
            <ul class="q-px-md q-my-none">
              <li>Przed 1. lipca uzyskany przychód nie może przekroczyć w okresie miesiąca 50% minimalnej kwoty wynagrodzenia.</li>
              <li>Od 1. lipca uzyskany przychód nie może przekroczyć w okresie miesiąca 75% minimalnej kwoty wynagrodzenia.</li>
            </ul>
          </template>
          <template v-else>
            Uzyskany przychód nie może przekroczyć w okresie miesiąca 75% minimalnej kwoty wynagrodzenia.
          </template>
        </div>
      </div>
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

import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {useConstants} from 'src/composables/constants'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useLocalStorage} from '@vueuse/core'
import {useMonthlyAmounts} from 'src/composables/monthlyAmounts'
import {useSettingStore} from 'stores/settingStore'
import {useTaxFreeAmount} from 'src/composables/taxFreeAmount'
import {useUnregisteredCompanyStore} from 'components/unregisteredCompany/store'
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import TaxFreeAmountFields from 'components/partials/form/TaxFreeAmountFields.vue'
import helpers from 'src/logic/helpers'

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()
const { availableDates } = useLawRuleDate()
const settingStore = useSettingStore()
const store = useUnregisteredCompanyStore()
const { wageStats } = useConstants()

const revenue = useLocalStorage('unregisteredCompany/form/revenue', helpers.round(0.75 * wageStats.value.minimumWage()), { mergeDefaults: true })
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

  const monthlyInputFields: InputFields[] = []

  for (let i = 0; i < 12; i++) {
    const inputFields: InputFields = {
      ...basicInputFields,
    }

    if(hasRevenueForEachMonth.value) {
      inputFields.revenue = monthlyRevenues.value[i]
    }
    if(hasExpensesForEachMonth.value) {
      inputFields.expenses = monthlyExpenses.value[i]
    }

    monthlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monthlyInputFields

  emit('submit')
}
</script>
