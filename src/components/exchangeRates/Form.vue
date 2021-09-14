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
                  :locale="constants.LOCALE_DATE"
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
                  :locale="constants.LOCALE_DATE"
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
import constants from 'src/logic/constants'
export default {
  setup () {
    return { constants }
  },
  data () {
    return {
      startDate: null,
      endDate: null,
    }
  },
  computed: {
    isDisabledButton () {
      if (!this.startDate || !this.endDate) {
        return true
      }
      if (this.startDate >= this.endDate) {
        return true
      }
      return false
    },
  },
}
</script>
