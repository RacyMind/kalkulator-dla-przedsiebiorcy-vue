<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
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
            :rules="[(val) => !!val || 'Uzupełnij pole']"
            lazy-rules="ondemand"
          />
        </div>
      </div>
    </FormSection>

    <FormSection title="Parametry obligacji">
      <CommonFields 
        ref="commonFieldsRef" 
      />

      <EdoForm 
        v-if="bondType === 'EDO'" 
        ref="edoFormRef" 
      />
      <CoiForm 
        v-if="bondType === 'COI'" 
        ref="coiFormRef" 
      />
      <TosForm 
        v-if="bondType === 'TOS'" 
        ref="tosFormRef" 
      />
      <RorForm 
        v-if="bondType === 'ROR'" 
        ref="rorFormRef" 
      />
      <DorForm 
        v-if="bondType === 'DOR'" 
        ref="dorFormRef" 
      />
    </FormSection>

    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { BondType, usePolishBondsStore } from 'components/polishBonds/store'
import { CoiCalculator } from 'components/polishBonds/logic/CoiCalculator'
import { CoiInputFields } from 'components/polishBonds/interfaces/CoiInputFields'
import { DorCalculator } from 'components/polishBonds/logic/DorCalculator'
import { DorInputFields } from 'components/polishBonds/interfaces/DorInputFields'
import { EdoCalculator } from 'components/polishBonds/logic/EdoCalculator'
import { EdoInputFields } from 'components/polishBonds/interfaces/EdoInputFields'
import { RorCalculator } from 'components/polishBonds/logic/RorCalculator'
import { RorInputFields } from 'components/polishBonds/interfaces/RorInputFields'
import { TosCalculator } from 'components/polishBonds/logic/TosCalculator'
import { TosInputFields } from 'components/polishBonds/interfaces/TosInputFields'
import { ref } from 'vue'
import { useFormValidation } from 'src/composables/formValidation'
import { useLocalStorage } from '@vueuse/core'
import CoiForm from './bondForms/CoiForm.vue'
import CommonFields from './bondForms/CommonFields.vue'
import DorForm from './bondForms/DorForm.vue'
import EdoForm from './bondForms/EdoForm.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import RorForm from './bondForms/RorForm.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import TosForm from './bondForms/TosForm.vue'

const emit = defineEmits(['submit'])

const { handleValidationError } = useFormValidation()
const store = usePolishBondsStore()

const commonFieldsRef = ref<InstanceType<typeof CommonFields> | null>(null)

const edoFormRef = ref<InstanceType<typeof EdoForm> | null>(null)

const coiFormRef = ref<InstanceType<typeof CoiForm> | null>(null)

const tosFormRef = ref<InstanceType<typeof TosForm> | null>(null)

const rorFormRef = ref<InstanceType<typeof RorForm> | null>(null)

const dorFormRef = ref<InstanceType<typeof DorForm> | null>(null)

const bondTypeOptions = [
  { label: 'EDO - Emerytalne Dziesięcioletnie Oszczędnościowe', value: 'EDO' },
  { label: 'COI - Czteroletnie Obligacje Indeksowane', value: 'COI' },
  { label: 'TOS - Trzymiesięczne Oszczędnościowe', value: 'TOS' },
  { label: 'ROR - Rodzinne Obligacje Skarbowe', value: 'ROR' },
  { label: 'DOR - Dwuletnie Obligacje Skarbowe', value: 'DOR' },
]

const bondType = useLocalStorage<BondType>('polishBonds/form/bondType', 'EDO', { mergeDefaults: true })

const handleFormSubmit = () => {
  store.selectedBondType = bondType.value
  
  // Save bond count to store
  if (commonFieldsRef.value) {
    store.bondCount = commonFieldsRef.value.boughtBondCount
  }
  
  switch (bondType.value) {
    case 'EDO':
      calculateEdo()
      break
    case 'COI':
      calculateCoi()
      break
    case 'TOS':
      calculateTos()
      break
    case 'ROR':
      calculateRor()
      break
    case 'DOR':
      calculateDor()
      break
  }
  
  emit('submit')
}

const calculateEdo = () => {
  const common = commonFieldsRef.value
  const form = edoFormRef.value
  
  if (!common || !form) return
  
  const inputFields: EdoInputFields = {
    boughtBondCount: common.boughtBondCount,
    yearlyInflationRate: common.yearlyInflationRate / 100, 
    belkaTax: common.belkaTax,
    initialInterestRate: form.initialInterestRate / 100, 
  }
  
  const calculator = new EdoCalculator()
  const result = calculator.setInputData(inputFields).calculate().getResult()
  store.result = result
}

const calculateCoi = () => {
  const common = commonFieldsRef.value
  const form = coiFormRef.value
  
  if (!common || !form) return
  
  const inputFields: CoiInputFields = {
    boughtBondCount: common.boughtBondCount,
    yearlyInflationRate: common.yearlyInflationRate / 100,
    belkaTax: common.belkaTax,
    initialInterestRate: form.initialInterestRate / 100,
  }
  
  const calculator = new CoiCalculator()
  const result = calculator.setInputData(inputFields).calculate().getResult()
  store.result = result
}

const calculateTos = () => {
  const common = commonFieldsRef.value
  const form = tosFormRef.value
  
  if (!common || !form) return
  
  const inputFields: TosInputFields = {
    boughtBondCount: common.boughtBondCount,
    yearlyInflationRate: common.yearlyInflationRate / 100,
    belkaTax: common.belkaTax,
    interestRate: form.interestRate / 100,
  }
  
  const calculator = new TosCalculator()
  const result = calculator.setInputData(inputFields).calculate().getResult()
  store.result = result
}

const calculateRor = () => {
  const common = commonFieldsRef.value
  const form = rorFormRef.value
  
  if (!common || !form) return
  
  const inputFields: RorInputFields = {
    boughtBondCount: common.boughtBondCount,
    yearlyInflationRate: common.yearlyInflationRate / 100,
    belkaTax: common.belkaTax,
    initialInterestRate: form.initialInterestRate / 100,
    nbpReferenceRates: form.nbpReferenceRates.map((rate: number) => rate / 100),
  }
  
  const calculator = new RorCalculator()
  const result = calculator.setInputData(inputFields).calculate().getResult()
  store.result = result
}

const calculateDor = () => {
  const common = commonFieldsRef.value
  const form = dorFormRef.value
  
  if (!common || !form) return
  
  const inputFields: DorInputFields = {
    boughtBondCount: common.boughtBondCount,
    yearlyInflationRate: common.yearlyInflationRate / 100,
    belkaTax: common.belkaTax,
    initialInterestRate: form.initialInterestRate / 100,
    nbpReferenceRates: form.nbpReferenceRates.map((rate: number) => rate / 100),
  }
  
  const calculator = new DorCalculator()
  const result = calculator.setInputData(inputFields).calculate().getResult()
  store.result = result
}
</script>
