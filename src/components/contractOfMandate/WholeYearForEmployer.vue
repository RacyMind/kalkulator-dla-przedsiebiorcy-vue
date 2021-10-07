<template>
  <q-card
    class="relative-position"
    style="width: auto; max-width: 90vw;">
    <q-btn
      icon="close"
      class="absolute-top-right z-top"
      flat
      round
      dense
      v-close-popup />
    <q-table
      title=" Podsumowanie dla pracodawcy"
      :grid="$q.screen.xs || $q.screen.sm"
      :rows="results.rows"
      :columns="columns"
      row-key="name"
      hide-bottom
      :pagination="{rowsPerPage: 13}">
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :class="(props.row.month === constants.LABELS.WHOLE_YEAR) ? 'bg-primary text-white' : 'bg-white text-black'"
        >
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import constants from 'src/logic/constants'
import { getYearlyResultOfEmployer } from 'src/logic/contractOfMandate'
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
      constants,
      grossAmount,
      ppkEmployerContributionRate,
      accidentContributionRate,
      isPensionContribution,
      isRentContribution,
    }
  },
  data () {
    return {
      monthlyInputs: [],
      results: [],
      columns: [
        {
          name: 'month',
          required: true,
          align: 'left',
          field: row => row.month,
          format: val => `${val}`,
        },
        {
          name: 'gross',
          label: 'Brutto',
          required: true,
          align: 'left',
          field: row => row.grossAmount,
          format: val => `${pln(val)}`,
        },
        {
          name: 'accident',
          label: 'Skł. wypadkowa',
          required: true,
          align: 'left',
          field: row => row.accidentContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'rent',
          label: 'Skł. rentowa',
          required: true,
          align: 'left',
          field: row => row.rentContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'pension',
          label: 'Skł. emerytalna',
          required: true,
          align: 'left',
          field: row => row.pensionContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'ppk',
          label: 'PPK',
          required: true,
          align: 'left',
          field: row => row.ppkContribution,
          format: val => `${pln(val)}`,
        },
        {
          name: 'totalAmount',
          label: 'Suma kosztów pracodawcy',
          required: true,
          align: 'left',
          field: row => row.totalAmount,
          format: val => `${pln(val)}`,
        },
      ],
    }
  },
  created () {
    this.updateMonthlyInputs()
    this.results = getYearlyResultOfEmployer(this.monthlyInputs)
  },
  watch: {
    results () {
      this.showNotifications()
    },
  },
  methods: {
    updateMonthlyInputs () {
      for (let i = 0; i < 12; i++) {
        this.monthlyInputs[i] = {
          grossAmount: this.grossAmount,
          accidentContributionRate: this.accidentContributionRate,
          ppkEmployerContributionRate: this.ppkEmployerContributionRate,
          isPensionContribution: this.isPensionContribution,
          isRentContribution: this.isRentContribution,
        }
      }
    },
    showNotifications () {
      if (this.results.totalBasisForRentAndPensionContributions > constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
        this.$q.notify({
          message: `Przekroczono limit 30-krotności składek ZUS (${constants.LIMIT_BASIC_AMOUNT_FOR_ZUS} zł). Powyżej limitu nie ma obowiązku opłacania składki emerytalnej i rentowej.`,
        })
      }
    },
  },
}
</script>
