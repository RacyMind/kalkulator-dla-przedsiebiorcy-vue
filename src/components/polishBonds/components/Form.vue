<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit"
  >
    <FormSection title="Rodzaj obligacji">
      <div class="row">
        <div class="col">
          <q-select
            v-model="bondType"
            :options="bondTypeOptions"
            label="Wybierz rodzaj obligacji"
            emit-value
            map-options
            color="brand"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
            aria-required="true"
          />
        </div>
      </div>

      <BondDescription v-if="bondType" :bond-type="bondType" />
    </FormSection>

    <FormSection title="Parametry obligacji">
      <CommonFields ref="commonFieldsRef" />
      <component :is="bondForm" v-if="bondType" :ref="setBondFormRef" />
      <p class="q-my-none text-caption text-grey">
        Aktualne oprocentowanie obligacji skarbowych znajduje się na stronie
        <a href="https://www.obligacjeskarbowe.pl/" target="_blank"
          >obligacjeskarbowe.pl</a
        >.
      </p>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { BondType, usePolishBondsStore } from 'components/polishBonds/store'
import { computed, ref } from 'vue'
import { useFormValidation } from 'src/composables/formValidation'
import { useLocalStorage } from '@vueuse/core'
import BondDescription from 'components/polishBonds/components/BondDescription.vue'
import CoiForm from 'components/polishBonds/components/bondForms/CoiForm.vue'
import CommonFields from 'components/polishBonds/components/bondForms/CommonFields.vue'
import DorForm from 'components/polishBonds/components/bondForms/DorForm.vue'
import EdoForm from 'components/polishBonds/components/bondForms/EdoForm.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import OtsForm from 'components/polishBonds/components/bondForms/OtsForm.vue'
import RodForm from 'components/polishBonds/components/bondForms/RodForm.vue'
import RorForm from 'components/polishBonds/components/bondForms/RorForm.vue'
import RosForm from 'components/polishBonds/components/bondForms/RosForm.vue'
import SubmitButton from 'src/components/partials/form/SubmitButton.vue'
import TosForm from 'components/polishBonds/components/bondForms/TosForm.vue'
import validationRules from 'src/logic/validationRules'
import { useReviewPrompt } from 'src/composables/useReviewPrompt'

const emit = defineEmits(['submit'])

const { incrementCalculationCount } = useReviewPrompt()

const { handleValidationError } = useFormValidation()
const store = usePolishBondsStore()
const bondType = useLocalStorage<BondType>('polishBonds/form/bondType', 'EDO', {
  mergeDefaults: true,
})
const bondCount = ref<number | null>(null)
const yearlyInflationRate = ref<number | null>(null)
const belkaTax = ref(true)

const bondTypeOptions = [
  { label: 'OTS - Obligacje 3-miesięczne', value: 'OTS' },
  { label: 'ROR - Obligacje roczne', value: 'ROR' },
  { label: 'DOR - Obligacje 2-letnie', value: 'DOR' },
  { label: 'TOS - Obligacje 3-letnie', value: 'TOS' },
  { label: 'COI - Obligacje 4-letnie', value: 'COI' },
  { label: 'ROS - Obligacje 6-letnie', value: 'ROS' },
  { label: 'EDO - Obligacje 10-letnie', value: 'EDO' },
  { label: 'ROD - Obligacje 12-letnie', value: 'ROD' },
]

const bondForm = computed(() => {
  switch (bondType.value) {
    case 'EDO':
      return EdoForm
    case 'COI':
      return CoiForm
    case 'TOS':
      return TosForm
    case 'OTS':
      return OtsForm
    case 'ROR':
      return RorForm
    case 'DOR':
      return DorForm
    case 'ROS':
      return RosForm
    case 'ROD':
      return RodForm
    default:
      return EdoForm
  }
})

const bondFormRef = ref<any>(null)
const commonFieldsRef = ref()

const saveCommonFields = () => {
  const commonFieldsValue = commonFieldsRef.value

  if (!commonFieldsValue) {
    return false
  }

  store.commonInputFields = {
    boughtBondCount: commonFieldsValue.boughtBondCount,
    yearlyInflationRate: commonFieldsValue.yearlyInflationRate,
    belkaTax: commonFieldsValue.belkaTax,
  }

  return true
}

const handleFormSubmit = () => {
  if (!saveCommonFields()) {
    return
  }

  store.selectedBondType = bondType.value

  // Save bond-specific fields to store
  const bondFormRefValue = bondFormRef.value
  if (!bondFormRefValue) {
    return
  }

  const commonFields = {
    boughtBondCount: bondCount.value || 0,
    yearlyInflationRate: yearlyInflationRate.value || 0,
    belkaTax: belkaTax.value,
  }

  switch (bondType.value) {
    case 'EDO':
      store.edoInputFields = {
        ...commonFields,
        initialInterestRate: bondFormRefValue.initialInterestRate,
      }
      break
    case 'COI':
      store.coiInputFields = {
        ...commonFields,
        initialInterestRate: bondFormRefValue.initialInterestRate,
      }
      break
    case 'TOS':
      store.tosInputFields = {
        ...commonFields,
        interestRate: bondFormRefValue.interestRate,
      }
      break
    case 'OTS':
      store.otsInputFields = {
        ...commonFields,
        interestRate: bondFormRefValue.interestRate,
      }
      break
    case 'ROR':
      store.rorInputFields = {
        ...commonFields,
        initialInterestRate: bondFormRefValue.initialInterestRate,
        nbpReferenceRates: bondFormRefValue.nbpReferenceRates,
      }
      break
    case 'DOR':
      store.dorInputFields = {
        ...commonFields,
        initialInterestRate: bondFormRefValue.initialInterestRate,
        nbpReferenceRates: bondFormRefValue.nbpReferenceRates,
      }
      break
    case 'ROS':
      store.rosInputFields = {
        ...commonFields,
        initialInterestRate: bondFormRefValue.initialInterestRate,
      }
      break
    case 'ROD':
      store.rodInputFields = {
        ...commonFields,
        initialInterestRate: bondFormRefValue.initialInterestRate,
      }
      break
  }

  incrementCalculationCount()
  emit('submit')
}

const setBondFormRef = (el: any) => {
  bondFormRef.value = el
}
</script>
