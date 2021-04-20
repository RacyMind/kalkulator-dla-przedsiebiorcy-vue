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
      <Form class="q-my-lg q-px-md" />
      <Advert />
      <SectionHeader>
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie dla pracownika
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            outline
            @click="openEmployeeModal = true"
          />
        </div>
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
      <q-dialog v-model="openEmployeeModal">
        <WholeYearForEmployee />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/contractOfEmployment/Form'
import EmployeeTable from 'components/contractOfEmployment/EmployeeTable'
import EmployeeStatistics from 'components/contractOfEmployment/EmployeeStatistics'
import EmployerTable from 'components/contractOfEmployment/EmployerTable'
import EmployerStatistics from 'components/contractOfEmployment/EmployerStatistics'
import WholeYearForEmployee from 'components/contractOfEmployment/WholeYearForEmployee'
export default {
  data () {
    return {
      openEmployeeModal: false,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa o pracę')
  },
  components: {
    WholeYearForEmployee,
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
