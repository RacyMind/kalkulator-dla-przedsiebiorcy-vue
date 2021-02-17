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
      <ContractWorkForm
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <ContractWorkTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <ContractWorkStatistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import ContractWorkForm from 'components/contractWork/ContractWorkForm'
import ContractWorkTable from 'components/contractWork/ContractWorkTable'
import ContractWorkStatistics from 'components/contractWork/ContractWorkStatistics'
export default {

  components: {
    SectionHeader,
    Advert,
    ContractWorkForm,
    ContractWorkTable,
    ContractWorkStatistics,
  },
}
</script>

<style scoped>

</style>
