<template>
  <q-page
    class="q-pa-md full-width c-contractWork"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <ContractOfMandateForm
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie dla pracownika
      </SectionHeader>
      <ContractOfMandateEmployeeTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracownika
      </SectionHeader>
      <ContractOfMandateEmployeeStatistics />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie dla pracodawcy
      </SectionHeader>
      <ContractOfMandateEmployerTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracodawcy
      </SectionHeader>
      <ContractOfMandateEmployerStatistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import ContractOfMandateForm from 'components/contractOfMandate/ContractOfMandateForm'
import ContractOfMandateEmployeeTable from 'components/contractOfMandate/ContractOfMandateEmployeeTable'
import ContractOfMandateEmployeeStatistics from 'components/contractOfMandate/ContractOfMandateEmployeeStatistics'
import ContractOfMandateEmployerTable from 'components/contractOfMandate/ContractOfMandateEmployerTable'
import ContractOfMandateEmployerStatistics from 'components/contractOfMandate/ContractOfMandateEmployerStatistics'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa zlecenie')
  },
  components: {
    SectionHeader,
    Advert,
    ContractOfMandateForm,
    ContractOfMandateEmployeeTable,
    ContractOfMandateEmployeeStatistics,
    ContractOfMandateEmployerTable,
    ContractOfMandateEmployerStatistics,
  },
}
</script>

<style scoped>

</style>
