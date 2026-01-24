import {isFuture, parse} from 'date-fns'

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
  todayOrPast: (val:string):string|void => {
    if (isFuture(parse(val, 'dd.MM.yyyy', new Date()))) {
      return 'Wybierz datę z przeszłości lub dzisiejszą'
    }
  },
  subject: (val:any):string|void => {
    if (val === null) {
      return 'Wybierz temat'
    }
  },
  minValue: (min:number) => (val:any):string|void => {
    if (val < min) {
      return `Minimalna wartość to ${min}`
    }
  },
  maxValue: (max:number) => (val:any):string|void => {
    if (val > max) {
      return `Maksymalna wartość to ${max}`
    }
  },
  greaterThan: (min:number) => (val:any):string|void => {
    if (val <= min) {
      return `Wartość musi być większa niż ${min}`
    }
  },
}
