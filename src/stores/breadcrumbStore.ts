import {acceptHMRUpdate, defineStore} from 'pinia'

export type BreadCrumbItem = {
  name: string,
  to?: string,
}

export type BreadCrumbs = {
  items: BreadCrumbItem[]
}

export const useBreadcrumbStore = defineStore('breadcrumb', {
  state: ():BreadCrumbs => ({
    items: [],
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBreadcrumbStore, import.meta.hot))
}
