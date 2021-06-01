<template>
  <q-form @submit.prevent="calculate">
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="businessStartDate"
          color="brand"
          mask="date"
          label="Data rozpoczęcia działalności*"
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
                  v-model="businessStartDate"
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
          :disable="!businessStartDate"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import VatLimit from 'src/logic/VatLimit'
import { getDayOfYear, lastDayOfYear, format } from 'date-fns'

export default {
  data () {
    return {
      businessStartDate: null,
    }
  },
  emits: ['scroll'],
  created () {
    this.businessStartDate = format(new Date(), 'yyyy/MM/dd')
    this.$store.commit('vatLimit/CLEAR_DATA')
  },
  methods: {
    calculate () {
      const vatLimit = new VatLimit()

      const lastDayOfDateYear = lastDayOfYear(new Date(this.businessStartDate))

      vatLimit.dayOfYear = getDayOfYear(new Date(this.businessStartDate))
      vatLimit.daysOfYear = getDayOfYear(lastDayOfDateYear)
      vatLimit.calculate()

      this.$store.commit('vatLimit/SET_BUSINESS_START_DATE', this.businessStartDate)
      this.$store.commit('vatLimit/SET_DAYS_TO_END_YEAR', vatLimit.daysOfYear - vatLimit.dayOfYear + 1)
      this.$store.commit('vatLimit/SET_AMOUNT', vatLimit.amount)

      this.$emit('scroll')
    },
  },
}
</script>
