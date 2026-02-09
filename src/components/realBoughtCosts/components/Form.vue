<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit"
  >
    <FormSection title="Cena">
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="price"
            type="number"
            min="0"
            step="0.01"
            label="Cena brutto"
            suffix="zł"
            color="brand"
            hide-bottom-space
            :rules="[(val) => !!val || '* Wpisz kwotę']"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-12 col-sm-6">
          <VatTaxRateSelect v-model="vatTaxRate" />
        </div>
      </div>
    </FormSection>
    <FormSection title="Odliczenia podatku">
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm-6">
          <q-select
            v-model.number="incomeTaxRate"
            :options="deductedIncomeTaxOptions"
            label="Odliczanie podatku dochodowego"
            color="brand"
            required
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-select
            v-model.number="deductedVatTaxPart"
            :options="deductedVatTaxPartOptions"
            label="Odliczanie podatku VAT"
            color="brand"
            required
            emit-value
            map-options
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { AvailableVatRate } from 'src/logic/taxes/interfaces/AvailableVatRate';
import { useFormValidation } from 'src/composables/formValidation';
import { useLocalStorage } from '@vueuse/core';
import { useRealBoughtCostStore } from 'components/realBoughtCosts/store';
import FormSection from 'components/partials/form/FormSection.vue';
import SubmitButton from 'components/partials/form/SubmitButton.vue';
import VatTaxRateSelect from 'components/partials/form/VatTaxRateSelect.vue';
import helpers from 'src/logic/helpers';
import { useReviewPrompt } from 'src/composables/useReviewPrompt';

type AvailableDeductedVatTaxPart = 0 | 0.5 | 1;
type IncomeTaxRate = 0 | 0.12 | 0.19 | 0.32;

const emit = defineEmits(['submit']);

const { incrementCalculationCount } = useReviewPrompt();

const deductedVatTaxPartOptions: {
  label: string;
  value: AvailableDeductedVatTaxPart;
}[] = [
  {
    label: 'Nie odliczaj podatku VAT',
    value: 0,
  },
  {
    label: 'Odlicz 50% podatku VAT',
    value: 0.5,
  },
  {
    label: 'Odlicz całość podatku VAT',
    value: 1,
  },
];

const deductedIncomeTaxOptions: { label: string; value: IncomeTaxRate }[] = [
  {
    label: 'Nie odliczaj podatku dochodowego',
    value: 0,
  },
  {
    label: '12%',
    value: 0.12,
  },
  {
    label: '19%',
    value: 0.19,
  },
  {
    label: '32%',
    value: 0.32,
  },
];

const { handleValidationError } = useFormValidation();
const store = useRealBoughtCostStore();

const price = useLocalStorage(
  'realBoughtCosts/form/price',
  helpers.round(1000),
  { mergeDefaults: true },
);
const vatTaxRate = useLocalStorage<AvailableVatRate>(
  'realBoughtCosts/form/vatTaxRate',
  0.23,
  { mergeDefaults: true },
);
const deductedVatTaxPart = useLocalStorage<AvailableDeductedVatTaxPart>(
  'realBoughtCosts/form/deductedVatTaxPart',
  1,
  { mergeDefaults: true },
);
const incomeTaxRate = useLocalStorage<IncomeTaxRate>(
  'realBoughtCosts/form/incomeTaxRate',
  0.12,
  { mergeDefaults: true },
);

const handleFormSubmit = () => {
  store.inputFields = {
    price: price.value,
    vatTaxRate: vatTaxRate.value,
    deductedVatTaxPart: deductedVatTaxPart.value,
    incomeTaxRate: incomeTaxRate.value,
  };

  incrementCalculationCount();
  emit('submit');
};
</script>
