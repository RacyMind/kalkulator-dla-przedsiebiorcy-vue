<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          suffix="zł"
          label="Przychód*"
          autofocus
          color="brand"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model.number="expenses"
          type="number"
          suffix="zł"
          min="0"
          step="0.01"
          label="Koszty uzyskania przychodu*"
          color="brand"
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
import {computed, defineComponent, ref} from 'vue'
import {UnregisteredCompanyInputFields} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyInputFields'
import validationRules from 'src/logic/validationRules'

export default defineComponent({
  setup(props, context) {
    const amount = ref(null)
    const expenses = ref(0)

    const isDisabledButton = computed(() => {
      return !amount.value
    })

    const save = () => {
      const input: UnregisteredCompanyInputFields = {
        incomeAmount: Number(amount.value),
        expenses: Number(expenses.value),
      }
      context.emit('save', input)
    }

    return{
      validationRules,
      amount,
      expenses,
      isDisabledButton,
      save,
    }
  },
})
</script>
