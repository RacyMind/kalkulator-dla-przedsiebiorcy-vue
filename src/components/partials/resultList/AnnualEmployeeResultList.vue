<template>
  <div v-if="result">
    <ListHeader>
      {{ constants.fullYear }}
    </ListHeader>
    <EmployeeResultList :result="props.result.annualResult" />
    <div
      v-for="(monthlyResult, index) in props.result.monthlyResults"
      :key="index">
      <ListHeader>
        {{ constants.monthNames[index] }}
      </ListHeader>
      <EmployeeResultList
        :result="monthlyResult"
        :month-index="index"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AnnualEmployeeResult} from 'src/logic/interfaces/AnnualEmployeeResult'
import EmployeeResultList from 'components/partials/resultList/EmployeeResultList.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import {useConstantsStore} from 'stores/constantsStore'
const constants = useConstantsStore()

interface Props {
  result: AnnualEmployeeResult
}
const props = defineProps<Props>()
</script>
