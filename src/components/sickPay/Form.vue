<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12">
        <q-input
          v-model.number="basicAmount"
          type="number"
          min="0"
          step="0.01"
          suffix="zł"
          label="Podstawa wymiaru świadczenia*"
          autofocus
          color="brand"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-select
          v-model="rate"
          :options="sickTaxRates"
          label="Stawka zasiłku chorobowego*"
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model.number="dayCount"
          type="number"
          min="1"
          step="1"
          label="Liczba dni na zwolnieniu*"
          color="brand"
          :rules="[validationRules.required]"
          lazy-rules
        />
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
import {computed, ref} from 'vue'
import constants from 'src/logic/constants'
import validationRules from 'src/logic/validationRules'
import {SickPayInputFields} from 'components/sickPay/interfaces/SickPayInputFields'
import {SickPayRate} from 'components/sickPay/types/SickPayRate'

export default {
  setup(props: any, context: any) {
    const sickTaxRates = [
      {
        label: '80%',
        value: 0.8,
      },
      {
        label: '100%',
        value: 1,
      },
    ]

    const basicAmount = ref(null)
    const dayCount = ref(null)
    const rate = ref(sickTaxRates[0])

    const isDisabledButton = computed(() => {
      return !basicAmount.value || !dayCount.value || rate.value === null
    })

    const save = () => {
      const input: SickPayInputFields = {
        basicAmount: Number(basicAmount.value),
        dayCount: Number(dayCount.value),
        rate: <SickPayRate>rate.value.value,
      }
      context.emit('save', input)
    }

    return {
      constants,
      validationRules,
      sickTaxRates,
      basicAmount,
      dayCount,
      rate,
      isDisabledButton,
      save,
    }
  },
}
</script>
