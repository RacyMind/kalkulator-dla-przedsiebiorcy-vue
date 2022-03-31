<template>
  <q-page
    class="q-py-md full-width c-cashRegisterLimit"
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
import {useStore} from 'vuex'
import {defineComponent, ref} from 'vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Form from 'components/cashRegisterLimit/Form.vue'
import Summary from 'components/cashRegisterLimit/Summary.vue'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/Footer.vue'
import helpers from 'src/logic/helpers'
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'

export default defineComponent({
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Limit obrotu dla kasy fiskalnej')

    const inputFields = ref(<CashRegisterLimitInputFields>{
      startDate: null,
    })

    const scrollTarget = ref(null) as any

    const save = (input: CashRegisterLimitInputFields) => {
      inputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return {
      inputFields,
      scrollTarget,
      save,
    }
  },
  components: {
    Summary,
    SectionHeader,
    Form,
    Advert,
    Footer,
  },
})
</script>
