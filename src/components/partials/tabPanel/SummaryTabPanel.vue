<template>
  <div>
    <div class="q-px-md q-py-sm">
      <q-toggle
        v-model="showAnnualResult"
        :checked-icon="matCheck"
        :unchecked-icon="matClear"
        label="Pokaż cały rok"
      />
    </div>
    <AnnualSummaryResultList
      v-if="showAnnualResult"
      :employee-result="employeeResult"
      :employer-result="employerResult"
    />
    <template v-else>
      <ListHeader>
        Umowa jednorazowa
        <Tooltip color="white">
          Do obliczeń brana jest pod uwagę kwota z 1. miesiąca
        </Tooltip>
      </ListHeader>
      <SummaryResultList
        :employee-result="employeeMonthlyResult"
        :employer-result="employerMonthlyResult"
        :month-index="0"
      />
      <SummaryStatistics
        :employee-result="employeeMonthlyResult"
        :employer-result="employerMonthlyResult"
      />
    </template>
  </div>
</template>

<script setup lang="ts">

import {AnnualEmployeeResult} from 'src/logic/interfaces/AnnualEmployeeResult'
import {AnnualEmployerResult} from 'src/logic/interfaces/AnnualEmployerResult'
import {computed, ref} from 'vue'
import AnnualSummaryResultList from 'components/partials/resultList/AnnualSummaryResultList.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import SummaryResultList from 'components/partials/resultList/SummaryResultList.vue'
import SummaryStatistics from 'components/partials/statistics/SummaryStatistics.vue'
import {matCheck, matClear} from 'src/icons'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  employeeResult: AnnualEmployeeResult,
  employerResult: AnnualEmployerResult,
}
const props = defineProps<Props>()

const showAnnualResult = ref(false)

const employeeResult = computed(() => props.employeeResult)
const employeeMonthlyResult = computed(() => employeeResult.value?.monthlyResults[0])

const employerResult = computed(() => props.employerResult)
const employerMonthlyResult = computed(() => employerResult.value?.monthlyResults[0])
</script>
