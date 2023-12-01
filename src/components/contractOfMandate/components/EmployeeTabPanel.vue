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
        <ListHeader title="Umowa jednorazowa" />
        <EmployeeResultList
          :result="monthlyResult" />
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
import ListHeader from 'components/partials/resultList/ListHeader.vue'

const store = useMandateContractStore()

const showAnnualResult = ref(false)

const annualResult = computed(() => store.annualEmployeeResult)
const monthlyResult = computed(() => annualResult.value?.monthlyResults[0] ?? null)
</script>
