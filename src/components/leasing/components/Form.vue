<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit"
  >
    <FormSection title="Przedmiot leasingu">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-input
            v-model.number="netAssetValue"
            type="number"
            min="0"
            step="0.01"
            label="Wartość przedmiotu netto"
            suffix="zł"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.greaterThan(0),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>
                Cena netto przedmiotu leasingu (bez VAT). Jeśli znasz cenę
                brutto, podziel ją przez 1,23.
              </Tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-select
            v-model="assetType"
            :options="assetTypeOptions"
            emit-value
            map-options
            label="Typ przedmiotu"
          />
        </div>
      </div>
      <div
        v-if="assetType === AssetType.Car"
        class="row q-col-gutter-sm q-mb-sm"
      >
        <div class="col-12">
          <q-select
            v-model="emissionCategory"
            :options="emissionCategoryOptions"
            emit-value
            map-options
            label="Kategoria emisji CO₂"
          >
            <template #append>
              <Tooltip>
                Kategoria wpływa na limit kosztów podatkowych: spalinowe 100
                tys., hybrydy plug-in 150 tys., elektryczne 225 tys. zł.
              </Tooltip>
            </template>
          </q-select>
        </div>
      </div>
    </FormSection>
    <FormSection title="Parametry umowy">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="initialPaymentRate"
            type="number"
            min="0"
            max="90"
            step="0.1"
            label="Opłata wstępna"
            suffix="%"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(0),
              validationRules.maxValue(90),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>
                Procent wartości przedmiotu płatny na początku umowy. Im wyższa,
                tym niższa rata.
              </Tooltip>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="installmentCount"
            type="number"
            min="24"
            max="84"
            step="1"
            label="Liczba rat"
            suffix="mies."
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(24),
              validationRules.maxValue(84),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>
                Minimalny okres leasingu operacyjnego to 24 miesiące (wymóg
                ustawowy).
              </Tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="residualValueRate"
            type="number"
            min="0"
            max="50"
            step="0.1"
            label="Wartość wykupu"
            suffix="%"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(0),
              validationRules.maxValue(50),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>
                Procent wartości przedmiotu do zapłaty po zakończeniu umowy.
                Typowo 1–20%.
              </Tooltip>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="annualInterestRate"
            type="number"
            min="0"
            max="30"
            step="0.01"
            label="Oprocentowanie roczne"
            suffix="%"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(0),
              validationRules.maxValue(30),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template #append>
              <Tooltip>
                Nominalna roczna stopa procentowa. W praktyce to WIBOR + marża
                leasingodawcy.
              </Tooltip>
            </template>
          </q-input>
        </div>
      </div>
    </FormSection>
    <FormSection title="Opcje podatkowe" :hide-separator="true">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-6">
          <VatTaxRateSelect v-model="vatRate" />
        </div>
        <div class="col-12 col-sm-6">
          <q-select
            v-model="vatDeductionRate"
            :options="vatDeductionOptions"
            emit-value
            map-options
            label="Odliczenie VAT"
          >
            <template #append>
              <Tooltip>
                100% — auto wyłącznie firmowe (wymaga VAT-26 i kilometrówki).
                50% — użytkowanie mieszane.
              </Tooltip>
            </template>
          </q-select>
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>
<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import {
  AssetType,
  EmissionCategory,
  VatDeductionRate,
} from 'components/leasing/types/LeasingTypes'
import { InputFields } from 'components/leasing/interfaces/InputFields'
import { useLeasingStore } from 'components/leasing/store'
import { useFormValidation } from 'src/composables/formValidation'
import { useReviewPrompt } from 'src/composables/useReviewPrompt'
import { AvailableVatRate } from 'src/logic/taxes/interfaces/AvailableVatRate'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import VatTaxRateSelect from 'components/partials/form/VatTaxRateSelect.vue'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const { incrementCalculationCount } = useReviewPrompt()
const { handleValidationError } = useFormValidation()
const store = useLeasingStore()

const assetTypeOptions = [
  { label: 'Samochód osobowy', value: AssetType.Car },
  { label: 'Inne (maszyny, pojazdy >3,5t)', value: AssetType.Other },
]

const emissionCategoryOptions = [
  {
    label: 'Spalinowy (≥50 g CO₂/km) — limit 100 tys. zł',
    value: EmissionCategory.Combustion,
  },
  {
    label: 'Hybryda plug-in (<50 g CO₂/km) — limit 150 tys. zł',
    value: EmissionCategory.PluginHybrid,
  },
  {
    label: 'Elektryczny — limit 225 tys. zł',
    value: EmissionCategory.Electric,
  },
]

const vatDeductionOptions = [
  { label: '100% — wyłącznie działalność', value: VatDeductionRate.Full },
  { label: '50% — użytkowanie mieszane', value: VatDeductionRate.Half },
  { label: '0% — nievatowiec', value: VatDeductionRate.None },
]

const netAssetValue = useLocalStorage('leasing/form/netAssetValue', 100000, {
  mergeDefaults: true,
})
const initialPaymentRate = useLocalStorage(
  'leasing/form/initialPaymentRate',
  10,
  { mergeDefaults: true },
)
const installmentCount = useLocalStorage('leasing/form/installmentCount', 36, {
  mergeDefaults: true,
})
const residualValueRate = useLocalStorage('leasing/form/residualValueRate', 1, {
  mergeDefaults: true,
})
const annualInterestRate = useLocalStorage(
  'leasing/form/annualInterestRate',
  8,
  { mergeDefaults: true },
)
const assetType = useLocalStorage<AssetType>(
  'leasing/form/assetType',
  AssetType.Car,
  { mergeDefaults: true },
)
const emissionCategory = useLocalStorage<EmissionCategory>(
  'leasing/form/emissionCategory',
  EmissionCategory.Combustion,
  { mergeDefaults: true },
)
const vatDeductionRate = useLocalStorage<VatDeductionRate>(
  'leasing/form/vatDeductionRate',
  VatDeductionRate.Half,
  { mergeDefaults: true },
)
const vatRate = useLocalStorage<AvailableVatRate>(
  'leasing/form/vatRate',
  0.23,
  { mergeDefaults: true },
)

const handleFormSubmit = () => {
  if (!netAssetValue.value) {
    return
  }

  const inputFields: InputFields = {
    netAssetValue: netAssetValue.value,
    initialPaymentRate: initialPaymentRate.value,
    installmentCount: installmentCount.value,
    residualValueRate: residualValueRate.value,
    annualInterestRate: annualInterestRate.value,
    assetType: assetType.value,
    emissionCategory: emissionCategory.value,
    vatDeductionRate: vatDeductionRate.value,
    vatRate: vatRate.value,
  }

  store.inputFields = inputFields

  incrementCalculationCount()
  emit('submit')
}
</script>
