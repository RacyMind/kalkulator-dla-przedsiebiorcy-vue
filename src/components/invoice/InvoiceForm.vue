<template>
  <q-form>
    <div class="row justify-between">
      <div class="col-6 q-pr-sm">
        <q-input
          v-model="amount"
          label="Kwota*"
          autofocus
          color="brand"
        />
        <div class="q-gutter-sm">
          <q-radio
            v-model="typeAmount"
            val="net"
            label="netto"
            color="brand"
          />
          <q-radio
            v-model="typeAmount"
            val="gross"
            label="brutto"
            color="brand"
          />
        </div>
      </div>
      <div class="col-6 q-pl-sm">
        <q-select
          v-model="rate"
          :options="$constants.VAT_VALUES"
          label="Stawka podatku VAT*"
          color="brand"
        />
      </div>
    </div>
    <div class="row q-mt-sm">
      <div class="col-12">
        <q-btn
          class="full-width"
          color="brand"
          size="lg"
          label="Oblicz"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      amount: 'invoice/amount',
      typeAmount: 'invoice/typeAmount',
      rate: 'invoice/rate'
    })
  }
}
</script>

<style scoped>

</style>
