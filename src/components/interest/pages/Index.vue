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
      <template v-if="hasResult">
        <Summary
          :input="inputFields"
        />
        <Statistics
          :input="inputFields"
        />
      </template>
      <div
        v-else
        class="q-pa-md">
        Brak danych
      </div>
    </template>
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

const hasResult = ref(false)

const save = (input: InterestInputFields) => {
  inputFields.value = input
  hasResult.value = true
  scrollToResults()
}
</script>
