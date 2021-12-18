<template>
  <q-form @submit.prevent="calculate">
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="sellStartDate"
          color="brand"
          mask="##.##.####"
          label="Data rozpoczęcia sprzedaży*"
          required
          :rules="['date']">
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer">
            </q-icon>
          </template>
          <DatePopup v-model="sellStartDate" />
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
          :disable="!sellStartDate"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import { getDayOfYear, lastDayOfYear, format } from 'date-fns'
import CashRegisterLimit from 'src/logic/CashRegisterLimit'
import DatePopup from 'components/partials/DatePopup'
import validationRules from 'src/logic/validationRules'

export default {
  data () {
    return {
      sellStartDate: null,
    }
  },
  created () {
    this.sellStartDate = format(new Date(), 'dd.MM.yyyy')
    this.$store.commit('cashRegisterLimit/CLEAR_DATA')
  },
  methods: {
    calculate () {
      const cashRegisterLimit = new CashRegisterLimit()

      const lastDayOfDateYear = lastDayOfYear(new Date(this.sellStartDate))

      cashRegisterLimit.dayOfYear = getDayOfYear(new Date(this.sellStartDate))
      cashRegisterLimit.daysOfYear = getDayOfYear(lastDayOfDateYear)
      cashRegisterLimit.calculate()

      this.$store.commit('cashRegisterLimit/SET_SELL_START_DATE', this.sellStartDate)
      this.$store.commit('cashRegisterLimit/SET_DAYS_TO_END_YEAR', cashRegisterLimit.daysOfYear - cashRegisterLimit.dayOfYear + 1)
      this.$store.commit('cashRegisterLimit/SET_AMOUNT', cashRegisterLimit.amount)

      this.$emit('scroll')
    },
  },
  components: {DatePopup},
  emits: ['scroll'],
}
</script>
