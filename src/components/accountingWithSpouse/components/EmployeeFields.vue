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
            autofocus
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
            label="Ulga podatkowa"
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
    </FormSubSection>
  </div>
</template>

<script setup lang="ts">

import {EmployeeFormFields} from 'components/accountingWithSpouse/interfaces/FormFields'
import {pln} from 'src/use/currencyFormat'
import {useConstants} from 'src/composables/constants'
import {watch} from 'vue'
import EachMonthAmountFields from 'components/partials/form/EachMonthAmountFields.vue'
import FormSubSection from 'components/partials/form/FormSubSection.vue'
import Tooltip from 'components/partials/Tooltip.vue'

const fields = defineModel<EmployeeFormFields>({required: true})

const { incomeTaxConstants } = useConstants()

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
</script>
