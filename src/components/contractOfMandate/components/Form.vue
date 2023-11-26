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
          />
        </div>
      </div>
      <div
        v-if="isHourlyAmount"
        class="row q-col-gutter-md">
        <div class="col-6">
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
            hide-bottom-space
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-6">
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
            hide-bottom-space
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row items-end q-col-gutter-sm">
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
            hide-bottom-space
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
      <div class="row">
        <div class="col">
          <q-toggle
            v-model="hasTaxRelief"
            checked-icon="check"
            unchecked-icon="clear"
            label="Ulga podatkowa"
          />
          <q-btn
            flat
            round
            size="sm"
            padding="sm"
            color="primary"
            icon="help">
            <q-tooltip>
              Brak naliczania podatku dochodowego dla wynagrrodzenia brutto do {{ pln(GeneraLRule.taxReliefLimit)}}.<br>Ulga dla osób do 26 roku życia, dla rodzin 4+, na powrót z zagranicy, dla pracujących seniorów
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-sm-grow">
          <q-toggle
            v-model="isAuthorExpenses"
            checked-icon="check"
            unchecked-icon="clear"
            label="Autorskie koszty uzyskania przychodu (50%)"
          />
        </div>
        <div class="col">
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
          />
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
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const isHourlyAmount = ref(false)
const amount:Ref<number|null> = ref(null)
const hourlyAmount:Ref<number|null> = ref(null)
const hourCount:Ref<number|null> = ref(null)
const amountType:Ref<AmountType> = ref(constants.AMOUNT_TYPES.GROSS)

const isAuthorExpenses = ref(false)
const partOfWorkWithAuthorExpenses = ref(100)
const hasTaxRelief = ref(false)
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
