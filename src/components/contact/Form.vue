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
          :rules="[validationRules.required, validationRules.email]"
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
          :rules="[validationRules.subject]"
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
          :rules="[validationRules.required]"
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
          :disable="isDisabledButton"
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

<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import {useQuasar} from 'quasar'
import axios from 'axios'
import validationRules from 'src/logic/validationRules'

export default defineComponent({
  setup() {
    const $q = useQuasar()

    const subjects =[
      'Zaproponuj nową funkcjonalność',
      'Zgłoś błąd',
      'Inne',
    ]

    const email = ref(null)
    const name = ref(null)
    const subject = ref(null)
    const message = ref(null)
    const isSending = ref(false)

    const isDisabledButton = computed(() => {
      if (isSending.value) {
        return true
      }
      return !email.value || !subject.value || !message.value
    })

    const send = () => {
      if (isSending.value) {
        return
      }

      isSending.value = true

      axios.post('https://kalkulatorfinansowy.app/contact.php',
        {
          email: email.value,
          message: message.value,
          name: name.value,
          subject: subject.value,
        }).then(() => {
          $q.notify({
            color: 'positive',
            message: 'Wiadomość została wysłana',
          })
          email.value = null
          name.value = null
          subject.value = null
          message.value = null
        }).catch(error => {
          $q.notify({
            color: 'negative',
            message: error.response.data,
          })
        }).finally(() => {
          isSending.value = false
        })
    }

    return {
      email,
      isDisabledButton,
      isSending,
      message,
      name,
      send,
      subject,
      subjects,
      validationRules,
    }
  },
})
</script>
