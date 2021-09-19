<template>
  <q-form @submit.prevent="show">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="startDate"
          color="brand"
          mask="date"
          label="Data początkowa*"
          required
          :rules="[
            'date',
            date => !isFuture(new Date(date)) || 'Wybierz datę z przeszłości lub dzisziejszą'
          ]">
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy1"
                transition-show="scale"
                transition-hide="scale">
                <q-date
                  v-model="startDate"
                  :locale="constants.LOCALE_DATE"
                  :options="onlyPast"
                  @input="() => $refs.qDateProxy1.hide()"
                >
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="endDate"
          class="q-pb-none"
          color="brand"
          mask="date"
          label="Data końcowa*"
          required
          :rules="[
            'date',
            date => !isFuture(new Date(date)) || 'Wybierz datę z przeszłości lub dzisziejszą'
          ]">
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy2"
                transition-show="scale"
                transition-hide="scale">
                <q-date
                  v-model="endDate"
                  :locale="constants.LOCALE_DATE"
                  :options="onlyPast"
                  @input="() => $refs.qDateProxy2.hide()"
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
          label="Pokaż"
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import { format, isFuture } from 'date-fns'
import { ref } from 'vue'
import constants from 'src/logic/constants'

export default {
  setup () {
    return {
      constants,
      isFuture,
      startDate: ref(null),
      endDate: ref(null),
      onlyPast (date) {
        return date <= format(new Date(), 'y/MM/dd')
      },
    }
  },
  computed: {
    isDisabledButton () {
      if (!this.startDate || !this.endDate) {
        return true
      }
      if (isFuture(new Date(this.startDate)) || isFuture(new Date(this.endDate))) {
        return true
      }
      if (this.startDate >= this.endDate) {
        return true
      }
      return false
    },
  },
  methods: {
    show () {
      const startDate = format(new Date(this.startDate), 'Y-MM-dd')
      const endDate = format(new Date(this.endDate), 'Y-MM-dd')
      this.$store.dispatch('exchangeRates/loadExchangeRateCurrency', {
        code: this.$route.params.currency,
        startDate,
        endDate,
      })
    },
  },
}
</script>
