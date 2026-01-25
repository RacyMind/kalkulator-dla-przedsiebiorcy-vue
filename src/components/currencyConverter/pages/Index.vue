<template>
  <ModulePageLayout class="c-currencies">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form
      @scroll="scrollTo"
    />
    <Advert/>
    <SectionHeader ref="scrollTarget">
      Podsumowanie
    </SectionHeader>
    <Summary/>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/currencyConverter/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/currencyConverter/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Przelicznik walut',
  },
]

const scrollTarget = ref(null) as any

const scrollTo = () => {
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
