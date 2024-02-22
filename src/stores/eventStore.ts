import {acceptHMRUpdate, defineStore} from 'pinia'

export enum EventType {
  CrossingTaxThreshold
}

export type Event = {
  type: EventType,
  sinceMonth ?: number
}

export const useEventStore = defineStore('event-store', {
  state: () => ({
    events: [] as Event[],
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEventStore, import.meta.hot))
}
