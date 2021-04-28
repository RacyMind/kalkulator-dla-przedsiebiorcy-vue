<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="email"
          type="email"
          label="Email*"
          autofocus
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="name"
          type="text"
          label="Imię"
          color="brand"
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
          label="Wyślij"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
export default {
  data () {
    return {
      email: null,
      name: null,
      subject: 'net',
      message: null,
    }
  },
  methods: {
    save () {
      // TO DO
    },
  },
}
</script>
