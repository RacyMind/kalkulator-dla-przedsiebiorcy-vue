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
        ref="myFormOfContractOfEmployment"
        v-if="myFormOfAccounting && myFormOfAccounting.value === constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT"
        :year="year"
        is-marriage
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="saveMyData"
      />
      <SelfEmploymentForm
        ref="myFormOfSelfEmployment"
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
        ref="spouseFormOfContractOfEmployment"
        v-if="spouseFormOfAccounting && spouseFormOfAccounting.value === constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT"
        :year="year"
        is-marriage
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="saveSpouseData"
      />
      <SelfEmploymentForm
        ref="spouseFormOfSelfEmployment"
        v-if="spouseFormOfAccounting && spouseFormOfAccounting.value === constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT"
        :year="year"
        is-marriage
        class="q-mt-md q-mb-lg q-px-md"
        @submitted="saveSpouseData"
      />
      <div class="row q-mt-md q-mb-lg q-px-md">
        <div class="col-12">
          <q-btn
            class="full-width"
            color="brand"
            size="lg"
            label="Oblicz"
            :disable="isDisabledButton"
            @click="calculate"
          />
        </div>
      </div>
      <SectionHeader ref="mySummaryHeader">
        <q-icon name="o_credit_card" />
        Moje rozliczenie
      </SectionHeader>
      <PersonSummary
        :year="year"
        :accounting-form=" myFormOfAccounting ? myFormOfAccounting.value : ''"
        :input-data="myData"
      />
      <SectionHeader ref="spouseSummaryHeader">
        <q-icon name="o_credit_card" />
        Rozliczenie małżonka
      </SectionHeader>
      <PersonSummary
        :year="year"
        :accounting-form=" spouseFormOfAccounting ? spouseFormOfAccounting.value : ''"
        :input-data="spouseData"
      />
      <SectionHeader ref="spouseSummaryHeader">
        <q-icon name="o_credit_card" />
        Wspólne rozliczenie
      </SectionHeader>
      <MarriageSummary
        :year="year"
        :my-accounting-form=" myFormOfAccounting ? myFormOfAccounting.value : ''"
        :my-input-data="myData"
        :spouse-accounting-form=" spouseFormOfAccounting ? spouseFormOfAccounting.value : ''"
        :spouse-input-data="spouseData"
      />
      <p class="q-py-md q-px-xs-md q-px-md-none bg-teal-1 text-grey">
        Wersja beta. Jeżeli widzisz błąd w obliczeniach, poinformuj mnie o tym.
      </p>
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
import PersonSummary from 'src/components/accountingWithSpouse/PersonSummary'
import MarriageSummary from 'src/components/accountingWithSpouse/MarriageSummary'
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
      myData: null,
      spouseFormOfAccounting: null,
      spouseData: null,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Rozliczenie z małżonkiem')
  },
  computed: {
      myForm () {
        if (!this.myFormOfAccounting) {
          return null
        }
        switch (this.myFormOfAccounting.value) {
          case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT:
            return this.$refs.myFormOfContractOfEmployment
          case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT:
            return this.$refs.myFormOfSelfEmployment
        }
        return null
      },
    spouseForm () {
      if (!this.spouseFormOfAccounting) {
        return null
      }
      switch (this.spouseFormOfAccounting.value) {
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT:
          return this.$refs.spouseFormOfContractOfEmployment
        case constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT:
          return this.$refs.spouseFormOfSelfEmployment
      }
      return null
    },
    isDisabledButton () {
      if (!this.myFormOfAccounting || !this.spouseFormOfAccounting) {
        return true
      }
      return false
    },
  },
  watch: {
    year () {
      this.myData = null
      this.spouseData = null
    },
  },
  methods: {
    calculate () {
      if (this.myForm.isDisabledButton || this.spouseForm.isDisabledButton) {
        this.$q.notify({
          message: 'Wprowadź wszystkie dane',
        })
        return
      }
      this.myForm.save()
      this.spouseForm.save()
      helpers.scrollToElement(this.$refs.mySummaryHeader.$el)
    },
    saveMyData (data) {
      this.myData = data
    },
    saveSpouseData (data) {
      this.spouseData = data
    },
  },
    components: {
      SectionHeader,
      Footer,
      ChooseYear,
      FormsOfAccounting,
      ContractOfEmploymentForm,
      SelfEmploymentForm,
      PersonSummary,
      MarriageSummary,
    },
}
</script>
