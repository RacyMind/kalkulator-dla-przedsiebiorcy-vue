import {ref, Ref} from 'vue'
import helpers from 'src/logic/helpers'

export function useScrollToResults() {
  const scrollTarget: Ref<any> = ref(null)

  const scrollToResults = () => {
    helpers.scrollToElement(scrollTarget?.value?.$el ?? scrollTarget?.value)
  }

  return { scrollTarget, scrollToResults }
}
