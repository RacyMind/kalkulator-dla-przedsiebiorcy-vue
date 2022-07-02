<template>
  <q-page
    class="q-py-md full-width c-vatLimit"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @save="save"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <Summary
        :input="inputFields"
      />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/Footer.vue'
import Form from 'components/vatLimit/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/vatLimit/Summary.vue'
import helpers from 'src/logic/helpers'

export default defineComponent({
  components: {
    Advert,
    Footer,
    Form,
    SectionHeader,
    Summary,
  },
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Limit sprzedaży dla zwolnienia z VAT')

    const inputFields = ref(<VatLimitInputFields>{
      startDate: null,
    })

    const scrollTarget = ref(null) as any

    const save = (input: VatLimitInputFields) => {
      inputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return {
      inputFields,
      save,
      scrollTarget,
    }
  },
})
</script>
