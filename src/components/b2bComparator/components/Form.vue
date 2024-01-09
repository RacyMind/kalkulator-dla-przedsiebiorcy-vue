<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
      <LawRuleDate />
    </FormSection>
    <FormSection title="Przychód">
      <div class="row">
        <div class="col">
          <q-input
            v-model.number="revenue"
            type="number"
            min="0"
            step="0.01"
            label="Przychód (bez VAT)*"
            suffix="zł"
            autofocus
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasRevenueForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne przychody w poszczególnych miesiącach"
          />
        </div>
      </div>
      <AnnualAmountFields
        v-if="hasRevenueForEachMonth"
        v-model="monthlyRevenues"
        :disable-until-month="businessHasStartedBeforeThisYear ? null : businessStartedInMonth"
      />
    </FormSection>
    <FormSection title="Koszty">
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="expenses"
            type="number"
            min="0"
            step="0.01"
            label="Koszty (bez VAT)"
            suffix="zł"
            color="brand"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasExpensesForEachMonth"
            checked-icon="check"
            unchecked-icon="clear"
            label="Różne koszty w poszczególnych miesiącach"
          />
        </div>
      </div>
      <AnnualAmountFields
        v-if="hasExpensesForEachMonth"
        v-model="monthlyExpenses"
      />
    </FormSection>
    <FormSection title="Podatek dochodowy">
      <div class="row q-mb-md">
        <div class="col">
          <LumpSumTaxRateSelect v-model.number="lumpSumTaxRate"/>
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div>
          <q-toggle
            v-model="hasTaxRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga podatkowa"
          />
          <Tooltip class="q-ml-sm">
            Brak naliczania podatku dochodowego dla przychodu do {{ pln(incomeTaxConstants.taxReliefLimit) }}.<br>Ulga dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów.
          </Tooltip>
        </div>
      </div>
      <TaxFreeAmountFields
        v-if="incomeTaxType === EntrepreneurTaxSystem.TaxScale"
        v-model:has-tax-free-amount="hasTaxFreeAmount"
        v-model:employer-count="employerCount" />
    </FormSection>
    <FormSection title="Składki ZUS">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasEmploymentContract"
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
            v-model="chosenContributionBasis"
            :disabled="hasEmploymentContract" />
        </div>
      </div>
      <div
        v-if="chosenContributionBasis === ContributionBasises.Custom"
        class="row">
        <div class="col">
          <q-input
            v-model.number="customContributionBasis"
            type="number"
            min="0"
            step="0.01"
            label="Podstawa składek ZUS*"
            suffix="zł"
            autofocus
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div
        v-if="businessHasStartedBeforeThisYear && incomeTaxType !== EntrepreneurTaxSystem.LumpSumTax"
        class="row q-mb-md">
        <div class="col">
          <q-input
            v-model.number="previousMonthHealthContributionBasis"
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
            v-model.number="accidentContributionRate"
            :disable="hasEmploymentContract"
            type="number"
            min="0"
            step="0.01"
            label="Składka wypadkowa*"
            color="brand"
            suffix="%"
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div>
          <q-toggle
            v-model="isSickContribution"
            :disable="hasEmploymentContract"
            checked-icon="check"
            unchecked-icon="clear"
            label="Składka chorobowa"
          />
        </div>
        <div>
          <q-toggle
            v-model="isFpContribution"
            :disable="fpContributionIsDisabled"
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

import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {pln} from 'src/use/currencyFormat'
import AnnualAmountFields from 'components/partials/form/AnnualAmountFields.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import LumpSumTaxRateSelect from 'components/selfEmployment/components/LumpSumTaxRateSelect.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import TaxFreeAmountFields from 'components/partials/form/TaxFreeAmountFields.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import ZusContributionBasisSelect from 'components/selfEmployment/components/ZusContributionBasisSelect.vue'
</script>
