<template>
  <div v-if="!hasDecision" class="c-consent-banner">
    <q-card bordered class="c-consent-banner__card">
      <q-card-section>
        <p class="text-subtitle2 text-weight-bold q-mb-sm">
          Ustawienia prywatności
        </p>
        <p class="text-caption q-mb-md">
          Używamy Google Analytics, aby analizować sposób korzystania z
          aplikacji i ulepszać kalkulatory. Dane analityczne uruchamiamy tylko
          po Twojej decyzji.
        </p>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-auto">
            <q-btn
              outline
              label="Ustawienia"
              color="primary"
              class="full-width"
              @click="openSettings"
            />
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              flat
              label="Odrzucam analityczne"
              color="primary"
              class="full-width"
              @click="rejectFromBanner"
            />
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              unelevated
              label="Akceptuję analityczne"
              color="primary"
              class="full-width"
              @click="acceptFromBanner"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="settingsOpen">
    <q-card style="width: 100%; max-width: 560px">
      <q-card-section>
        <p class="text-h6 q-mb-sm">Ustawienia prywatności</p>
        <p class="text-caption q-mb-md">
          Niezbędne dane techniczne są zawsze aktywne. Poniżej możesz zarządzać
          analityką.
        </p>

        <q-toggle
          v-model="analyticsEnabledInSettings"
          label="Analityka (Google Analytics / Firebase Analytics)"
          color="primary"
          left-label
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Anuluj" color="grey-8" v-close-popup />
        <q-btn
          flat
          label="Odrzuć analityczne"
          color="primary"
          @click="rejectFromSettings"
        />
        <q-btn
          unelevated
          label="Zapisz"
          color="primary"
          @click="saveSettings"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  acceptAnalytics,
  getConsentState,
  rejectAnalytics,
} from 'src/logic/consent'

const consentState = ref(getConsentState())
const settingsOpen = ref(false)
const analyticsEnabledInSettings = ref(false)

const hasDecision = computed(() => Boolean(consentState.value))

const refreshConsentState = () => {
  consentState.value = getConsentState()
}

const openSettings = () => {
  analyticsEnabledInSettings.value =
    consentState.value?.analyticsStorage === 'granted'
  settingsOpen.value = true
}

const acceptFromBanner = async () => {
  await acceptAnalytics('banner')
  refreshConsentState()
}

const rejectFromBanner = async () => {
  await rejectAnalytics('banner')
  refreshConsentState()
}

const rejectFromSettings = async () => {
  await rejectAnalytics('settings')
  refreshConsentState()
  settingsOpen.value = false
}

const saveSettings = async () => {
  if (analyticsEnabledInSettings.value) {
    await acceptAnalytics('settings')
  } else {
    await rejectAnalytics('settings')
  }
  refreshConsentState()
  settingsOpen.value = false
}
</script>

<style scoped lang="scss">
.c-consent-banner {
  position: fixed;
  right: 16px;
  bottom: calc(16px + var(--admob-banner-offset, 0px));
  left: 16px;
  z-index: 3000;
}

.c-consent-banner__card {
  max-width: 920px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .c-consent-banner {
    right: 8px;
    bottom: calc(8px + var(--admob-banner-offset, 0px));
    left: 8px;
  }
}
</style>
