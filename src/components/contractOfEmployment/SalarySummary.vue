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
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import employerContractOfEmployment from 'components/contractOfEmployment/employerContractOfEmployment'
import employeeContractOfEmployment from 'components/contractOfEmployment/employeeContractOfEmployment'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfEmploymentInputFields>,
      required: true,
    },
  },
  setup (props) {
    const employerResult = computed(() => {
      employerContractOfEmployment.setParams(props.input.year)
      return employerContractOfEmployment.getMonthlyResult(props.input)
    })

    const employeeResult = computed(() => {
      employeeContractOfEmployment.setParams(props.input.year)
      return employeeContractOfEmployment.getMonthlyResult(props.input)
    })

    return {
      employeeResult,
      employerResult,
    }
  },
  computed: {
    totalEmployerZusContributions () {
      return [
        this.employerResult.pensionContribution,
        this.employerResult.disabilityContribution,
        this.employerResult.accidentContribution,
        this.employerResult.fpContribution,
        this.employerResult.fgspContribution,
      ].reduce((current, sum) => current + sum)
    },
    totalEmployeeZusContributions () {
      return [
        this.employeeResult.pensionContribution,
        this.employeeResult.disabilityContribution,
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
    SalarySummaryTable,
  },
})
</script>
