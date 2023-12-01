<template>
  <div v-if="result">
    <ListHeader :title="constants.FULL_YEAR" />
    <EmployeeResultList :result="props.result.annualResult" />
    <Separator />
    <div
      v-for="(monthlyResult, index) in props.result.monthlyResults"
      :key="index">
      <ListHeader :title="constants.MONTH_NAMES[index]" />
      <EmployeeResultList :result="monthlyResult" />
      <Separator v-if="index < 12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {AnnualEmployeeResult} from 'components/contractOfMandate/interfaces/AnnualEmployeeResult'
import EmployeeResultList from 'components/contractOfMandate/components/EmployeeResultList.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import Separator from 'components/partials/Separator.vue'
import constants from 'src/logic/constants'

interface Props {
  result: AnnualEmployeeResult
}
const props = defineProps<Props>()
</script>
