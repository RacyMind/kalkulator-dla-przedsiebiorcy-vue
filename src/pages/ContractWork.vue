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
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {ExpenseRate} from 'components/contractWork/types/ExpenseRate'
import {Ref, defineComponent, ref, watch} from 'vue'
import {useAppStore} from 'stores/app-store'
import Advert from 'components/partials/Advert.vue'
import ChooseYear from 'src/components/partials/ChooseYear.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/contractWork/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/contractWork/Statistics.vue'
import Summary from 'components/contractWork/Summary.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
export default defineComponent({
  components: {
    Advert,
    ChooseYear,
    Footer,
    Form,
    SectionHeader,
    Statistics,
    Summary,
  },
  setup() {
    const appStore = useAppStore()
    appStore.moduleTitle = 'Umowa o dzieło'

    const year = ref(helpers.getDefaultYear())

    const inputFields:Ref<ContractWorkInputFields> = ref({
      amount: 0,
      amountType: constants.AMOUNT_TYPES.GROSS,
      expenseRate: <ExpenseRate>0,
      year: helpers.getDefaultYear(),
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
      inputFields,
      save,
      scrollTarget,
      year,
    }
  },
})
</script>
