<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="save">
    <FormSection title="Dane faktury">
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model.number="amount"
            type="number"
            min="0"
            step="0.01"
            suffix="zł"
            label="Kwota"
            autofocus
            color="brand"
            :rules="[validationRules.requiredAmount]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
          <div class="q-mt-sm block">
            <q-radio
              v-model="amountType"
              :val="constants.amountTypes.net"
              label="netto"
            />
            <q-radio
              v-model="amountType"
              :val="constants.amountTypes.gross"
              label="brutto"
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="taxRate"
            :options="vatTaxRates"
            label="Stawka podatku VAT"
            color="brand"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {AmountType} from 'src/types/AmountType'
import {InvoiceInputFields} from './interfaces/InvoiceInputFields'
import {VatTaxRate} from 'src/types/VatTaxRate'
import {ref} from 'vue'
import {useFormValidation} from 'src/composables/formValidation'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import {useConstantsStore} from 'stores/constantsStore'
import validationRules from 'src/logic/validationRules'

const constants = useConstantsStore()

const emit = defineEmits<{
  save: [input: InvoiceInputFields]
}>()

const {handleValidationError} = useFormValidation()
const vatTaxRates = [
  {
    label: '0%',
    value: 0,
  },
  {
    label: '5%',
    value: 0.05,
  },
  {
    label: '8%',
    value: 0.08,
  },
  {
    label: '23%',
    value: 0.23,
  },
]

const amount = ref<number | null>(null)
const amountType = ref(constants.amountTypes.net)
const taxRate = ref(vatTaxRates[vatTaxRates.length - 1])

const save = () => {
  const input: InvoiceInputFields = {
    amount: Number(amount.value),
    amountType: amountType.value as AmountType,
    taxRate: taxRate.value.value as VatTaxRate,
  }
  emit('save', input)
}
</script>
