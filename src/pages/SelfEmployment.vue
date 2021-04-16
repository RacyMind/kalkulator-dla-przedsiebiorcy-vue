<template>
  <q-page
    class="q-pa-md full-width c-selfEmployment"
    style="max-width:800px;">
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <selfEmploymentForm
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <selfEmploymentTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <selfEmploymentStatistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import selfEmploymentForm from 'components/selfEmployment/selfEmploymentForm'
import selfEmploymentTable from 'components/selfEmployment/selfEmploymentTable'
import selfEmploymentStatistics from 'components/selfEmployment/selfEmploymentStatistics'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Samozatrudnienie')
  },
  components: {
    SectionHeader,
    Advert,
    selfEmploymentForm,
    selfEmploymentTable,
    selfEmploymentStatistics,
  },
}
</script>

<style scoped>

</style>
