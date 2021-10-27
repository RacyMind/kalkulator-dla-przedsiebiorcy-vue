<template>
  <q-page
    class="q-py-md full-width c-work"
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
        Ja
      </SectionHeader>
      <FormsOfAccounting
        v-model="myFormOfAccounting"
        class="q-mt-md q-mb-lg q-px-md"/>
      <ContractOfEmploymentForm
        v-if="myFormOfAccounting && myFormOfAccounting.value === constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT"
        :year="year"
        is-marriage
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="saveMyData"
      />
      <SelfEmploymentForm
        v-if="myFormOfAccounting && myFormOfAccounting.value === constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT"
        :year="year"
        is-marriage
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="saveMyData"
      />
      <SectionHeader ref="spouseHeader">
        <q-icon name="o_description" />
        Małżonek
      </SectionHeader>
      <FormsOfAccounting
        v-model="spouseFormOfAccounting"
        class="q-mt-md q-mb-lg q-px-md"/>
      <ContractOfEmploymentForm
        v-if="spouseFormOfAccounting && spouseFormOfAccounting.value === constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT"
        :year="year"
        is-marriage
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="saveSpouseData"
      />
      <SelfEmploymentForm
        v-if="spouseFormOfAccounting && spouseFormOfAccounting.value === constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT"
        :year="year"
        is-marriage
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="saveSpouseData"
      />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import { ref } from 'vue'
import helpers from 'src/logic/helpers'
import constants from 'src/logic/constants'
import ChooseYear from 'src/components/ChooseYear'
import FormsOfAccounting from 'src/components/partials/FormsOfAccounting'
import SectionHeader from 'components/SectionHeader'
import Footer from 'components/Footer'
import ContractOfEmploymentForm from 'src/components/contractOfEmployment/Form'
import SelfEmploymentForm from 'src/components/selfEmployment/Form'
export default {
    setup () {
      const year = ref(helpers.getDefaultYear())
      return {
        constants,
        year,
      }
    },
  data () {
    return {
      myFormOfAccounting: null,
      spouseFormOfAccounting: null,
    }
  },
    created () {
      this.$store.commit('app/SET_MODULE_TITLE', 'Rozliczenie z małżonkiem')
      this.$store.commit('accountingWithSpouse/clearAllData')
    },
    watch: {
      year () {
        //
      },
    },
  methods: {
    saveMyData (data) {
      this.$store.commit('accountingWithSpouse/setMyData', data)
      this.$store.commit('accountingWithSpouse/setMyAccountingForm', this.myFormOfAccounting.value)
      helpers.scrollToElement(this.$refs.spouseHeader.$el)
    },
    saveSpouseData (data) {
      this.$store.commit('accountingWithSpouse/setSpouseData', data)
      this.$store.commit('accountingWithSpouse/setSpouseAccountingForm', this.spouseFormOfAccounting.value)
    },
  },
    components: {
      SectionHeader,
      Footer,
      ChooseYear,
      FormsOfAccounting,
      ContractOfEmploymentForm,
      SelfEmploymentForm,
    },
}
</script>
