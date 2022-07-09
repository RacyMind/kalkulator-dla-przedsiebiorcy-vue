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
      <Advert />
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
import Advert from 'components/partials/Advert.vue'
import ChooseYear from 'src/components/partials/ChooseYear.vue'
import ContractOfEmploymentForm from 'src/components/contractOfEmployment/Form.vue'
import Footer from 'components/partials/Footer.vue'
import FormsOfAccounting from 'src/components/partials/FormsOfAccounting.vue'
import MarriageSummary from 'src/components/accountingWithSpouse/MarriageSummary.vue'
import PersonSummary from 'src/components/accountingWithSpouse/PersonSummary.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import SelfEmploymentForm from 'src/components/selfEmployment/Form.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
export default {
  components: {
      Advert,
      ChooseYear,
      ContractOfEmploymentForm,
      Footer,
      FormsOfAccounting,
      MarriageSummary,
      PersonSummary,
      SectionHeader,
      SelfEmploymentForm,
    },
    computed: {
      isDisabledButton () {
      if (!this.myFormOfAccounting || !this.spouseFormOfAccounting) {
        return true
      }
      return false
    },
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
  },
  created () {
    this.$store.commit('app/setModuleTitle', 'Rozliczenie z małżonkiem')
  },
  data () {
    return {
      myData: null,
      myFormOfAccounting: null,
      spouseData: null,
      spouseFormOfAccounting: null,
    }
  },
    methods: {
    calculate () {
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
  setup () {
      const year = ref(helpers.getDefaultYear())
      return {
        constants,
        year,
      }
    },
  watch: {
    year () {
      this.myData = null
      this.spouseData = null
    },
  },
}
</script>
