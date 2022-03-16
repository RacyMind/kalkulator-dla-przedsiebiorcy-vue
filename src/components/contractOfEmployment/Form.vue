<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          label="Wynagrodzenie*"
          autofocus
          color="brand"
          suffix="zł"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
        <div class="q-mt-sm block">
          <div class="row">
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
          <q-toggle
            v-model="workInLivePlace"
            class="q-mt-sm"
            label=" Praca w miejscu zamieszkania"
          />
          <q-toggle
            v-if="!isMarriage"
            v-model="isReliefForYoung"
            class="q-mt-sm"
            label="Zerowy PIT dla młodych"
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
            <q-toggle
              v-model="isReliefForMiddleClass"
              class="q-mt-sm"
              label="Ulga dla klasy średniej"
            />
          </template>
          <q-toggle
            v-model="isFreeAmount"
            :disable="isMarriage"
            class="q-mt-sm"
            label="Kwota wolna od podatku"
          />
          <q-toggle
            v-model="isAuthorExpenses"
            class="q-mt-sm col-6"
            label="Autorskie koszty uzyskania przychodu (50%)"
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
            lazy-rules
          />
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="column">
          <q-input
            v-model.number="accidentContributionRate"
            type="number"
            class="full-width"
            min="0"
            step="0.01"
            label="Składka wypadkowa*"
            color="brand"
            suffix="%"
            :rules="[
              val => !!val || '* Wpisz wartość',
            ]"
            lazy-rules
          />
          <q-toggle
            v-model="isFpContribution"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="isPpkContribution"
            class="q-mt-sm"
            label="PPK"
          />
          <div
            v-if="isPpkContribution"
            class="row">
            <div class="col-6">
              <q-input
                v-model.number="employerPpkContributionRate"
                type="number"
                class="full-width"
                :min="constants.PARAMS[year].PPK.EMPLOYER.MINIMUM_RATE"
                :max="constants.PARAMS[year].PPK.EMPLOYER.MAXIMUM_RATE"
                step="0.01"
                label="Pracodawca"
                color="brand"
                suffix="%"
                :rules="[
                  val => !!val || '* Wpisz wartość',
                ]"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pl-sm">
              <q-input
                v-model.number="employeePpkContributionRate"
                type="number"
                class="full-width"
                :min="constants.PARAMS[year].PPK.EMPLOYER.MINIMUM_RATE"
                :max="constants.PARAMS[year].PPK.EMPLOYER.MAXIMUM_RATE"
                step="0.01"
                label="Pracownik"
                color="brand"
                suffix="%"
                :rules="[
                  val => !!val || '* Wpisz wartość',
                ]"
                lazy-rules
              />
            </div>
          </div>
        </div>
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
import {computed, defineComponent, ref, Ref} from 'vue'
import constants from 'src/logic/constants'
import employeeContractOfEmployment from 'components/contractOfEmployment/employeeContractOfEmployment'
import {AvailableYear} from 'src/types/AvailableYear'
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import validationRules from 'src/logic/validationRules'

export default defineComponent({
  props: {
    year: Number,
    isMarriage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const amount:Ref<number|null> = ref(null)
    const amountType = ref(constants.AMOUNT_TYPES.GROSS)
    const accidentContributionRate = ref(constants.PARAMS[<AvailableYear>props.year].ACCIDENT_RATE)
    const workInLivePlace = ref(true)
    const isFreeAmount = ref(true)
    const isReliefForYoung = ref(false)
    const isReliefForBigFamily = ref(false)
    const isReliefForSenior = ref(false)
    const isReliefForMiddleClass = ref(false)
    const isFpContribution = ref(false)
    const isPpkContribution = ref(false)
    const employerPpkContributionRate = ref(constants.PARAMS[<AvailableYear>props.year].PPK.EMPLOYER.DEFAULT_RATE)
    const employeePpkContributionRate = ref(constants.PARAMS[<AvailableYear>props.year].PPK.EMPLOYEE.DEFAULT_RATE)
    const isAuthorExpenses = ref(false)
    const partOfWorkWithAuthorExpenses = ref(100)

    const isDisabledButton = computed(() => {
      if (!amount.value) {
        return true
      }
      if(isAuthorExpenses.value && !partOfWorkWithAuthorExpenses.value) {
        return true
      }
      if(isPpkContribution.value && (!employerPpkContributionRate.value || !employeePpkContributionRate.value)) {
        return true
      }
      return false
    })

    const save = () => {
      const input: ContractOfEmploymentInputFields = {
        year: <AvailableYear>props.year,
        grossAmount: Number(amount.value),
        workInLivePlace: workInLivePlace.value,
        isFreeAmount: isFreeAmount.value,
        isReliefForYoung: isReliefForYoung.value,
        isReliefForBigFamily: isReliefForBigFamily.value,
        isReliefForMiddleClass: isReliefForMiddleClass.value,
        isReliefForSenior: isReliefForSenior.value,
        partOfWorkWithAuthorExpenses: partOfWorkWithAuthorExpenses.value,
        isFpContribution: isFpContribution.value,
        accidentContributionRate: accidentContributionRate.value / 100,
        employerPpkContributionRate: employerPpkContributionRate.value,
        employeePpkContributionRate: employeePpkContributionRate.value,
      }

      if (isAuthorExpenses.value) {
        input.partOfWorkWithAuthorExpenses = partOfWorkWithAuthorExpenses.value / 100
      } else {
        input.partOfWorkWithAuthorExpenses = 0
      }

      if(isPpkContribution.value) {
        input.employerPpkContributionRate = employerPpkContributionRate.value / 100
        input.employeePpkContributionRate = employeePpkContributionRate.value / 100
      } else {
        input.employerPpkContributionRate = 0
        input.employeePpkContributionRate = 0
      }

      if(amountType.value === constants.AMOUNT_TYPES.NET) {
        const min = Number(amount.value)
        input.grossAmount = employeeContractOfEmployment.findGrossAmountUsingNetAmount(min, 1.7 * min, 100, min, input)
      }

      context.emit('save', input)
    }

    return {
      constants,
      validationRules,
      amount,
      amountType,
      accidentContributionRate,
      workInLivePlace,
      isFreeAmount,
      isReliefForYoung,
      isReliefForBigFamily,
      isReliefForSenior,
      isReliefForMiddleClass,
      isFpContribution,
      isPpkContribution,
      employerPpkContributionRate,
      employeePpkContributionRate,
      isAuthorExpenses,
      partOfWorkWithAuthorExpenses,
      isDisabledButton,
      save,
    }
  },
})
</script>
