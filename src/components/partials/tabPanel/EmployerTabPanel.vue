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
    <AnnualEmployerResultList
      v-if="showAnnualResult"
      :result="result" />
    <template v-else>
      <ListHeader>
        Umowa jednorazowa
        <Tooltip color="white">
          Do obliczeń brana jest pod uwagę kwota z 1. miesiąca
        </Tooltip>
      </ListHeader>
      <EmployerResultList
        :result="monthlyResult" />
      <Separator />
      <EmployerStatistics :result="monthlyResult" />
    </template>
  </div>
</template>

<script setup lang="ts">

import {AnnualEmployerResult} from 'src/logic/interfaces/AnnualEmployerResult'
import {computed, ref} from 'vue'
import AnnualEmployerResultList from 'components/partials/resultList/AnnualEmployerResultList.vue'
import EmployerResultList from 'components/partials/resultList/EmployerResultList.vue'
import EmployerStatistics from 'components/partials/statistics/EmployerStatistics.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import Separator from 'components/partials/Separator.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: AnnualEmployerResult
}
const props = defineProps<Props>()

const showAnnualResult = ref(false)

const result = computed(() => props.result)
const monthlyResult = computed(() => result.value.monthlyResults[0])
</script>
