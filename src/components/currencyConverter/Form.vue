<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="calculate">
    <FormSection title="Przelicznik walut">
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-4">
          <q-input
            v-model.number="amount"
            type="number"
            min="0"
            step="0.01"
            label="Kwota"
            color="brand"
            :rules="[validationRules.requiredAmount]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="fromCurrency"
            :options="currencies"
            label="Mam"
            color="brand"
            use-input
            input-debounce="0"
            @filter="filterCurrency"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="toCurrency"
            :options="currencies"
            label="Chcę"
            color="brand"
            use-input
            input-debounce="0"
            @filter="filterCurrency"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useCurrencyConverterStore} from 'stores/currency-converter-store'
import {useCurrencyRateStore} from 'stores/currency-rate-store'
import {useFormValidation} from 'src/composables/formValidation'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import currencyConverter from './currencyConverter'
import validationRules from 'src/logic/validationRules'

const pln = {
  code: 'PLN',
  currency: 'złoty',
  label: 'PLN złoty',
  mid: 1,
}

const emit = defineEmits(['scroll'])

const {handleValidationError} = useFormValidation()
const currencyRateStore = useCurrencyRateStore()
const currencyConverterStore = useCurrencyConverterStore()

currencyRateStore.loadLatestExchangeRates()

const amount = ref(null)
const currencies = ref([pln])
const fromCurrency = ref(pln)
const toCurrency = ref(pln)

const filterCurrency = (val: string, update: any) => {
  let allRates = [pln]
  allRates = allRates.concat(JSON.parse(JSON.stringify(currencyRateStore.currencyRates)))
  allRates.forEach(rate => {
    rate.label = `${rate.code} ${rate.currency}`
  })

  if (val === '') {
    update(() => {
      currencies.value = allRates
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    currencies.value = allRates.filter(currency => currency.label.toLowerCase().indexOf(needle) > -1)
  })
}

const calculate = () => {
  const fromRatio = Number(fromCurrency.value.mid)
  const toRatio = Number(toCurrency.value.mid)

  currencyConverterStore.amount = amount.value
  currencyConverterStore.valueForOne = currencyConverter.convert(1, fromRatio, toRatio)
  currencyConverterStore.valueForWholeAmount = currencyConverter.convert(amount.value, fromRatio, toRatio)
  currencyConverterStore.fromCurrency = fromCurrency.value.code
  currencyConverterStore.toCurrency = toCurrency.value.code

  emit('scroll')
}
</script>
