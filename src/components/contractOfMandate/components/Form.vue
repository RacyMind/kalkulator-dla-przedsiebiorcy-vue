<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection title="Wynagrodzenie">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="isHourlyAmount"
            checked-icon="check"
            unchecked-icon="clear"
            label="Stawka godzinowa"
            size="lg"
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
      <div class="row items-center q-col-gutter-sm">
        <div class="col-grow">
          <q-input
            v-model.number="amount"
            :disable="isHourlyAmount"
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
          />
        </div>
        <div class="col-shrink">
          <q-radio
            v-model="amountType"
            :val="constants.AMOUNT_TYPES.NET"
            label="netto"
          />
          <q-radio
            v-model="amountType"
            :val="constants.AMOUNT_TYPES.GROSS"
            label="brutto"
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Podatek dochodowy">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-grow">
          <q-toggle
            v-model="areAuthorExpenses"
            checked-icon="check"
            unchecked-icon="clear"
            label="Autorskie koszty uzyskania przychodu (50%)"
          />
          <q-input
            v-if="areAuthorExpenses"
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
            hide-bottom-space
          />
        </div>
        <div class="col">
          <q-toggle
            v-model="hasTaxFreeAmount"
            label="Kwota wolna od podatku"
            checked-icon="check"
            unchecked-icon="clear"
          />
          <q-select
            v-if="hasTaxFreeAmount"
            v-model="employerCount"
            :options="employerCountOptions"
            emit-value
            map-options
            label="Kwota odliczana u" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasTaxRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga podatkowa"
          />
          <Tooltip class="q-ml-sm">
            Brak naliczania podatku dochodowego dla wynagrrodzenia brutto do {{ pln(GeneraLRule.taxReliefLimit)}}.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów
          </Tooltip>
        </div>
      </div>
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
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-sm-grow">
          <q-toggle
            v-model="isFpContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka na Fundusz Pracy"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="accidentContributionRate"
            type="number"
            class="full-width"
            min="0"
            step="0.01"
            label="Składka wypadkowa*"
            color="brand"
            suffix="%"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
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
            :min="constants.PPK.EMPLOYER.MINIMUM_RATE"
            :max="constants.PPK.EMPLOYER.MAXIMUM_RATE"
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
            :min="constants.PPK.EMPLOYER.MINIMUM_RATE"
            :max="constants.PPK.EMPLOYER.MAXIMUM_RATE"
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
    <div class="row">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="brand"
          size="md"
          label="Oblicz"
        />
      </div>
    </div>
  </q-form>
</template>
<script setup lang="ts">
import {AmountType} from 'src/types/AmountType'
import {AvailableYear} from 'src/types/AvailableYear'
import {GeneraLRule} from '../../../logic/taxes/GeneraLRule'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import {Ref, computed, ref, watch} from 'vue'
import {pln} from '../../../use/currencyFormat'
import {useMandateContractStore} from 'components/contractOfMandate/store'
import {useQuasar} from 'quasar'
import FormSection from 'components/partials/FormSection.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const $q = useQuasar()
const store = useMandateContractStore()

const employerCountOptions = [
  {
    label: '1 pracodawcy',
    value: 1,
  },
  {
    label: '2 pracodawców',
    value: 2,
  },
  {
    label: '3 pracodawców',
    value: 3,
  },
]

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
const isHourlyAmount = ref(false)
const amount:Ref<number|null> = ref(null)
const hourlyAmount:Ref<number|null> = ref(null)
const hourCount:Ref<number|null> = ref(null)
const amountType:Ref<AmountType> = ref(constants.AMOUNT_TYPES.GROSS)

// the income tax section
const areAuthorExpenses = ref(false)
const partOfWorkWithAuthorExpenses = ref(100)
const hasTaxRelief = ref(false)
const hasTaxFreeAmount = ref(true)
const employerCount = ref(1)

// the ZUS contribution section
const contributionScheme:Ref<ContributionSchemes> = ref(ContributionSchemes.Unemployed)
const isHealthContribution = ref(true)
const isSickContribution = ref(true)
const isDisabilityContribution = ref(true)
const isPensionContribution = ref(true)
const isFpContribution = ref(false)
const isPpkContribution = ref(false)
const employerPpkContributionRate = ref(constants.PPK.EMPLOYER.DEFAULT_RATE)
const employeePpkContributionRate = ref(constants.PPK.EMPLOYEE.DEFAULT_RATE)
const accidentContributionRate = ref(constants.ACCIDENT_RATE)

watch(amountType, () => {
  if (amountType.value === constants.AMOUNT_TYPES.NET) {
    $q.notify({
      message: 'Przy wynagrodzeniu netto obliczenia są szacunkowe. Zalecane jest korzystanie z wynagroodzenia brutto, by poznać dokładne obliczenia.',
    })
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
      accidentContributionRate.value = constants.ACCIDENT_RATE
      break
    case ContributionSchemes.ContractWithEmployer:
      isHealthContribution.value = true
      isSickContribution.value = true
      isDisabilityContribution.value = true
      isPensionContribution.value = true
      isFpContribution.value = true
      accidentContributionRate.value = constants.ACCIDENT_RATE
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
      accidentContributionRate.value = constants.ACCIDENT_RATE
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

watch(hourlyAmount, () => {
  if (!isHourlyAmount.value) {
    return
  }
  if(!hourlyAmount.value || !hourCount.value) {
    return
  }
  amount.value = helpers.round(hourlyAmount.value * hourCount.value, 2)
})
watch(hourCount, () => {
  if (!isHourlyAmount.value) {
    return
  }
  if(!hourlyAmount.value || !hourCount.value) {
    return
  }
  amount.value = helpers.round(hourlyAmount.value * hourCount.value, 2)
})

const handleValidationError = () => {
  $q.notify({
    color: 'negative',
    message: 'Formularz zawiera błędy.',
  })
}

const handleFormSubmit = () => {
  const inputFields: InputFields = {
    grossAmount: amount.value ?? 0,
    hasTaxRelief: hasTaxRelief.value,
    partTaxReducingAmount: hasTaxFreeAmount.value ? employerCount.value * 12 : 0,
    canLumpSumTaxBe: true,
    partOfWorkWithAuthorExpenses: areAuthorExpenses.value ? helpers.round(partOfWorkWithAuthorExpenses.value / 100, 2) : 0,
    isHealthContribution: isHealthContribution.value,
    isDisabilityContribution: isDisabilityContribution.value,
    isPensionContribution: isPensionContribution.value,
    isSickContribution: isSickContribution.value,
    isFpContribution: isFpContribution.value,
    accidentContributionRate: helpers.round(accidentContributionRate.value / 100, 3),
    employeePpkContributionRate: isPpkContribution.value ? helpers.round(employeePpkContributionRate.value / 100, 3) : 0,
    employerPpkContributionRate: isPpkContribution.value ? helpers.round(employerPpkContributionRate.value / 100, 3) : 0,
  }

  const monhtlyInputFields: InputFields[] = []

  for (let i = 0; i < 12; i++) {
    monhtlyInputFields.push(inputFields)
  }

  store.monthlyInputFields = monhtlyInputFields
}
</script>
