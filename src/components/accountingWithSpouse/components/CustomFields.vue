<template>
  <div>
    <FormSubSection title="Przychód i koszty">
      <div class="row q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model.number="fields.revenue"
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
            v-model.number="fields.expenses"
            type="number"
            min="0"
            step="0.01"
            label="Koszty"
            suffix="zł"
            color="brand"
            hide-bottom-space
          />
        </div>
      </div>
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
      </div>
    </FormSubSection>
    <FormSubSection title="Składki ZUS">
      <div class="row q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model.number="fields.socialContributions"
            type="number"
            min="0"
            step="0.01"
            label="Składki społeczne"
            suffix="zł"
            color="brand"
            hint="Składki obniżające podstawę opodatkowania."
            hide-bottom-space
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="fields.healthContributions"
            type="number"
            min="0"
            step="0.01"
            label="Składka zdrowotna"
            suffix="zł"
            hide-bottom-space
          />
        </div>
      </div>
    </FormSubSection>
  </div>
</template>

<script setup lang="ts">

import {CustomFormFields} from 'components/accountingWithSpouse/interfaces/FormFields'
import {pln} from 'src/use/currencyFormat'
import {useConstants} from 'src/composables/constants'
import FormSubSection from 'components/partials/form/FormSubSection.vue'
import Tooltip from 'components/partials/Tooltip.vue'

const { incomeTaxConstants } = useConstants()

const fields = defineModel<CustomFormFields>({required: true})
</script>
