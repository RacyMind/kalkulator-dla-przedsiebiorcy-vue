<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="save">
    <FormSection title="Kwota i odsetki">
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
            data-testid="amount"
            :rules="[validationRules.requiredAmount]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model.number="rate"
            type="number"
            min="0"
            step="0.01"
            suffix="%"
            label="Odsetki"
            color="brand"
            data-testid="rate"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
      </div>
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-toggle
            v-model="isBasicCapitalRate"
            class="q-mt-sm"
            data-testid="basic-capital-rate"
            label="Ustawowe odsetki kapitałowe"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            v-model="isBasicLateRate"
            class="q-mt-sm"
            data-testid="basic-late-rate"
            label="Ustawowe odsetki za opóźnienie"
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Okres naliczania">
      <div class="row items-start q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="startDate"
            color="brand"
            mask="##.##.####"
            label="Termin zapłaty"
            :rules="[validationRules.required]"
            data-testid="startDate"
            lazy-rules="ondemand"
            hide-bottom-space>
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer">
              </q-icon>
            </template>
            <DatePopup v-model="startDate" />
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="endDate"
            color="brand"
            mask="##.##.####"
            label="Data zapłaty"
            :rules="[validationRules.required]"
            data-testid="endDate"
            lazy-rules="ondemand"
            hide-bottom-space>
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer">
              </q-icon>
            </template>
            <DatePopup v-model="endDate" />
          </q-input>
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script lang="ts">
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {computed, defineComponent, ref, watch} from 'vue'
import {differenceInDays, parse} from 'date-fns'
import {useFormValidation} from 'src/composables/formValidation'
import DatePopup from 'components/partials/DatePopup.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import constants from 'src/logic/constants'
import validationRules from 'src/logic/validationRules'

export default defineComponent({
  components: {
    DatePopup,
    FormSection,
    SubmitButton,
  },
  setup(props, context) {
    const {handleValidationError} = useFormValidation()
    const amount = ref(null)
    const rate = ref(constants.BASIC_CAPITAL_INTEREST_RATE)

    const startDate = ref('')
    const endDate = ref('')

    const isBasicCapitalRate = ref(true)
    const isBasicLateRate = ref(false)

    const formattedStartDate = computed( () => {
      return parse(
        startDate.value,
        'dd.MM.yyyy',
        new Date(),
      )
    })

    const formattedEndDate = computed( () => {
      return parse(
        endDate.value,
        'dd.MM.yyyy',
        new Date(),
      )
    })

    watch(isBasicCapitalRate, () => {
      if(isBasicCapitalRate.value) {
        isBasicLateRate.value = false
        rate.value = constants.BASIC_CAPITAL_INTEREST_RATE
      }
    })

    watch(isBasicLateRate, () => {
      if(isBasicLateRate.value) {
        isBasicCapitalRate.value = false
        rate.value = constants.BASIC_LATE_INTEREST_RATE
      }
    })

    watch(rate, () => {
      isBasicCapitalRate.value = rate.value === constants.BASIC_CAPITAL_INTEREST_RATE
      isBasicLateRate.value = rate.value === constants.BASIC_LATE_INTEREST_RATE
    })

    const isDisabledButton = computed(() => {
      if(!amount.value || !rate.value || !startDate.value || !endDate.value) {
        return true
      }
      return formattedStartDate.value >= formattedEndDate.value
    })

    const save = () => {
      const input: InterestInputFields = {
        amount: Number(amount.value),
        dayCount: differenceInDays(
          new Date(formattedEndDate.value),
          new Date(formattedStartDate.value),
        ),
        rate: Number(rate.value) / 100,
      }
      context.emit('save', input)
    }

    return{
      amount,
      endDate,
      handleValidationError,
      isBasicCapitalRate,
      isBasicLateRate,
      isDisabledButton,
      rate,
      save,
      startDate,
      validationRules,
    }
  },
})
</script>
