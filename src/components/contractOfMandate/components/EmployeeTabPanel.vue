<template>
  <div>
    <template v-if="monthlyResult">
      <div class="q-px-md q-py-sm">
        <q-toggle
          v-model="showAnnualResult"
          checked-icon="check"
          unchecked-icon="clear"
          label="Pokaż cały rok"
        />
      </div>
      <EmployeeAnnualResultList
        v-if="showAnnualResult"
        :result="annualResult" />
      <template v-else>
        <ListHeader>
          Umowa jednorazowa
          <Tooltip color="white">
            Do obliczeń brana jest pod uwagę kwota z 1. miesiąca
          </Tooltip>
        </ListHeader>
        <EmployeeResultList
          :result="monthlyResult" />
        <Separator />
        <EmployeeStatistics :result="monthlyResult" />
      </template>
    </template>
    <div
      v-else
      class="q-pa-md">
      Brak danych
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, ref} from 'vue'
import {useMandateContractStore} from 'components/contractOfMandate/store'
import EmployeeAnnualResultList from 'components/partials/resultList/EmployeeAnnualResultList.vue'
import EmployeeResultList from 'components/partials/resultList/EmployeeResultList.vue'
import EmployeeStatistics from 'components/partials/statistics/EmployeeStatistics.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import Separator from 'components/partials/Separator.vue'
import Tooltip from 'components/partials/Tooltip.vue'

const store = useMandateContractStore()

const showAnnualResult = ref(false)

const annualResult = computed(() => store.annualEmployeeResult)
const monthlyResult = computed(() => annualResult.value?.monthlyResults[0] ?? null)
</script>
