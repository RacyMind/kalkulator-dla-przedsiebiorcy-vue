<template>
  <div>
    <div class="q-px-md q-py-sm">
      <q-toggle
        v-model="showAnnualResult"
        checked-icon="check"
        unchecked-icon="clear"
        label="Pokaż cały rok"
      />
    </div>
    <AnnualEmployeeResultList
      v-if="showAnnualResult"
      :result="result" />
    <template v-else>
      <ListHeader>
        Umowa jednorazowa
        <Tooltip color="white">
          Do obliczeń brana jest pod uwagę kwota z 1. miesiąca
        </Tooltip>
      </ListHeader>
      <EmployeeResultList
        :result="monthlyResult"
        :month-index="0"
      />
      <Separator />
      <EmployeeStatistics :result="monthlyResult" />
    </template>
  </div>
</template>

<script setup lang="ts">

import {AnnualEmployeeResult} from 'src/logic/interfaces/AnnualEmployeeResult'
import {computed, ref} from 'vue'
import AnnualEmployeeResultList from 'components/partials/resultList/AnnualEmployeeResultList.vue'
import EmployeeResultList from 'components/partials/resultList/EmployeeResultList.vue'
import EmployeeStatistics from 'components/partials/statistics/EmployeeStatistics.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import Separator from 'components/partials/Separator.vue'
import SummaryResultList from 'components/partials/resultList/SummaryResultList.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: AnnualEmployeeResult
}
const props = defineProps<Props>()

const showAnnualResult = ref(false)

const result = computed(() => props.result)
const monthlyResult = computed(() => result.value.monthlyResults[0])
</script>
