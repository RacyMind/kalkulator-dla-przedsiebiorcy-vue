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
        />
        <div class="q-mt-sm block">
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
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="q-mt-sm block">
          <div>Koszty uzyskania przychodu*</div>
          <q-radio
            v-model.number="expenseRate"
            :val="constants.CONTRACT_WORK.EXPENSES_20"
            label="20%"
          />
          <q-radio
            v-model.number="expenseRate"
            :val="constants.CONTRACT_WORK.EXPENSES_50"
            label="50%"
          />
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
import {computed, defineComponent, Ref, ref, toRefs} from 'vue'
import constants from 'src/logic/constants'
import {AmountType} from 'src/types/AmountType'
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {AvailableYear} from 'src/types/AvailableYear'

export default defineComponent({
  props: {
    year: {
      year: Number,
      required: true,
    },
  },
  setup(props, context) {
    const { year } = toRefs(props)

    const amount = ref(null)
    const amountType = ref(constants.AMOUNT_TYPES.GROSS)
    const expenseRate:Ref = ref(constants.CONTRACT_WORK.EXPENSES_20)

    const isDisabledButton = computed(() => {
      return !amount.value || expenseRate.value === null
    })

    const save = () => {
      const input: ContractWorkInputFields = {
        year: <AvailableYear>year.value,
        amount: Number(amount.value),
        amountType: <AmountType>amountType.value,
        expenseRate: expenseRate.value,
      }
      context.emit('save', input)
    }

    return {
      constants,
      amount,
      amountType,
      expenseRate,
      isDisabledButton,
      save,
    }
  },
})
</script>
