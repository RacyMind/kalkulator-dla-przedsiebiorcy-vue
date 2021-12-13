<template>
  <q-page
    class="q-py-md full-width c-unregisteredCompany"
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
        :input="unregisteredCompanyInputFields"
      />
      <SectionHeader>
        <q-icon name="o_pie_chart"/>
        Wykres
      </SectionHeader>
      <Statistics
        :input="unregisteredCompanyInputFields"
      />
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts">
import {ref} from 'vue'
import {useStore} from 'vuex'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Advert from 'components/Advert.vue'
import Form from 'components/unregisteredCompany/Form.vue'
import Summary from 'components/unregisteredCompany/Summary.vue'
import Statistics from 'components/unregisteredCompany/Statistics.vue'
import Footer from 'components/Footer.vue'
import helpers from 'src/logic/helpers'
import {UnregisteredCompanyInputFields} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyInputFields'

export default {
  setup() {
    const store = useStore()
    store.commit('app/SET_MODULE_TITLE', 'Działalność niezarejestrowana')

    const unregisteredCompanyInputFields = ref(<UnregisteredCompanyInputFields>{
      incomeAmount: 0,
      expenses: 0,
    })

    const scrollTarget = ref(null) as any

    const save = (input: UnregisteredCompanyInputFields) => {
      unregisteredCompanyInputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return {
      unregisteredCompanyInputFields,
      scrollTarget,
      save,
    }
  },
  components: {
    SectionHeader,
    Advert,
    Form,
    Summary,
    Statistics,
    Footer,
  },
}
</script>
