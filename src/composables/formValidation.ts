import {useQuasar} from 'quasar'

export const useFormValidation = () => {
  const handleValidationError = () => {
    const $q = useQuasar()

    $q.notify({
      color: 'negative',
      message: 'Formularz zawiera błędy.',
    })
  }

  return {
    handleValidationError,
  }
}
