import {Notify} from 'quasar'

export const useFormValidation = () => {
  const handleValidationError = () => {
    Notify.create({
      color: 'negative',
      message: 'Formularz zawiera błędy.',
    })
  }

  return {
    handleValidationError,
  }
}
