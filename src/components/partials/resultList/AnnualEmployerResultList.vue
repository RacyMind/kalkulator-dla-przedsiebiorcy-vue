<template>
  <div v-if="result">
    <ListHeader>
      {{ constants.FULL_YEAR }}
    </ListHeader>
    <EmployerResultList :result="props.result.annualResult" />
    <Separator />
    <div
      v-for="(monthlyResult, index) in props.result.monthlyResults"
      :key="index">
      <ListHeader>
        {{ constants.MONTH_NAMES[index] }}
      </ListHeader>
      <EmployerResultList :result="monthlyResult" />
      <Separator v-if="index < 12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {AnnualEmployerResult} from 'src/logic/interfaces/AnnualEmployerResult'
import EmployerResultList from 'components/partials/resultList/EmployerResultList.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import Separator from 'components/partials/Separator.vue'
import constants from 'src/logic/constants'

interface Props {
  result: AnnualEmployerResult
}
const props = defineProps<Props>()
</script>
