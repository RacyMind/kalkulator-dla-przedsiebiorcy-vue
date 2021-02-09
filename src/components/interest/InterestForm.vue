<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-6 q-pr-sm">
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
      <div class="col-6 q-pl-sm">
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
          label="odsetki ustawowe"
          color="red-8"
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-6 q-pr-sm">
        <q-input
          v-model="date"
          color="brand"
          mask="date"
          label="Termin zapłaty"
          required
          :rules="['date']">
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale">
                <q-date
                  v-model="date"
                  :locale="$constants.LOCALE_DATE"
                  color="red-8"
                  @input="() => $refs.qDateProxy.hide()"
                >
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row q-mt-sm">
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
      date: null,
    }
  },
  watch: {
    isBasicRate: function (val) {
      if (val) {
        this.rate = this.$constants.BASIC_INTEREST_RATE
      }
    },
    rate: function (val) {
      if (val !== 13) {
        this.isBasicRate = false
      }
    },
  },
}
</script>

<style scoped>

</style>
