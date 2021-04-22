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
      <Form
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie dla pracownika
      </SectionHeader>
      <EmployeeTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracownika
      </SectionHeader>
      <EmployeeStatistics />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie dla pracodawcy
      </SectionHeader>
      <EmployerTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres dla pracodawcy
      </SectionHeader>
      <EmployerStatistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/contractOfMandate/Form'
import EmployeeTable from 'components/contractOfMandate/EmployeeTable'
import EmployeeStatistics from 'components/contractOfMandate/EmployeeStatistics'
import EmployerTable from 'components/contractOfMandate/EmployerTable'
import EmployerStatistics from 'components/contractOfMandate/EmployerStatistics'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa zlecenie')
  },
  components: {
    SectionHeader,
    Advert,
    Form,
    EmployeeTable,
    EmployeeStatistics,
    EmployerTable,
    EmployerStatistics,
  },
}
</script>
