<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Wynagrodzenie brutto
      </div>
      <div>
        {{ pln(result.grossAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składki ZUS
      </div>
      <div class="text-weight-bold">
        {{ pln(totalZusContributions) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka wypadkowa
      </div>
      <div>
        {{ pln(result.accidentContribution) }}
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
        Suma kosztów pracodawcy
      </div>
      <div>
        {{ pln(result.totalAmount) }}
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getMonthlyResultOfEmployer } from 'src/logic/contractOfMandate'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const store = useStore()
    const grossAmount = computed(() => store.getters['contractOfMandate/grossAmount'])
    const ppkEmployerContributionRate = computed(() => store.getters['contractOfMandate/ppkEmployerContributionRate'])
    const accidentContributionRate = computed(() => store.getters['contractOfMandate/accidentContributionRate'])
    const isPensionContribution = computed(() => store.getters['contractOfMandate/isPensionContribution'])
    const isRentContribution = computed(() => store.getters['contractOfMandate/isRentContribution'])

    return {
      pln,
      grossAmount,
      ppkEmployerContributionRate,
      accidentContributionRate,
      isPensionContribution,
      isRentContribution,
    }
  },
  computed: {
    result () {
      return getMonthlyResultOfEmployer(
        this.grossAmount,
        this.accidentContributionRate,
        this.ppkEmployerContributionRate,
        this.isPensionContribution,
        this.isRentContribution,
      )
    },
    totalZusContributions () {
      return [
        this.result.pensionContribution,
        this.result.rentContribution,
        this.result.accidentContribution,
      ].reduce((current, sum) => current + sum)
    },
  },
}
</script>
