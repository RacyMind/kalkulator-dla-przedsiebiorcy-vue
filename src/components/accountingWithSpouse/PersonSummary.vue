<template>
  <div>
    <template v-if="inputData">
      <ListRow
        name="Wynagrodzenie brutto"
        :value="pln(result.rows[constants.LOCALE_DATE.wholeYearIndex].grossAmount)"
      />
      <ListRow
        class="bg-teal-1"
        name="Podstawa opodatkowania"
        :value="pln(result.totalBasisForTax)"
      />
      <ListRow
        name="Podatek"
        :value="pln(result.rows[constants.LOCALE_DATE.wholeYearIndex].taxAmount)"
      />
      <ListRow
        class="bg-primary text-white"
        name="Wynagrodzenie netto"
        :value="pln(result.rows[constants.LOCALE_DATE.wholeYearIndex].netAmount)"
      />
    </template>
  </div>
</template>

<script>
import ListRow from 'src/components/partials/ListRow'
import contractOfEmployment from 'src/logic/contractOfEmployment'
import selfEmployment from 'src/logic/selfEmployment'
import constants from 'src/logic/constants'
import { pln } from 'src/use/currencyFormat'

export default {
  props: {
    inputData: {
      type: Object,
      required: true,
    },
    accountingForm: {
      type: String,
      required: true,
    },
  },
  setup () {
    return {
      pln,
      constants,
    }
  },
  computed: {
    result () {
      switch (this.accountingForm) {
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT:
          return this.getResultForContractOfEmployment()
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT:
          return this.getResultForSelfEmployment()
        default:
          return null
      }
    },
  },
  methods: {
    getResultForContractOfEmployment () {
      const monthlyInputs = []
      for (let i = 0; i < 12; i++) {
        monthlyInputs[i] = {
          grossAmount: this.inputData.grossAmount,
          employeePPkContributionRate: this.inputData.employeePPkContributionRate,
          partOfWorkWithAuthorExpenses: this.inputData.partOfWorkWithAuthorExpenses,
          workInLivePlace: this.inputData.workInLivePlace,
          isFreeAmount: this.inputData.isFreeAmount,
          isFpContribution: this.inputData.isFpContribution,
          isYoung: this.inputData.isYoung,
          isAidForBigFamily: this.inputData.isAidForBigFamily,
          isAidForSenior: this.inputData.isAidForSenior,
          isAidForMiddleClass: this.inputData.isAidForMiddleClass,
          employerPpkContributionRate: this.inputData.employerPpkContributionRate,
        }
      }
      return contractOfEmployment.getYearlyResultOfEmployee(monthlyInputs)
    },
    getResultForSelfEmployment () {
      const monthlyInputs = []
      for (let i = 0; i < 12; i++) {
        monthlyInputs[i] = {
          grossAmount: this.inputData.grossAmount,
          expenses: this.inputData.expenses,
          taxType: this.inputData.taxType,
          taxRateForLumpSum: this.inputData.taxRateForLumpSum,
          isFreeAmount: this.inputData.isFreeAmount,
          accidentContributionRate: this.inputData.accidentContributionRate,
          isFpContribution: this.inputData.isFpContribution,
          isSickContribution: this.inputData.isSickContribution,
          isSmallZus: this.inputData.isSmallZus,
          isAidForStart: this.inputData.isAidForStart,
          isFullTimeJob: this.inputData.isFullTimeJob,
          customBasisForZus: this.inputData.customBasisForZus,
          isAidForBigFamily: this.inputData.isAidForBigFamily,
          isAidForSenior: this.inputData.isAidForSenior,
          isAidForMiddleClass: this.inputData.isAidForMiddleClass,
        }
      }
      return selfEmployment.getYearlyResult(monthlyInputs)
    },
  },
  components: {
    ListRow,
  },
}
</script>
