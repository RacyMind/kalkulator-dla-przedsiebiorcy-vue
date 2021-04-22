<template>
  <q-card style="width: 1600px; max-width: 80vw;">
    <q-table
      title=" Podsumowanie dla pracodawcy"
      :data="data"
      :columns="columns"
      row-key="name"
      hide-bottom
      :pagination="{rowsPerPage: 13}">
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :class="(props.row.month=='Cały rok')?'bg-primary text-white':'bg-white text-black'"
        >
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from 'src/logic/helpers'
import ContractOfMandate from 'src/logic/ContractOfMandate'

export default {
  data () {
    return {
      totalBasisForTax: 0,
      totalBasicAmountForRentAndPension: 0,
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
          field: row => row.gross,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'accident',
          label: 'Skł. wypadkowa',
          required: true,
          align: 'left',
          field: row => row.accident,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'rent',
          label: 'Skł. rentowa',
          required: true,
          align: 'left',
          field: row => row.rent,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'pension',
          label: 'Skł. emerytalna',
          required: true,
          align: 'left',
          field: row => row.pension,
          format: val => `${helpers.formatCurrency(val)}`,
        },
        {
          name: 'totalAmount',
          label: 'Suma kosztów pracodawcy',
          required: true,
          align: 'left',
          field: row => row.totalAmount,
          format: val => `${helpers.formatCurrency(val)}`,
        },
      ],
      data: [],
    }
  },
  created () {
    this.setData()
  },
  computed: {
    ...mapGetters({
      gross: 'contractOfMandate/gross',
      employerZus: 'contractOfMandate/employerZus',
    }),
  },
  methods: {
    setData () {
      const total = {
        month: 'Cały rok',
        gross: 0,
        pension: 0,
        accident: 0,
        rent: 0,
        totalAmount: 0,
      }

      for (let i = 0; i < 12; i++) {
        const result = this.getResultForOneMonth()

        this.data[i] = {
          month: this.$constants.LOCALE_DATE.months[i],
          gross: result.gross,
          pension: result.pension,
          accident: result.accident,
          rent: result.rent,
          totalAmount: result.totalAmount,
        }

        total.gross += result.gross
        total.pension += result.pension
        total.accident += result.accident
        total.rent += result.rent
        total.totalAmount += result.totalAmount
      }

      this.data.push(total)
    },
    getResultForOneMonth () {
      const model = new ContractOfMandate()
      const currentBasicAmountForRentAndPension = this.totalBasicAmountForRentAndPension

      model.gross = this.gross
      model.basicAmountForRentAndPension = model.gross

      const newBasicAmountForRentAndPension = model.gross + this.totalBasicAmountForRentAndPension

      if (currentBasicAmountForRentAndPension > this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
        model.basicAmountForRentAndPension = 0
      } else {
        if (newBasicAmountForRentAndPension > this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS) {
          model.basicAmountForRentAndPension = this.$constants.LIMIT_BASIC_AMOUNT_FOR_ZUS - currentBasicAmountForRentAndPension
        }
      }

      this.totalBasicAmountForRentAndPension += model.gross

      model.employerZus.accident = this.employerZus.accident
      if (this.employerZus.pension) {
        model.calculateZUSEmployerPension()
      }
      if (this.employerZus.rent) {
        model.calculateZUSEmployerRent()
      }

      const totalAmount = model.gross + model.employerZus.rent +
        model.employerZus.pension + model.employerZus.accident

      return {
        gross: model.gross,
        rent: model.employerZus.rent,
        pension: model.employerZus.pension,
        accident: model.employerZus.accident,
        totalAmount: totalAmount,
      }
    },
  },
}
</script>
