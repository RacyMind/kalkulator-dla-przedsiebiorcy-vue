<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit"
  >
    <FormSection title="Informacje o zatrudnieniu i zwolnieniu lekarskim">
      <div class="row">
        <div class="col-12">
          <q-input
            v-model.number="basicAmount"
            type="number"
            min="0"
            step="0.01"
            suffix="zł"
            label="Podstawa wymiaru świadczenia"
            color="brand"
            :rules="[validationRules.requiredAmount]"
            hide-bottom-space
            lazy-rules="ondemand"
            aria-required="true"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm-6">
          <q-select
            v-model="rate"
            :options="sickTaxRates"
            label="Stawka zasiłku chorobowego"
            color="brand"
            emit-value
            map-options
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="dayCount"
            type="number"
            min="1"
            step="1"
            label="Liczba dni na zwolnieniu"
            color="brand"
            hide-bottom-space
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
            aria-required="true"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { SickPayRate } from 'components/sickPay/types/SickPayRate';
import { storeToRefs } from 'pinia';
import { useConstantsStore } from 'stores/constantsStore';
import { useFormValidation } from 'src/composables/formValidation';
import { useLocalStorage } from '@vueuse/core';
import { useSIckPayStore } from 'components/sickPay/store';
import FormSection from 'components/partials/form/FormSection.vue';
import SubmitButton from 'components/partials/form/SubmitButton.vue';
import validationRules from 'src/logic/validationRules';
import { useReviewPrompt } from 'src/composables/useReviewPrompt';

const emit = defineEmits(['submit']);

const { incrementCalculationCount } = useReviewPrompt();

const { handleValidationError } = useFormValidation();
const { wageStats } = storeToRefs(useConstantsStore());
const store = useSIckPayStore();

const sickTaxRates = [
  {
    label: '80%',
    value: 0.8 as SickPayRate,
  },
  {
    label: '100%',
    value: 1 as SickPayRate,
  },
];

const basicAmount = useLocalStorage(
  'sickPay/form/basicAmount',
  wageStats.value.minimumWage,
  { mergeDefaults: true },
);
const rate = useLocalStorage<SickPayRate>(
  'sickPay/form/rate',
  sickTaxRates[0].value,
  { mergeDefaults: true },
);
const dayCount = useLocalStorage('sickPay/form/dayCount', 7, {
  mergeDefaults: true,
});

const handleFormSubmit = () => {
  store.inputFields = {
    basicAmount: basicAmount.value,
    rate: rate.value,
    dayCount: dayCount.value,
  };

  incrementCalculationCount();
  emit('submit');
};
</script>
