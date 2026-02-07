<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection title="Dane najmu">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-input
            v-model.number="monthlyRent"
            type="number"
            min="0"
            step="0.01"
            label="Miesięczny przychód z najmu (zł)"
            suffix="zł"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>Czysty czynsz najmu, bez opłat za media i czynsz administracyjny</Tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-input
            v-model.number="monthlyExpenses"
            type="number"
            min="0"
            step="0.01"
            label="Miesięczne koszty utrzymania (zł)"
            suffix="zł"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>Twoje wydatki jako wynajmującego (ubezpieczenie, naprawy, kredyt). NIE zmniejszają podatku ryczałtowego, ale wpływają na realny zysk netto</Tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-input
            v-model.number="refactoredCharges"
            type="number"
            min="0"
            step="0.01"
            label="Opłaty refakturowane na najemcę (zł/mies.)"
            suffix="zł"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>Kwoty, które najemca Ci płaci, a Ty przekazujesz dalej (spółdzielnia, dostawcy mediów). Zmniejszają przychód do opodatkowania ryczałtem</Tooltip>
            </template>
          </q-input>
        </div>
      </div>
    </FormSection>
    <FormSection title="Okres i opcje">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-input
            v-model.number="numberOfYears"
            type="number"
            min="1"
            max="30"
            step="1"
            label="Liczba lat"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(1), validationRules.maxValue(30)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>Na ile lat chcesz zobaczyć projekcję zysku z najmu</Tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-input
            v-model.number="vacancyMonths"
            type="number"
            min="0"
            max="12"
            step="1"
            label="Pustostany (miesiące bez najemcy w roku)"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0), validationRules.maxValue(12)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>Ile miesięcy w roku przewidujesz bez najemcy. Przychód zmniejsza się proporcjonalnie, koszty utrzymania pozostają</Tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-input
            v-model.number="annualRentIncrease"
            type="number"
            min="0"
            max="100"
            step="0.1"
            label="Roczna waloryzacja czynszu (%)"
            suffix="%"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0), validationRules.maxValue(100)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>O ile procent rocznie planujesz podnosić czynsz. Stosowane w projekcji wieloletniej</Tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-toggle
            v-model="isSpouseSettlement"
            checked-icon="check"
            unchecked-icon="clear"
            label="Rozliczenie małżonków (próg 200 000 zł)"
          />
          <Tooltip>Zaznacz, jeśli składasz oświadczenie o opodatkowaniu całości przychodu z najmu u jednego z małżonków. Próg podwyższonej stawki rośnie do 200 000 zł</Tooltip>
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {InputFields} from 'components/rentalProfit/interfaces/InputFields'
import {useFormValidation} from 'src/composables/formValidation'
import {useLocalStorage} from '@vueuse/core'
import {useRentalProfitStore} from 'components/rentalProfit/store'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()
const store = useRentalProfitStore()

const monthlyRent = useLocalStorage('rentalProfit/form/monthlyRent', 3000, {mergeDefaults: true})
const monthlyExpenses = useLocalStorage('rentalProfit/form/monthlyExpenses', 500, {mergeDefaults: true})
const refactoredCharges = useLocalStorage('rentalProfit/form/refactoredCharges', 0, {mergeDefaults: true})
const numberOfYears = useLocalStorage('rentalProfit/form/numberOfYears', 1, {mergeDefaults: true})
const isSpouseSettlement = useLocalStorage('rentalProfit/form/isSpouseSettlement', false, {mergeDefaults: true})
const vacancyMonths = useLocalStorage('rentalProfit/form/vacancyMonths', 0, {mergeDefaults: true})
const annualRentIncrease = useLocalStorage('rentalProfit/form/annualRentIncrease', 0, {mergeDefaults: true})

const handleFormSubmit = () => {
  if (!monthlyRent.value && monthlyRent.value !== 0) {
    return
  }

  const inputFields: InputFields = {
    monthlyRent: monthlyRent.value ?? 0,
    monthlyExpenses: monthlyExpenses.value ?? 0,
    refactoredCharges: refactoredCharges.value ?? 0,
    numberOfYears: numberOfYears.value ?? 1,
    isSpouseSettlement: isSpouseSettlement.value,
    vacancyMonths: vacancyMonths.value ?? 0,
    annualRentIncrease: annualRentIncrease.value ?? 0,
  }

  store.inputFields = inputFields

  emit('submit')
}
</script>
