<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="daysOfRunningBusiness"
          type="number"
          min="1"
          max="31"
          step="1"
          label="Ilość dni prowadzenia działalności*"
          autofocus
          color="brand"
          :rules="[validationRules.required]"
          lazy-rules
        />
        <q-select
          v-model.number="daysInMonth"
          :options="availableDays"
          label="Ilość dni w miesiącu*"
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="column">
          <q-toggle
            v-model="isSmallZus"
            class="q-mt-sm"
            label="Mały ZUS"
          />
          <q-toggle
            v-model="isFpContribution"
            :disable="isSmallZus"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="isSickContribution"
            class="q-mt-sm"
            label="Składka chorobowa"
          />
        </div>
        <q-toggle
          v-model="isCustomBasisForZus"
          :disable="isSmallZus"
          class="q-mt-sm"
          label="Własna podstawa dla składek ZUS"
        />
        <q-input
          v-if="isCustomBasisForZus"
          v-model="customBasisForZus"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Podstawa dla składek ZUS"
          color="brand"
          required
        />
        <q-input
          v-model.number="accidentContributionRate"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Składka wypadkowa (%)*"
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
import {computed, defineComponent, Ref, ref, watch} from 'vue'
import constants from 'src/logic/constants'
import {PartialZusContributionInputFields} from 'components/partialZusContributions/interfaces/PartialZusContributionInputFields'
import validationRules from 'src/logic/validationRules'
import helpers from 'src/logic/helpers'
import {getDaysInMonth} from 'date-fns'

const availableDays = [28, 29, 30, 31]

export default defineComponent({
  props: {
    year: Number,
  },
  setup(props, context) {
    const year = helpers.getDefaultYear()

    const accidentContributionRate = ref(constants.PARAMS[year].ACCIDENT_RATE)
    const customBasisForZus = ref(constants.PARAMS[year].ZUS.OWNER.BIG_AMOUNT)
    const daysInMonth = ref(getDaysInMonth(new Date()))
    const daysOfRunningBusiness: Ref<number | null> = ref(null)
    const isCustomBasisForZus = ref(false)
    const isFpContribution = ref(false)
    const isSickContribution = ref(false)
    const isSmallZus = ref(false)

    const isDisabledButton = computed(() => {
      if (!daysOfRunningBusiness.value || !daysInMonth.value) {
        return true
      }
      if (daysOfRunningBusiness.value &&
        daysInMonth.value &&
        daysOfRunningBusiness.value > daysInMonth.value) {
        return true
      }
      return false
    })

    watch(isSmallZus, () => {
      if (isSmallZus.value) {
        isFpContribution.value = false
        isCustomBasisForZus.value = false
      }
    })

    const save = () => {
      const input: PartialZusContributionInputFields = {
        accidentContributionRate: accidentContributionRate.value / 100,
        customBasisForZus: Number(customBasisForZus.value),
        daysInMonth: Number(daysInMonth.value),
        daysOfRunningBusiness: Number(daysOfRunningBusiness.value),
        isFpContribution: isFpContribution.value,
        isSickContribution: isSickContribution.value,
        isSmallZus: isSmallZus.value,
      }

      if (!isCustomBasisForZus.value) {
        input.customBasisForZus = 0
      }

      context.emit('save', input)
    }

    return {
      accidentContributionRate,
      availableDays,
      constants,
      customBasisForZus,
      daysInMonth,
      daysOfRunningBusiness,
      isCustomBasisForZus,
      isDisabledButton,
      isFpContribution,
      isSickContribution,
      isSmallZus,
      save,
      validationRules,
    }
  },
})
</script>
