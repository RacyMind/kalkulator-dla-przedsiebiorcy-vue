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
            :disable="!gross"
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
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie dla pracodawcy
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!gross"
            outline
            @click="openEmployerModal = true"
          />
        </div>
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
      <q-dialog v-model="openEmployerModal">
        <WholeYearForEmployer />
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
import WholeYearForEmployer from 'components/contractOfEmployment/WholeYearForEmployer'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      openEmployeeModal: false,
      openEmployerModal: false,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Umowa o pracę')
  },
  computed: {
    ...mapGetters({
      gross: 'contractOfEmployment/gross',
    }),
  },
  components: {
    WholeYearForEmployee,
    WholeYearForEmployer,
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
