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
  </div>
</template>

<script>
import ListRow from 'src/components/partials/ListRow'
import contractOfEmployment from 'src/logic/contractOfEmployment'
import selfEmployment from 'src/logic/selfEmployment'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import taxes from 'src/logic/taxes'
import { pln } from 'src/use/currencyFormat'

export default {
  props: {
    myInputData: {
      type: Object,
      required: true,
    },
    myAccountingForm: {
      type: String,
      required: true,
    },
    spouseInputData: {
      type: Object,
      required: true,
    },
    spouseAccountingForm: {
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

      const grossAmount = this.myResult.rows[constants.LOCALE_DATE.wholeYearIndex].grossAmount + this.spouseResult.rows[constants.LOCALE_DATE.wholeYearIndex].grossAmount
      const basisForTax = helpers.round((this.myResult.totalBasisForTax + this.spouseResult.totalBasisForTax) / 2, 2)
      const amountOfDeductionOfHealthContributionFromTax = this.myResult.rows[constants.LOCALE_DATE.wholeYearIndex].amountOfDeductionOfHealthContributionFromTax + this.spouseResult.rows[constants.LOCALE_DATE.wholeYearIndex].amountOfDeductionOfHealthContributionFromTax
      let taxAmount = helpers.round(taxes.calculateIncomeTaxUsingGeneralRules(0, basisForTax, 0, true, 0, false, true, true) * 2 - amountOfDeductionOfHealthContributionFromTax)

      if (taxAmount < 0) {
        taxAmount = 0
      }

      const netAmount = grossAmount - taxAmount

      return {
        grossAmount,
        basisForTax,
        taxAmount,
        netAmount,
      }
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
