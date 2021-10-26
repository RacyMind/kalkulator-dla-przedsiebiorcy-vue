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
    },
    watch: {
      year () {
        //
      },
    },
    components: {
      SectionHeader,
      Footer,
      ChooseYear,
      FormsOfAccounting,
      ContractOfEmploymentForm,
    },
}
</script>
