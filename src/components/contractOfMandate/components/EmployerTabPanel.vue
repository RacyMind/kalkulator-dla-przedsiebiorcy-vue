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
      <EmployerAnnualResultList
        v-if="showAnnualResult"
        :result="annualResult" />
      <template v-else>
        <ListHeader title="Umowa jednorazowa" />
        <EmployerResultList
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
import EmployerAnnualResultList from 'components/partials/resultList/EmployerAnnualResultList.vue'
import EmployerResultList from 'components/partials/resultList/EmployerResultList.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'

const store = useMandateContractStore()

const showAnnualResult = ref(false)

const annualResult = computed(() => store.annualEmployerResult)
const monthlyResult = computed(() => annualResult.value?.monthlyResults[0] ?? null)
</script>
