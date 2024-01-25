<template>
  <div>
    <EmployeeResultList
      v-if="formType === FormType.EmploymentContract"
      :spouse = props.spouse
    />
    <EntreprenneurResultList
      v-else-if="formType === FormType.Entrepreneur"
      :spouse = props.spouse
    />
    <CustomResultList
      v-else-if="formType === FormType.Custom || formType === FormType.Unemployment"
      :spouse = props.spouse
    />
  </div>
</template>

<script setup lang="ts">

import {FormType} from 'components/accountingWithSpouse/interfaces/FormFields'
import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {computed} from 'vue'
import {useAccountingWithSpouseStore} from 'components/accountingWithSpouse/store'
import CustomResultList from 'components/accountingWithSpouse/components/resultList/CustomResultList.vue'
import EmployeeResultList from 'components/accountingWithSpouse/components/resultList/EmployeeResultList.vue'
import EntreprenneurResultList from 'components/accountingWithSpouse/components/resultList/EntreprenneurResultList.vue'

interface Props {
  spouse: Spouse
}
const props = defineProps<Props>()

const store = useAccountingWithSpouseStore()

const formType = computed(() => {
  if(props.spouse === Spouse.Husband) {
    return store.husband?.formType
  }
  return store.wife?.formType
})
</script>
