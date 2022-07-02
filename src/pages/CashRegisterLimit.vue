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
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/cashRegisterLimit/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/cashRegisterLimit/Summary.vue'
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
      save,
      scrollTarget,
    }
  },
})
</script>
