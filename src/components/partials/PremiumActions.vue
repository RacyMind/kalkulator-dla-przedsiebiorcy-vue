<template>
  <div
    v-if="premiumStore.isBillingAvailable && !premiumStore.isPremiumActive"
    class="premium-actions column items-center q-gutter-xs"
  >
    <q-btn color="amber-8" rounded unelevated no-caps @click="openModal">
      Usuń reklamy i przyciski wsparcia
    </q-btn>
    <div class="text-caption">
      Jednorazowo {{ premiumStore.premiumPriceLabel }}
    </div>

    <q-dialog v-model="isModalOpen">
      <q-card class="premium-modal">
        <q-card-section>
          <div class="text-h6">Wersja premium</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="q-mb-sm">
            Korzystaj z aplikacji bez reklam i bez przycisków wsparcia. Jedna
            płatność odblokowuje pełną wersję premium na Twoim koncie Google
            Play.
          </p>
          <p class="q-mb-sm">
            Cena brutto: <strong>{{ premiumStore.premiumPriceLabel }}</strong
            >.
          </p>
          <p class="q-mb-none text-caption">
            Opcja "Przywróć zakup" służy do odzyskania aktywnej wersji premium
            po reinstalacji aplikacji lub zmianie telefonu. Jeśli używasz tego
            samego konta Google Play, nie płacisz drugi raz.
          </p>
        </q-card-section>
        <q-card-section v-if="showBillingDebug" class="q-pt-none text-caption">
          <div class="text-weight-medium q-mb-xs">Debug billing</div>
          <div>
            Native Android:
            {{ yesNo(premiumStore.billingReadiness?.isNativeAndroid) }}
          </div>
          <div>
            CdvPurchase:
            {{ yesNo(premiumStore.billingReadiness?.hasCdvPurchaseNamespace) }}
          </div>
          <div>
            Store init:
            {{ yesNo(premiumStore.billingReadiness?.storeInitialized) }}
          </div>
          <div>
            Produkt: {{ yesNo(premiumStore.billingReadiness?.productLoaded) }}
          </div>
          <div>
            Oferta: {{ yesNo(premiumStore.billingReadiness?.hasOffer) }}
          </div>
          <div>
            Ready: {{ yesNo(premiumStore.billingReadiness?.isReadyToPurchase) }}
          </div>
          <div v-if="premiumStore.billingReadiness?.message">
            Readiness message: {{ premiumStore.billingReadiness.message }}
          </div>
          <div v-if="premiumStore.lastBillingErrorCode !== null">
            Last error: [{{ premiumStore.lastBillingErrorCode }}]
            {{ premiumStore.lastBillingRawMessage ?? 'brak szczegółów' }}
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-gutter-sm">
          <q-btn flat no-caps label="Zamknij" @click="isModalOpen = false" />
          <q-btn
            flat
            dense
            no-caps
            :loading="isRestoring"
            @click="handleRestore"
          >
            Przywróć zakup
          </q-btn>
          <q-btn
            color="amber-8"
            rounded
            unelevated
            no-caps
            :loading="isBuying"
            @click="handleBuy"
          >
            Kup teraz
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { adMobService } from 'boot/admob'
import { usePremiumStore } from 'stores/premiumStore'
import { PremiumStatus, PurchaseStatus } from 'src/services/billing/types'

const $q = useQuasar()
const premiumStore = usePremiumStore()

const isBuying = ref(false)
const isRestoring = ref(false)
const isModalOpen = ref(false)
const showBillingDebug = computed(
  () => import.meta.env.DEV && premiumStore.isBillingAvailable,
)

onMounted(async () => {
  if (premiumStore.status === PremiumStatus.Idle) {
    await premiumStore.initializePremium()
    return
  }

  await premiumStore.refreshBillingReadiness()
})

const hideAds = async () => {
  await adMobService.hideAd()
  document.body.style.marginBottom = ''
}

const openModal = async () => {
  await premiumStore.refreshBillingReadiness()
  isModalOpen.value = true
}

const yesNo = (value: boolean | undefined) => {
  if (value === undefined) {
    return 'brak'
  }

  return value ? 'tak' : 'nie'
}

const getDetailedErrorMessage = (
  fallbackMessage: string,
  errorData: {
    message?: string
    code?: string | number
    rawMessage?: string
  },
) => {
  if (!showBillingDebug.value) {
    return fallbackMessage
  }

  const codePart =
    errorData.code !== undefined ? `[${String(errorData.code)}] ` : ''
  const messagePart = errorData.rawMessage ?? errorData.message

  if (!messagePart) {
    return fallbackMessage
  }

  return `${fallbackMessage} (${codePart}${messagePart})`
}

const handleBuy = async () => {
  isBuying.value = true
  const result = await premiumStore.buyPremium()

  if (result.status === PurchaseStatus.Purchased) {
    await hideAds()
    isModalOpen.value = false
    $q.notify({
      type: 'positive',
      message: 'Zakup aktywowany',
    })
  } else if (result.status === PurchaseStatus.Cancelled) {
    $q.notify({
      type: 'warning',
      message: 'Zakup anulowany',
    })
  } else {
    $q.notify({
      type: 'negative',
      message: getDetailedErrorMessage(
        'Nie udało się aktywować zakupu',
        result,
      ),
    })
  }

  await premiumStore.refreshBillingReadiness()
  isBuying.value = false
}

const handleRestore = async () => {
  isRestoring.value = true
  const result = await premiumStore.restorePremium()

  if (result.restored) {
    await hideAds()
    isModalOpen.value = false
    $q.notify({
      type: 'positive',
      message: 'Zakup został przywrócony',
    })
  } else if (result.message === 'not_found') {
    $q.notify({
      type: 'warning',
      message: 'Nie znaleziono aktywnego zakupu',
    })
  } else {
    $q.notify({
      type: 'negative',
      message: getDetailedErrorMessage(
        'Nie udało się przywrócić zakupu',
        result,
      ),
    })
  }

  await premiumStore.refreshBillingReadiness()
  isRestoring.value = false
}
</script>

<style lang="scss" scoped>
.premium-actions {
  width: 100%;
}

.premium-modal {
  max-width: 420px;
  width: 92vw;
}
</style>
