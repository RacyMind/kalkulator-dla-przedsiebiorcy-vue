<template>
  <q-page
    class="q-py-md full-width c-interest"
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
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics
        :input="inputFields"
      />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/interest/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/interest/Statistics.vue'
import Summary from 'components/interest/Summary.vue'
import helpers from 'src/logic/helpers'

export default defineComponent({
  components: {
    Advert,
    Footer,
    Form,
    SectionHeader,
    Statistics,
    Summary,
  },
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Odsetki')

    const inputFields = ref(<InterestInputFields>{
      amount: 0,
      dayCount: 0,
      rate: 0,
    })

    const scrollTarget = ref(null) as any

    const save = (input: InterestInputFields) => {
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
