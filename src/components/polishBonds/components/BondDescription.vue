<template>
  <ul
    v-if="props.bondType"
    class="q-my-none q-px-md text-caption">
    <li><b>Jakie jest oprocentowanie:</b> {{ interestRateInfo }}</li>
    <li><b>Kapitalizacja odsetek co:</b> {{ capitalizationPeriod }}</li>
    <li><b>Wypłata odsetek:</b> {{ interestPayment }}</li>
  </ul>
</template>

<script setup lang="ts">
import { BondType } from 'components/polishBonds/store'
import { computed } from 'vue'
import { useBondConstants } from 'components/polishBonds/logic/BondConstants'

interface Props {
  bondType: BondType | null
}

const props = defineProps<Props>()
const constants = useBondConstants()

const formatPercent = (value: number) => {
  return (value * 100).toFixed(2) + '%'
}

const interestRateInfo = computed(() => {
  switch (props.bondType) {
    case 'EDO':
      return `${formatPercent(constants.edo.initialInterestRate)} w pierwszym rocznym okresie odsetkowym. W kolejnych rocznych okresach odsetkowych: inflacja + ${formatPercent(constants.edo.inflationMargin)}`
    case 'COI':
      return `${formatPercent(constants.coi.initialInterestRate)} w pierwszym rocznym okresie odsetkowym. W kolejnych rocznych okresach odsetkowych: inflacja + ${formatPercent(constants.coi.inflationMargin)}`
    case 'OTS':
      return `Stałe ${formatPercent(constants.ots.interestRate)} w skali roku przez cały okres`
    case 'TOS':
      return `Stałe ${formatPercent(constants.tos.interestRate)} w skali roku przez cały okres`
    case 'ROR':
      return `${formatPercent(constants.ror.initialInterestRate)} w skali roku, w pierwszym miesięcznym okresie odsetkowym. W kolejnych miesięcznych okresach odsetkowych: stopa referencyjna NBP + ${formatPercent(constants.ror.nbpRateMargin)}`
    case 'DOR':
      return `${formatPercent(constants.dor.initialInterestRate)} w skali roku, w pierwszym miesięcznym okresie odsetkowym. W kolejnych miesięcznych okresach odsetkowych: stopa referencyjna NBP + ${formatPercent(constants.dor.nbpRateMargin)}`
    case 'ROS':
      return `${formatPercent(constants.ros.initialInterestRate)} w pierwszym rocznym okresie odsetkowym. W kolejnych rocznych okresach odsetkowych: inflacja + ${formatPercent(constants.ros.inflationMargin)}`
    case 'ROD':
      return `${formatPercent(constants.rod.initialInterestRate)} w pierwszym rocznym okresie odsetkowym. W kolejnych rocznych okresach odsetkowych: inflacja + ${formatPercent(constants.rod.inflationMargin)}`
    default:
      return 'Brak danych'
  }
})

const capitalizationPeriod = computed(() => {
  switch (props.bondType) {
    case 'EDO':
      return '12 miesięcy'
    case 'COI':
    return 'Brak kapitalizacji'
    case 'OTS':
      return 'Brak kapitalizacji'
    case 'TOS':
      return '12 miesięcy'
    case 'ROR':
    return 'Brak kapitalizacji'
    case 'DOR':
    return 'Brak kapitalizacji'
    case 'ROS':
      return '12 miesięcy'
    case 'ROD':
      return '12 miesięcy'
    default:
      return 'Brak danych'
  }
})

const interestPayment = computed(() => {
  switch (props.bondType) {
    case 'EDO':
      return 'Po 10 latach'
    case 'COI':
      return 'Co 12 miesięcy'
    case 'OTS':
      return 'Po 3 miesiącach'
    case 'TOS':
      return 'Po 3 latach'
    case 'ROR':
      return 'Co miesiąc'
    case 'DOR':
    return 'Co miesiąc'
    case 'ROS':
      return 'Po 6 latach'
    case 'ROD':
      return 'Po 12 latach'
    default:
      return 'Brak danych'
  }
})
</script>