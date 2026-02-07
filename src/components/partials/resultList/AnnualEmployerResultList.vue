<template>
  <div v-if="result">
    <ListHeader>
      {{ constants.fullYear }}
    </ListHeader>
    <EmployerResultList :result="props.result.annualResult" />
    <div
      v-for="(monthlyResult, index) in props.result.monthlyResults"
      :key="index">
      <ListHeader>
        {{ constants.monthNames[index] }}
      </ListHeader>
      <EmployerResultList :result="monthlyResult" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {AnnualEmployerResult} from 'src/logic/interfaces/AnnualEmployerResult'
import EmployerResultList from 'components/partials/resultList/EmployerResultList.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import {useConstantsStore} from 'stores/constantsStore'
const constants = useConstantsStore()

interface Props {
  result: AnnualEmployerResult
}
const props = defineProps<Props>()
</script>
