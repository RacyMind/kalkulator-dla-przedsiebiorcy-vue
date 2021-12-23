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
          label="Kwota*"
          autofocus
          color="brand"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model.number="rate"
          type="number"
          min="0"
          step="0.01"
          suffix="%"
          label="Odsetki*"
          color="brand"
          :rules="[validationRules.required]"
          lazy-rules
        />
        <q-toggle
          v-model="isBasicCapitalRate"
          class="q-mt-sm"
          label="Ustawowe odsetki kapitałowe"
        />
        <q-toggle
          v-model="isBasicLateRate"
          class="q-mt-sm"
          label="Ustawowe odsetki za opóźnienie"
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="startDate"
          color="brand"
          mask="##.##.####"
          label="Termin zapłaty*"
          :rules="[validationRules.required]"
          lazy-rules>
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer">
            </q-icon>
          </template>
          <DatePopup v-model="startDate" />
        </q-input>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="endDate"
          class="q-pb-none"
          color="brand"
          mask="##.##.####"
          label="Data zapłaty*"
          :rules="[validationRules.required]"
          lazy-rules>
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
import {computed, ref, watch} from 'vue'
import differenceInDays from 'date-fns/differenceInDays'
import DatePopup from 'components/partials/DatePopup.vue'
import validationRules from 'src/logic/validationRules'
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import constants from 'src/logic/constants'
import {parse} from 'date-fns'

export default {
  setup(props: any, context: any) {
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
        rate: Number(rate.value) / 100,
        dayCount: differenceInDays(
          new Date(formattedEndDate.value),
          new Date(formattedStartDate.value),
        ),
      }
      context.emit('save', input)
    }

    return{
      validationRules,
      amount,
      rate,
      startDate,
      endDate,
      isBasicCapitalRate,
      isBasicLateRate,
      isDisabledButton,
      save,
    }
  },
  components: {
    DatePopup,
  },
}
</script>
