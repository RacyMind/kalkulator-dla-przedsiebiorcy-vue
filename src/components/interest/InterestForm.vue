<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Kwota*"
          autofocus
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="rate"
          type="number"
          min="0"
          step="0.01"
          label="Odsetki (%) *"
          color="brand"
          required
        />
        <q-toggle
          v-model="isBasicRate"
          class="q-mt-sm"
          label="odsetki ustawowe"
          color="red-8"
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="startDate"
          color="brand"
          mask="date"
          label="Termin zapłaty*"
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
                  v-model="startDate"
                  :locale="$constants.LOCALE_DATE"
                  color="red-8"
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
          label="Data zapłaty*"
          required
          :rules="['date']">
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
                  :locale="$constants.LOCALE_DATE"
                  color="red-8"
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
          label="Oblicz"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
export default {
  data () {
    return {
      amount: null,
      rate: null,
      isBasicRate: false,
      startDate: null,
      endDate: null,
    }
  },
  created () {
    this.rate = this.$constants.BASIC_INTEREST_RATE
    this.isBasicRate = true
  },
  watch: {
    isBasicRate: function (val) {
      if (val) {
        this.rate = this.$constants.BASIC_INTEREST_RATE
      }
    },
    rate: function (val) {
      this.isBasicRate = Number(val) === 13
    },
  },
}
</script>

<style scoped>

</style>
