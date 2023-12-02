<template>
  <div>
    <template v-if="employeeMonthlyResult && employerRonthlyResult">
      <div class="q-px-md q-py-sm">
        <q-toggle
          v-model="showAnnualResult"
          checked-icon="check"
          unchecked-icon="clear"
          label="Pokaż cały rok"
        />
      </div>
      <SummaryAnnualResultList
        v-if="showAnnualResult"
        :employee-result="employeeAnnualResult"
        :employer-result="employerAnnualResult"
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
          :employer-result="employerRonthlyResult"
        />
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
import ListHeader from 'components/partials/resultList/ListHeader.vue'
import SummaryAnnualResultList from 'components/partials/resultList/SummaryAnnualResultList.vue'
import SummaryResultList from 'components/partials/resultList/SummaryResultList.vue'
import Tooltip from 'components/partials/Tooltip.vue'

const store = useMandateContractStore()

const showAnnualResult = ref(false)

const employeeAnnualResult = computed(() => store.annualEmployeeResult)
const employeeMonthlyResult = computed(() => employeeAnnualResult.value?.monthlyResults[0] ?? null)

const employerAnnualResult = computed(() => store.annualEmployerResult)
const employerRonthlyResult = computed(() => employerAnnualResult.value?.monthlyResults[0] ?? null)
</script>
