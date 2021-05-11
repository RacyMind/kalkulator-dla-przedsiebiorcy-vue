<template>
  <q-form @submit.prevent="send">
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
    <div class="row">
      <div class="col-12">
        <q-select
          v-model="subject"
          :options="subjects"
          label="Temat*"
          color="brand"
          :rules="[subjectRule]"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="message"
          type="textarea"
          label="Wiadomość*"
          color="brand"
          required
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
          :loading="isSending"
          :disable="isDisable"
        />
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <p
          class="q-mb-none text-grey text-justify"
          style="font-size:0.8rem;">
          Podane przez Ciebie w formularzu kontaktowym dane zostaną wykorzystane w celu kontaktu zwrotnego. Ponadto, Twoje dane zostaną zapisane w bazie administratora w celu archiwizacji wymienianej z Tobą korespondencji. Administratorem danych osobowych będzie Racy Mind Łukasz Socha, ul. Puławska 15/7, 24-300 Opole Lubelskie, NIP: 717-181-21-16. Będziesz mieć prawo żądania dostępu do danych osobowych, ich sprostowania, usunięcia oraz przenoszenia. Jeżeli uznasz, że Twoje dane przetwarzane są niezgodnie z prawem, będziesz mógł wnieść skargę do organu nadzorczego. Podanie danych jest dobrowolne, ale niezbędne, by przesłać formularz kontaktowy.
        </p>
      </div>
    </div>
  </q-form>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      email: null,
      name: null,
      subject: null,
      message: null,
      subjects: ['Zaproponuj nową funkcjonalność', 'Zgłoś błąd', 'Inne'],
      isSending: false,
    }
  },
  computed: {
    isDisable () {
      if (this.isSending) {
        return true
      }
      return !this.email || !this.subject || !this.message
    },
  },
  methods: {
    send () {
      if (this.isSending) {
        return
      }

      this.isSending = true
      axios.post('https://kalkulatorfinansowy.app/contact.php',
        {
          email: this.email,
          name: this.name,
          subject: this.subject,
          message: this.message,
        })
        .then(() => {
          this.$q.notify({
            color: 'positive',
            message: 'Wiadomość została wyłana',
          })
          this.email = null
          this.name = null
          this.subject = null
          this.message = null
        })
        .catch(error => {
          this.$q.notify({
            color: 'negative',
            message: error.response.data,
          })
        })
        .finally(() => {
          this.isSending = false
        })
    },
    subjectRule (val) {
      if (val === null) {
        return 'Wybierz temat'
      }
    },
  },
}
</script>
