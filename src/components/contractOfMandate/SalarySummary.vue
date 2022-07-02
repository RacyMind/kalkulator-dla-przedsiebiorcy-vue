<template>
  <SalarySummaryTable
    :net-amount="employeeResult.netAmount"
    :tax-amount="employeeResult.taxAmount"
    :total-amount="employerResult.totalAmount"
    :total-ppk-contributions="employeeResult.ppkContribution + employerResult.ppkContribution"
    :total-zus-contributions="employeeResult.contributionTotal - employeeResult.ppkContribution + employerResult.contributionTotal - employerResult.ppkContribution"
  />
</template>
<script lang="ts">

import {computed, defineComponent, PropType} from 'vue'
import SalarySummaryTable from 'src/components/partials//SalarySummaryTable.vue'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import employerContractOfMandate from 'components/contractOfMandate/employerContractOfMandate'
import employeeContractOfMandate from 'components/contractOfMandate/employeeContractOfMandate'

export default defineComponent({
  components: {
    SalarySummaryTable,
  },
  computed: {
    totalAmount () {
      return this.employerResult.totalAmount
    },
    totalEmployeeZusContributions () {
      return [
        this.employeeResult.pensionContribution,
        this.employeeResult.disabilityContribution,
        this.employeeResult.sickContribution,
        this.employeeResult.healthContribution,
      ].reduce((current, sum) => current + sum)
    },
    totalEmployerZusContributions () {
      return [
        this.employerResult.pensionContribution,
        this.employerResult.disabilityContribution,
        this.employerResult.accidentContribution,
      ].reduce((current, sum) => current + sum)
    },
    totalPPkContributions () {
      return this.employeeResult.ppkContribution + this.employerResult.ppkContribution
    },
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<ContractOfMandateInputFields>,
    },
  },
  setup (props) {
    const employerResult = computed(() => {
      employerContractOfMandate.setParams(props.input.year)
      return employerContractOfMandate.getMonthlyResult(props.input)
    })

    const employeeResult = computed(() => {
      employeeContractOfMandate.setParams(props.input.year)
      return employeeContractOfMandate.getMonthlyResult(props.input)
    })

    return {
      employeeResult,
      employerResult,
    }
  },
})
</script>
