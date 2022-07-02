<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          label="Przychód netto*"
          autofocus
          color="brand"
          suffix="zł"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
        <q-input
          v-model.number="expenses"
          type="number"
          min="0"
          step="0.01"
          label="Koszty netto*"
          color="brand"
          suffix="zł"
        />
        <q-select
          v-model="incomeTaxType"
          :options="incomeTaxTypes"
          :disable="isMarriage"
          label="Forma opodatkowania*"
          color="brand"
          required
          emit-value
          map-options
        />
        <q-select
          v-if="incomeTaxType === constants.TAX_TYPES.LUMP_SUM"
          v-model="taxRateForLumpSum"
          :options="constants.PARAMS[this.year].TAX_RATES_FOR_LAMP_SUM"
          label="Stawka ryczałtu ewidencjonowanego"
          color="brand"
          emit-value
          map-options
        />
        <q-toggle
          v-model="isFreeAmount"
          :disable="incomeTaxType !== constants.TAX_TYPES.GENERAL || isMarriage"
          class="q-mt-sm"
          label="Kwota wolna od podatku"
        />
        <template v-if="year >= 2022">
          <q-toggle
            v-if="!isMarriage"
            v-model="isReliefForSenior"
            class="q-mt-sm"
            label="Zerowy PIT dla seniora"
          />
          <q-toggle
            v-if="!isMarriage"
            v-model="isReliefForBigFamily"
            class="q-mt-sm"
            label="Zerowy PIT dla rodzin 4+"
          />
        </template>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="column">
          <q-toggle
            v-model="isFullTimeJob"
            class="q-mt-sm"
            label="Praca na etacie"
          />
          <q-toggle
            v-model="isReliefForCompanyStart"
            :disable="isFullTimeJob"
            class="q-mt-sm"
            label="Ulga na start"
          />
          <q-toggle
            v-model="isSmallZus"
            :disable="isFullTimeJob || isReliefForCompanyStart"
            class="q-mt-sm"
            label="Mały ZUS"
          />
          <q-toggle
            v-model="isFpContribution"
            :disable="isSmallZus || isFullTimeJob || isReliefForCompanyStart"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="isSickContribution"
            :disable="isFullTimeJob"
            class="q-mt-sm"
            label="Składka chorobowa"
          />
        </div>
        <q-toggle
          v-model="isCustomBasisForZus"
          :disable="isSmallZus"
          class="q-mt-sm"
          label="Własna podstawa dla składek ZUS"
        />
        <q-input
          v-if="isCustomBasisForZus"
          v-model.number="customBasisForZus"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Podstawa dla składek ZUS"
          color="brand"
          suffix="zł"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
        <q-input
          v-model.number="accidentContributionRate"
          :disable="isFullTimeJob"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Składka wypadkowa*"
          color="brand"
          suffix="%"
          :rules="[validationRules.required]"
          lazy-rules
        />
      </div>
    </div>
    <div
      v-if="!isMarriage"
      class="row q-mt-lg">
      <div class="col-12">
        <q-btn
          type="submit"
          :disable="isDisabledButton"
          class="full-width"
          color="brand"
          size="lg"
          label="Oblicz"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import {AvailableYear} from 'src/types/AvailableYear'
import {IncomeTaxType} from 'src/types/IncomeTaxType'
import {Ref, computed, defineComponent, ref, watch} from 'vue'
import {SelfEmploymentInputFields} from 'components/selfEmployment/interfaces/SelfEmploymentInputFields'
import constants from 'src/logic/constants'
import validationRules from 'src/logic/validationRules'

const incomeTaxTypes = [
  {
    label: 'Zasady ogólne',
    value: constants.TAX_TYPES.GENERAL,
  },
  {
    label: 'Podatek liniowy',
    value: constants.TAX_TYPES.LINEAR,
  },
  {
    label: 'Ryczałt ewidencjonowany',
    value: constants.TAX_TYPES.LUMP_SUM,
  },
]

export default defineComponent({
  props: {
    isMarriage: {
      default: false,
      required: false,
      type: Boolean,
    },
    year: Number,
  },
  setup(props, context) {
    const amount:Ref<number|null> = ref(null)
    const expenses = ref(0)
    const incomeTaxType = ref(<IncomeTaxType>constants.TAX_TYPES.GENERAL)
    const taxRateForLumpSum = ref(constants.PARAMS[<AvailableYear>props.year].TAX_RATES_FOR_LAMP_SUM[constants.PARAMS[<AvailableYear>props.year].TAX_RATES_FOR_LAMP_SUM.length - 2].value)
    const isFreeAmount = ref(true)
    const isReliefForBigFamily = ref(false)
    const isReliefForSenior = ref(false)
    const isReliefForMiddleClass = ref(false)
    const isReliefForCompanyStart = ref(false)
    const accidentContributionRate = ref(constants.PARAMS[<AvailableYear>props.year].ACCIDENT_RATE)
    const isFpContribution = ref(false)
    const isSickContribution = ref(false)
    const isSmallZus = ref(false)
    const isFullTimeJob = ref(false)
    const isCustomBasisForZus = ref(false)
    const customBasisForZus = ref(constants.PARAMS[<AvailableYear>props.year].ZUS.OWNER.BIG_AMOUNT)

    const isDisabledButton = computed(() => {
      if (!amount.value) {
        return true
      }
      return false
    })

    watch(isFullTimeJob, () => {
      if(isFullTimeJob.value) {
        isReliefForCompanyStart.value = false
        isSmallZus.value = false
        isFpContribution.value = false
        isSickContribution.value = false
      }
    })

    watch(isReliefForCompanyStart, () => {
      if(isReliefForCompanyStart.value) {
        isFpContribution.value = false
      }
    })

    watch(isSmallZus, () => {
      if(isSmallZus.value) {
        isFpContribution.value = false
        isCustomBasisForZus.value = false
      }
    })

    watch(incomeTaxType, () => {
      if (incomeTaxType.value !== constants.TAX_TYPES.GENERAL) {
        isFreeAmount.value = false
        isReliefForMiddleClass.value = false
      } else {
        isReliefForMiddleClass.value = true
        isFreeAmount.value = true
      }
    })

    const save = () => {
      const input: SelfEmploymentInputFields = {
        accidentContributionRate: accidentContributionRate.value / 100,
        amount: Number(amount.value),
        customBasisForZus: Number(customBasisForZus.value),
        expenses: Number(expenses.value),
        incomeTaxType: incomeTaxType.value,
        isFpContribution: isFpContribution.value,
        isFreeAmount: isFreeAmount.value,
        isFullTimeJob: isFullTimeJob.value,
        isReliefForBigFamily: isReliefForBigFamily.value,
        isReliefForCompanyStart: isReliefForCompanyStart.value,
        isReliefForSenior: isReliefForSenior.value,
        isSickContribution: isSickContribution.value,
        isSmallZus: isSmallZus.value,
        taxRateForLumpSum: taxRateForLumpSum.value / 100,
        year: <AvailableYear>props.year,
      }

      if (!isCustomBasisForZus.value) {
        input.customBasisForZus = 0
      }

      context.emit('save', input)
    }

    return {
      accidentContributionRate,
      amount,
      constants,
      customBasisForZus,
      expenses,
      incomeTaxType,
      incomeTaxTypes,
      isCustomBasisForZus,
      isDisabledButton,
      isFpContribution,
      isFreeAmount,
      isFullTimeJob,
      isReliefForBigFamily,
      isReliefForCompanyStart,
      isReliefForMiddleClass,
      isReliefForSenior,
      isSickContribution,
      isSmallZus,
      save,
      taxRateForLumpSum,
      validationRules,
    }
  },
})
</script>
