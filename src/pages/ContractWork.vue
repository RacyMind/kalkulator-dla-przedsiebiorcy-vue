<template>
  <q-page
    class="q-py-md full-width c-contractWork"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_date_range" />
        Rok podatkowy
      </SectionHeader>
      <ChooseYear
        v-model="year"
        class="q-mt-md q-mb-lg q-px-md"/>
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        :year="year"
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
import {defineComponent, Ref, ref, watch} from 'vue'
import {useStore} from 'vuex'
import ChooseYear from 'src/components/partials/ChooseYear.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/contractWork/Form.vue'
import Summary from 'components/contractWork/Summary.vue'
import Statistics from 'components/contractWork/Statistics.vue'
import Footer from 'components/Footer.vue'
import helpers from 'src/logic/helpers'
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import constants from 'src/logic/constants'
import {ExpenseRate} from 'components/contractWork/types/ExpenseRate'
export default defineComponent({
  setup() {
    const store = useStore()
    store.commit('app/setModuleTitle', 'Umowa o dzieło')

    const year = ref(helpers.getDefaultYear())

    const inputFields:Ref<ContractWorkInputFields> = ref({
      year: helpers.getDefaultYear(),
      expenseRate: <ExpenseRate>0,
      amount: 0,
      amountType: constants.AMOUNT_TYPES.GROSS,
    })

    const scrollTarget = ref(null) as any

    watch(year, () => {
      inputFields.value.amount = 0
    })

    const save = (input: ContractWorkInputFields) => {
      inputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return {
      year,
      inputFields,
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
    ChooseYear,
  },
})
</script>
