<template>
  <div>
    <FormSubSection title="Wynagrodzenie">
      <div class="row q-mb-sm">
        <div class="col">
          <q-input
            v-model.number="fields.grossAmount"
            :disable="fields.hasAmountForEachMonth"
            type="number"
            min="0"
            step="0.01"
            label="Miesięczne wynagrodzenie brutto*"
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
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="fields.hasAmountForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne wynagrodzenie w poszczególnych miesiącach"
          />
        </div>
      </div>
      <EachMonthAmountFields
        v-if="fields.hasAmountForEachMonth"
        v-model="fields.grossAmounts"
      />
    </FormSubSection>
    <FormSubSection title="Podatek dochodowy">
      <div class="row q-col-gutter-x-md">
        <div>
          <q-toggle
            v-model="fields.hasTaxRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga podatkowa dla przychodu"
          />
          <Tooltip class="q-ml-sm">
            Brak naliczania podatku dochodowego dla wynagrodzenia do {{ pln(incomeTaxConstants.taxReliefLimit) }} brutto.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
        <div>
          <q-toggle
            v-model="fields.workInLivePlace"
            checked-icon="check"
            unchecked-icon="clear"
            label="Praca w miejscu zamieszkania"
          />
        </div>
      </div>
      <AuthorExpenseFields
        class="q-mt-sm"
        v-model:are-author-expenses="fields.areAuthorExpenses"
        v-model:part-of-work-with-author-expenses="fields.partOfWorkWithAuthorExpenses"
        disable-for-each-month
      />
    </FormSubSection>
    <FormSubSection title="Składki ZUS">
      <div class="row q-mb-md">
        <div class="col">
          <q-select
            v-model="fields.contributionScheme"
            :options="contributionSchemeOptions"
            emit-value
            map-options
            label="Schemat składek ZUS" />
        </div>
      </div>
      <ZusContributionFields
        v-model:is-pension-contribution="fields.isPensionContribution"
        v-model:is-health-contribution="fields.isHealthContribution"
        v-model:is-sick-contribution="fields.isSickContribution"
        v-model:is-disability-contribution="fields.isDisabilityContribution"
        hide-employer-contributions
        class="q-mb-sm"
      />
      <PpkContributionFields
        v-model:employee-ppk-contribution-rate="fields.employeePpkContributionRate"
        v-model:employer-ppk-contribution-rate="fields.employerPpkContributionRate"
        v-model:is-ppk-contribution="fields.isPpkContribution"
      />
    </FormSubSection>
  </div>
</template>

<script setup lang="ts">

import {ContributionScheme} from 'components/accountingWithSpouse/logic/ContributionScheme'
import {EmployeeFormFields} from 'components/accountingWithSpouse/interfaces/FormFields'
import {pln} from 'src/use/currencyFormat'
import {useConstants} from 'src/composables/constants'
import {watch} from 'vue'
import AuthorExpenseFields from 'components/partials/form/employee/AuthorExpenseFields.vue'
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue'
import FormSubSection from 'components/partials/form/FormSubSection.vue'
import PpkContributionFields from 'components/partials/form/employee/PpkContributionFields.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import ZusContributionFields from 'components/partials/form/employee/ZusContributionFields.vue'

const fields = defineModel<EmployeeFormFields>({required: true})

const { incomeTaxConstants } = useConstants()

const contributionSchemeOptions = [
  {
    label: 'Wszystkie składki ZUS',
    value: ContributionScheme.All,
  },
  {
    label: 'Tylko składka zdrowotna',
    value: ContributionScheme.OnlyHealthContribution,
  },
  {
    label: 'Bez składek ZUS',
    value: ContributionScheme.Without,
  },
]

watch(() => fields.value.hasAmountForEachMonth, (hasAmountForEachMonth) => {
  if (!hasAmountForEachMonth) {
    fields.value.grossAmounts = []
    return
  }
  if(fields.value.grossAmounts.length) {
    return
  }

  for(let i = 0; i < 12; i++) {
    fields.value.grossAmounts[i] = fields.value.grossAmount ?? 0
  }
})
watch(() => fields.value.contributionScheme, (contributionScheme) => {
  switch (contributionScheme) {
    case ContributionScheme.All:
      fields.value.isHealthContribution = true
      fields.value.isSickContribution = true
      fields.value.isDisabilityContribution = true
      fields.value.isPensionContribution = true
      break
    case ContributionScheme.OnlyHealthContribution:
      fields.value.isHealthContribution = true
      fields.value.isSickContribution = false
      fields.value.isDisabilityContribution = false
      fields.value.isPensionContribution = false
      break
    case ContributionScheme.Without:
      fields.value.isHealthContribution = false
      fields.value.isSickContribution = false
      fields.value.isDisabilityContribution = false
      fields.value.isPensionContribution = false
      break
  }
})
</script>
