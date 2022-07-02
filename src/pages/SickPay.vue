<template>
  <q-page
    class="q-py-md full-width c-sickPay"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description"/>
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @save="save"
      />
      <Advert/>
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card"/>
        Podsumowanie
      </SectionHeader>
      <Summary
        :input="inputFields
        "/>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts">
import {SickPayInputFields} from 'components/sickPay/interfaces/SickPayInputFields'
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/sickPay/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/sickPay/Summary.vue'
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
    store.commit('app/setModuleTitle', 'Zasiłek chorobowy')

    const inputFields = ref(<SickPayInputFields>{
      basicAmount: 0,
      dayCount: 0,
      rate: 1,
    })

    const scrollTarget = ref(null) as any

    const save = (input: SickPayInputFields) => {
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
