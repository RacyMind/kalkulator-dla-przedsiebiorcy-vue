import { nextTick, ref, Ref } from 'vue'
import helpers from 'src/logic/helpers'

export function useScrollToResults() {
  const scrollTarget: Ref<any> = ref(null)

  const scrollToResults = async () => {
    await nextTick()
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })

    helpers.scrollToElement(scrollTarget?.value?.$el ?? scrollTarget?.value)
  }

  return { scrollTarget, scrollToResults }
}
