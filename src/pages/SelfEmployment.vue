<template>
  <q-page
    class="q-py-md full-width c-selfEmployment"
    style="max-width:800px;">
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
        @save="save"
        class="q-mt-md q-mb-lg q-px-md"
      />
      <Advert />
      <SectionHeader ref="scrollTarget">
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!inputFields.amount"
            outline
            @click="openModal = true"
          />
        </div>
      </SectionHeader>
      <Summary :input="inputFields" />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics :input="inputFields" />

      <q-dialog v-model="openModal">
        <YearlySummary :input="inputFields" />
      </q-dialog>
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {Ref, defineComponent, ref, watch} from 'vue'
import {SelfEmploymentInputFields} from 'components/selfEmployment/interfaces/SelfEmploymentInputFields'
import {useAppStore} from 'stores/app-store'
import Advert from 'components/partials/Advert.vue'
import ChooseYear from 'components/partials/ChooseYear.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/selfEmployment/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/selfEmployment/Statistics.vue'
import Summary from 'components/selfEmployment/Summary.vue'
import YearlySummary from 'components/selfEmployment/YearlySummary.vue'
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
    YearlySummary,
  },
  setup() {
    const appStore = useAppStore()
    appStore.moduleTitle = 'Samozatrudnienie'

    const year = ref(helpers.getDefaultYear())
    const openModal = ref(false)
    const scrollTarget = ref(null) as any

    const inputFields:Ref<SelfEmploymentInputFields> = ref({
      accidentContributionRate: 0,
      amount: 0,
      customBasisForZus: 0,
      expenses: 0,
      incomeTaxType: constants.TAX_TYPES.GENERAL,
      isFpContribution: false,
      isFreeAmount: true,
      isFullTimeJob: false,
      isReliefForBigFamily: false,
      isReliefForCompanyStart: false,
      isReliefForSenior: false,
      isSickContribution: false,
      isSmallZus: false,
      taxRateForLumpSum: 0,
      year: helpers.getDefaultYear(),
    })

    watch(year, () => {
      inputFields.value.amount = 0
    })

    const save = (input: SelfEmploymentInputFields) => {
      inputFields.value = input
      helpers.scrollToElement(scrollTarget?.value?.$el)
    }

    return {
      inputFields,
      openModal,
      save,
      scrollTarget,
      year,
    }
  },
})
</script>
