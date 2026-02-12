export const Capacitor = {
  isNativePlatform: () => false,
  getPlatform: () => 'web',
}

export const registerPlugin = (name: string) => {
  if (name === 'PlayBilling') {
    return {
      initialize: async () => {},
      queryProductDetails: async () => ({ productDetails: [] }),
      purchaseProduct: async () => ({}),
      queryPurchases: async () => ({ purchases: [] }),
      acknowledgePurchase: async () => ({}),
    }
  }

  return {}
}
