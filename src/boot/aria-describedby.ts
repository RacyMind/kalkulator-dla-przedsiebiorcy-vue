import { boot } from 'quasar/wrappers'

let counter = 0

function linkFieldMessages() {
  const fields = document.querySelectorAll('.q-field')
  fields.forEach((field) => {
    const messages = field.querySelector('.q-field__messages')
    if (!messages || messages.hasAttribute('data-aria-linked')) return

    const input = field.querySelector('input, textarea, select, [role="listbox"], [role="combobox"]')
    if (!input) return

    const id = `q-field-msg-${++counter}`
    messages.id = id
    messages.setAttribute('aria-live', 'polite')
    messages.setAttribute('data-aria-linked', '')
    input.setAttribute('aria-describedby', id)
  })
}

export default boot(({ router }) => {
  if (typeof document === 'undefined') return

  router.afterEach(() => {
    setTimeout(linkFieldMessages, 300)
  })
})
