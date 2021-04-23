<template>
  <div>
    <p class="text-center q-my-md text-primary">Kurs średni z dnia {{ date }}</p>
    <q-table
      :data="rates"
      :columns="columns"
      row-key="name"
      hide-bottom
      :pagination="{rowsPerPage: 999}">
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      totalBasisForTax: 0,
      totalBasicAmountForRentAndPension: 0,
      columns: [
        {
          name: 'currency',
          label: 'Nazwa waluty',
          required: true,
          align: 'left',
          field: row => row.currency,
          format: val => `${val}`,
        },
        {
          name: 'code',
          label: 'Kod waluty',
          required: true,
          align: 'left',
          field: row => row.code,
          format: val => `${val}`,
        },
        {
          name: 'mid',
          label: 'Kurs średni',
          required: true,
          align: 'left',
          field: row => row.mid,
          format: val => `${val}`,
        },
      ],
    }
  },
  created () {
    if (this.rates.length === 0) {
      this.$store.dispatch('exchangeRates/loadLatestExchangeRates')
    }
    this.$q.notify({
      message: 'Źródło danych: Narodowy Bank Polski',
    })
  },
  computed: {
    ...mapGetters({
      rates: 'exchangeRates/rates',
      date: 'exchangeRates/date',
    }),
  },
}
</script>
