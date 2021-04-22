<template>
  <q-page
    class="q-pa-md full-width c-selfEmployment"
    style="max-width:800px;">
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
        Podsumowanie
      </SectionHeader>
      <Table />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/selfEmployment/Form'
import Table from 'components/selfEmployment/Table'
import Statistics from 'components/selfEmployment/Statistics'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Samozatrudnienie')
  },
  components: {
    SectionHeader,
    Advert,
    Form,
    Table,
    Statistics,
  },
}
</script>
