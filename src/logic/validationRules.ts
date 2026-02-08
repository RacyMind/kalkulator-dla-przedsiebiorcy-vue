import {isFuture, parse} from 'date-fns'

export default {
  email: (val:any):string|boolean => {
    if (!val.includes('@') || !val.includes('.')) {
      return 'Wpisz poprawny adres email'
    }
    return true
  },
  required: (val:any):string|boolean => {
    if (!val) {
      return 'Uzupełnij pole'
    }
    return true
  },
  requiredAmount: (val:any):string|boolean => {
    if (!val && val !== 0) {
      return 'Wpisz kwotę'
    }
    return true
  },
  todayOrPast: (val:string):string|boolean => {
    if (isFuture(parse(val, 'dd.MM.yyyy', new Date()))) {
      return 'Wybierz datę z przeszłości lub dzisiejszą'
    }
    return true
  },
  subject: (val:any):string|boolean => {
    if (val === null) {
      return 'Wybierz temat'
    }
    return true
  },
  minValue: (min:number) => (val:any):string|boolean => {
    if (val < min) {
      return `Minimalna wartość to ${min}`
    }
    return true
  },
  maxValue: (max:number) => (val:any):string|boolean => {
    if (val > max) {
      return `Maksymalna wartość to ${max}`
    }
    return true
  },
  lessThan: (max:number) => (val:any):string|boolean => {
    if (val >= max) {
      return `Wartość musi być mniejsza niż ${max}`
    }
    return true
  },
  greaterThan: (min:number) => (val:any):string|boolean => {
    if (val <= min) {
      return `Wartość musi być większa niż ${min}`
    }
    return true
  },
}
