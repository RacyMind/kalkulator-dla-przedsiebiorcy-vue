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
            type="number"
            min="0"
            step="0.01"
            label="Wynagrodzenie"
            suffix="zł"
            color="brand"
            :rules="[validationRules.requiredAmount]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <AmountTypeSelect
          v-model="amountType"
          class="col-shrink" />
      </div>
    </FormSection>
    <FormSection title="Koszty uzyskania przychodu">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="contractWithEmployer"
            checked-icon="check"
            unchecked-icon="clear"
            label="Umowa z obecnym pracodawcą"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-select
            v-model="expenseRate"
            :options="expenseRateOptions"
            emit-value
            map-options
            label="Koszty uzyskania przychodów" />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>
<script setup lang="ts">
import {AmountTypes, useConstantsStore} from 'stores/constantsStore'
import {storeToRefs} from 'pinia'
import {ContractWorkCalculator} from 'components/contractWork/logic/ContractWorkCalculator'
import {ExpenseRate} from 'components/contractWork/types/ExpenseRate'
import {InputFields} from 'components/contractWork/interfaces/InputFields'
import {findGrossAmountUsingNetAmount} from 'src/logic/findGrossAmountUsingNetAmount'
import {useContractWorkStore} from 'components/contractWork/store'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useLocalStorage} from '@vueuse/core'
import AmountTypeSelect from 'components/partials/form/AmountTypeSelect.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const { incomeTaxConstants, wageStats } = storeToRefs(useConstantsStore())
const {handleValidationError} = useFormValidation()
const { availableDates } = useLawRuleDate()
const store = useContractWorkStore()

const expenseRateOptions = [
  {
    label: '20%',
    value: incomeTaxConstants.value.taxScale.expenses.rates.default,
  },
  {
    label: '50%',
    value: incomeTaxConstants.value.taxScale.expenses.rates.author,
  },
]

const amount = useLocalStorage('contractWork/form/amount', wageStats.value.minimumWage(), { mergeDefaults: true })
const amountType =  useLocalStorage<AmountTypes>('contractWork/form/amountType', AmountTypes.Gross, { mergeDefaults: true })
const expenseRate = useLocalStorage<ExpenseRate>('contractWork/form/expenseRate', incomeTaxConstants.value.taxScale.expenses.rates.default as ExpenseRate, { mergeDefaults: true })
const contractWithEmployer =  useLocalStorage('contractWork/form/contractWithEmployer', false, { mergeDefaults: true })

const handleFormSubmit = () => {
  if (!amount.value) {
    return
  }

  const basicInputFields: InputFields = {
    grossAmount: amount.value,
    expenseRate: expenseRate.value,
    canLumpSumTaxBe: !contractWithEmployer.value,
  }

  if(amountType.value === AmountTypes.Net) {
    let netAmount = amount.value

    const calculator = new ContractWorkCalculator()
    basicInputFields.grossAmount = findGrossAmountUsingNetAmount(
      (grossAmount) => {
        basicInputFields.grossAmount = grossAmount
        return calculator.setInputData(basicInputFields).calculate().getResult()
      },
      0.5 * netAmount, 2 * netAmount, netAmount,
    )
  }

  store.inputFields = basicInputFields

  emit('submit')
}
</script>
