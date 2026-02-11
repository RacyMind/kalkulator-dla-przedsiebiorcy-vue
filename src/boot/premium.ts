import { usePremiumStore } from 'stores/premiumStore'

export default () => {
  const premiumStore = usePremiumStore()

  void premiumStore.initializePremium().catch((error: unknown) => {
    console.error(
      '[PremiumBilling] premium boot initializePremium failed:',
      error,
    )
  })
}
