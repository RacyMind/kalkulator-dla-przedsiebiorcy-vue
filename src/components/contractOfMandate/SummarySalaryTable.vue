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
import { useMonthlyEmployeeResult } from 'src/use/contractOfMandate/useMonthlyEmployeeResult'
import { useMonthlyEmployerResult } from 'src/use/contractOfMandate/useMonthlyEmployerResult'
import SummarySalaryTable from 'src/components/SummarySalaryTable'
export default {
  setup () {
    const { result: employeeResult } = useMonthlyEmployeeResult()
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
