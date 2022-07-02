export default {
  email: (val:any):string|void => {
    if (!val.includes('@') || !val.includes('.')) {
      return 'Wpisz poprawny adres email'
    }
  },
  required: (val:any):string|void => {
    if (!val) {
      return 'Uzupełnij pole'
    }
  },
  requiredAmount: (val:any):string|void => {
    if (!val && val !== 0) {
      return 'Wpisz kwotę'
    }
  },
  subject: (val:any):string|void => {
    if (val === null) {
      return 'Wybierz temat'
    }
  },
}
