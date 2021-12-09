export default {
  required: (val:any):string|void => {
    if (!val) {
      return 'UUzupełnij pole'
    }
  },
  requiredAmount: (val:any):string|void => {
    if (!val && val !== 0) {
      return 'Wpisz kwotę'
    }
  },
  email: (val:any):string|void => {
    if (!val.includes('@') || !val.includes('.')) {
      return 'Wpisz poprawny adres email'
    }
  },
  subject: (val:any):string|void => {
    if (val === null) {
      return 'Wybierz temat'
    }
  },
}
