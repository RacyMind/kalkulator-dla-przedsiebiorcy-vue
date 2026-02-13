import { usePremiumStore } from 'stores/premiumStore'

export default async () => {
  const premiumStore = usePremiumStore()

  try {
    await premiumStore.initializePremium()
  } catch (error: unknown) {
    console.error(
      '[PremiumBilling] premium boot initializePremium failed:',
      error,
    )
  }
}
