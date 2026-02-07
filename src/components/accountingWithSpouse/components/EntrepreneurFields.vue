<template>
  <div>
    <FormSubSection title="Przychód">
      <div class="row q-mb-sm">
        <div class="col">
          <q-input
            v-model.number="fields.revenue"
            :disable="fields.hasRevenueForEachMonth"
            type="number"
            min="0"
            step="0.01"
            label="Miesięczny przychód (bez VAT)"
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
            v-model="fields.hasRevenueForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne przychody w poszczególnych miesiącach"
          />
        </div>
      </div>
      <EachMonthAmountFields
        v-if="fields.hasRevenueForEachMonth"
        v-model="fields.revenueAmounts"
      />
    </FormSubSection>
    <FormSubSection title="Koszty">
      <div class="row q-mb-sm">
        <div class="col">
          <q-input
            v-model.number="fields.expenses"
            :disable="fields.hasExpensesForEachMonth"
            type="number"
            min="0"
            step="0.01"
            label="Miesięczne koszty (bez VAT)"
            suffix="zł"
            hide-bottom-space
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="fields.hasExpensesForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne koszty w poszczególnych miesiącach"
          />
        </div>
      </div>
      <EachMonthAmountFields
        v-if="fields.hasExpensesForEachMonth"
        v-model="fields.expensesAmounts"
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
            Brak naliczania podatku dochodowego dla przychodu do {{ pln(incomeTaxConstants.taxReliefLimit) }}.<br>Ulga dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
      </div>
    </FormSubSection>
    <FormSubSection title="Składki ZUS">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="fields.hasEmploymentContract"
            checked-icon="check"
            unchecked-icon="clear"
            label="Zatrudniony na umowę o pracę"
          />
          <Tooltip class="q-ml-sm">
            Zatrudniony na umowę o pracę, zarabiający co najmniej równowartość minimalnego wynagrodzenia, płaci tylko składkę zdrowotną.
          </Tooltip>
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col">
          <ZusContributionBasisSelect
            v-model="fields.chosenContributionBasis"
            :disabled="fields.hasEmploymentContract" />
        </div>
      </div>
      <div
        v-if="fields.chosenContributionBasis === ContributionBasises.Custom"
        class="row">
        <div class="col">
          <q-input
            v-model.number="fields.customContributionBasis"
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
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="fields.healthContributionBasisInJanuary"
            type="number"
            min="0"
            step="0.01"
            label="Dochód z grudnia poprzedniego roku"
            suffix="zł"
            color="brand"
            hint="Przychód minus koszty i składki społeczne. Potrzebny do obliczenia składki zdrowotnej w styczniu."
          />
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="fields.accidentContributionRate"
            :disable="fields.hasEmploymentContract"
            type="number"
            min="0"
            step="0.01"
            label="Składka wypadkowa"
            color="brand"
            suffix="%"
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div>
          <q-toggle
            v-model="fields.isSickContribution"
            :disable="fields.hasEmploymentContract"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka chorobowa"
          />
        </div>
        <div>
          <q-toggle
            v-model="fields.isFpContribution"
            :disable="fpContributionIsDisabled"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka na Fundusz Pracy"
          />
        </div>
      </div>
    </FormSubSection>
  </div>
</template>

<script setup lang="ts">

import {ContributionBasises} from 'src/composables/contributionBasises'
import {EntrepreneurFormFields} from 'components/accountingWithSpouse/interfaces/FormFields'
import {computed, watch} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue'
import FormSubSection from 'components/partials/form/FormSubSection.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import ZusContributionBasisSelect from 'components/selfEmployment/components/ZusContributionBasisSelect.vue'

const { incomeTaxConstants } = storeToRefs(useConstantsStore())

const fields = defineModel<EntrepreneurFormFields>({required: true})

const fpContributionIsDisabled = computed(() => fields.value.chosenContributionBasis === ContributionBasises.Small || fields.value.hasEmploymentContract)

watch(() => fields.value.hasRevenueForEachMonth, (hasRevenueForEachMonth) => {
  if (!hasRevenueForEachMonth) {
    fields.value.revenueAmounts = []
    return
  }
  if(fields.value.revenueAmounts.length) {
    return
  }

  for(let i = 0; i < 12; i++) {
    fields.value.revenueAmounts[i] = fields.value.revenue ?? 0
  }
})
watch(() => fields.value.hasExpensesForEachMonth, (hasExpensesForEachMonth) => {
  if (!hasExpensesForEachMonth) {
    fields.value.expensesAmounts = []
    return
  }
  if(fields.value.expensesAmounts.length) {
    return
  }

  for(let i = 0; i < 12; i++) {
    fields.value.expensesAmounts[i] = fields.value.expenses ?? 0
  }
})
watch(() => fields.value.chosenContributionBasis, (chosenContributionBasis) => {
  switch (chosenContributionBasis) {
    case  ContributionBasises.Small:
      fields.value.isFpContribution = false
      break
    case  ContributionBasises.Big:
      fields.value.isFpContribution = true
      break
  }
})
watch(() => fields.value.hasEmploymentContract, (hasEmploymentContract) => {
  if(hasEmploymentContract) {
    fields.value.isFpContribution = false
    fields.value.isSickContribution = false
  }
})
</script>
