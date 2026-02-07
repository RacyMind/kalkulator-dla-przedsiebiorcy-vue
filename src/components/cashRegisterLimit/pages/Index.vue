<template>
  <ModulePageLayout class="c-company">
    <template #form>
      <SectionHeader :level="2">
        Wypełnij formularz
      </SectionHeader>
      <Form
        @save="save"
      />
      <Advert/>
    </template>
    <template #results>
      <SectionHeader :level="2"
                     ref="scrollTarget">
        Podsumowanie
      </SectionHeader>
      <Summary
        :input="inputFields"
      />
    </template>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/cashRegisterLimit/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/cashRegisterLimit/Summary.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Limit obrotu dla kasy fiskalnej',
  },
]

const inputFields = ref(<CashRegisterLimitInputFields>{
  startDate: null,
})


const save = (input: CashRegisterLimitInputFields) => {
  inputFields.value = input
  scrollToResults()
}
</script>
