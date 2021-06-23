<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="daysOfRunningBusiness"
          type="number"
          min="1"
          max="31"
          step="1"
          label="Ilość dni prowadzenia działalności*"
          autofocus
          color="brand"
          required
        />
        <q-select
          v-model="daysInMonth"
          :options="days"
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
            v-model="isFp"
            :disable="isSmallZus"
            class="q-mt-sm"
            label="Składka na Fundusz Pracy"
          />
          <q-toggle
            v-model="isSick"
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
          v-model="accidentRate"
          type="number"
          class="full-width"
          min="0"
          step="0.01"
          label="Składka wypadkowa (%)*"
          color="brand"
          required
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

<script>
import SelfEmployment from 'src/logic/SelfEmployment'
import getDaysInMonth from 'date-fns/getDaysInMonth'

export default {
  data () {
    return {
      selfEmployment: null,
      accidentRate: 0,
      isSmallZus: false,
      isSick: false,
      isFp: true,
      isCustomBasisForZus: false,
      customBasisForZus: null,
      daysOfRunningBusiness: null,
      daysInMonth: null,
      days: [28, 29, 30, 31],
    }
  },
  emits: ['scroll'],
  created () {
    this.accidentRate = this.$constants.ACCIDENT_RATE
    this.customBasisForZus = this.$constants.ZUS.OWNER.BIG_AMOUNT
    this.daysInMonth = getDaysInMonth(new Date())

    this.$store.commit('partialZusContributions/CLEAR_DATA')
  },
  computed: {
    isDisabledButton () {
      if (!this.daysOfRunningBusiness || !this.daysInMonth) {
        return true
      }
      if (this.daysOfRunningBusiness > this.daysInMonth) {
        return true
      }
      return false
    },
  },
  watch: {
    isSmallZus: function (val) {
      if (val) {
        this.isFp = false
        this.isCustomBasisForZus = false
      }
    },
  },
  methods: {
    calculate () {
      this.selfEmployment = new SelfEmployment()
      this.selfEmployment.zusAccidentRate = Number(this.accidentRate) / 100

      if (this.isSmallZus) {
        this.selfEmployment.basisForZus = this.$constants.ZUS.OWNER.SMALL_AMOUNT
      } else {
        this.selfEmployment.basisForZus = this.$constants.ZUS.OWNER.BIG_AMOUNT
      }

      if (this.isCustomBasisForZus) {
        this.selfEmployment.basisForZus = Number(this.customBasisForZus)
      }

      this.selfEmployment.basisForZus /= this.daysInMonth
      this.selfEmployment.basisForZus *= this.daysOfRunningBusiness
      this.selfEmployment.basisForZus = parseFloat(this.selfEmployment.basisForZus.toFixed(2))

      this.calculateAmount()

      this.$store.commit('partialZusContributions/SET_BASIS_FOR_ZUS', this.selfEmployment.basisForZus)
      this.$store.commit('partialZusContributions/SET_ZUS', this.selfEmployment.zus)

      this.$emit('scroll')
    },
    calculateAmount () {
        this.selfEmployment.calculateZUSAccident()
        this.selfEmployment.calculateZUSPension()
        this.selfEmployment.calculateZUSRent()

      if (this.isSick) {
        this.selfEmployment.calculateZUSSick()
      }

      if (this.isFp) {
        this.selfEmployment.calculateZUSFP()
      }

      this.selfEmployment.calculateZUSHealth()
      this.selfEmployment.calculateUSHealth()
    },
  },
}
</script>
