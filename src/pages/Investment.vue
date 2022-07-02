<template>
  <q-page
    class="q-py-md full-width c-investment"
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
        :input="inputFields"
      />
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts">
import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/Footer.vue'
import Form from 'components/investment/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/investment/Summary.vue'
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
    store.commit('app/setModuleTitle', 'Lokata')

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

    return {
      inputFields,
      save,
      scrollTarget,
    }
  },
})
</script>
