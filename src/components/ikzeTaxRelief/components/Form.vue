<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
      <LawRuleDate />
    </FormSection>
    <FormSection title="Typ limitu IKZE">
      <div class="row items-center">
        <div class="col">
          <q-select
            v-model="status"
            :options="statusOptions"
            emit-value
            map-options
            label="Typ limitu IKZE" />
        </div>
        <div class="col-auto q-ml-sm">
          <Tooltip>
            <p><strong>Umowa o pracę</strong> — niższy limit IKZE (1,2-krotność przeciętnego wynagrodzenia).</p>
            <p><strong>Działalność gospodarcza</strong> — wyższy limit IKZE (1,8-krotność przeciętnego wynagrodzenia).</p>
          </Tooltip>
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col">
          Limit IKZE na {{ settingStore.dateOfLawRules.getFullYear() }} rok: <strong>{{ pln(currentIkzeLimit) }}</strong>
        </div>
      </div>
    </FormSection>
    <FormSection
      v-if="status === IkzeLimitStatus.SelfEmployment"
      title="Forma opodatkowania">
      <div class="row">
        <div class="col">
          <q-select
            v-model="taxSystem"
            :options="taxSystemOptions"
            emit-value
            map-options
            label="Forma opodatkowania" />
        </div>
      </div>
      <div
        v-if="taxSystem === IkzeTaxSystem.LumpSum"
        class="row q-mt-sm">
        <div class="col">
          <q-select
            v-model="lumpSumTaxRate"
            :options="lumpSumTaxRateOptions"
            emit-value
            map-options
            label="Stawka ryczałtu" />
        </div>
      </div>
    </FormSection>
    <FormSection title="Dane do obliczeń">
      <div class="row q-mb-sm">
        <div class="col">
          <q-input
            v-model.number="taxBaseBeforeRelief"
            type="number"
            min="0"
            step="0.01"
            :label="taxBaseLabel"
            suffix="zł"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-input
            v-model.number="ikzeContribution"
            type="number"
            min="0"
            :max="currentIkzeLimit"
            step="0.01"
            label="Wpłata na IKZE"
            suffix="zł"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0), validationRules.maxValue(currentIkzeLimit)]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {IkzeLimitStatus, getIkzeLimit} from 'src/logic/ikzeLimits'
import {IkzeTaxSystem} from 'components/ikzeTaxRelief/types/IkzeTaxSystem'
import {InputFields} from 'components/ikzeTaxRelief/interfaces/InputFields'
import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'
import {computed, watch} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import {useFormValidation} from 'src/composables/formValidation'
import {useIkzeTaxReliefStore} from 'components/ikzeTaxRelief/store'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useLocalStorage} from '@vueuse/core'
import {useSettingStore} from 'stores/settingStore'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()
const {availableDates} = useLawRuleDate()
const settingStore = useSettingStore()
const store = useIkzeTaxReliefStore()

const statusOptions = [
  {
    label: 'Umowa o pracę',
    value: IkzeLimitStatus.EmploymentContract,
  },
  {
    label: 'Działalność gospodarcza',
    value: IkzeLimitStatus.SelfEmployment,
  },
]

const taxSystemOptions = [
  {
    label: 'Skala podatkowa',
    value: IkzeTaxSystem.TaxScale,
  },
  {
    label: 'Podatek liniowy',
    value: IkzeTaxSystem.FlatTax,
  },
  {
    label: 'Ryczałt',
    value: IkzeTaxSystem.LumpSum,
  },
]

const lumpSumTaxRateOptions = [
  {label: '17%', value: 0.17},
  {label: '15%', value: 0.15},
  {label: '14%', value: 0.14},
  {label: '12,5%', value: 0.125},
  {label: '12%', value: 0.12},
  {label: '10%', value: 0.1},
  {label: '8,5%', value: 0.085},
  {label: '5,5%', value: 0.055},
  {label: '3%', value: 0.03},
  {label: '2%', value: 0.02},
]

const status = useLocalStorage<IkzeLimitStatus>('ikzeTaxRelief/form/status', IkzeLimitStatus.EmploymentContract, {mergeDefaults: true})
const taxSystem = useLocalStorage<IkzeTaxSystem>('ikzeTaxRelief/form/taxSystem', IkzeTaxSystem.TaxScale, {mergeDefaults: true})
const lumpSumTaxRate = useLocalStorage<LumpSumTaxRate>('ikzeTaxRelief/form/lumpSumTaxRate', 0.085, {mergeDefaults: true})
const taxBaseBeforeRelief = useLocalStorage('ikzeTaxRelief/form/taxBaseBeforeRelief', 80000, {mergeDefaults: true})
const ikzeContribution = useLocalStorage('ikzeTaxRelief/form/ikzeContribution', 5000, {mergeDefaults: true})

const currentIkzeLimit = computed(() => getIkzeLimit(settingStore.dateOfLawRules, status.value))

const taxBaseLabel = computed(() => {
  if (taxSystem.value === IkzeTaxSystem.LumpSum && status.value === IkzeLimitStatus.SelfEmployment) {
    return 'Roczny przychód do opodatkowania ryczałtem'
  }
  return 'Roczna podstawa opodatkowania'
})

watch(status, (newStatus) => {
  if (newStatus === IkzeLimitStatus.EmploymentContract) {
    taxSystem.value = IkzeTaxSystem.TaxScale
  }
})

watch(currentIkzeLimit, (newLimit) => {
  if (ikzeContribution.value > newLimit) {
    ikzeContribution.value = newLimit
  }
})

const handleFormSubmit = () => {
  const inputFields: InputFields = {
    status: status.value,
    taxSystem: status.value === IkzeLimitStatus.EmploymentContract ? IkzeTaxSystem.TaxScale : taxSystem.value,
    ikzeContribution: ikzeContribution.value,
    taxBaseBeforeRelief: taxBaseBeforeRelief.value,
  }

  if (taxSystem.value === IkzeTaxSystem.LumpSum && status.value === IkzeLimitStatus.SelfEmployment) {
    inputFields.lumpSumTaxRate = lumpSumTaxRate.value
  }

  store.inputFields = inputFields

  emit('submit')
}
</script>
