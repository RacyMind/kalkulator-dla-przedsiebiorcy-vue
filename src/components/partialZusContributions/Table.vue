<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podstawa wymiaru składek
      </div>
      <div>
        {{ pln(basisForZus) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składka chorobowa
      </div>
      <div>
        {{ pln(zus.sick) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składka rentowa
      </div>
      <div>
        {{ pln(zus.rent) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składka emerytalna
      </div>
      <div>
        {{ pln(zus.pension) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składka wypadkowa
      </div>
      <div>
        {{ pln(zus.accident) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składka na Fundusz Pracy
      </div>
      <div>
        {{ pln(zus.fp) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
      <div>
        Składki ZUS
      </div>
      <div>
        {{ pln(zusTotal) }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    return { pln }
  },
  computed: {
    ...mapGetters({
      zus: 'partialZusContributions/zus',
      basisForZus: 'partialZusContributions/basisForZus',
    }),
    zusTotal () {
      if (this.isZusEmpty(this.zus)) {
        return null
      }
      return Object.values(this.zus).reduce((current, sum) => current + sum)
    },
  },
  methods: {
    isZusEmpty (zus) {
      if (!zus.health && !zus.rent &&
        !zus.pension && !zus.sick && !zus.fp) {
        return true
      }
      return false
    },
  },
}
</script>
