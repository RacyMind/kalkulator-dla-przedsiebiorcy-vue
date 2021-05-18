<template>
  <q-form @submit.prevent="calculate">
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="sellStartDate"
          color="brand"
          mask="date"
          label="Data rozpoczęcia sprzedaży*"
          required
          :rules="['date']">
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy1"
                transition-show="scale"
                transition-hide="scale">
                <q-date
                  v-model="sellStartDate"
                  :locale="$constants.LOCALE_DATE"
                  @input="() => $refs.qDateProxy1.hide()"
                >
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
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
import CashRegisterLimit from 'src/logic/CashRegisterLimit'
import { getDayOfYear, lastDayOfYear, format } from 'date-fns'

export default {
  data () {
    return {
      sellStartDate: null,
    }
  },
  emits: ['scroll'],
  created () {
    this.sellStartDate = format(new Date(), 'yyyy/MM/dd')
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
}
</script>
