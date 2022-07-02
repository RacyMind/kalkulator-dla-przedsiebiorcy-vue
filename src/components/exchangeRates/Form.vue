<template>
  <q-form @submit.prevent="save">
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
            date => !isFuture(new Date(date)) || 'Wybierz datę z przeszłości lub dzisiejszą'
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
            date => !isFuture(new Date(date)) || 'Wybierz datę z przeszłości lub dzisiejszą'
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
import { format, isFuture, subMonths } from 'date-fns'
import { ref } from 'vue'
import constants from 'src/logic/constants'

export default {
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
  created () {
    const now = new Date()
    const monthAgo = subMonths(now, 1)

    this.startDate = format(monthAgo, 'Y/MM/dd')
    this.endDate = format(now, 'Y/MM/dd')

    this.save()
  },
  methods: {
    save () {
      const startDate = format(new Date(this.startDate), 'Y-MM-dd')
      const endDate = format(new Date(this.endDate), 'Y-MM-dd')

      this.$store.commit('exchangeRates/setLoading', true)

      this.$store.dispatch('exchangeRates/loadExchangeRateCurrency', {
        code: this.$route.params.currency,
        endDate,
        startDate,
      }).then(response => {
        this.$store.commit('exchangeRates/setCurrency', response.data)
        this.$q.notify({
          message: 'Źródło danych: Narodowy Bank Polski',
        })
      }).catch((error) => {
        let message = 'Nie udało się połączyć z serwerem NBP. Spróbuj ponownie'
        if (error.response) {
          message = error.response.data
        }
        this.$q.notify({
          message: message,
        })
        this.$store.commit('exchangeRates/setCurrency', null)
      }).finally(() => {
        this.$store.commit('exchangeRates/setLoading', false)
      })
    },
  },
  setup () {
    return {
      constants,
      endDate: ref(null),
      isFuture,
      onlyPast (date) {
        return date <= format(new Date(), 'y/MM/dd')
      },
      startDate: ref(null),
    }
  },
}
</script>
