export default {
  required: (val:any):string|void => {
    if (!val) {
      return 'Pole wymagane'
    }
  },
  email: (val:any):string|void => {
    if (!val.includes('@') || !val.includes('.')) {
      return 'Niepoprawny adres email'
    }
  },
  subject: (val:any):string|void => {
    if (val === null) {
      return 'Wybierz temat'
    }
  },
}
