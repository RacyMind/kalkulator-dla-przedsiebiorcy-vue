<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Wynagrodzenie netto
      </div>
      <div>
        {{ pln(result.netAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Koszty przychodu
      </div>
      <div>
        {{ pln(result.expenses) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podstawa opodatkowania
      </div>
      <div>
        {{ pln(result.basisForTax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek dochodowy
      </div>
      <div>
        {{ pln(result.taxAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składki ZUS
      </div>
      <div class="text-weight-bold">
        {{ pln(totalZusContributions) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka zdrowotna
      </div>
      <div>
        {{ pln(result.healthContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka chorobowa
      </div>
      <div>
        {{ pln(result.sickContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka rentowa
      </div>
      <div>
        {{ pln(result.rentContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka emerytalna
      </div>
      <div>
        {{ pln(result.pensionContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        PPK
      </div>
      <div>
        {{ pln(result.ppkContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Wynagrodzenie brutto
      </div>
      <div>
        {{ pln(result.grossAmount) }}
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import constants from 'src/logic/constants'
import { getMonthlyResultOfEmployee } from 'src/logic/contractOfMandate'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const store = useStore()
    const grossAmount = computed(() => store.getters['contractOfMandate/grossAmount'])
    const ppkEmployeeContributionRate = computed(() => store.getters['contractOfMandate/ppkEmployeeContributionRate'])
    const partOfWorkWithAuthorExpenses = computed(() => store.getters['contractOfMandate/partOfWorkWithAuthorExpenses'])
    const isPensionContribution = computed(() => store.getters['contractOfMandate/isPensionContribution'])
    const isRentContribution = computed(() => store.getters['contractOfMandate/isRentContribution'])
    const isSickContribution = computed(() => store.getters['contractOfMandate/isSickContribution'])
    const isHealthContribution = computed(() => store.getters['contractOfMandate/isHealthContribution'])
    const isYoung = computed(() => store.getters['contractOfMandate/isYoung'])

    return {
      pln,
      grossAmount,
      ppkEmployeeContributionRate,
      partOfWorkWithAuthorExpenses,
      isPensionContribution,
      isRentContribution,
      isSickContribution,
      isHealthContribution,
      isYoung,
    }
  },
  computed: {
    result () {
      return getMonthlyResultOfEmployee(
        this.grossAmount,
        this.ppkEmployeeContributionRate,
        this.partOfWorkWithAuthorExpenses,
        this.isPensionContribution,
        this.isRentContribution,
        this.isSickContribution,
        this.isHealthContribution,
        this.isYoung,
      )
    },
    totalZusContributions () {
      return [
        this.result.pensionContribution,
        this.result.rentContribution,
        this.result.sickContribution,
        this.result.healthContribution,
      ].reduce((current, sum) => current + sum)
    },
  },
  watch: {
    grossAmount: function (val) {
      if (val) {
        this.showNotifications()
      }
    },
  },
  methods: {
    showNotifications () {
      if (this.grossAmount && this.result.grossAmount <= constants.LUMP_SUM_UP_TO_AMOUNT) {
        this.$q.notify({
          message: `Dla wynagrodzenia brutto do ${constants.LUMP_SUM_UP_TO_AMOUNT} zł płaci się podatek zryczałtowany.`,
        })
      }
    },
  },
}
</script>
