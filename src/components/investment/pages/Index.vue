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
import helpers from 'src/logic/helpers'

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

const scrollTarget = ref(null) as any

const save = (input: InvestmentInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
