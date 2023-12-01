<template>
  <div v-if="employeeResult">
    <ListHeader :title="constants.FULL_YEAR" />
    <SummaryResultList
      :employee-result="props.employeeResult.annualResult"
      :employer-result="props.employerResult.annualResult" />
    <Separator />
    <div
      v-for="(monthlyResult, index) in props.employeeResult.monthlyResults"
      :key="index">
      <ListHeader :title="constants.MONTH_NAMES[index]" />
      <SummaryResultList
        :employee-result="monthlyResult"
        :employer-result="props.employerResult.monthlyResults[index]"
      />
      <Separator v-if="index < 12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {AnnualEmployeeResult} from 'src/logic/interfaces/AnnualEmployeeResult'
import {AnnualEmployerResult} from 'src/logic/interfaces/AnnualEmployerResult'
import EmployeeResultList from 'components/partials/resultList/EmployeeResultList.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import Separator from 'components/partials/Separator.vue'
import SummaryResultList from 'components/partials/resultList/SummaryResultList.vue'
import constants from 'src/logic/constants'

interface Props {
  employeeResult: AnnualEmployeeResult
  employerResult: AnnualEmployerResult
}
const props = defineProps<Props>()
</script>
