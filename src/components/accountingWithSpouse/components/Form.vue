<template>
  <q-form>
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
      <LawRuleDate />
    </FormSection>
    <SpouseForm :spouse="Spouse.Husband" />
    <SpouseForm :spouse="Spouse.Wife" />
  </q-form>
</template>

<script setup lang="ts">

import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'

import {Spouse} from 'components/accountingWithSpouse/logic/Spouse'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import SpouseForm from 'components/accountingWithSpouse/components/SpouseForm.vue'

const { availableDates } = useLawRuleDate()
</script>
