<template>
  <q-form @validation-error="handleValidationError" @submit.prevent="save">
    <FormSection title="Kwota i odsetki">
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model.number="amount"
            type="number"
            min="0"
            step="0.01"
            suffix="zł"
            label="Kwota"
            autofocus
            color="brand"
            data-testid="amount"
            :rules="[validationRules.requiredAmount]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model.number="rate"
            type="number"
            min="0"
            step="0.01"
            suffix="%"
            label="Odsetki"
            color="brand"
            data-testid="rate"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
      </div>
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-toggle
            v-model="isBasicCapitalRate"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            class="q-mt-sm"
            data-testid="basic-capital-rate"
            label="Ustawowe odsetki kapitałowe"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            v-model="isBasicLateRate"
            :checked-icon="matCheck"
            :unchecked-icon="matClear"
            class="q-mt-sm"
            data-testid="basic-late-rate"
            label="Ustawowe odsetki za opóźnienie"
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Okres naliczania">
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="startDate"
            color="brand"
            mask="##.##.####"
            label="Termin zapłaty"
            :rules="[validationRules.required]"
            data-testid="startDate"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template v-slot:append>
              <q-icon :name="matEvent" class="cursor-pointer"> </q-icon>
            </template>
            <DatePopup v-model="startDate" />
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="endDate"
            color="brand"
            mask="##.##.####"
            label="Data zapłaty"
            :rules="[validationRules.required]"
            data-testid="endDate"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          >
            <template v-slot:append>
              <q-icon :name="matEvent" class="cursor-pointer"> </q-icon>
            </template>
            <DatePopup v-model="endDate" />
          </q-input>
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { InterestInputFields } from 'components/interest/interfaces/InterestInputFields';
import { computed, ref, watch } from 'vue';
import { differenceInDays, parse } from 'date-fns';
import { useFormValidation } from 'src/composables/formValidation';
import DatePopup from 'components/partials/DatePopup.vue';
import FormSection from 'components/partials/form/FormSection.vue';
import SubmitButton from 'components/partials/form/SubmitButton.vue';
import { useConstantsStore } from 'stores/constantsStore';
import validationRules from 'src/logic/validationRules';
import { matCheck, matClear, matEvent } from 'src/icons';
import { useReviewPrompt } from 'src/composables/useReviewPrompt';

const constants = useConstantsStore();

const { incrementCalculationCount } = useReviewPrompt();

const emit = defineEmits<{
  save: [input: InterestInputFields];
}>();

const { handleValidationError } = useFormValidation();
const amount = ref<number | null>(null);
const rate = ref(constants.basicCapitalInterestRate);

const startDate = ref('');
const endDate = ref('');

const isBasicCapitalRate = ref(true);
const isBasicLateRate = ref(false);

const formattedStartDate = computed(() => {
  return parse(startDate.value, 'dd.MM.yyyy', new Date());
});

const formattedEndDate = computed(() => {
  return parse(endDate.value, 'dd.MM.yyyy', new Date());
});

watch(isBasicCapitalRate, () => {
  if (isBasicCapitalRate.value) {
    isBasicLateRate.value = false;
    rate.value = constants.basicCapitalInterestRate;
  }
});

watch(isBasicLateRate, () => {
  if (isBasicLateRate.value) {
    isBasicCapitalRate.value = false;
    rate.value = constants.basicLateInterestRate;
  }
});

watch(rate, () => {
  isBasicCapitalRate.value = rate.value === constants.basicCapitalInterestRate;
  isBasicLateRate.value = rate.value === constants.basicLateInterestRate;
});

const save = () => {
  const input: InterestInputFields = {
    amount: Number(amount.value),
    dayCount: differenceInDays(
      new Date(formattedEndDate.value),
      new Date(formattedStartDate.value),
    ),
    rate: Number(rate.value) / 100,
  };
  incrementCalculationCount();
  emit('save', input);
};
</script>
