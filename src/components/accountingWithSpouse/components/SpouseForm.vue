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
    <EmployeeFields
      v-if="formType === FormType.EmploymentContract"
      v-model="employee"
    />
    <CustomFields
      v-else-if="formType === FormType.Custom"
      v-model="custom"
    />
  </FormSection>
</template>

<script setup lang="ts">

import {ContributionScheme} from 'components/accountingWithSpouse/logic/ContributionScheme'
import {CustomFormFields, EmployeeFormFields, FormType} from 'components/accountingWithSpouse/interfaces/FormFields'
import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {computed} from 'vue'
import {useConstants} from 'src/composables/constants'
import {useLocalStorage} from '@vueuse/core'
import CustomFields from 'components/accountingWithSpouse/components/CustomFields.vue'
import EmployeeFields from 'components/accountingWithSpouse/components/EmployeeFields.vue'
import FormSection from 'components/partials/form/FormSection.vue'

interface Props {
  spouse: Spouse
}
const props = defineProps<Props>()

const { wageStats, zusConstants } = useConstants()

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

const employeeInitialValue: EmployeeFormFields = {
  grossAmount: wageStats.value.minimumWage(),
  hasAmountForEachMonth: false,
  grossAmounts: [],
  workInLivePlace: true,
  hasTaxRelief: false,
  contributionScheme: ContributionScheme.All,
  isDisabilityContribution: true,
  isHealthContribution: true,
  isPensionContribution: true,
  isSickContribution: true,
  isPpkContribution: false,
  employerPpkContributionRate: zusConstants.value.employer.rates.ppkContribution.default * 100,
  employeePpkContributionRate: zusConstants.value.employee.rates.ppkContribution.default * 100,
}


const formType = useLocalStorage<FormType>(`accountingWithSpouse/form/${props.spouse}/formType`, FormType.EmploymentContract, { mergeDefaults: true })
const custom = useLocalStorage<CustomFormFields>(`accountingWithSpouse/form/${props.spouse}/custom`, customInitialValue, { mergeDefaults: true })
const employee = useLocalStorage<EmployeeFormFields>(`accountingWithSpouse/form/${props.spouse}/employee`, employeeInitialValue, { mergeDefaults: true })
</script>
