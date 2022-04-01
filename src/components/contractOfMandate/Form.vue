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
          suffix="zł"
          autofocus
          color="brand"
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
          :readonly="isHourlyAmount"
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
          <div class="row full-width">
            <q-toggle
              v-model="isHourlyAmount"
              class="q-mt-sm"
              label="Stawka godzinowa"
            />
          </div>
          <div
            v-if="isHourlyAmount"
            class="row full-width">
            <div class="col-6">
              <q-input
                v-model.number="hourlyAmount"
                type="number"
                min="0"
                step="0.01"
                label="Stawka godzinowa*"
                suffix="zł"
                color="brand"
                :rules="[
                  val => !!val || '* Wpisz kwotę',
                ]"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pl-sm">
              <q-input
                v-model.number="hourCount"
                type="number"
                class="full-width"
                :min="1"
                step="1"
                label="Ilość godzin*"
                color="brand"
                :rules="[
                  val => !!val || '* Wpisz ilość godzin',
                ]"
                lazy-rules
              />
            </div>
          </div>
          <q-toggle
            v-model="isReliefForYoung"
            class="q-mt-sm"
            label="Zerowy PIT dla młodych"
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
        <div class="q-mt-sm block">
          <div class="column">
            <q-toggle
              v-model="isStudent"
              class="q-mt-sm"
              label="Student / uczeń"
            />
            <div class="row">
              <q-toggle
                v-model="isHealthContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka zdrowotna"
              />
              <q-toggle
                v-model="isSickContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka chorobowa"
              />
            </div>
            <div class="row">
              <q-toggle
                v-model="isRentContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka rentowa"
              />
              <q-toggle
                v-model="isPensionContribution"
                :disable="isStudent"
                class="q-mt-sm col-6"
                label="Składka emerytalna"
              />
              <q-toggle
                v-model="isFpContribution"
                class="q-mt-sm"
                label="Składka na Fundusz Pracy"
              />
              <q-input
                v-model.number="accidentContributionRate"
                :disable="isStudent"
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
                v-model="isPpkContribution"
                class="q-mt-sm"
                label="PPK"
              />
              <div
                v-if="isPpkContribution"
                class="row full-width">
                <div class="col-6">
                  <q-input
                    v-model.number="employerPpkContributionRate"
                    type="number"
                    class="full-width"
                    :min="constants.PPK.EMPLOYER.MINIMUM_RATE"
                    :max="constants.PPK.EMPLOYER.MAXIMUM_RATE"
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
                    :min="constants.PPK.EMPLOYER.MINIMUM_RATE"
                    :max="constants.PPK.EMPLOYER.MAXIMUM_RATE"
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
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="brand"
          size="lg"
          label="Oblicz"
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import {defineComponent, computed, Ref, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'
import {AvailableYear} from 'src/types/AvailableYear'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import employeeContractOfMandate from 'components/contractOfMandate/employeeContractOfMandate'

export default defineComponent({
  props: {
    year: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    const $q = useQuasar()

    const amount:Ref<number|null> = ref(null)
    const amountType = ref(constants.AMOUNT_TYPES.GROSS)
    const accidentContributionRate = ref(constants.PARAMS[<AvailableYear>props.year].ACCIDENT_RATE)
    const isReliefForYoung = ref(false)
    const isStudent = ref(false)
    const isHealthContribution = ref(true)
    const isSickContribution = ref(true)
    const isRentContribution = ref(true)
    const isPensionContribution = ref(true)
    const isFpContribution = ref(false)
    const isPpkContribution = ref(false)
    const employerPpkContributionRate = ref(constants.PARAMS[<AvailableYear>props.year].PPK.EMPLOYER.DEFAULT_RATE)
    const employeePpkContributionRate = ref(constants.PARAMS[<AvailableYear>props.year].PPK.EMPLOYEE.DEFAULT_RATE)
    const isAuthorExpenses = ref(false)
    const partOfWorkWithAuthorExpenses = ref(100)
    const isHourlyAmount = ref(false)
    const hourlyAmount:Ref<number|null> = ref(null)
    const hourCount:Ref<number|null> = ref(null)

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

    watch(isStudent, () => {
      if (isStudent.value) {
        isHealthContribution.value = false
        isSickContribution.value = false
        isRentContribution.value = false
        isPensionContribution.value = false
        accidentContributionRate.value = 0

        $q.notify({
          message: 'Dla studenta / ucznia nie odprowadza się składek ZUS.',
        })
      }
    })
    watch(hourlyAmount, () => {
      if (isHourlyAmount.value) {
        amount.value = Number(hourlyAmount.value) * Number(hourCount.value)
      }
    })
    watch(hourCount, () => {
      if (isHourlyAmount.value) {
        amount.value = Number(hourlyAmount.value) * Number(hourCount.value)
      }
    })

    const save = () => {
      const input: ContractOfMandateInputFields = {
        year: <AvailableYear>props.year,
        grossAmount: Number(amount.value),
        isReliefForYoung: isReliefForYoung.value,
        partOfWorkWithAuthorExpenses: partOfWorkWithAuthorExpenses.value,
        isHealthContribution: isHealthContribution.value,
        isSickContribution: isSickContribution.value,
        isDisabilityContribution: isRentContribution.value,
        isPensionContribution: isPensionContribution.value,
        accidentContributionRate: accidentContributionRate.value / 100,
        isFpContribution: isFpContribution.value,
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
        input.grossAmount = employeeContractOfMandate.findGrossAmountUsingNetAmount(min, 1.7 * min, 100, min, input)
      }

      context.emit('save', input)
    }

    return {
      constants,
      amount,
      amountType,
      accidentContributionRate,
      isReliefForYoung,
      isStudent,
      isHealthContribution,
      isSickContribution,
      isRentContribution,
      isPensionContribution,
      isFpContribution,
      isPpkContribution,
      employerPpkContributionRate,
      employeePpkContributionRate,
      isAuthorExpenses,
      partOfWorkWithAuthorExpenses,
      isHourlyAmount,
      hourlyAmount,
      hourCount,
      isDisabledButton,
      save,
    }
  },
})
</script>
