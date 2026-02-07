<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm text-weight-bold">
      <div>
        Wynagrodzenie netto
      </div>
      <div>
        {{ pln(netAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składki ZUS
      </div>
      <div>
        {{ pln(totalZusContributions) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składka PPK
      </div>
      <div>
        {{ pln(totalPpkContributions) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek
      </div>
      <div>
        {{ pln(taxAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
      <div>
        Suma kosztów pracodawcy
      </div>
      <div>
        {{ pln(totalAmount) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {pln} from 'src/composables/currencyFormat'

interface Props {
  netAmount: number
  totalZusContributions: number
  totalPpkContributions: number
  taxAmount: number
  totalAmount: number
}

defineProps<Props>()
</script>
