<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Przychód*"
          autofocus
          color="brand"
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="expenses"
          type="number"
          min="0"
          step="0.01"
          label="Koszty uzyskania przychodu*"
          color="brand"
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
        />
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
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
export default {
  emits: ['submitted'],
  data () {
    return {
      amount: null,
      expenses: 0,
    }
  },
  computed: {
    isDisabledButton () {
      if (!this.amount) {
        return true
      }
      if (this.expenses.length === 0) {
        return true
      }
      return false
    },
  },
  methods: {
    save () {
      this.$store.commit('unregisteredCompany/setAmount', +this.amount)
      this.$store.commit('unregisteredCompany/setExpenses', +this.expenses)

      this.$emit('submitted')
    },
  },
}
</script>
