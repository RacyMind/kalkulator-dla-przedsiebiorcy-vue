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
        Składka PPK
      </div>
      <div>
        {{ pln(result.ppkContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
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
import { pln } from 'src/use/currencyFormat'
import { useMonthlyEmployerResult } from 'src/use/useContractOfMandate'

export default {
  props: {
    year: Number,
  },
  setup (props) {
    const { result } = useMonthlyEmployerResult(props)
    return {
      pln,
      result,
    }
  },
  computed: {
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
