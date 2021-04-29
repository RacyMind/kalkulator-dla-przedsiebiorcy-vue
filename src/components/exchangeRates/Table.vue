<template>
  <div>
    <p
      class="text-center q-my-md text-primary">
      <span v-if="date">
        Kurs średni z dnia {{ date }}
      </span>
    </p>
    <q-table
      :data="rates"
      :columns="columns"
      row-key="name"
      :loading="isLoading"
      hide-pagination
      :pagination="{rowsPerPage: 999}">
      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm">
          <span>
            Brak walut do wyświetlenia
          </span>
        </div>
      </template>
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
          style: 'max-width:200px;  white-space: normal !important;word-wrap: break-word;',
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
      isLoading: 'exchangeRates/isLoading',
    }),
  },
}
</script>
