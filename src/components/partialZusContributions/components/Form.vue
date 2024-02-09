<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
      <LawRuleDate />
    </FormSection>
    <FormSection title="Okres prowadzenia działalności">
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="daysOfRunningBusiness"
            type="number"
            min="1"
            max="31"
            step="1"
            label="Ilość dni prowadzenia działalności"
            color="brand"
            :rules="[
              val => !!val || '* Wpisz liczbę dni',
            ]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-select
            v-model.number="monthIndex"
            :options="monthOptions"
            emit-value
            map-options
            color="brand"
            label="Miesiąc rozpoczęcia działalności" />
        </div>
      </div>
    </FormSection>
    <FormSection title="Składki ZUS">
      <div class="row q-col-gutter-x-md">
        <div class="col">
          <ZusContributionBasisSelect v-model="chosenContributionBasis"/>
        </div>
        <div class="col">
          <q-input
            v-model.number="contributionBasis"
            :disable="chosenContributionBasis !== ContributionBasises.Custom"
            type="number"
            min="0"
            step="0.01"
            label="Podstawa składek ZUS"
            suffix="zł"
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-mb-md">
        <div class="col">
          <q-input
            v-model.number="accidentContributionRate"
            type="number"
            min="0"
            step="0.01"
            label="Składka wypadkowa"
            color="brand"
            suffix="%"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div>
          <q-toggle
            v-model="isSickContribution"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka chorobowa"
          />
        </div>
        <div>
          <q-toggle
            v-model="isFpContribution"
            :disable="chosenContributionBasis === ContributionBasises.Small"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka na Fundusz Pracy"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {ContributionBasises, useContributionBasis} from 'src/composables/contributionBasises'
import {ContributionCalculator} from 'components/partialZusContributions/logic/ContributionCalculator'
import {useConstants} from 'src/composables/constants'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useLocalStorage} from '@vueuse/core'
import {useMonths} from 'src/composables/months'
import {usePartialZusContributionStore} from 'components/partialZusContributions/store'
import {useSettingStore} from 'stores/settingStore'
import {watch} from 'vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import ZusContributionBasisSelect from 'components/selfEmployment/components/ZusContributionBasisSelect.vue'
import helpers from 'src/logic/helpers'

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()
const { availableDates } = useLawRuleDate()
const { monthOptions } = useMonths()
const { zusConstants } = useConstants()
const store = usePartialZusContributionStore()
const settingStore = useSettingStore()

const daysOfRunningBusiness = useLocalStorage('partialZusContributions/form/daysOfRunningBusiness', new ContributionCalculator().getDaysInMonth(new Date().getMonth()), { mergeDefaults: true })
const monthIndex = useLocalStorage('partialZusContributions/form/monthIndex', new Date().getMonth(), { mergeDefaults: true })

const { chosenContributionBasis } = useContributionBasis('partialZusContributions/form')
const contributionBasis = useLocalStorage('partialZusContributions/form/contributionBasis', zusConstants.value.entrepreneur.basises.big, { mergeDefaults: true })
const accidentContributionRate = useLocalStorage('partialZusContributions/form/accidentContributionRate', zusConstants.value.employer.rates.accidentCContribution.default * 100, { mergeDefaults: true })
const isFpContribution = useLocalStorage('partialZusContributions/form/isFpContribution', true, { mergeDefaults: true })
const isSickContribution = useLocalStorage('partialZusContributions/form/isSickContribution', false, { mergeDefaults: true })

watch(chosenContributionBasis, () => {
  switch (chosenContributionBasis.value) {
    case ContributionBasises.Big:
      contributionBasis.value = zusConstants.value.entrepreneur.basises.big
      break
    case ContributionBasises.Small:
      contributionBasis.value = zusConstants.value.entrepreneur.basises.small(monthIndex.value)
      isFpContribution.value = false
      break
  }
})

watch(() => settingStore.dateOfLawRules, () => {
  switch (chosenContributionBasis.value) {
    case ContributionBasises.Big:
      contributionBasis.value = zusConstants.value.entrepreneur.basises.big
      break
    case ContributionBasises.Small:
      contributionBasis.value = zusConstants.value.entrepreneur.basises.small(monthIndex.value)
      break
  }
})

watch(monthIndex, () => {
  if(chosenContributionBasis.value === ContributionBasises.Small) {
    contributionBasis.value = zusConstants.value.entrepreneur.basises.small(monthIndex.value)
  }
})

const handleFormSubmit = () => {
  store.inputFields = {
    contributionBasis: contributionBasis.value,
    monthIndex: monthIndex.value,
    daysOfRunningBusiness: daysOfRunningBusiness.value,
    isFpContribution: isFpContribution.value,
    isSickContribution: isSickContribution.value,
    accidentContributionRate: helpers.round(accidentContributionRate.value / 100, 4),
  }

  emit('submit')
}
</script>
