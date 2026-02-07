<template>
  <ModulePageLayout class="c-savings">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form
      @save="save"
    />
    <Advert/>
    <SectionHeader ref="scrollTarget">
      Podsumowanie
    </SectionHeader>
    <Summary
      :input="inputFields"
    />
    <SectionHeader>
      Wykres
    </SectionHeader>
    <Statistics
      :input="inputFields"
    />
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/interest/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/interest/Statistics.vue'
import Summary from 'components/interest/Summary.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Odsetki',
  },
]

const inputFields = ref(<InterestInputFields>{
  amount: 0,
  dayCount: 0,
  rate: 0,
})


const save = (input: InterestInputFields) => {
  inputFields.value = input
  scrollToResults()
}
</script>
