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
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card" />
            Podsumowanie
          </div>
          <q-btn
            color="white"
            size="sm"
            label="pokaż cały rok"
            :disable="!gross"
            outline
            @click="openModal = true"
          />
        </div>
      </SectionHeader>
      <Table />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <Statistics />

      <q-dialog v-model="openModal">
        <WholeYear />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import Advert from 'components/Advert'
import Form from 'components/selfEmployment/Form'
import Table from 'components/selfEmployment/Table'
import Statistics from 'components/selfEmployment/Statistics'
import WholeYear from 'components/selfEmployment/WholeYear'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      openModal: false,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Samozatrudnienie')
  },
  computed: {
    ...mapGetters({
      gross: 'selfEmployment/gross',
    }),
  },
  components: {
    SectionHeader,
    Advert,
    Form,
    Table,
    Statistics,
    WholeYear,
  },
}
</script>
