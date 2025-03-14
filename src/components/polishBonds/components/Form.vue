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
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
          />
        </div>
      </div>

      <BondDescription
        v-if="bondType"
        :bond-type="bondType"
      />
    </FormSection>

    <FormSection title="Parametry obligacji">
      <CommonFields
        ref="commonFieldsRef"
      />
      <component
        :is="dynamicBondForm"
        v-if="bondType"
        :ref="setBondFormRef"
      />
      <p class="q-my-none text-caption text-grey">
        Aktualne oprocentowanie obligacji skarbowych znajduje się na stronie <a href="https://www.obligacjeskarbowe.pl/"
                                                                                target="_blank">obligacjeskarbowe.pl</a>.
      </p>
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
import { OtsCalculator } from 'components/polishBonds/logic/OtsCalculator'
import { OtsInputFields } from 'components/polishBonds/interfaces/OtsInputFields'
import { Result } from 'components/polishBonds/interfaces/Result'
import { RorCalculator } from 'components/polishBonds/logic/RorCalculator'
import { RorInputFields } from 'components/polishBonds/interfaces/RorInputFields'
import { TosCalculator } from 'components/polishBonds/logic/TosCalculator'
import { TosInputFields } from 'components/polishBonds/interfaces/TosInputFields'
import { computed, ref } from 'vue'
import { useFormValidation } from 'src/composables/formValidation'
import { useLocalStorage } from '@vueuse/core'
import BondDescription from '../components/BondDescription.vue'
import CoiForm from './bondForms/CoiForm.vue'
import CommonFields from './bondForms/CommonFields.vue'
import DorForm from './bondForms/DorForm.vue'
import EdoForm from './bondForms/EdoForm.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import OtsForm from './bondForms/OtsForm.vue'
import RorForm from './bondForms/RorForm.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import TosForm from './bondForms/TosForm.vue'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const { handleValidationError } = useFormValidation()
const store = usePolishBondsStore()

const commonFieldsRef = ref<InstanceType<typeof CommonFields> | null>(null)
const bondFormRef = ref<any>(null)

const otsFormRef = ref<InstanceType<typeof OtsForm> | null>(null)
const edoFormRef = ref<InstanceType<typeof EdoForm> | null>(null)
const coiFormRef = ref<InstanceType<typeof CoiForm> | null>(null)
const tosFormRef = ref<InstanceType<typeof TosForm> | null>(null)
const rorFormRef = ref<InstanceType<typeof RorForm> | null>(null)
const dorFormRef = ref<InstanceType<typeof DorForm> | null>(null)

const bondTypeOptions = [
  { label: 'OTS - Trzymiesięczne Oszczędnościowe', value: 'OTS' },
  { label: 'ROR - Roczne Obligacje Skarbowe', value: 'ROR' },
  { label: 'DOR - Dwuletnie Obligacje Skarbowe', value: 'DOR' },
  { label: 'TOS - Trzyletnie Oszczędnościowe', value: 'TOS' },
  { label: 'COI - Czteroletnie Obligacje Indeksowane', value: 'COI' },
  { label: 'EDO - Emerytalne Dziesięcioletnie Oszczędnościowe', value: 'EDO' },
  ]

const bondType = useLocalStorage<BondType>('polishBonds/form/bondType', 'EDO', { mergeDefaults: true })

const dynamicBondForm = computed(() => {
  switch (bondType.value) {
    case 'OTS': return OtsForm
    case 'EDO': return EdoForm
    case 'COI': return CoiForm
    case 'TOS': return TosForm
    case 'ROR': return RorForm
    case 'DOR': return DorForm
    default: return null
  }
})

const setBondFormRef = (el: any) => {
  bondFormRef.value = el

  switch (bondType.value) {
    case 'OTS':
      otsFormRef.value = el
      break
    case 'EDO':
      edoFormRef.value = el
      break
    case 'COI':
      coiFormRef.value = el
      break
    case 'TOS':
      tosFormRef.value = el
      break
    case 'ROR':
      rorFormRef.value = el
      break
    case 'DOR':
      dorFormRef.value = el
      break
  }
}

const handleFormSubmit = () => {
  store.selectedBondType = bondType.value

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
    case 'OTS':
      calculateOts()
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

const prepareCommonInputFields = () => {
  const common = commonFieldsRef.value
  if (!common) return null

  return {
    boughtBondCount: common.boughtBondCount,
    yearlyInflationRate: common.yearlyInflationRate / 100,
    belkaTax: common.belkaTax,
  }
}

type Calculator<T, R> = {
  setInputData(inputFields: T): Calculator<T, R>
  calculate(): Calculator<T, R>
  getResult(): R
}

function useCalculator<T extends EdoInputFields | CoiInputFields | TosInputFields | OtsInputFields | RorInputFields | DorInputFields>(
  calculator: Calculator<T, Result>,
  inputFields: T,
): void {
  store.result = calculator.setInputData(inputFields).calculate().getResult()
}

const calculateEdo = () => {
  const common = prepareCommonInputFields()
  const form = edoFormRef.value

  if (!common || !form) return

  const inputFields: EdoInputFields = {
    ...common,
    initialInterestRate: form.initialInterestRate / 100,
  }

  useCalculator(new EdoCalculator(), inputFields)
}

const calculateCoi = () => {
  const common = prepareCommonInputFields()
  const form = coiFormRef.value

  if (!common || !form) return

  const inputFields: CoiInputFields = {
    ...common,
    initialInterestRate: form.initialInterestRate / 100,
  }

  useCalculator(new CoiCalculator(), inputFields)
}

const calculateTos = () => {
  const common = prepareCommonInputFields()
  const form = tosFormRef.value

  if (!common || !form) return

  const inputFields: TosInputFields = {
    ...common,
    interestRate: form.interestRate / 100,
  }

  useCalculator(new TosCalculator(), inputFields)
}

const calculateOts = () => {
  const common = prepareCommonInputFields()
  const form = otsFormRef.value

  if (!common || !form) return

  const inputFields: OtsInputFields = {
    ...common,
    interestRate: form.interestRate / 100,
    initialInterestRate: form.interestRate / 100,
  }

  useCalculator(new OtsCalculator(), inputFields)
}

const calculateRor = () => {
  const common = prepareCommonInputFields()
  const form = rorFormRef.value

  if (!common || !form) return

  const inputFields: RorInputFields = {
    ...common,
    initialInterestRate: form.initialInterestRate / 100,
    nbpReferenceRates: form.nbpReferenceRates.map((rate: number) => rate / 100),
  }

  useCalculator(new RorCalculator(), inputFields)
}

const calculateDor = () => {
  const common = prepareCommonInputFields()
  const form = dorFormRef.value

  if (!common || !form) return

  const inputFields: DorInputFields = {
    ...common,
    initialInterestRate: form.initialInterestRate / 100,
    nbpReferenceRates: form.nbpReferenceRates.map((rate: number) => rate / 100),
  }

  useCalculator(new DorCalculator(), inputFields)
}
</script>
