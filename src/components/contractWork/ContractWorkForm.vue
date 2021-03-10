<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Kwota*"
          autofocus
          color="brand"
          required
        />
        <div class="q-mt-sm block">
          <q-radio
            v-model="amountType"
            :val="$constants.AMOUNT_TYPES.NET"
            label="netto"
          />
          <q-radio
            v-model="amountType"
            :val="$constants.AMOUNT_TYPES.GROSS"
            label="brutto"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="q-mt-sm block">
          <div>Koszty przychodu*</div>
          <q-radio
            v-model="expenses"
            :val="$constants.CONTRACT_WORK.EXPENSES_20"
            label="20%"
          />
          <q-radio
            v-model="expenses"
            :val="$constants.CONTRACT_WORK.EXPENSES_50"
            label="50%"
          />
        </div>
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-btn
          type="submit"
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
export default {
  data () {
    return {
      amount: null,
      amountType: null,
      expenses: null,
    }
  },
  created () {
    this.amountType = this.$constants.AMOUNT_TYPES.NET
    this.expenses = this.$constants.CONTRACT_WORK.EXPENSES_20
  },
}
</script>

<style scoped>

</style>
