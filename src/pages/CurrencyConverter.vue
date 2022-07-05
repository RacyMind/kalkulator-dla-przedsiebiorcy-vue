<template>
  <q-page
    class="q-py-md full-width c-currencyConverter"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @scroll="scrollTo"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <Table />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useAppStore} from 'stores/app-store'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/currencyConverter/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Table from 'components/currencyConverter/Table.vue'
import helpers from 'src/logic/helpers'

export default defineComponent({
  components: {
    Advert,
    Footer,
    Form,
    SectionHeader,
    Table,
  },
  setup () {
    const appStore = useAppStore()
    appStore.moduleTitle = 'Przelicznik walut'

    const scrollTarget = ref(null) as any

    const scrollTo = () => {
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return {
      scrollTarget,
      scrollTo,
    }
  },
})
</script>
