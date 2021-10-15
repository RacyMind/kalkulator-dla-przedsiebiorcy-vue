<template>
  <SummarySalaryTable
    :net-amount="employeeResult.netAmount"
    :tax-amount="employeeResult.taxAmount"
    :total-amount="totalAmount"
    :total-ppk-contributions="totalPPkContributions"
    :total-zus-contributions="totalEmployeeZusContributions + totalEmployerZusContributions"
  />
</template>
<script>

import { useMonthlyEmployeeResult, useMonthlyEmployerResult } from 'src/use/useContractOfMandate'
import SummarySalaryTable from 'src/components/SummarySalaryTable'
export default {
  props: {
    year: Number,
  },
  setup (props) {
    const { result: employeeResult } = useMonthlyEmployeeResult(props)
    const { result: employerResult } = useMonthlyEmployerResult()

    return {
      employeeResult,
      employerResult,
    }
  },
  computed: {
    totalEmployerZusContributions () {
      return [
        this.employerResult.pensionContribution,
        this.employerResult.rentContribution,
        this.employerResult.accidentContribution,
      ].reduce((current, sum) => current + sum)
    },
    totalEmployeeZusContributions () {
      return [
        this.employeeResult.pensionContribution,
        this.employeeResult.rentContribution,
        this.employeeResult.sickContribution,
        this.employeeResult.healthContribution,
      ].reduce((current, sum) => current + sum)
    },
    totalPPkContributions () {
      return this.employeeResult.ppkContribution + this.employerResult.ppkContribution
    },
    totalAmount () {
      return this.employerResult.totalAmount
    },
  },
  components: {
    SummarySalaryTable,
  },
}
</script>
