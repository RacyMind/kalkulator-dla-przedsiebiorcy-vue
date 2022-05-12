<!--
<template>
  <div>
    <template v-if="commonResult">
      <ListRow
        name="Wynagrodzenie brutto"
        :value="pln(commonResult.grossAmount)"
      />
      <ListRow
        class="bg-teal-1"
        name="Podstawa opodatkowania"
        :value="pln(commonResult.basisForTax)"
      />
      <ListRow
        name="Podatek"
        :value="pln(commonResult.taxAmount)"
      />
      <ListRow
        class="bg-primary text-white"
        name="Wynagrodzenie netto"
        :value="pln(commonResult.netAmount)"
      />
    </template>
    <div
      v-else
      class="q-pa-md"
    >
      Brak danych
    </div>
  </div>
</template>

<script>
import ListRow from 'src/components/partials/ListRow'
import contractOfEmployment from 'src/logic/contractOfEmployment'
import selfEmployment from 'src/logic/selfEmployment'
import constants from 'src/logic/constants'
import jointAccounting from 'src/logic/jointAccounting'
import { pln } from 'src/use/currencyFormat'

export default {
  props: {
    myInputData: {
      required: true,
    },
    myAccountingForm: {
      required: true,
    },
    spouseInputData: {
      required: true,
    },
    spouseAccountingForm: {
      required: true,
    },
    year: Number,
  },
  setup () {
    return {
      pln,
      constants,
    }
  },
  computed: {
    myResult () {
      if (!this.myInputData) {
        return null
      }

      switch (this.myAccountingForm) {
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT:
          return this.getResultForContractOfEmployment(this.myInputData)
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT:
          return this.getResultForSelfEmployment(this.myInputData)
        default:
          return null
      }
    },
    spouseResult () {
      if (!this.spouseInputData) {
        return null
      }

      switch (this.spouseAccountingForm) {
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT:
          return this.getResultForContractOfEmployment(this.spouseInputData)
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT:
          return this.getResultForSelfEmployment(this.spouseInputData)
        default:
          return null
      }
    },
    commonResult () {
      if (!this.myResult || !this.spouseResult) {
        return null
      }

      jointAccounting.setYear(this.year)

      const myData = {
        grossAmount: this.myResult.rows[constants.LOCALE_DATE.wholeYearIndex].grossAmount,
        contributionTotal: this.myResult.rows[constants.LOCALE_DATE.wholeYearIndex].contributionTotal,
        basisForTax: this.myResult.totalBasisForTax,
        amountOfDeductionOfHealthContributionFromTax: this.myResult.rows[constants.LOCALE_DATE.wholeYearIndex].amountOfDeductionOfHealthContributionFromTax,
        isAidForMiddleClass: this.myInputData.isAidForMiddleClass,
        isAidForBigFamily: this.myInputData.isAidForBigFamily,
      }

      const spouseData = {
        grossAmount: this.spouseResult.rows[constants.LOCALE_DATE.wholeYearIndex].grossAmount,
        contributionTotal: this.myResult.rows[constants.LOCALE_DATE.wholeYearIndex].contributionTotal,
        basisForTax: this.spouseResult.totalBasisForTax,
        amountOfDeductionOfHealthContributionFromTax: this.spouseResult.rows[constants.LOCALE_DATE.wholeYearIndex].amountOfDeductionOfHealthContributionFromTax,
        isAidForMiddleClass: this.spouseInputData.isAidForMiddleClass,
        isAidForBigFamily: this.spouseInputData.isAidForBigFamily,
      }

      return jointAccounting.getResult(myData, spouseData)
    },
  },
  methods: {
    getResultForContractOfEmployment (inputData) {
      const monthlyInputs = []
      for (let i = 0; i < 12; i++) {
        monthlyInputs[i] = {
          grossAmount: inputData.grossAmount,
          employeePPkContributionRate: inputData.employeePPkContributionRate,
          partOfWorkWithAuthorExpenses: inputData.partOfWorkWithAuthorExpenses,
          workInLivePlace: inputData.workInLivePlace,
          isFreeAmount: inputData.isFreeAmount,
          isFpContribution: inputData.isFpContribution,
          isYoung: inputData.isYoung,
          isAidForBigFamily: inputData.isAidForBigFamily,
          isAidForSenior: inputData.isAidForSenior,
          isAidForMiddleClass: inputData.isAidForMiddleClass,
          employerPpkContributionRate: inputData.employerPpkContributionRate,
        }
      }
      return contractOfEmployment.getYearlyResultOfEmployee(monthlyInputs)
    },
    getResultForSelfEmployment (inputData) {
      const monthlyInputs = []
      for (let i = 0; i < 12; i++) {
        monthlyInputs[i] = {
          grossAmount: inputData.grossAmount,
          expenses: inputData.expenses,
          taxType: inputData.taxType,
          taxRateForLumpSum: inputData.taxRateForLumpSum,
          isFreeAmount: inputData.isFreeAmount,
          accidentContributionRate: inputData.accidentContributionRate,
          isFpContribution: inputData.isFpContribution,
          isSickContribution: inputData.isSickContribution,
          isSmallZus: inputData.isSmallZus,
          isAidForStart: inputData.isAidForStart,
          isFullTimeJob: inputData.isFullTimeJob,
          customBasisForZus: inputData.customBasisForZus,
          isAidForBigFamily: inputData.isAidForBigFamily,
          isAidForSenior: inputData.isAidForSenior,
          isAidForMiddleClass: inputData.isAidForMiddleClass,
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
-->
