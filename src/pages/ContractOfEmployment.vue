<template>
  <q-page
    class="q-pa-md full-width c-contractOfEmployment"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <ContractOfEmploymentForm
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie dla pracownika
      </SectionHeader>
      <ContractOfEmploymentEmployeeTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracownika
      </SectionHeader>
      <ContractOfEmploymentEmployeeStatistics />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie dla pracodawcy
      </SectionHeader>
      <ContractOfEmploymentEmployerTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracodawcy
      </SectionHeader>
      <ContractOfEmploymentEmployerStatistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import ContractOfEmploymentForm from 'components/ContractOfEmployment/ContractOfEmploymentForm'
import ContractOfEmploymentEmployeeTable from 'components/ContractOfEmployment/ContractOfEmploymentEmployeeTable'
import ContractOfEmploymentEmployeeStatistics from 'components/ContractOfEmployment/ContractOfEmploymentEmployeeStatistics'
import ContractOfEmploymentEmployerTable from 'components/ContractOfEmployment/ContractOfEmploymentEmployerTable'
import ContractOfEmploymentEmployerStatistics from 'components/ContractOfEmployment/ContractOfEmploymentEmployerStatistics'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa o pracę')
  },
  components: {
    SectionHeader,
    Advert,
    ContractOfEmploymentForm,
    ContractOfEmploymentEmployeeTable,
    ContractOfEmploymentEmployeeStatistics,
    ContractOfEmploymentEmployerTable,
    ContractOfEmploymentEmployerStatistics,
  },
}
</script>

<style scoped>

</style>
