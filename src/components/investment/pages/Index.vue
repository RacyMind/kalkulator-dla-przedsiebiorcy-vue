<template>
  <ModulePageLayout class="c-savings">
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
import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/investment/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/investment/Summary.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Lokata',
  },
]

const inputFields = ref(<InvestmentInputFields>{
  amount: 0,
  monthCount: 0,
  rate: 0,
})


const save = (input: InvestmentInputFields) => {
  inputFields.value = input
  scrollToResults()
}
</script>
