<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="save">
    <FormSection title="Parametry lokaty">
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-4">
          <q-input
            v-model.number="amount"
            type="number"
            min="0"
            step="0.01"
            suffix="zł"
            label="Kapitał"
            autofocus
            color="brand"
            :rules="[validationRules.requiredAmount]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model.number="rate"
            type="number"
            min="0"
            step="0.01"
            suffix="%"
            label="Oprocentowanie"
            color="brand"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model.number="monthCount"
            type="number"
            min="1"
            step="1"
            label="Okres lokaty (w miesiącach)"
            color="brand"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script lang="ts">
import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {computed, defineComponent, ref} from 'vue'
import {useFormValidation} from 'src/composables/formValidation'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import validationRules from 'src/logic/validationRules'

export default defineComponent({
  components: {
    FormSection,
    SubmitButton,
  },
  setup(props, context) {
    const {handleValidationError} = useFormValidation()
    const amount = ref(null)
    const rate = ref(null)
    const monthCount = ref(12)

    const isDisabledButton = computed(() => {
      return !amount.value || !rate.value || !monthCount.value
    })

    const save = () => {
      const input: InvestmentInputFields = {
        amount: Number(amount.value),
        monthCount: Number(monthCount.value),
        rate: Number(rate.value) / 100,
      }
      context.emit('save', input)
    }

    return{
      amount,
      handleValidationError,
      isDisabledButton,
      monthCount,
      rate,
      save,
      validationRules,
    }
  },
})
</script>
