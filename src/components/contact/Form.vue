<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="send">
    <FormSection title="Dane kontaktowe">
      <div class="row items-end q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            autofocus
            color="brand"
            :rules="[validationRules.required, validationRules.email]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="name"
            type="text"
            label="Imię"
            color="brand"
            hide-bottom-space
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Wiadomość">
      <q-select
        v-model="subject"
        :options="subjects"
        label="Temat"
        color="brand"
        :rules="[validationRules.subject]"
        lazy-rules="ondemand"
        hide-bottom-space
        class="q-mb-sm"
      />
      <q-input
        v-model="message"
        type="textarea"
        label="Treść wiadomości"
        color="brand"
        :rules="[validationRules.required]"
        lazy-rules="ondemand"
        hide-bottom-space
        aria-required="true"
      />
    </FormSection>
    <div class="full-width bg-surface q-pa-md text-grey text-caption">
      <p class="q-mb-none text-justify">
        Podane przez Ciebie w formularzu kontaktowym dane zostaną wykorzystane w celu kontaktu zwrotnego. Ponadto, Twoje dane zostaną zapisane w bazie administratora w celu archiwizacji wymienianej z Tobą korespondencji. Administratorem danych osobowych będzie Racy Mind Łukasz Socha, ul. Puławska 15/7, 24-300 Opole Lubelskie, NIP: 717-181-21-16. Będziesz mieć prawo żądania dostępu do danych osobowych, ich sprostowania, usunięcia oraz przenoszenia. Jeżeli uznasz, że Twoje dane przetwarzane są niezgodnie z prawem, będziesz mógł wnieść skargę do organu nadzorczego. Podanie danych jest dobrowolne, ale niezbędne, by przesłać formularz kontaktowy.
      </p>
    </div>
    <div class="row q-pt-md">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="primary"
          size="md"
          label="Wyślij"
          rounded
          unelevated
          :loading="isSending"
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useFormValidation} from 'src/composables/formValidation'
import {useQuasar} from 'quasar'
import FormSection from 'components/partials/form/FormSection.vue'
import axios from 'axios'
import validationRules from 'src/logic/validationRules'

const $q = useQuasar()
const {handleValidationError} = useFormValidation()

const subjects =[
  'Zaproponuj nową funkcjonalność',
  'Zgłoś błąd',
  'Inne',
]

const email = ref<string | null>(null)
const name = ref<string | null>(null)
const subject = ref<string | null>(null)
const message = ref<string | null>(null)
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
</script>
