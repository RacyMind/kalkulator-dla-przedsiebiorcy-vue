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
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/vatLimit/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/vatLimit/Summary.vue'
import {useScrollToResults} from 'src/composables/useScrollToResults'

const { scrollTarget, scrollToResults } = useScrollToResults()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Limit sprzedaży dla zwolnienia z VAT',
  },
]

const inputFields = ref(<VatLimitInputFields>{
  startDate: new Date(),
})

const save = (input: VatLimitInputFields) => {
  inputFields.value = input
  scrollToResults()
}
</script>
