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
      <div class="row items-center q-col-gutter-sm q-mb-sm">
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
        <div class="col-shrink">
          <q-radio
            v-model="amountType"
            :val="AmountTypes.Net"
            label="netto"
          />
          <q-radio
            v-model="amountType"
            :val="AmountTypes.Gross"
            label="brutto"
          />
        </div>
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
      <AnnualAmountInput
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
            v-model="workInLivePlace"
            checked-icon="check"
            unchecked-icon="clear"
            label="Praca w miejscu zamieszkania"
          />
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col">
          <q-toggle
            v-model="hasTaxFreeAmount"
            label="Kwota wolna od podatku"
            checked-icon="check"
            unchecked-icon="clear"
          />
          <Tooltip class="q-ml-sm">
            Kwota wolna jest odliczana od podatku równomiernie w każdym miesiącu roku.
          </Tooltip>
        </div>
      </div>
      <div
        v-if="hasTaxFreeAmount"
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
      <div class="row q-col-gutter-md">
        <div class="col">
          <q-toggle
            v-model="areAuthorExpenses"
            checked-icon="check"
            unchecked-icon="clear"
            label="Autorskie koszty uzyskania przychodu (50%)"
          />
        </div>
      </div>
      <div
        v-if="areAuthorExpenses"
        class="row q-col-gutter-md">
        <div class="col">
          <q-input
            v-model.number="partOfWorkWithAuthorExpenses"
            type="number"
            min="0"
            max="100"
            step="1"
            label="Część pracy*"
            color="brand"
            suffix="%"
            :rules="[
              val => !!val || '* Wpisz wartość',
            ]"
          />
        </div>
      </div>
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
import {Ref, ref} from 'vue'
import {findGrossAmountUsingNetAmount} from 'src/logic/findGrossAmountUsingNetAmount'
import {pln} from 'src/use/currencyFormat'
import {useAmmmountType} from 'src/composables/amountType'
import {useEmploymentContractStore} from 'components/contractOfEmployment/store'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useMonthlyAmounts} from 'src/composables/monthlyAmounts'
import {useTaxFreeAmount} from 'src/composables/taxFreeAmount'
import AnnualAmountInput from 'components/partials/form/AnnualAmountInput.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import helpers from 'src/logic/helpers'

const emit = defineEmits(['submit'])

const store = useEmploymentContractStore()
const { availableDates } = useLawRuleDate()
const {handleValidationError} = useFormValidation()
const { zusConstants, incomeTaxConstnts } = useConstants()

// the salary section
const amount:Ref<number|null> = ref(null)
const amountType = useAmmmountType()
const { monthlyAmounts, hasAmountForEachMonth } = useMonthlyAmounts(amount)

// the income tax section
const workInLivePlace = ref(true)
const areAuthorExpenses = ref(false)
const partOfWorkWithAuthorExpenses = ref(100)
const hasTaxRelief = ref(false)
const { employerCountOptions, employerCount, hasTaxFreeAmount } = useTaxFreeAmount()

// the ZUS contribution section
const isFpContribution = ref(true)
const isPpkContribution = ref(false)
const employerPpkContributionRate = ref(zusConstants.value.employer.rates.ppkContribution.default * 100)
const employeePpkContributionRate = ref(zusConstants.value.employee.rates.ppkContribution.default * 100)
const accidentContributionRate = ref(zusConstants.value.employer.rates.accidentCContribution.default * 100)

const handleFormSubmit = () => {
  if (!amount.value) {
    return
  }

  const basicInputFields: InputFields = {
    grossAmount: amount.value ,
    hasTaxRelief: hasTaxRelief.value,
    partTaxReducingAmount: hasTaxFreeAmount.value ? employerCount.value * 12 : 0,
    partOfWorkWithAuthorExpenses: areAuthorExpenses.value ? helpers.round(partOfWorkWithAuthorExpenses.value / 100, 2) : 0,
    workInLivePlace: workInLivePlace.value,
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
