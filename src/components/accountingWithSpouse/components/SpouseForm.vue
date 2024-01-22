<template>
  <FormSection :title="title">
    <div class="row">
      <div class="col">
        <q-select
          v-model="formType"
          :options="formTypeOptions"
          emit-value
          map-options
          label="Typ formularza" />
      </div>
    </div>
    <template v-if="formType === FormType.Custom">
      <FormSubSection title="Przychód i koszty">
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-input
              v-model.number="custom.revenue"
              type="number"
              min="0"
              step="0.01"
              label="Przychód"
              suffix="zł"
              color="brand"
              :rules="[
                val => !!val || '* Wpisz kwotę',
              ]"
              lazy-rules="ondemand"
              hide-bottom-space
            />
          </div>
          <div class="col">
            <q-input
              v-model.number="custom.expenses"
              type="number"
              min="0"
              step="0.01"
              label="Koszty"
              suffix="zł"
              color="brand"
              :rules="[
                val => !!val || '* Wpisz kwotę',
              ]"
              lazy-rules="ondemand"
              hide-bottom-space
            />
          </div>
        </div>
      </FormSubSection>
      <FormSubSection title="Składki ZUS">
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-input
              v-model.number="custom.socialContributions"
              type="number"
              min="0"
              step="0.01"
              label="Składki społeczne"
              suffix="zł"
              color="brand"
              :rules="[
                val => !!val || '* Wpisz kwotę',
              ]"
              lazy-rules="ondemand"
              hint="Składki społeczne obniżające podstawę opodatkowania."
              hide-bottom-space
            />
          </div>
          <div class="col">
            <q-input
              v-model.number="custom.healthContributions"
              type="number"
              min="0"
              step="0.01"
              label="Składka zdrowotna"
              suffix="zł"
              color="brand"
              :rules="[
                val => !!val || '* Wpisz kwotę',
              ]"
              lazy-rules="ondemand"
              hide-bottom-space
            />
          </div>
        </div>
      </FormSubSection>
      <FormSubSection title="Podatek dochodowy">
        <div class="row q-col-gutter-x-md">
          <div>
            <q-toggle
              v-model="custom.hasTaxRelief"
              checked-icon="check"
              unchecked-icon="clear"
              label="Ulga podatkowa"
            />
            <Tooltip class="q-ml-sm">
              Brak naliczania podatku dochodowego dla wynagrodzenia do {{ pln(incomeTaxConstants.taxReliefLimit) }} brutto.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
            </Tooltip>
          </div>
        </div>
      </FormSubSection>
    </template>
  </FormSection>
</template>

<script setup lang="ts">

import {CustomFormFields, FormType} from 'components/accountingWithSpouse/interfaces/FormFields'
import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import {useConstants} from 'src/composables/constants'
import {useLocalStorage} from '@vueuse/core'
import FormSection from 'components/partials/form/FormSection.vue'
import FormSubSection from 'components/partials/form/FormSubSection.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  spouse: Spouse
}
const props = defineProps<Props>()

const { incomeTaxConstants } = useConstants()

const title = computed(() => props.spouse === Spouse.Husband ? 'Mąż' : 'Żona')

const formTypeOptions = [
  {
    label: 'Umowa o pracę',
    value: FormType.EmploymentContract,
  },
  {
    label: 'Działalność gospodarcza',
    value: FormType.Entrepreneur,
  },
  {
    label: 'Niestandardowy',
    value: FormType.Custom,
  },
  {
    label: 'Nie pracuje',
    value: FormType.Unemployment,
  },
]


const customInitialValue: CustomFormFields = {
  revenue: 10000,
  expenses: 0,
  socialContributions: 0,
  healthContributions: 0,
  hasTaxRelief: false,
}


const formType = useLocalStorage<FormType>(`accountingWithSpouse/form/${props.spouse}/formType`, FormType.EmploymentContract, { mergeDefaults: true })
const custom = useLocalStorage<CustomFormFields>(`accountingWithSpouse/form/${props.spouse}/custom`, customInitialValue, { mergeDefaults: true })
</script>
