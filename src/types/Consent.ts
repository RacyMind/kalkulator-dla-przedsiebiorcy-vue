export type ConsentDecision = 'granted' | 'denied'

export type ConsentSource = 'banner' | 'settings'

export interface ConsentState {
  readonly analyticsStorage: ConsentDecision
  readonly updatedAt: string
  readonly source: ConsentSource
}
