<template>
  <ModulePageLayout class="c-company">
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
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/cashRegisterLimit/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/cashRegisterLimit/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Limit obrotu dla kasy fiskalnej',
  },
]

const inputFields = ref(<CashRegisterLimitInputFields>{
  startDate: null,
})

const scrollTarget = ref(null) as any

const save = (input: CashRegisterLimitInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
