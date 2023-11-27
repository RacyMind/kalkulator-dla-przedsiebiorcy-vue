<template>
  <div>
    <FormSection title="Wynagrodzenie">
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="isHourlyAmount"
            checked-icon="check"
            unchecked-icon="clear"
            label="Stawka godzinowa"
            size="lg"
          />
        </div>
      </div>
      <div
        v-if="isHourlyAmount"
        class="row items-center q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model.number="hourlyAmount"
            :autofocus="isHourlyAmount"
            type="number"
            min="0"
            step="0.01"
            label="Stawka godzinowa*"
            suffix="zł"
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="hourCount"
            type="number"
            class="full-width"
            min="1"
            step="1"
            label="Ilość godzin*"
            color="brand"
            :rules="[
              val => !!val || '* Wpisz ilość godzin',
            ]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row items-center q-col-gutter-sm">
        <div class="col-grow">
          <q-input
            v-model.number="amount"
            :disable="isHourlyAmount"
            type="number"
            min="0"
            step="0.01"
            label="Wynagrodzenie*"
            suffix="zł"
            autofocus
            color="brand"
            :rules="[
              val => !!val || '* Wpisz kwotę',
            ]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-shrink">
          <q-radio
            v-model="amountType"
            :val="constants.AMOUNT_TYPES.NET"
            label="netto"
          />
          <q-radio
            v-model="amountType"
            :val="constants.AMOUNT_TYPES.GROSS"
            label="brutto"
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Podatek dochodowy">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-grow">
          <q-toggle
            v-model="isAuthorExpenses"
            checked-icon="check"
            unchecked-icon="clear"
            label="Autorskie koszty uzyskania przychodu (50%)"
            size="lg"
          />
          <q-input
            v-if="isAuthorExpenses"
            v-model.number="partOfWorkWithAuthorExpenses"
            type="number"
            min="0"
            max="100"
            step="1"
            label="Część pracy*"
            color="brand"
            suffix="%"
            :rules="[
              val => !!val || '* Wpisz wartość',
            ]"
            hide-bottom-space
          />
        </div>
        <div class="col">
          <q-toggle
            v-model="hasTaxFreeAmount"
            checked-icon="check"
            unchecked-icon="clear"
            label="Kwota wolna od podatku"
            size="lg"
          />
          <q-select
            v-if="hasTaxFreeAmount"
            v-model="employerCount"
            :options="employerCountOptions"
            emit-value
            map-options
            label="Kwota odliczana u" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasTaxRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga podatkowa"
            size="lg"
          />
          <Tooltip>
            Brak naliczania podatku dochodowego dla wynagrrodzenia brutto do {{ pln(GeneraLRule.taxReliefLimit)}}.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów
          </Tooltip>
        </div>
      </div>
    </FormSection>
  </div>
</template>
<script setup lang="ts">
import {AmountType} from 'src/types/AmountType'
import {GeneraLRule} from '../../../logic/taxes/GeneraLRule'
import {Ref, ref, watch} from 'vue'
import {pln} from '../../../use/currencyFormat'
import FormSection from 'components/partials/FormSection.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const employerCountOptions = [
  {
    label: '1 pracodawcy',
    value: 1,
  },
  {
    label: '2 pracodawców',
    value: 2,
  },
  {
    label: '3 pracodawców',
    value: 3,
  },
]

// the salary section
const isHourlyAmount = ref(false)
const amount:Ref<number|null> = ref(null)
const hourlyAmount:Ref<number|null> = ref(null)
const hourCount:Ref<number|null> = ref(null)
const amountType:Ref<AmountType> = ref(constants.AMOUNT_TYPES.GROSS)

// the income tax section
const isAuthorExpenses = ref(false)
const partOfWorkWithAuthorExpenses = ref(100)
const hasTaxRelief = ref(false)
const hasTaxFreeAmount = ref(true)
const employerCount = ref(1)

watch(hourlyAmount, () => {
  if (!isHourlyAmount.value) {
    return
  }
  if(!hourlyAmount.value || !hourCount.value) {
    return
  }
  amount.value = helpers.round(hourlyAmount.value * hourCount.value, 2)
})
watch(hourCount, () => {
  if (!isHourlyAmount.value) {
    return
  }
  if(!hourlyAmount.value || !hourCount.value) {
    return
  }
  amount.value = helpers.round(hourlyAmount.value * hourCount.value, 2)
})
</script>
